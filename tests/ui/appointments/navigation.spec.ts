import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-01: Navigation to Appointments
test('should navigate from Home to Appointments via Manage Appointments button', async ({ page }) => {
  await page.goto(process.env.HUB_URL!);
  const homePage = new HomePage(page);
  await homePage.isLoaded();

  await homePage.manageAppointmentsButton.click();
  await page.waitForLoadState('networkidle');

  const appointments = new AppointmentsPage(page);
  await expect(page).toHaveURL(/\/hub\/appointments/);
  await expect(appointments.scheduleHeading).toBeVisible();
});
