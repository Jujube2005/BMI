# Testing Plan & Documentation

## 1. Overview
This document outlines the comprehensive testing strategy for the BMI3 application. The primary goal is to ensure application stability, correct user flows, and UI consistency across different pages. We currently utilize **Playwright** for End-to-End (E2E) testing.

## 2. Test Scope

### 2.1 End-to-End (E2E) Testing
We use Playwright to simulate real user interactions in a browser environment.
- **Location**: `tests/`
- **Configuration**: `playwright.config.ts`
- **Browsers**: Chromium (Configured), easily extensible to Firefox/WebKit.

#### Current Test Suites

**Suite 1: Core Authentication & Navigation (`tests/e2e.spec.ts`)**
1.  **Unauthenticated Redirect**: Verifies that accessing the root path (`/`) redirects to `/login`.
2.  **Footer Verification (Login)**: Ensures the footer contains specific student details ("67162110078-5 Chotika Jakchai") and correct styling.
3.  **Navigation Flow**: Tests the link from Login page to Register page.
4.  **Login Validation**: Verifies error messages appear when logging in with invalid credentials.
5.  **Reset Password Protection**: Checks that the Reset Password page shows an error when accessed without a token.

**Suite 2: Additional UI & Edge Cases (`tests/additional.spec.ts`)**
6.  **Registration Validation**: Tests HTML5 form validation for invalid email formats.
7.  **Forgot Password UI**: Verifies the presence of key elements (Header, Input, Button) on the Forgot Password page.
8.  **Back Navigation**: Tests the "Back to Login" functionality from the Forgot Password page.
9.  **Footer Verification (Register)**: Confirms footer consistency on the Register page.
10. **Protected Routes**: Ensures unauthorized access to `/admin` redirects to `/login`.

**Suite 3: API Integration (`tests/api.spec.ts`)**
11. **Register API**: Verifies `POST /api/auth/register` successfully creates a user.
12. **Login API**: Verifies `POST /api/auth/login` successfully authenticates a valid user.
13. **Login API (Invalid)**: Verifies `POST /api/auth/login` rejects invalid credentials.
14. **Forgot Password API**: Verifies `POST /api/auth/forgot-password` handles requests correctly.
15. **User Profile API**: Verifies `GET /api/auth/me` returns correct user data after login.
16. **BMI Operations API**: Verifies `POST /api/bmi` creates records and `GET /api/bmi` retrieves them.
17. **Password Reset Flow**: Verifies full flow: Register -> Forgot Password -> Reset Password -> Login with new password.

**Suite 4: Database Verification (`tests/db.spec.ts`)**
18. **User Persistence**: Verifies that a user registered via API is correctly saved in the SQLite database using Prisma Client.
19. **BMI Record Persistence**: Verifies that BMI records created via API are correctly linked to the user in the database.

**Suite 5: Unit Tests (`src/utils/*.test.ts`)**
20. **BMI Calculation**: Tests `calculateBMI` function for correctness and error handling (zero/negative values).
21. **BMI Categorization**: Tests `getBMICategory` logic for all ranges (Underweight, Normal, Overweight, Obese).

### 2.2 Future Testing Roadmap
-   **Component Testing**: Test individual React components in isolation using Vitest + React Testing Library.
-   **CI/CD Integration**: Automate these tests in GitHub Actions.

## 3. How to Run Tests
### Prerequisites
- Node.js installed
- Project dependencies installed: `npm install`
- Playwright browsers installed: `npx playwright install`

### Commands
**Run E2E, API & Database Tests (Playwright):**
```bash
npx playwright test
```

**Run Unit Tests (Vitest):**
```bash
npx vitest run
```

**Run Specific Test File:**
```bash
npx playwright test tests/e2e.spec.ts
```

**Run in UI Mode (Interactive Debugging):**
```bash
npx playwright test --ui
```

**View HTML Report:**
```bash
npx playwright show-report
```

## 4. CI/CD Integration Strategy
For continuous quality assurance, a CI pipeline (e.g., GitHub Actions) is recommended.

**Example Workflow:**
1.  **Trigger**: On Push to `main` or Pull Request.
2.  **Steps**:
    -   Checkout Code.
    -   Install Node.js & Dependencies.
    -   Install Playwright Browsers.
    -   Run `npx playwright test`.
    -   Upload Test Report artifacts on failure.
