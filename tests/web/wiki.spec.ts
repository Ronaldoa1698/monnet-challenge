import { test, expect } from '../../fixtures/secret.fixture';
import { readPokemonData } from '../../data/xlsxReader';
import { WikiPokemonPage } from '../../pages/WikiPokemonPage';

test.describe('@wiki Wikipedia - Pokémon page (POM)', () => {
  const rows = readPokemonData();

  for (const { name } of rows) {
    test(`@wiki page for ${name}: heading & image download`, async ({ page }) => {
      const wiki = new WikiPokemonPage(page);

      await wiki.goto(name);
      const heading = await wiki.getHeadingText();
      expect(heading.toLowerCase()).toContain(name.toLowerCase());

      const artist = await wiki.getArtistInfo();
      console.log(`🎨 [${name}] Diseñado por: ${artist}`);

      const imageInfo = await wiki.downloadAndSaveImage(name);

      expect(imageInfo.sizeKB).toBeGreaterThan(1);
      expect(imageInfo.sizeKB).toBeLessThan(488.28);

      console.log(`✅ [${name}] → ${imageInfo.filePath} (${imageInfo.sizeKB.toFixed(2)} KB)`);
    });
  }
});