import { test, expect } from '@playwright/test';
import { setupTestPage } from '../../src/utils/helperNavigation';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

// Функція для генерації унікальних даних з префіксом
const generateUniqueEmail = () => `aqa-${Date.now()}@example.com`;

test.describe('Positive registration scenario', () => {
  let registrationPage;

  test.beforeEach(async ({ page, browserName }) => {
    // Налаштування сторінки та навігації
    await setupTestPage(page, browserName);

    // Створюємо екземпляр сторінки реєстрації
    registrationPage = new RegistrationPage(page);
  });

  test('Successful registration', async () => {
    // Генерація унікального email
    const email = generateUniqueEmail();

    // Заповнення форми через методи з RegistrationPage
    await registrationPage.fillName('John');
    await registrationPage.fillLastName('Doe');
    await registrationPage.fillEmail(email);
    await registrationPage.fillPassword('Valid1Pass');
    await registrationPage.fillRepeatPassword('Valid1Pass');

    // Перевірка, що всі поля валідні
    await registrationPage.expectNameValid();
    await registrationPage.expectLastNameValid();
    await registrationPage.expectEmailValid();
    await registrationPage.expectPasswordValid();
    await registrationPage.expectRepeatPasswordValid();

    // Перевірка, що кнопка Register активна
    const registerButton = registrationPage.registerButton;
    await expect(registerButton).toBeEnabled();

    // Надсилання форми
    await registerButton.click();

    // Перевірка редиректу після реєстрації
    await expect(registrationPage.page).toHaveURL('https://qauto.forstudy.space/panel/garage');
  });
});
