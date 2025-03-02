import { test, expect } from '@playwright/test';
import { setupTestPage } from '../../src/utils/helperNavigation';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

test.describe('Name field validation', () => {
  let registrationPage;

  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
    registrationPage = new RegistrationPage(page);
  });

  const testCases = [
    { name: 'John', valid: true, description: 'valid name' },
    { name: '', error: 'Name is required', valid: false, description: 'empty name' },
    { name: '111', error: 'Name is invalid', valid: false, description: 'name with numbers' },
    { name: 'A', error: 'Name has to be from 2 to 20 characters long', valid: false, description: 'name too short' },
    { name: 'A'.repeat(21), error: 'Name has to be from 2 to 20 characters long', valid: false, description: 'name too long' },
    { name: 'Дое', error: 'Name is invalid', valid: false, description: 'non-ASCII characters' },
    { name: 'John@123', error: 'Name is invalid', valid: false, description: 'special characters in name' }
  ];

  testCases.forEach(({ name, error, valid, description }) => {
    test(`Validates ${description}`, async () => {
      await registrationPage.fillName(name);
      if (valid) {
        await registrationPage.expectNameValid();
      } else {
        await registrationPage.expectNameError(error);
      }
    });
  });

  test('Valid name should pass validation after errors', async () => {
    await registrationPage.fillName('John');
    await registrationPage.expectNameValid();
  });

  test('Register button should remain disabled after entering valid name', async () => {
    await registrationPage.fillName('John');
    await registrationPage.expectRegisterButtonDisabled();
  });
});
