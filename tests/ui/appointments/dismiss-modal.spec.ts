import { test, expect } from '@playwright/test';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-05: Modal dismissal — close error modal via X
test('should dismiss error modal via close button', async ({ page }) => {
  const appointments = new AppointmentsPage(page);
  await appointments.goto();

  await appointments.selectFirstAvailableSlot();
  await appointments.submitSchedule();

  await expect(appointments.errorModalTitle).toBeVisible();
  await appointments.dismissModal();

  await expect(appointments.errorModalTitle).not.toBeVisible();
  await expect(appointments.scheduleButton).toBeVisible();
});
