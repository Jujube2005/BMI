import { test, expect } from '@playwright/test';

test.describe('History Verification for Seeded User', () => {
  const email = 'testuser@example.com';
  const password = 'password123';

  test('should login and display seeded BMI history', async ({ page }) => {
    // 1. Go to login page
    await page.goto('/login');

    // 2. Fill credentials
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');

    // 3. Verify redirected to dashboard
    await expect(page).toHaveURL('/');
    
    // 4. Verify "Welcome Back" or similar dashboard element
    await expect(page.locator('h1')).toContainText('BMI Tracker');

    // 5. Verify History Table exists
    const historyTable = page.locator('table');
    await expect(historyTable).toBeVisible();

    // 6. Verify we have at least 4 rows in the body (corresponding to our 4 seeded records)
    const rows = historyTable.locator('tbody tr');
    await expect(rows).toHaveCount(4);

    // 7. Verify the content of the first row (latest record)
    // It should be the one from "1 hour ago" -> Weight 78, Height 180
    const firstRow = rows.first();
    await expect(firstRow).toContainText('78kg');
    await expect(firstRow).toContainText('180cm');
    
    // 8. Verify the content of the last row (oldest record)
    // It should be the one from "2 months ago" -> Weight 85, Height 180
    const lastRow = rows.last();
    await expect(lastRow).toContainText('85kg');
    await expect(lastRow).toContainText('180cm');
  });
});
