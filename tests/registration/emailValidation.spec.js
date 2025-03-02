import { test, expect } from '@playwright/test';
import { setupTestPage } from '../../src/utils/helperNavigation';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

test.describe('Email field validation', () => {
  let registrationPage;

  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
    registrationPage = new RegistrationPage(page);
  });

  const testCases = [
    { email: '', error: 'Email required', description: 'empty email' },
    { email: 'invalid-email', error: 'Email is incorrect', description: 'invalid email format' },
    { email: 'user@exa!mple.com', error: 'Email is incorrect', description: 'special characters in email' },
    { email: 'testuserexample.com', error: 'Email is incorrect', description: 'missing @ symbol' },
    { email: 'testuser@', error: 'Email is incorrect', description: 'missing domain' },
    { email: 'garbageemail@!@#$.com', error: 'Email is incorrect', description: 'garbage email' },
    { email: '"John Doe" <john.doe@example.com>', error: 'Email is incorrect', description: 'copied email with name' },
    { email: 'testuser@example.com some extra text', error: 'Email is incorrect', description: 'extra text in email' },
    { email: 'testuser@@example.com', error: 'Email is incorrect', description: 'multiple @ symbols' },
    { email: '.testuser@example.com', error: 'Email is incorrect', description: 'leading dot in email' },
    { email: 'testuser@example.com.', error: 'Email is incorrect', description: 'trailing dot in email' },
    { email: 'test..user@example.com', error: 'Email is incorrect', description: 'multiple dots in email' },
    { email: 'testuser@exámple.com', error: 'Email is incorrect', description: 'Unicode characters in email' },
    { email: 'testuser@.example.com', error: 'Email is incorrect', description: 'leading dot in domain' }
  ];

  testCases.forEach(({ email, error, description }) => {
    test(`Validates ${description}`, async () => {
      await registrationPage.fillEmail(email);
      await registrationPage.expectEmailError(error);
    });
  });

  test('Valid email should pass validation', async () => {
    await registrationPage.fillEmail('testuser@example.com');
    await registrationPage.expectEmailValid();
  });

  test('Register button should remain disabled after entering valid email', async () => {
    await registrationPage.fillEmail('testuser@example.com');
    await registrationPage.expectRegisterButtonDisabled();
  });
});
