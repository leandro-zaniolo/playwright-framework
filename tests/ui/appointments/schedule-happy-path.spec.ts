import { test, expect } from '@playwright/test';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-02: Happy Path — full scheduling flow
test('should schedule an appointment with all required fields', async ({ page }) => {
  const appointments = new AppointmentsPage(page);
  await appointments.goto();

  await appointments.fillSchedulingForm({
    purpose: 'Annual checkup - automation test',
  });

  await appointments.submitSchedule();
  await expect(appointments.confirmButton).toBeVisible();
  await expect(appointments.cancelButton).toBeVisible();

  await appointments.confirmSchedule();
  await expect(appointments.successModal).toBeVisible();
});
