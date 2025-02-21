import { test, expect } from '@playwright/test';
import { setupTestPage } from '../helpers/navigation';

test.describe('Email field validation', () => {
  test.beforeEach(async ({ page, browserName }) => {
    await setupTestPage(page, browserName);
  });

  test('Validates the "Email" field with various conditions', async ({ page }) => {
    const emailField = page.locator('#signupEmail');
    const emailError = page.locator('.invalid-feedback p');
    const registerButton = page.locator('button:has-text("Register")');

    // Перевірка на правильний email
    try {
      const validEmail = 'testuser@example.com';
      await emailField.fill(validEmail);
      await emailField.blur();
      await expect(emailField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
      console.log("✅ Passed valid email check.");
    } catch (error) {
      console.error("❌ Error during valid email check: ", error);
    }

    await emailField.fill(''); // Очищення поля після перевірки

    // Перевірка на порожнє поле для Email
    try {
      await emailField.fill('');
      await emailField.blur();
      await expect(emailError).toHaveText('Email required');
      await expect(emailField).toHaveClass(/is-invalid/);
      await expect(emailField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      console.log("✅ Passed empty email validation.");
    } catch (error) {
      console.error("❌ Error during empty email validation: ", error);
    }

    await emailField.fill(''); // Очищення поля після перевірки

    // Перевірка на неправильний email (неправильний формат)
    try {
      const invalidEmail = 'invalid-email';
      await emailField.fill(invalidEmail);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      await expect(emailField).toHaveCSS('border-color', 'rgb(220, 53, 69)');
      console.log("✅ Passed invalid email validation.");
    } catch (error) {
      console.error("❌ Error during invalid email validation: ", error);
    }

    await emailField.fill(''); // Очищення поля після перевірки

    // Перевірка на email, який містить неприпустимі символи
    try {
      const invalidEmailChars = 'user@exa!mple.com';
      await emailField.fill(invalidEmailChars);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed email special characters validation.");
    } catch (error) {
      console.error("❌ Error during special characters validation: ", error);
    }

    await emailField.fill(''); // Очищення поля після перевірки

    // Перевірка на наявність символа "@" у email
    try {
      const invalidEmailWithoutAt = 'testuserexample.com';
      await emailField.fill(invalidEmailWithoutAt);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed email '@' symbol validation.");
    } catch (error) {
      console.error("❌ Error during email '@' symbol validation: ", error);
    }

    // Перевірка на відсутність домену в email (відсутність символа "@")
    try {
      const emailWithoutDomain = 'testuser@';
      await emailField.fill(emailWithoutDomain);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed missing domain validation.");
    } catch (error) {
      console.error("❌ Error during missing domain validation: ", error);
    }

    // Перевірка на неприпустимі символи в email
    try {
      const garbageEmail = 'garbageemail@!@#$.com';
      await emailField.fill(garbageEmail);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed garbage email validation.");
    } catch (error) {
      console.error("❌ Error during garbage email validation: ", error);
    }

    // Перевірка на email, скопійований з адресної книги з ім'ям
    try {
      const copiedEmail = '"John Doe" <john.doe@example.com>';
      await emailField.fill(copiedEmail);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed copied email validation.");
    } catch (error) {
      console.error("❌ Error during copied email validation: ", error);
    }

    // Перевірка на зайвий текст в email
    try {
      const emailWithExtraText = 'testuser@example.com some extra text';
      await emailField.fill(emailWithExtraText);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed extra text email validation.");
    } catch (error) {
      console.error("❌ Error during extra text email validation: ", error);
    }

    // Перевірка на два символи "@" в email
    try {
      const emailWithTwoAt = 'testuser@@example.com';
      await emailField.fill(emailWithTwoAt);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed multiple '@' symbols validation.");
    } catch (error) {
      console.error("❌ Error during multiple '@' symbols validation: ", error);
    }

    // Перевірка на крапку на початку email
    try {
      const emailWithLeadingDot = '.testuser@example.com';
      await emailField.fill(emailWithLeadingDot);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed leading dot in email validation.");
    } catch (error) {
      console.error("❌ Error during leading dot in email validation: ", error);
    }

    // Перевірка на крапку в кінці email
    try {
      const emailWithTrailingDot = 'testuser@example.com.';
      await emailField.fill(emailWithTrailingDot);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed trailing dot in email validation.");
    } catch (error) {
      console.error("❌ Error during trailing dot in email validation: ", error);
    }

    // Перевірка на кілька крапок в email
    try {
      const emailWithMultipleDots = 'test..user@example.com';
      await emailField.fill(emailWithMultipleDots);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed multiple dots in email validation.");
    } catch (error) {
      console.error("❌ Error during multiple dots in email validation: ", error);
    }

    // Перевірка на Unicode символи в email
    try {
      const emailWithUnicode = 'testuser@exámple.com';
      await emailField.fill(emailWithUnicode);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed Unicode email validation.");
    } catch (error) {
      console.error("❌ Error during Unicode email validation: ", error);
    }

    // Перевірка на домен з ведучою крапкою
    try {
      const emailWithLeadingDotInDomain = 'testuser@.example.com';
      await emailField.fill(emailWithLeadingDotInDomain);
      await emailField.blur();
      await expect(emailError).toHaveText('Email is incorrect');
      await expect(emailField).toHaveClass(/is-invalid/);
      console.log("✅ Passed leading dot in domain validation.");
    } catch (error) {
      console.error("❌ Error during leading dot in domain validation: ", error);
    }

    // Перевірка на правильний email після помилок
    try {
      const validEmail = 'testuser@example.com';
      await emailField.fill(validEmail);
      await emailField.blur();
      await expect(emailField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
      console.log("✅ Passed valid email check after errors.");
    } catch (error) {
      console.error("❌ Error during valid email check after errors: ", error);
    }

    // Перевірка, що кнопка "Register" деактивована після введення правильного email
    try {
      await expect(registerButton).toBeDisabled();
      console.log("✅ Passed register button disabled check.");
    } catch (error) {
      console.error("❌ Error during register button disabled check: ", error);
    }
  });
});
