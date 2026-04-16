import { type Page, type Locator, expect } from '@playwright/test';

export class HomePage {
  readonly practiceTitle: Locator;
  readonly practiceAddress: Locator;

  // Navigation
  readonly navHome: Locator;
  readonly navAppointments: Locator;
  readonly navBilling: Locator;

  // Contact links
  readonly callOfficeLink: Locator;
  readonly callDrBrianLink: Locator;
  readonly emailDrBrianLink: Locator;
  readonly smsDrBrianLink: Locator;

  // Cards & actions
  readonly billingCard: Locator;
  readonly manageAppointmentsButton: Locator;
  readonly manageBillingButton: Locator;

  constructor(page: Page) {
    this.practiceTitle = page.getByAltText('Acme Direct Care Practice');
    this.practiceAddress = page.getByRole('link', { name: '701 Princeton Ave SW, Wichita, KS, 35211' });

    this.navHome = page.getByRole('link', { name: 'Home', exact: true });
    this.navAppointments = page.getByRole('link', { name: 'Appointments', exact: true });
    this.navBilling = page.getByRole('link', { name: 'Billing', exact: true });

    this.callOfficeLink = page.getByRole('link', { name: /Call the office.*\(555\) 123-1234/ });
    this.callDrBrianLink = page.getByRole('link', { name: /Call Dr\. Brian.*\(316\) 854-1559/ });
    this.emailDrBrianLink = page.getByRole('link', { name: /Send an email to.*Dr\. Brian/ });
    this.smsDrBrianLink = page.getByRole('link', { name: /Send an SMS to Dr\. Brian.*\(316\) 854-1559/ });

    this.billingCard = page.getByRole('heading', { name: 'Billing' });
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
