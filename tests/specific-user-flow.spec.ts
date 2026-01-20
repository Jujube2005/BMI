import { test, expect } from '@playwright/test';

test.describe('Specific User Flow: testuser', () => {
  const username = 'testuser';
  const email = 'testuser@example.com';
  const password = 'password123';

  test('Should login as testuser and record BMI', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // Verify login success
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('BMI Tracker');
    // Check for the user's initial in the navbar to confirm identity
    await expect(page.locator('nav')).toContainText(username);

    // 2. Record BMI
    // Test data: Weight 75kg, Height 180cm
    // BMI = 75 / (1.8 * 1.8) = 23.15
    const weight = '75';
    const height = '180';
    const expectedBMI = '23.15';
    const expectedStatus = 'Overweight (ท้วม)'; // 23 <= 23.15 < 25

    await page.fill('#weight', weight);
    await page.fill('#height', height);
    await page.click('button:has-text("Calculate & Save")');

    // 3. Verify Result in History
    // Wait for the table row to appear with the specific BMI value
    const row = page.locator('tr', { hasText: expectedBMI });
    await expect(row).toBeVisible();
    await expect(row).toContainText(expectedStatus);
    await expect(row).toContainText(`${weight}kg / ${height}cm`);
  });
});
