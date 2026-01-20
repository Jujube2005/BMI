import { test, expect } from '@playwright/test';

test.describe('UI Flow: Login & BMI Input', () => {

  const uniqueUser = `ui_user_${Date.now()}`;
  const email = `${uniqueUser}@example.com`;
  const password = 'password123';

  // Setup: Register via API to ensure user exists
  test.beforeAll(async ({ request }) => {
    await request.post('/api/auth/register', {
      data: {
        username: uniqueUser,
        email: email,
        password: password
      }
    });
  });

  test('Should allow user to login and record BMI', async ({ page }) => {
    // 1. Login via UI
    await page.goto('/login');
    
    // Fill credentials
    await page.fill('#email', email);
    await page.fill('#password', password);
    
    // Click Login
    await page.click('button[type="submit"]');
    
    // Assert redirection to Home
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toHaveText('BMI Tracker');
    await expect(page.getByText(uniqueUser)).toBeVisible();

    // 2. Record BMI
    // Fill Weight (kg) and Height (cm)
    // Using explicit labels to be robust
    await page.getByLabel('Weight (kg)').fill('70');
    await page.getByLabel('Height (cm)').fill('175');
    
    // Submit
    await page.click('button:has-text("Calculate & Save")');

    // 3. Verify Result in History
    // BMI = 70 / (1.75 * 1.75) = 22.86
    const bmiValue = '22.86';
    const bmiStatus = 'Normal (ปกติ)'; // Based on logic in page.tsx

    // Check if the new row appears in the table
    // We look for a row containing the BMI value
    const row = page.locator('tr', { hasText: bmiValue });
    await expect(row).toBeVisible();
    await expect(row).toContainText(bmiStatus);
  });

});
