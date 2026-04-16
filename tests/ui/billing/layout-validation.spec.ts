import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

// TC-08: Layout Validation
test('should display Invoices, Make a Payment, and Credit Cards sections', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  await expect(billing.invoicesHeading).toBeVisible();
  await expect(billing.makePaymentHeading).toBeVisible();
  await expect(billing.creditCardsHeading).toBeVisible();
  await expect(billing.sendPaymentButton).toBeVisible();
  await expect(billing.addNewCardButton).toBeVisible();
});
