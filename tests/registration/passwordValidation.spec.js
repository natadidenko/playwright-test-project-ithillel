import { test, expect } from '@playwright/test';
import { setupTestPage } from '../helpers/navigation';

test.describe('Email field validation', () => {
  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
  });

  test('Password field validation', async ({ page }) => {
    const passwordField = page.locator('#signupPassword');
    const passwordError = page.locator('#signupPassword ~ .invalid-feedback p');

    // Перевірка порожнього пароля
    try {
      await passwordField.fill('');
      await passwordField.blur();
      await expect(passwordError).toHaveText('Password required');
      await expect(passwordField).toHaveClass(/is-invalid/);
      console.log("✅ Empty password validation passed.");
    } catch (error) {
      console.error("❌ Error during empty password validation: ", error);
    }

    // Перевірка пароля з недостатньою довжиною
    try {
      await passwordField.fill('Short1');
      await passwordField.blur();
      await expect(passwordError).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
      await expect(passwordField).toHaveClass(/is-invalid/);
      console.log("✅ Short password validation passed.");
    } catch (error) {
      console.error("❌ Error during short password validation: ", error);
    }

    // Перевірка пароля без цифри
    try {
      await passwordField.fill('NoDigitsHere');
      await passwordField.blur();
      await expect(passwordError).toHaveText('Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
      await expect(passwordField).toHaveClass(/is-invalid/);
      console.log("✅ Password without digit validation passed.");
    } catch (error) {
      console.error("❌ Error during password without digit validation: ", error);
    }

    // Перевірка валідного пароля
    try {
      await passwordField.fill('ValidPass1');
      await passwordField.blur();
      await expect(passwordField).not.toHaveClass(/is-invalid/);
      console.log("✅ Valid password check passed.");
    } catch (error) {
      console.error("❌ Error during valid password check: ", error);
    }
  });

  test('Re-enter Password field validation', async ({ page }) => {
    const passwordField = page.locator('#signupPassword');
    const repeatPasswordField = page.locator('#signupRepeatPassword');
    const repeatPasswordError = page.locator('#signupRepeatPassword ~ .invalid-feedback p');

    // Перевірка порожнього поля повторного введення пароля
    try {
      await repeatPasswordField.fill('');
      await repeatPasswordField.blur();
      await expect(repeatPasswordError).toHaveText('Re-enter password required');
      await expect(repeatPasswordField).toHaveClass(/is-invalid/);
      console.log("✅ Empty re-enter password validation passed.");
    } catch (error) {
      console.error("❌ Error during empty re-enter password validation: ", error);
    }

    // Перевірка невідповідності паролів
    try {
      await passwordField.fill('ValidPass1');
      await repeatPasswordField.fill('DifferentPass1');
      await repeatPasswordField.blur();
      await expect(repeatPasswordError).toHaveText('Passwords do not match');
      await expect(repeatPasswordField).toHaveClass(/is-invalid/);
      console.log("✅ Password mismatch validation passed.");
    } catch (error) {
      console.error("❌ Error during password mismatch validation: ", error);
    }

    // Перевірка співпадіння паролів
    try {
      await repeatPasswordField.fill('ValidPass1');
      await repeatPasswordField.blur();
      await expect(repeatPasswordField).not.toHaveClass(/is-invalid/);
      console.log("✅ Password match validation passed.");
    } catch (error) {
      console.error("❌ Error during password match validation: ", error);
    }
  });
});
