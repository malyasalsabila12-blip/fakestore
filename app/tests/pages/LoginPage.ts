import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('[data-test="username-input"]', username);
    await this.page.fill('[data-test="password-input"]', password);
    const submitBtn = this.page.locator('[data-test="login-submit"]');
    await submitBtn.click({ force: true });
  }
}
