import { Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

export class WikiPokemonPage {
  constructor(private page: Page) {}

  async goto(name: string) {
    const capitalized = name[0].toUpperCase() + name.slice(1);
    await this.page.goto(`https://en.wikipedia.org/wiki/${capitalized}`, { waitUntil: 'domcontentloaded' });
    
    if ((await this.page.title()).includes('does not have')) {
      await this.page.goto(`https://en.wikipedia.org/wiki/${capitalized}_(Pokémon)`, { waitUntil: 'domcontentloaded' });
    }
  }

  async getHeadingText(): Promise<string> {
    return await this.page.locator('#firstHeading').innerText();
  }

  async getArtistInfo(): Promise<string> {
    const artistRow = this.page.locator('tr:has(th:has-text("Designed by")) td');
    return await artistRow.first().innerText().catch(() => 'Artista no encontrado');
  }

  async downloadAndSaveImage(pokemonName: string): Promise<{ filePath: string; sizeKB: number; extension: string }> {
    const imgSrc = await this.page.locator('table.infobox img').first().getAttribute('src');
    if (!imgSrc) throw new Error('Imagen no encontrada');

    const imageUrl = (imgSrc.startsWith('//') ? `https:${imgSrc}` : imgSrc)
      .replace(/\/thumb\/(.+?)\/\d+px-.+$/, '/$1');

    const resp = await this.page.request.get(imageUrl);
    const bytes = Buffer.from(await resp.body());

    let ext = path.extname(imageUrl).toLowerCase();
    if (!ext || !['.jpg', '.jpeg', '.png', '.svg'].includes(ext)) {
      ext = this.detectExtension(bytes);
    }

    const imagesDir = path.join(process.cwd(), 'images');
    fs.mkdirSync(imagesDir, { recursive: true });
    
    const filePath = path.join(imagesDir, `${pokemonName}${ext}`);
    fs.writeFileSync(filePath, bytes);

    return {
      filePath,
      sizeKB: fs.statSync(filePath).size / 1024,
      extension: ext
    };
  }

  private detectExtension(buf: Buffer): string {
    if (buf[0] === 0x89 && buf[1] === 0x50) return '.png';
    if (buf[0] === 0xFF && buf[1] === 0xD8) return '.jpg';
    return '.png';
  }
}