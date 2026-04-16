import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

// TC-11: Missing Payment Method
test('should show error when no payment method is selected', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  await billing.fillAmount('1');
  await billing.sendPaymentButton.click();

  await expect(billing.modalTitle).toContainText('Error');
  await expect(billing.modalMessage).toContainText('Please select a payment method');
});
