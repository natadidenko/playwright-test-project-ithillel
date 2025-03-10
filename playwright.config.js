// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Отримуємо змінну оточення NODE_ENV та завантажуємо відповідний .env файл
const ENV = process.env.NODE_ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${ENV}`) });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: process.env.BASE_URL,
    headless: true, // Запуск у фоновому режимі без візуального інтерфейсу
    trace: 'on-first-retry',
    timeout: 60000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'qa',
      use: {
        baseURL: process.env.BASE_URL,
      },
    },
    
    {
      name: 'prod',
      use: {
        baseURL: process.env.BASE_URL,
      },
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
