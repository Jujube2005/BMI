import { test, expect } from '@playwright/test';

test.describe('History Verification for testuser', () => {
  const username = 'testuser';
  const email = 'testuser@example.com';
  const password = 'password123';

  test('Should display BMI history with different dates', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // Verify login
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('BMI Tracker');

    // 2. Check History Table
    // We expect at least 3 records from our seed script
    const rows = page.locator('tbody tr');
    // Using count() to handle potentially more records from other tests
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Verify we have different dates/weights
    // Record 1: 7 days ago, 80kg
    await expect(page.locator('tr', { hasText: '80kg' })).toBeVisible();
    
    // Record 2: 3 days ago, 78kg
    await expect(page.locator('tr', { hasText: '78kg' })).toBeVisible();

    // Record 3: 1 hour ago, 76kg
    await expect(page.locator('tr', { hasText: '76kg' })).toBeVisible();
    
    // Verify date column contains different values (simple check)
    // We can't easily predict the exact string without knowing the locale execution environment,
    // but we can check that we have multiple distinct dates.
    const dateTexts = await rows.locator('td:first-child').allInnerTexts();
    const uniqueDates = new Set(dateTexts.map(d => d.split(',')[0])); // extract date part roughly
    // It's possible "1 hour ago" and "today" are same date if late at night, but 3 days and 7 days should be different.
    expect(uniqueDates.size).toBeGreaterThan(1);
  });
});
