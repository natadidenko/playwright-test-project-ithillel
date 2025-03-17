// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Отримуємо __dirname в ES-модулях
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Завантажуємо .env файл
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Отримуємо змінну середовища (qa або prod)
const ENV = process.env.NODE_ENV || 'qa';

// Витягуємо змінні з .env
const baseURL = process.env[`BASE_URL_${ENV}`] || 'https://qauto.forstudy.space';
const username = process.env[`HTTP_CREDENTIALS_USERNAME_${ENV}`] || '';
const password = process.env[`HTTP_CREDENTIALS_PASSWORD_${ENV}`] || '';

// Перевіряємо, чи всі змінні визначені
if (!baseURL) {
  throw new Error(`BASE_URL_${ENV} is not set in the .env file.`);
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
    storageState: 'storageState.json', // Використовуємо збережений стан сесії
    httpCredentials: username && password ? { username, password } : undefined,
  },
  projects: [
    {
      name: ENV,
      use: { baseURL, storageState: 'storageState.json' }, // Використання storageState
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'storageState.json' },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'storageState.json' },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'storageState.json' },
    },
  ],
});
