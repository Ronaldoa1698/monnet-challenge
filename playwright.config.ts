import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: 'https://en.wikipedia.org',    
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',              
    trace: 'on-first-retry', 
    headless: true,                
  },

  projects: [
    {
      name: 'QA',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'CERT',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  outputDir: path.join(__dirname, 'test-results'),
});
