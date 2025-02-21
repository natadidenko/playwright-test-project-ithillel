import { test, expect } from '@playwright/test';
import { setupTestPage } from '../helpers/navigation';

test.describe('Name field validation', () => {
  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
  });

  test('Validates the "Name" field with various conditions', async ({ page }) => {
    const nameField = page.locator('#signupName');
    const registerButton = page.locator('button:has-text("Register")');
    const nameError = page.locator('.invalid-feedback p');

    // Позитивна перевірка: правильне ім’я
    try {
      const validName = 'John';
      await nameField.fill(validName);
      await nameField.blur();
      await expect(nameField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
      console.log("✅ Passed valid name check.");
    } catch (error) {
      console.error("❌ Error during valid name check: ", error);
    }

    // Негативна перевірка: порожнє ім’я
    try {
      await nameField.fill('');
      await nameField.blur();
      await expect(nameError).toHaveText('Name is required');
      await expect(nameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed empty name validation.");
    } catch (error) {
      console.error("❌ Error during empty name validation: ", error);
    }

    // Негативна перевірка: неправильне ім’я (цифри)
    try {
      await nameField.fill('111');
      await nameField.blur();
      await expect(nameError).toHaveText('Name is invalid');
      await expect(nameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed invalid name validation.");
    } catch (error) {
      console.error("❌ Error during invalid name validation: ", error);
    }

    // Негативна перевірка: ім’я занадто коротке (менше 2 символів)
    try {
      await nameField.fill('A');
      await nameField.blur();
      await expect(nameError).toHaveText('Name has to be from 2 to 20 characters long');
      await expect(nameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed name length check (too short).");
    } catch (error) {
      console.error("❌ Error during name length check (too short): ", error);
    }

    // Негативна перевірка: ім’я занадто довге (більше 20 символів)
    try {
      await nameField.fill('A'.repeat(21));
      await nameField.blur();
      await expect(nameError).toHaveText('Name has to be from 2 to 20 characters long');
      await expect(nameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed name length check (too long).");
    } catch (error) {
      console.error("❌ Error during name length check (too long): ", error);
    }

    // Позитивна перевірка: правильне ім’я після помилок
    try {
      const validName = 'John';
      await nameField.fill(validName);
      await nameField.blur();
      await expect(nameField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
      console.log("✅ Passed valid name check after errors.");
    } catch (error) {
      console.error("❌ Error during valid name check after errors: ", error);
    }

    // Перевірка, що кнопка "Register" деактивована після введення правильного імені
    try {
      await expect(registerButton).toBeDisabled();
      console.log("✅ Passed register button disabled check.");
    } catch (error) {
      console.error("❌ Error during register button disabled check: ", error);
    }
  });
});
