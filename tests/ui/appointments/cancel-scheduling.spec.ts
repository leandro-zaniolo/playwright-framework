import { test, expect } from '@playwright/test';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-04: Cancellation — cancel on confirmation modal
test('should cancel scheduling from the confirmation modal', async ({ page }) => {
  const appointments = new AppointmentsPage(page);
  await appointments.goto();

  await appointments.fillSchedulingForm({
    purpose: 'Should be cancelled - automation test',
  });

  await appointments.submitSchedule();
  await expect(appointments.confirmButton).toBeVisible();

  await appointments.cancelButton.click();

  await expect(appointments.confirmButton).not.toBeVisible();
  await expect(appointments.purposeTextarea).toHaveValue('Should be cancelled - automation test');
});
