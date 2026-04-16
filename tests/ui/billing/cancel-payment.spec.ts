import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

// TC-10: Cancel Payment Flow
test('should cancel payment at the confirmation stage', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  await billing.selectPaymentMethod('4242');
  await billing.fillAmount('1');
  await billing.sendPaymentButton.click();

  await expect(billing.confirmButton).toBeVisible();
  await billing.cancelButton.click();

  await expect(billing.confirmButton).not.toBeVisible();
  await expect(billing.makePaymentHeading).toBeVisible();
});
