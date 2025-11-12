import { test as base } from '@playwright/test';
import { createHash } from 'crypto';
import { existsSync } from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { getEnv } from '../utils/env';

type Secrets = {
  encryptedSecret: string;
};

function loadEnvForProject(projectName: string) {
  const envFile = projectName === 'cert' ? '.env.cert' : '.env.qa';
  const envPath = path.resolve(process.cwd(), envFile);
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn(`[WARN] No se encontró ${envFile}.`);
  }
}

export const test = base.extend<Secrets>({
  encryptedSecret: [
    async ({}, use, testInfo) => {
      loadEnvForProject(testInfo.project.name);
      const secret = getEnv('SECRET_KEY');
      const hash = createHash('sha256').update(secret).digest('hex');

      console.log(`[${testInfo.project.name}] SHA256(secret): ${hash}`);

      await use(hash);
      console.log(
        `[${testInfo.project.name}] Test finished at: ${new Date().toISOString()}`
      );
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
