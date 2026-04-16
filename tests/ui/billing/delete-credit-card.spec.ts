import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/billing.page';

// TC-15: Delete Credit Card + cleanup extras (keep at least 2)
test('should delete extra credit cards keeping at most 2', async ({ page }) => {
  const billing = new BillingPage(page);
  await billing.goto();

  let cardCount = await billing.cardRows.count();

  while (cardCount > 2) {
    await billing.deleteFirstCard();
    cardCount = await billing.cardRows.count();
  }

  expect(await billing.cardRows.count()).toBeLessThanOrEqual(2);
});
