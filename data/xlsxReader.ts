import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export type PokemonRow = { id: number; name: string, abilities: string[] };

export type ReadPokemonOptions = {
  filePath?: string;
  sheetIndex?: number;
  headerRow?: number;
  strictNoDuplicates?: boolean;
};

const DEFAULT_EXCEL_FILE = 'Challenge automation - Datos-pruebas 2.xlsx';

function toCleanString(v: unknown): string {
  return (v ?? '').toString().trim();
}

function normalizeAbilityName(s: string): string {
  return toCleanString(s)
    .toLowerCase()
    .replace(/\s+/g, '-');
}

function resolveWorkbookPath(explicit?: string): string {
  const targetPath = explicit ?? DEFAULT_EXCEL_FILE;
  const abs = path.resolve(process.cwd(), targetPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`El archivo Excel no existe: ${abs}`);
  }
  return abs;
}

function validateRow(
  row: any[], 
  rowIndex: number, 
  cols: { idCol: number; nameCol: number; abilitiesCol: number }
): { id: number; name: string; abilities: string[] } | null {
  const { idCol, nameCol, abilitiesCol } = cols;
  const idRaw = row[idCol];
  const nameRaw = row[nameCol];
  const abilitiesRaw = row[abilitiesCol];

  if (idRaw == null && nameRaw == null && abilitiesRaw == null) return null;

  const id = Number(idRaw);
  const name = toCleanString(nameRaw);
  const abilities = String(abilitiesRaw ?? '')
    .split(',')
    .map(s => normalizeAbilityName(s))
    .filter(Boolean);

  if (!Number.isFinite(id) || id <= 0) {
    console.warn(`[xlsxReader] Fila ${rowIndex}: 'id' inválido (${idRaw}). Se ignora.`);
    return null;
  }
  if (!name) {
    console.warn(`[xlsxReader] Fila ${rowIndex}: 'name' vacío. Se ignora.`);
    return null;
  }
  if (!abilities.length) {
    console.warn(`[xlsxReader] Fila ${rowIndex}: 'abilities' vacío. Se ignora.`);
    return null;
  }

  return { id, name, abilities };
}

function inferColumnsFromHeader(headerRow: any[]): {
  idCol: number; nameCol: number; abilitiesCol: number;
  } {

  const findCol = (patterns: string[]) => 
  headerRow.findIndex((cell, idx) => {
    const h = toCleanString(cell).toLowerCase();
    return patterns.some(p => h.includes(p));
  });
  const idCol = findCol(['id', 'ident']) !== -1 ? findCol(['id', 'ident']) : 0;
  const nameCol = findCol(['name', 'nombre']) !== -1 ? findCol(['name', 'nombre']) : 1;
  const abilitiesCol = findCol(['abilities', 'habilidades']);
  if (idCol === -1 || nameCol === -1 || abilitiesCol === -1) {
    throw new Error(
      `No fue posible identificar columnas ID/NAME/ABILITIES en el encabezado: [${headerRow.join(' | ')}]`
    );
  }
  return { idCol, nameCol, abilitiesCol };
}

export function readPokemonData(opts?: ReadPokemonOptions): PokemonRow[] {
  const filePath = resolveWorkbookPath(opts?.filePath);
  const sheetIndex = opts?.sheetIndex ?? 0;
  const headerRowIndex = opts?.headerRow ?? 0;

  const wb = xlsx.readFile(filePath, { cellDates: false, cellNF: false, cellText: false });
  const sheetName = wb.SheetNames[sheetIndex];
  if (!sheetName) {
    throw new Error(`El índice de hoja ${sheetIndex} no existe en el archivo: ${path.basename(filePath)}`);
  }

  const rows: any[][] = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });
  if (!rows.length || rows.every(r => r.length === 0)) {
    throw new Error(`La hoja "${sheetName}" está vacía en ${path.basename(filePath)}.`);
  }

  const cols = inferColumnsFromHeader(rows[headerRowIndex] ?? []);
  const result: PokemonRow[] = [];
  const seenIds = new Set<number>();
  const seenNames = new Set<string>();

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const validated = validateRow(rows[i] ?? [], i + 1, cols);
    if (!validated) continue;

    const { id, name, abilities } = validated;
    const lowName = name.toLowerCase();

    if (seenIds.has(id) || seenNames.has(lowName)) {
      const msg = `[xlsxReader] Fila ${i + 1}: duplicado detectado (${seenIds.has(id) ? 'id' : 'name'}).`;
      if (opts?.strictNoDuplicates) throw new Error(msg);
      console.warn(`${msg} Se ignora.`);
      continue;
    }
    seenIds.add(id);
    seenNames.add(lowName);
    result.push({ id, name, abilities });
  }

  if (!result.length) {
    throw new Error(
      `No se obtuvieron filas válidas en "${sheetName}". Revisa encabezados y datos.`
    );
  }

  return result;
}

export function readPokemonNames(opts?: ReadPokemonOptions): string[] {
  return readPokemonData(opts).map(r => r.name);
}