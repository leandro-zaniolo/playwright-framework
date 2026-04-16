import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';

test('should display practice info, contact links, and billing on the home page', async ({ page }) => {
  await page.goto(process.env.HUB_URL!);
  const homePage = new HomePage(page);
  await homePage.isLoaded();

  // Practice info
  await expect(homePage.practiceTitle).toBeVisible();

  // Address with Google Maps link
  await expect(homePage.practiceAddress).toBeVisible();
  await expect(homePage.practiceAddress).toHaveAttribute('href', /maps\.google\.com/);

  // Contact links with correct hrefs
  await expect(homePage.callOfficeLink).toBeVisible();
  await expect(homePage.callOfficeLink).toHaveAttribute('href', 'tel:5551231234');

  await expect(homePage.callDrBrianLink).toBeVisible();
  await expect(homePage.callDrBrianLink).toHaveAttribute('href', 'tel:3168541559');

  await expect(homePage.emailDrBrianLink).toBeVisible();
  await expect(homePage.emailDrBrianLink).toHaveAttribute('href', /^mailto:/);

  await expect(homePage.smsDrBrianLink).toBeVisible();
  await expect(homePage.smsDrBrianLink).toHaveAttribute('href', 'sms:3168541559');

  // Billing card
  await expect(homePage.billingCard).toBeVisible();

  // Quick actions
  await expect(homePage.manageAppointmentsButton).toBeVisible();
  await expect(homePage.manageBillingButton).toBeVisible();
});
