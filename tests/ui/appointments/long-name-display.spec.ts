import { test, expect } from '@playwright/test';
import { AppointmentsPage } from '../../pages/appointments.page';

// TC-06: Edge case — long doctor name display
test('should handle long patient/doctor names without layout break', async ({ page }) => {
  const appointments = new AppointmentsPage(page);
  await appointments.goto();

  const longNameEntry = page.locator('text=Pedro de Alcântara Francisco');
  if (await longNameEntry.isVisible().catch(() => false)) {
    const box = await longNameEntry.boundingBox();
    expect(box).toBeTruthy();

    const viewport = page.viewportSize()!;
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  }
});
