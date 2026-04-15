import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { HomePage } from './pages/home.page';

test.describe('Login', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test('should display the login landing page', async () => {
    await loginPage.goto();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.createAccountLink).toBeVisible();
  });

  test('should log in with valid credentials and land on the hub', async () => {
    await loginPage.goto();
    await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

    await homePage.isLoaded();
    await expect(homePage.practiceTitle).toBeVisible();
  });
});
