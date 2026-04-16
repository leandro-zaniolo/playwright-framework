import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

// TC-09: Success Payment
test('should process a $1 payment using an existing card', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  await billing.selectPaymentMethod('4242');
  await billing.fillAmount('1');
  await billing.sendPaymentButton.click();

  await expect(billing.confirmButton).toBeVisible();
  await billing.confirmButton.click();

  await expect(billing.modalTitle).toContainText(/Payment Completed Successfully/i);
});
