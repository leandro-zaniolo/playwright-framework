import { test, expect } from '@playwright/test';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-03: Validation — missing description
test('should show error when scheduling without a description', async ({ page }) => {
  const appointments = new AppointmentsPage(page);
  await appointments.goto();

  await appointments.selectFirstAvailableSlot();
  await appointments.submitSchedule();

  await expect(appointments.errorModalTitle).toBeVisible();
  await expect(appointments.errorModalMessage).toContainText(
    'Please describe the purpose of your appointment',
  );
});
