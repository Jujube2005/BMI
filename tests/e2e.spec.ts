import { test, expect } from '@playwright/test';

test.describe('BMI3 Application E2E Tests', () => {

  test('Case 1: Should redirect to login page when accessing home page unauthenticated', async ({ page }) => {
    await page.goto('/');
    // Should be redirected to /login
    await expect(page).toHaveURL(/\/login/);
    // Heading on Login page is "Welcome Back"
    await expect(page.locator('h2', { hasText: 'Welcome Back' })).toBeVisible();
  });

  test('Case 2: Should display the correct footer text on login page', async ({ page }) => {
    await page.goto('/login');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toHaveText('67162110078-5 Chotika Jakchai');
    await expect(footer).toHaveCSS('background-color', 'rgb(0, 0, 0)'); // black
    await expect(footer).toHaveCSS('color', 'rgb(255, 255, 255)'); // white
  });

  test('Case 3: Should navigate to register page from login page', async ({ page }) => {
    await page.goto('/login');
    // Link text is "Register"
    await page.click('text=Register');
    
    await expect(page).toHaveURL(/\/register/);
    // Heading on Register page is "Create Account"
    await expect(page.locator('h2', { hasText: 'Create Account' })).toBeVisible();
  });

  test('Case 4: Should show error message on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    // Input is type="email" placeholder="Enter your email"
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Expect an error message. 
    // The code sets error state "Login failed" or from server.
    // Class is text-red-600 in new design
    const errorMessage = page.locator('.text-red-600'); 
    await expect(errorMessage).toBeVisible();
    // Also check for common error text just in case
    // await expect(errorMessage).toHaveText(/failed|error/i);
  });

  test('Case 5: Should show invalid link message on reset password page without token', async ({ page }) => {
    await page.goto('/reset-password');
    
    await expect(page.locator('h2', { hasText: 'Invalid Link' })).toBeVisible();
    await expect(page.getByText('Missing reset token')).toBeVisible();
  });

});
