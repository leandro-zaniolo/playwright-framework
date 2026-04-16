import { test, expect } from '@playwright/test';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-07: No slots available for a professional
test('should show no-slots message when professional has no availability', async ({ page }) => {
  const appointments = new AppointmentsPage(page);
  await appointments.goto();
  await appointments.selectResponsible('Amanda');

  await expect(appointments.noSlotsMessage).toBeVisible();
  expect(await appointments.availableTimeSlots.count()).toBe(0);
});
