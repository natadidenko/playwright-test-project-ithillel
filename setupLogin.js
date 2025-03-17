import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Перехід на сторінку
  await page.goto('https://guest:welcome2qauto@qauto.forstudy.space/');

  // Натискаємо на кнопку Sign In, щоб відкрити модальне вікно
  await page.click('.header_signin');

  // Чекаємо, поки модальне вікно стане видимим
  const modal = page.locator('.modal'); // Тобі потрібно перевірити селектор модального вікна
  await modal.waitFor({ state: 'visible' });

  // Заповнюємо форму входу
  await page.fill('#signinEmail', 'email3@domain.com');
  await page.fill('#signinPassword', 'Qa123456!');

  // Натискаємо на кнопку "Login" всередині модального вікна, використовуючи точний селектор
  const loginButton = await page.locator('body > ngb-modal-window > div > div > app-signin-modal > div.modal-footer.d-flex.justify-content-between > button.btn.btn-primary');
  await loginButton.click();

  // Чекаємо редиректу на гараж
  await page.waitForURL('https://qauto.forstudy.space/panel/garage');

  // Зберігаємо стан сесії
  await context.storageState({ path: 'storageState.json' });

  // Закриваємо браузер
  await browser.close();
})();
