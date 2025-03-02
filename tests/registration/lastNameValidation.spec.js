import { test, expect } from '@playwright/test';
import { setupTestPage } from '../../src/utils/helperNavigation';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

test.describe('Last Name field validation', () => {
  let registrationPage;

  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
    registrationPage = new RegistrationPage(page);
  });

  const testCases = [
    { lastName: '', error: 'Last name is required', description: 'empty last name' },
    { lastName: '111', error: 'Last name is invalid', description: 'last name with numbers' },
    { lastName: 'A', error: 'Last name has to be from 2 to 20 characters long', description: 'last name too short' },
    { lastName: 'A'.repeat(21), error: 'Last name has to be from 2 to 20 characters long', description: 'last name too long' },
    { lastName: 'Дое', error: 'Last name is invalid', description: 'non-ASCII characters' },
    { lastName: 'Doe@123', error: 'Last name is invalid', description: 'special characters in last name' }
  ];

  testCases.forEach(({ lastName, error, description }) => {
    test(`Validates ${description}`, async () => {
      await registrationPage.fillLastName(lastName);
      await registrationPage.expectLastNameError(error);
    });
  });

  test('Valid last name should pass validation', async () => {
    await registrationPage.fillLastName('Doe');
    await registrationPage.expectLastNameValid();
  });

  test('Register button should remain disabled after entering valid last name', async () => {
    await registrationPage.fillLastName('Doe');
    await registrationPage.expectRegisterButtonDisabled();
  });
});
