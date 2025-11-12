import { test, expect } from '../../fixtures/secret.fixture';
import { readPokemonData } from '../../data/xlsxReader';

test('@data lee Excel y lista pokemons', async () => {
  const rows = readPokemonData();
  console.log('Total filas válidas:', rows.length);
  console.log('Primeras 3:', rows.slice(0, 3));
  expect(rows.length).toBeGreaterThan(0);
  for (const r of rows) {
    expect(r.id).toBeGreaterThan(0);
    expect(r.name).not.toBe('');
  }
});