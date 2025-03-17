import path from 'path'; 
import { fileURLToPath } from 'url'; // Імпортуємо fileURLToPath
import { test as base } from '@playwright/test';

// Отримуємо шлях до поточного файлу
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); // Отримуємо директорію поточного файлу

export const test = base.extend({
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.resolve(__dirname, '../../storageState.json'), // Використовуємо path для шляху
    });

    const page = await context.newPage();
    await page.goto('https://qauto.forstudy.space/panel/garage');
    await use(page);

    await context.close();
  },
});
