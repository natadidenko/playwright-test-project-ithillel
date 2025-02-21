import { test, expect } from '@playwright/test';

// Функція для генерації унікальних даних з префіксом
const generateUniqueEmail = () => `aqa-${Date.now()}@example.com`;

test.describe('Positive registration scenario', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Налаштування заголовків авторизації для всіх браузерів
    await page.setExtraHTTPHeaders({
      'Authorization': 'Basic ' + Buffer.from('guest:welcome2qauto').toString('base64')
    });

    try {
      // Перехід на сторінку
      await page.goto('https://qauto.forstudy.space/', { waitUntil: 'networkidle' });
      await page.waitForLoadState('networkidle');
    } catch (error) {
      console.error("Error during page load: ", error);
    }

    if (browserName === 'firefox') {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    }

    await page.waitForSelector('button:has-text("Sign up")', { state: 'visible', timeout: 15000 });
    await page.click('button:has-text("Sign up")', { force: true });
  });

  test('Successful registration', async ({ page }) => {
    // Заповнення поля "Name"
    await page.fill('#signupName', 'John');
    await page.locator('#signupName').blur(); // Додаємо втрату фокусу
    await expect(page.locator('#signupName')).toHaveCSS('border-color', 'rgb(206, 212, 218)');

    // Заповнення поля "Last Name"
    await page.fill('#signupLastName', 'Doe');
    await expect(page.locator('#signupLastName')).toHaveCSS('border-color', 'rgb(206, 212, 218)');

    // Заповнення поля "Email"
    const email = generateUniqueEmail();  // Генерація унікальної email з префіксом
    await page.fill('#signupEmail', email);
    await expect(page.locator('#signupEmail')).toHaveCSS('border-color', 'rgb(206, 212, 218)');

    // Заповнення поля "Password"
    await page.fill('#signupPassword', 'Valid1Pass');
    await expect(page.locator('#signupPassword')).toHaveCSS('border-color', 'rgb(206, 212, 218)');

    // Заповнення поля "Re-enter Password"
    await page.fill('#signupRepeatPassword', 'Valid1Pass');
    await expect(page.locator('#signupRepeatPassword')).toHaveCSS('border-color', 'rgb(206, 212, 218)');

    // Перевірка, що кнопка активна після заповнення
    const registerButton = page.locator('button:has-text("Register")');
    await expect(registerButton).toBeEnabled();

    // Надсилання форми та перевірка редиректу
    await registerButton.click();
    await expect(page).toHaveURL('https://qauto.forstudy.space/panel/garage');
  });
});
