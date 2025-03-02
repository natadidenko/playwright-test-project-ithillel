import { expect } from '@playwright/test';

export class RegistrationPage {
  constructor(page) {
    this.page = page;
    
    // Поля введення
    this.emailField = page.locator('#signupEmail');
    this.emailError = page.locator('.invalid-feedback p');
    
    this.lastNameField = page.locator('#signupLastName');
    this.lastNameError = page.locator('#signupLastName + .invalid-feedback p');
    
    this.nameField = page.locator('#signupName');
    this.nameError = page.locator('.invalid-feedback p');
    
    this.passwordField = page.locator('#signupPassword');
    this.passwordError = page.locator('#signupPassword ~ .invalid-feedback p');

    this.repeatPasswordField = page.locator('#signupRepeatPassword');
    this.repeatPasswordError = page.locator('#signupRepeatPassword ~ .invalid-feedback p');

    this.registerButton = page.locator('button:has-text("Register")');
  }

  // Методи для email
  async fillEmail(email) {
    await this.emailField.fill(email);
    await this.emailField.blur();
  }

  async expectEmailError(errorText) {
    await expect(this.emailError).toHaveText(errorText);
    await expect(this.emailField).toHaveClass(/is-invalid/);
  }

  async expectEmailValid() {
    await expect(this.emailField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
  }

  // Методи для lastName
  async fillLastName(lastName) {
    await this.lastNameField.fill(lastName);
    await this.lastNameField.blur();
  }

  async expectLastNameError(errorText) {
    await expect(this.lastNameError).toHaveText(errorText);
    await expect(this.lastNameField).toHaveClass(/is-invalid/);
  }

  async expectLastNameValid() {
    await expect(this.lastNameField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
  }

  // Методи для Name
  async fillName(name) {
    await this.nameField.fill(name);
    await this.nameField.blur();
  }

  async expectNameError(errorText) {
    await expect(this.nameError).toHaveText(errorText);
    await expect(this.nameField).toHaveClass(/is-invalid/);
  }

  async expectNameValid() {
    await expect(this.nameField).toHaveCSS('border-color', 'rgb(206, 212, 218)');
  }

  // Методи для пароля
  async fillPassword(password) {
    await this.passwordField.fill(password);
    await this.passwordField.blur(); // Додаємо втрату фокусу, щоб запустити валідацію
  }

  async expectPasswordError(errorText) {
    await expect(this.passwordError).toHaveText(errorText);
    await expect(this.passwordField).toHaveClass(/is-invalid/);
  }

  async expectPasswordValid() {
    await expect(this.passwordField).not.toHaveClass(/is-invalid/);
  }

  // Методи для повторного введення пароля
  async fillRepeatPassword(password) {
    await this.repeatPasswordField.fill(password);
    await this.repeatPasswordField.blur();
  }

  async expectRepeatPasswordError(errorText) {
    await expect(this.repeatPasswordError).toHaveText(errorText);
    await expect(this.repeatPasswordField).toHaveClass(/is-invalid/);
  }

  async expectRepeatPasswordValid() {
    await expect(this.repeatPasswordField).not.toHaveClass(/is-invalid/);
  }

  // Перевірка, що кнопка Register деактивована
  async expectRegisterButtonDisabled() {
    await expect(this.registerButton).toBeDisabled();
  }
}
