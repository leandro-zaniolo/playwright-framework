import { type Page, type Locator, expect } from '@playwright/test';

export class AppointmentsPage {
  private page: Page;

  // Appointments list
  readonly heading: Locator;

  // Scheduling form
  readonly scheduleHeading: Locator;
  readonly responsibleDropdown: Locator;
  readonly purposeTextarea: Locator;
  readonly scheduleButton: Locator;
  readonly nextDayButton: Locator;
  readonly noSlotsMessage: Locator;

  // Confirmation modal
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly modalCloseButton: Locator;

  // Error modal
  readonly errorModalTitle: Locator;
  readonly errorModalMessage: Locator;

  // Success modal
  readonly successModal: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Appointments' });
    this.scheduleHeading = page.getByRole('heading', { name: 'Schedule an Appointment' });

    this.responsibleDropdown = page.locator('.select-button');
    this.purposeTextarea = page.locator('textarea.notes');
    this.scheduleButton = page.getByRole('button', { name: 'Schedule Appointment' });
    this.nextDayButton = page.locator('.next-button');
    this.noSlotsMessage = page.getByText('No slots available');

    this.confirmButton = page.getByRole('button', { name: 'Confirm and Schedule Appointment' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.modalCloseButton = page.locator('.modal.in .close-button.close');

    this.errorModalTitle = page.locator('.modal.in .modal-title', { hasText: 'Error' });
    this.errorModalMessage = page.locator('.modal.in .modal-footer');

    this.successModal = page.locator('.modal.in .modal-title', { hasText: 'Appointment Successfully Scheduled' });
  }

  async goto() {
    await this.page.goto(process.env.HUB_URL! + 'appointments');
    await this.page.waitForLoadState('networkidle');
    await expect(this.scheduleHeading).toBeVisible();
  }

  async selectResponsible(name: string) {
    await this.responsibleDropdown.click();
    await this.page.locator('.select-list-option', { hasText: name }).click();
    await this.page.waitForLoadState('networkidle');
  }

  selectDay(label: string) {
    return this.page.locator('.day.toggle-box', { hasText: label });
  }

  selectTimeSlot(time: string) {
    return this.page.locator('.toggle-box.slot:visible', { hasText: time });
  }

  get availableTimeSlots() {
    return this.page.locator('.toggle-box.slot:visible');
  }

  get firstAvailableTimeSlot() {
    return this.availableTimeSlots.first();
  }

  async hasAvailableSlots(): Promise<boolean> {
    return await this.availableTimeSlots.count() > 0;
  }

  async selectFirstAvailableSlot(maxDaysToTry = 5) {
    for (let i = 0; i < maxDaysToTry; i++) {
      if (await this.hasAvailableSlots()) {
        await this.firstAvailableTimeSlot.click();
        return;
      }
      if (await this.nextDayButton.isVisible()) {
        await this.nextDayButton.click();
        await this.page.waitForLoadState('networkidle');
      } else {
        const nextDay = this.page.locator('.day.toggle-box:not(.selected)').first();
        await nextDay.click();
        await this.page.waitForLoadState('networkidle');
      }
    }
    throw new Error(`No available time slots found after checking ${maxDaysToTry} days`);
  }

  async fillSchedulingForm(options: { time?: string; purpose?: string; day?: string }) {
    if (options.day) {
      await this.selectDay(options.day).click();
      await this.page.waitForLoadState('networkidle');
    }

    if (options.time) {
      await this.selectTimeSlot(options.time).click();
    } else {
      await this.selectFirstAvailableSlot();
    }

    if (options.purpose) {
      await this.purposeTextarea.fill(options.purpose);
    }
  }

  async submitSchedule() {
    await this.scheduleButton.click();
  }

  async confirmSchedule() {
    await expect(this.confirmButton).toBeVisible();
    await this.confirmButton.click();
  }

  async dismissModal() {
    await this.modalCloseButton.click();
  }
}
