import { Page, Locator } from '@playwright/test';

export class SignUpPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly countryCodeSelect: Locator;
  readonly phoneInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-test="signup-email-input"]');
    this.continueButton = page.locator('[data-test="signup-continue-btn"]');
    this.firstNameInput = page.locator('[data-test="first-name-input"]');
    this.lastNameInput = page.locator('[data-test="last-name-input"]');
    this.countryCodeSelect = page.locator('[data-test="country-code-select"]');
    this.phoneInput = page.locator('[data-test="phone-input"]');
    this.usernameInput = page.locator('[data-test="signup-username-input"]');
    this.passwordInput = page.locator('[data-test="signup-password-input"]');
    this.termsCheckbox = page.locator('[data-test="terms-checkbox"]');
    this.createAccountButton = page.locator('[data-test="create-account-btn"]');
  }

  async goto() {
    await this.page.goto('/signup');
  }

  async startRegistration(email: string) {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async fillDetails(details: {
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
    password: string;
  }) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.phoneInput.fill(details.phone);
    await this.usernameInput.fill(details.username);
    await this.passwordInput.fill(details.password);
    await this.termsCheckbox.check();
  }
}
