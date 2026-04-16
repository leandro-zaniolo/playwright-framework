import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

// TC-12: Invalid Amount (Negative)
test('should show error for amount below minimum threshold', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  await billing.selectPaymentMethod('4242');
  await billing.fillAmount('-1');
  await billing.sendPaymentButton.click();

  await expect(billing.modalTitle).toContainText('Error');
  await expect(billing.modalMessage).toContainText('The amount must be at least $0.50');
});
