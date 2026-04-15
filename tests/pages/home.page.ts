import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly practiceTitle: Locator;
  readonly navHome: Locator;
  readonly navAppointments: Locator;
  readonly navBilling: Locator;
  readonly manageAppointmentsButton: Locator;
  readonly manageBillingButton: Locator;

  constructor(page: Page) {
    this.practiceTitle = page.getByAltText('Acme Direct Care Practice');
    this.navHome = page.getByRole('link', { name: 'Home', exact: true });
    this.navAppointments = page.getByRole('link', { name: 'Appointments', exact: true });
    this.navBilling = page.getByRole('link', { name: 'Billing', exact: true });
    this.manageAppointmentsButton = page.getByRole('link', { name: 'Manage Appointments' });
    this.manageBillingButton = page.getByRole('link', { name: 'Manage Billing' });
  }

  async isLoaded() {
    await expect(this.manageAppointmentsButton).toBeVisible({ timeout: 15_000 });
    await expect(this.manageBillingButton).toBeVisible();
    await expect(this.navHome).toBeVisible();
    await expect(this.navAppointments).toBeVisible();
    await expect(this.navBilling).toBeVisible();
  }
}
