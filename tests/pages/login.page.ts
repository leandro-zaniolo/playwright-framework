import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly loginButton: Locator;
  readonly createAccountLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly rateLimitBanner: Locator;

  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.locator('component-submit-button[data-label="Log In"] button');
    this.createAccountLink = page.getByRole('link', { name: 'Create Account' });
    this.emailInput = page.locator('input[name="oauth_email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.rateLimitBanner = page.locator('text=Too many failed attempts');
  }

  async goto() {
    await this.page.goto(process.env.HUB_URL!);
    await expect(this.loginButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.loginButton.click();
    await expect(this.emailInput).toBeVisible();
    await this.page.waitForLoadState('networkidle');

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    const rateLimited = await this.rateLimitBanner.isVisible().catch(() => false);
    if (rateLimited) {
      throw new Error('Rate limited — wait 12 minutes and try again.');
    }

    await this.page.waitForURL('**/hub/', { timeout: 15_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }
}
