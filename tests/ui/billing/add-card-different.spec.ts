import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

const CARD_NUMBER = '4242 4242 4242 4242';
const CARD_CVC = '123';

function getCardExpiry(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String((now.getFullYear() + 2) % 100).padStart(2, '0');
  return `${month}${year}`;
}

// TC-25: Add Different Card via "Pay with different card"
test('should add a new card via Pay with different card link', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  await billing.payWithDifferentCardLink.click();
  await expect(billing.addCardSubmitButton).toBeVisible();

  await billing.fillCardForm(CARD_NUMBER, getCardExpiry(), CARD_CVC);
  await billing.addCardSubmitButton.click();

  await expect(page.getByText('Credit card added successfully')).toBeVisible();
});
