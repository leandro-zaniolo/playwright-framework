import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Hub Dashboard', () => {
  test('should display practice info and navigation after login', async ({ page }) => {
    await page.goto(process.env.HUB_URL!);

    const homePage = new HomePage(page);
    await homePage.isLoaded();
    await expect(homePage.practiceTitle).toBeVisible();
  });
});
