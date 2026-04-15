import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Hub landing (/hub/login)
  readonly loginButton: Locator;
  readonly createAccountLink: Locator;

  // OAuth login form
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginButton = page.locator('component-submit-button[data-label="Log In"] button');
    this.createAccountLink = page.getByRole('link', { name: 'Create Account' });

    this.emailInput = page.locator('input[name="oauth_email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto(process.env.HUB_URL!);
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.loginButton.click();
    await expect(this.emailInput).toBeVisible();

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    // Wait for OAuth callback to complete and land back on the hub
    await this.page.waitForURL('**/hub/', { timeout: 30_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }
}
