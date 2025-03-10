// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Завантажуємо .env файл
dotenv.config({ path: path.resolve(__dirname, `.env`) });

// Отримуємо змінну оточення NODE_ENV для визначення середовища (qa або prod)
const ENV = process.env.NODE_ENV || 'qa';

// Визначаємо базову URL та дані авторизації в залежності від середовища
const baseURL = process.env[`BASE_URL_${ENV}`];
const username = process.env[`HTTP_CREDENTIALS_USERNAME_${ENV}`];
const password = process.env[`HTTP_CREDENTIALS_PASSWORD_${ENV}`];

if (!baseURL || !username || !password) {
  throw new Error(`Environment variables for ${ENV} are not properly set.`);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    timeout: 60000,
    httpCredentials: {
      username: username,
      password: password,
    },
  },
  projects: [
    {
      name: ENV,
      use: {
        baseURL,
        httpCredentials: {
          username: username,
          password: password,
        },
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
});
