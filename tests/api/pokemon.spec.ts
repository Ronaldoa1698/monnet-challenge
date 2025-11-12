import { test, expect } from '../../fixtures/secret.fixture';
import { readPokemonData } from '../../data/xlsxReader';

const API = 'https://pokeapi.co/api/v2/pokemon';

async function validatePokemonResponse(resp: any, expectedId: number, expectedName: string){
  await expect(resp).toBeOK();
  const json = await resp.json();

  expect(json.id).toBe(expectedId);
  expect(json.name.toLowerCase()).toBe(expectedName.toLowerCase());
  expect(Array.isArray(json.abilities)).toBe(true);
  expect(json.abilities.length).toBeGreaterThan(0);

  return json;
}

function validateTime(ms: number, limitMs: number) {
    expect(ms).toBeLessThan(limitMs);
}

test.describe('@PokeAPI - GET /pokemon/{id|name}', () => {
  const rows = readPokemonData();
  for (const { id, name, abilities: expectedAbilities } of rows) {
    test(`@id: ${id} (${name})`, async ({ request }) => {
        const t0 = Date.now();
        const resp = await request.get(`${API}/${id}`);
        const ms = Date.now() - t0;
        await validatePokemonResponse(resp, id, name);
        validateTime(ms, 10_000);
    });

    test(`@name: ${name}`, async ({ request }) => {
      const t0 = Date.now();
      const resp = await request.get(`${API}/${name}`);
      const ms = Date.now() - t0;
      await validatePokemonResponse(resp, id, name);
      validateTime(ms, 10_000);
    });

    test(`@abilities match (id: ${id} - ${name})`, async ({ request }) => {
      const t0 = Date.now();
      const resp = await request.get(`${API}/${id}`);
      await expect(resp).toBeOK();
      const json = await validatePokemonResponse(resp, id, name);
      const ms = Date.now() - t0;

      const apiAbilities = json.abilities
        .map((a: any) => a.ability.name)
        .sort();
      const excelAbilities = [...expectedAbilities].sort();
      expect(apiAbilities).toEqual(excelAbilities);

      validateTime(ms, 10_000);
    });
  }
});
