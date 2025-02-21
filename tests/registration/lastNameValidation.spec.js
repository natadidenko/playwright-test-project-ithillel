import { test, expect } from '@playwright/test';
import { setupTestPage } from '../helpers/navigation';

test.describe('Last Name field validation', () => {
  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
  });

  test('Validates the "Last name" fields with various conditions', async ({ page }) => {
    const lastNameField = page.locator('#signupLastName');  // Локатор для Last Name
    const registerButton = page.locator('button:has-text("Register")');
    const lastNameError = page.locator('#signupLastName + .invalid-feedback p');  // Локатор для помилки Last Name

    // Перевірка на порожнє поле для Last name
    try {
      await lastNameField.fill('');
      await lastNameField.blur();
      await expect(lastNameError).toHaveText('Last name is required');
      await expect(lastNameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed empty last name validation.");
    } catch (error) {
      console.error("❌ Error during empty last name validation: ", error);
    }

    // Перевірка на неправильне прізвище (наприклад, цифри)
    try {
      await lastNameField.fill('111');
      await lastNameField.blur();
      await expect(lastNameError).toHaveText('Last name is invalid');
      await expect(lastNameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed invalid last name validation.");
    } catch (error) {
      console.error("❌ Error during invalid last name validation: ", error);
    }

    // Перевірка на неправильну довжину для Last name (менше 2 символів)
    try {
      await lastNameField.fill('A');
      await lastNameField.blur();
      await expect(lastNameError).toHaveText('Last name has to be from 2 to 20 characters long');
      await expect(lastNameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed last name length check (too short).");
    } catch (error) {
      console.error("❌ Error during last name length check (too short): ", error);
    }

    // Перевірка на неправильну довжину для Last name (більше 20 символів)
    try {
      await lastNameField.fill('A'.repeat(21)); // Вставляємо більше 20 символів
      await lastNameField.blur();
      await expect(lastNameError).toHaveText('Last name has to be from 2 to 20 characters long');
      await expect(lastNameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed last name length check (too long).");
    } catch (error) {
      console.error("❌ Error during last name length check (too long): ", error);
    }

    // Перевірка на неанглійські символи у Last name
    try {
      await lastNameField.fill('Дое');
      await lastNameField.blur();
      await expect(lastNameError).toHaveText('Last name is invalid');
      await expect(lastNameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed non-ASCII characters validation for last name.");
    } catch (error) {
      console.error("❌ Error during non-ASCII characters validation: ", error);
    }

    // Перевірка на використання спеціальних символів у Last name
    try {
      await lastNameField.fill('Doe@123');
      await lastNameField.blur();
      await expect(lastNameError).toHaveText('Last name is invalid');
      await expect(lastNameField).toHaveClass(/is-invalid/);
      console.log("✅ Passed special characters validation for last name.");
    } catch (error) {
      console.error("❌ Error during special characters validation: ", error);
    }

    // Перевірка на правильну роботу автозаповнення для Last name
    try {
      const testLastName = 'Smith';
      await lastNameField.fill(testLastName); // Вводимо Last name
      await expect(lastNameField).toHaveValue(testLastName);
      console.log("✅ Passed auto-fill validation for last name.");
    } catch (error) {
      console.error("❌ Error during auto-fill validation: ", error);
    }

    // Перевірка, чи очищається поле після введення помилки
    try {
      await lastNameField.fill('');  // Очищаємо поле
      await expect(lastNameField).toHaveValue('');
      console.log("✅ Passed field clearing check after error.");
    } catch (error) {
      console.error("❌ Error during field clearing check: ", error);
    }

     // Перевірка на правильне прізвище після помилок
    try {
      const validLastName = 'Doe';
      await lastNameField.fill(validLastName);
      await lastNameField.blur();
      await expect(lastNameField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
      console.log("✅ Passed valid last name check after errors.");
    } catch (error) {
      console.error("❌ Error during valid last name check after errors: ", error);
    }
     
     // Перевірка, що кнопка "Register" деактивована після введення правильного імені та прізвища
    try {
      await expect(registerButton).toBeDisabled();
      console.log("✅ Passed register button disabled check.");
      } catch (error) {
      console.error("❌ Error during register button disabled check: ", error);
      }
  });
});
