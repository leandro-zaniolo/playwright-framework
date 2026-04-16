import { type Page, type Locator, expect } from '@playwright/test';

export class BillingPage {
  private page: Page;

  // Sections
  readonly invoicesHeading: Locator;
  readonly makePaymentHeading: Locator;
  readonly creditCardsHeading: Locator;

  // Payment form
  readonly paymentMethodDropdown: Locator;
  readonly amountInput: Locator;
  readonly sendPaymentButton: Locator;
  readonly payWithDifferentCardLink: Locator;

  // Credit cards
  readonly addNewCardButton: Locator;
  readonly cardRows: Locator;
  readonly deleteCardButtons: Locator;

  // Modals
  readonly modalTitle: Locator;
  readonly modalMessage: Locator;
  readonly modalCloseButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly addCardSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.invoicesHeading = page.getByRole('heading', { name: 'Invoices' });
    this.makePaymentHeading = page.getByRole('heading', { name: 'Make a Payment' });
    this.creditCardsHeading = page.getByRole('heading', { name: 'Credit Cards' });

    this.paymentMethodDropdown = page.locator('.select-button').first();
    this.amountInput = page.locator('input[name="amount"]');
    this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });
    this.payWithDifferentCardLink = page.getByRole('link', { name: 'Pay with a different card' });

    this.addNewCardButton = page.getByRole('button', { name: 'Add New Credit Card' });
    this.cardRows = page.locator('text=Visa 4242');
    this.deleteCardButtons = page.locator('a[data-action="click:credit-cards-list#deleteCreditCard"]');

    this.modalTitle = page.locator('.modal.in .modal-title').first();
    this.modalMessage = page.locator('.modal.in .modal-footer');
    this.modalCloseButton = page.locator('.modal.in .close-button.close');
    this.confirmButton = page.getByRole('button', { name: /Confirm/ });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.addCardSubmitButton = page.locator('.modal.in button[type="submit"]', { hasText: 'Add' });
  }

  async goto() {
    await this.page.goto(process.env.HUB_URL! + 'billing');
    await this.page.waitForLoadState('networkidle');
    await expect(this.makePaymentHeading).toBeVisible();
  }

  async selectPaymentMethod(optionText: string) {
    await this.paymentMethodDropdown.click();
    await this.page.locator('.select-list-option', { hasText: optionText }).first().click();
  }

  async fillAmount(amount: string) {
    await this.amountInput.clear();
    await this.amountInput.fill(amount);
  }

  async fillStripeCard(cardNumber: string, expiry: string, cvc: string) {
    const stripeFrames = this.page.locator('iframe[name*="privateStripeFrame"]');

    const cardFrame = this.page.frameLocator(`iframe[name="${await stripeFrames.nth(0).getAttribute('name')}"]`);
    await cardFrame.locator('input[name="cardnumber"]').fill(cardNumber);

    const expiryFrame = this.page.frameLocator(`iframe[name="${await stripeFrames.nth(1).getAttribute('name')}"]`);
    await expiryFrame.locator('input[name="exp-date"]').fill(expiry);

    const cvcFrame = this.page.frameLocator(`iframe[name="${await stripeFrames.nth(2).getAttribute('name')}"]`);
    await cvcFrame.locator('input[name="cvc"]').fill(cvc);
  }

  async deleteFirstCard() {
    await this.deleteCardButtons.first().click();

    // Confirm the deletion
    const confirmBtn = this.page.getByRole('button', { name: 'Confirm' });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Wait for success modal
    const successModal = this.page.locator('.modal.in', { hasText: 'deleted successfully' });
    await successModal.waitFor({ state: 'visible', timeout: 10_000 });

    await successModal.locator('.close-button').click();
    await this.page.waitForLoadState('networkidle');
  }

  async dismissModal() {
    await this.modalCloseButton.click();
  }
}
