import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// This test needs a clean browser — no saved auth
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Landing Page', () => {
  test('should display login and create account options', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.createAccountLink).toBeVisible();
  });
});
