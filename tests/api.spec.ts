import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {

  const uniqueUser = `api_user_${Date.now()}`;
  const email = `${uniqueUser}@example.com`;
  const password = 'password123';

  // Setup: Register a user first for the login test to work
  // Or simply register in the login test if tests run in parallel and state isn't shared
  
  test('POST /api/auth/register should create a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        username: uniqueUser,
        email: email,
        password: password
      }
    });

    // Expect either 200 (OK) or 201 (Created)
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    if (body.user) {
        expect(body.user).toHaveProperty('username', uniqueUser);
        expect(body.user).toHaveProperty('email', email);
    }
  });

  test('POST /api/auth/login should authenticate the user', async ({ request }) => {
    // Need to register first because tests run in parallel/isolation
    // Use a specific user for this test to avoid collision
    const loginUser = `login_user_${Date.now()}`;
    const loginEmail = `${loginUser}@example.com`;
    
    // 1. Register
    await request.post('/api/auth/register', {
        data: {
          username: loginUser,
          email: loginEmail,
          password: password
        }
    });

    // 2. Login
    const response = await request.post('/api/auth/login', {
      data: {
        email: loginEmail,
        password: password
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('username', loginUser);
  });

  test('POST /api/auth/login should fail with invalid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'non_existent@example.com',
        password: 'wrongpassword'
      }
    });

    expect(response.ok()).toBeFalsy();
    // API returns 400 or 401
    expect([400, 401]).toContain(response.status());
    
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('POST /api/auth/forgot-password should handle requests', async ({ request }) => {
    const response = await request.post('/api/auth/forgot-password', {
      data: {
        email: 'some_email@example.com'
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('GET /api/auth/me should return current user after login', async ({ request }) => {
    const meUser = `me_user_${Date.now()}`;
    const meEmail = `${meUser}@example.com`;

    // 1. Register
    await request.post('/api/auth/register', {
      data: { username: meUser, email: meEmail, password: password }
    });

    // 2. Login
    await request.post('/api/auth/login', {
      data: { email: meEmail, password: password }
    });

    // 3. Get Me
    const response = await request.get('/api/auth/me');
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('username', meUser);
  });

  test('BMI Operations: Create and Fetch records', async ({ request }) => {
    const bmiUser = `bmi_user_${Date.now()}`;
    const bmiEmail = `${bmiUser}@example.com`;

    // 1. Register & Login
    await request.post('/api/auth/register', {
      data: { username: bmiUser, email: bmiEmail, password: password }
    });
    await request.post('/api/auth/login', {
      data: { email: bmiEmail, password: password }
    });

    // 2. Create BMI Record
    const postResponse = await request.post('/api/bmi', {
      data: { weight: 70, height: 175 }
    });
    expect(postResponse.ok()).toBeTruthy();
    const postBody = await postResponse.json();
    expect(postBody).toHaveProperty('record');
    expect(postBody.record.bmi).toBeCloseTo(22.86, 1);

    // 3. Get BMI Records
    const getResponse = await request.get('/api/bmi');
    expect(getResponse.ok()).toBeTruthy();
    const getBody = await getResponse.json();
    expect(getBody).toHaveProperty('records');
    expect(Array.isArray(getBody.records)).toBeTruthy();
    expect(getBody.records.length).toBeGreaterThan(0);
    expect(getBody.records[0].weight).toBe(70);
  });

  test('Password Reset Flow', async ({ request }) => {
    const resetUser = `reset_user_${Date.now()}`;
    const resetEmail = `${resetUser}@example.com`;
    const newPassword = 'newpassword123';

    // 1. Register
    await request.post('/api/auth/register', {
      data: { username: resetUser, email: resetEmail, password: password }
    });

    // 2. Forgot Password (get token)
    const forgotResponse = await request.post('/api/auth/forgot-password', {
      data: { email: resetEmail }
    });
    expect(forgotResponse.ok()).toBeTruthy();
    const forgotBody = await forgotResponse.json();
    const token = forgotBody.mockToken; // Assuming API returns mockToken in dev/test
    expect(token).toBeDefined();

    // 3. Reset Password
    const resetResponse = await request.post('/api/auth/reset-password', {
      data: { token: token, password: newPassword }
    });
    expect(resetResponse.ok()).toBeTruthy();

    // 4. Login with OLD password (should fail)
    const failLogin = await request.post('/api/auth/login', {
      data: { email: resetEmail, password: password }
    });
    expect(failLogin.ok()).toBeFalsy();

    // 5. Login with NEW password (should success)
    const successLogin = await request.post('/api/auth/login', {
      data: { email: resetEmail, password: newPassword }
    });
    expect(successLogin.ok()).toBeTruthy();
  });

});
