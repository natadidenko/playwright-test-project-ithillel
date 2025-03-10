import dotenv from 'dotenv';

// Завантажуємо .env файл
dotenv.config();

export async function setupTestPage(page, browserName) {
  // Отримуємо середовище (qa або prod) з NODE_ENV
  const ENV = process.env.NODE_ENV || 'qa';

  // Отримуємо значення для авторизації в залежності від середовища
  const username = process.env[`HTTP_CREDENTIALS_USERNAME_${ENV}`];
  const password = process.env[`HTTP_CREDENTIALS_PASSWORD_${ENV}`];

  if (!username || !password) {
    throw new Error(`HTTP credentials for ${ENV} are not set in the environment variables`);
  }

  // Налаштування заголовків авторизації для всіх браузерів
  await page.setExtraHTTPHeaders({
    'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
  });

  try {
    // Перехід на сторінку
    await page.goto('https://qauto.forstudy.space/', { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
  } catch (error) {
    console.error("❌ Error during page load: ", error);
  }

  // Перевірка наявності кнопки реєстрації
  await page.waitForSelector('button:has-text("Sign up")', { state: 'visible', timeout: 15000 });
  await page.click('button:has-text("Sign up")', { force: true });
}
