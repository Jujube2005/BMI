import { test, expect } from '@playwright/test';

test.describe('BMI3 Application Additional E2E Tests', () => {

  test('Case 6: Should show validation error for invalid email format on Register page', async ({ page }) => {
    await page.goto('/register');
    
    // Fill with invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    
    // Try to submit. 
    // Since it's HTML5 validation, we can check validity state or try to catch the browser validation message.
    // Easier way in Playwright is to check if the form was NOT submitted (URL didn't change).
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should still be on register page
    await expect(page).toHaveURL(/\/register/);
    
    // Check validity
    const emailInput = page.locator('input[type="email"]');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(isValid).toBe(false);
  });

  test('Case 7: Forgot Password page should display correct UI elements', async ({ page }) => {
    await page.goto('/forgot-password');
    
    await expect(page.locator('h2', { hasText: 'Forgot Password' })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Send Reset Link' })).toBeVisible();
  });

  test('Case 8: Forgot Password page should have working "Back to Login" link', async ({ page }) => {
    await page.goto('/forgot-password');
    
    const backLink = page.getByRole('link', { name: 'Back to Login' });
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('Case 9: Register page should contain the footer', async ({ page }) => {
    await page.goto('/register');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveText('67162110078-5 Chotika Jakchai');
  });

  test('Case 10: Accessing protected route (/admin) without auth should redirect to login', async ({ page }) => {
    // Attempt to go to /admin directly
    await page.goto('/admin');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

});
