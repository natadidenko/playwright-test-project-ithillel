import { test, expect } from '@playwright/test';
import { setupTestPage } from '../../src/utils/helperNavigation';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

test.describe('Password and Re-enter Password field validation', () => {
  let registrationPage;

  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
    registrationPage = new RegistrationPage(page);
  });

  const passwordTestCases = [
    { password: '', error: 'Password required', valid: false, description: 'empty password' },
    { password: 'Short1', error: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter', valid: false, description: 'short password' },
    { password: 'NoDigitsHere', error: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter', valid: false, description: 'password without digit' },
    { password: 'ValidPass1', valid: true, description: 'valid password' },
    { password: 'A'.repeat(16), error: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter', valid: false, description: 'password too long' },
    { password: '@@@@@@@@', error: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter', valid: false, description: 'password with only special characters' },
  ];

  passwordTestCases.forEach(({ password, error, valid, description }) => {
    test(`Validates password: ${description}`, async () => {
      await registrationPage.fillPassword(password);
      if (valid) {
        await registrationPage.expectPasswordValid();
      } else {
        await registrationPage.expectPasswordError(error);
      }
    });
  });

  const repeatPasswordTestCases = [
    { password: 'ValidPass1', repeatPassword: '', error: 'Re-enter password required', valid: false, description: 'empty re-enter password' },
    { password: 'ValidPass1', repeatPassword: 'DifferentPass1', error: 'Passwords do not match', valid: false, description: 'passwords do not match' },
    { password: 'ValidPass1', repeatPassword: 'ValidPass1', valid: true, description: 'passwords match' },
    { password: 'Short1', repeatPassword: 'Short1', error: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter', valid: false, description: 'short repeat password' },
    { password: '@@@@@@@@', repeatPassword: '@@@@@@@@', error: 'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter', valid: false, description: 'repeat password with special characters' },
  ];

  repeatPasswordTestCases.forEach(({ password, repeatPassword, error, valid, description }) => {
    test(`Validates re-enter password: ${description}`, async () => {
      await registrationPage.fillPassword(password);
      await registrationPage.fillRepeatPassword(repeatPassword || ''); // Явно передаємо пустий рядок, якщо значення undefined
      if (valid) {
        await registrationPage.expectRepeatPasswordValid();
      } else {
        await registrationPage.expectRepeatPasswordError(error);
      }
    });
  });

  test('Register button should remain disabled after entering valid password and repeat password', async () => {
    await registrationPage.fillPassword('ValidPass1');
    await registrationPage.fillRepeatPassword('ValidPass1');
    await registrationPage.expectRegisterButtonDisabled();
  });
});
