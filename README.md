# Atlas Patient Hub — Test Automation

Test suite for the [Atlas Patient Hub](https://atlas.md/patient-hub), built as part of the Entermotion QA Engineer assessment.

## Target Application

- **App:** Atlas Patient Hub (staging)
- **URL:** `https://atlas.atlasdevel5.com/hub/`
- **Scope:** Desktop web (2000x1080 viewport)

## Tech Stack

- **Playwright** — UI automation and API testing
- **TypeScript**
- **dotenv** — environment-based credential management
- **Playwright MCP** — browser exploration during test development

## Project Structure

```
tests/
  ui/
    pages/
      login.page.ts    # Login landing + OAuth form (Page Object)
      home.page.ts     # Hub dashboard after login (Page Object)
    login.spec.ts      # Login flow tests
  api/                 # API/GraphQL tests (planned)
```

## Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` and fill in your credentials:

```
HUB_URL="https://atlas.atlasdevel5.com/hub/"
USER_EMAIL="your-email@example.com"
USER_PASSWORD="your-password"
```

## Running Tests

```bash
npm test              # run all tests
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:headed   # run with visible browser
npm run test:debug    # run in debug mode
npm run report        # open HTML report
```

## Current Coverage

### UI Tests — Login (`login.spec.ts`)

| Test | Status |
|------|--------|
| Should display the login landing page (Log In button, Create Account link) | Passing |
| Should log in with valid credentials and land on the hub | Passing |

The login test validates the full OAuth flow:
1. Navigate to the hub (redirects to `/hub/login`)
2. Click "Log In" on the landing page
3. Fill email and password on the OAuth form
4. Wait for the callback redirect back to `/hub/`
5. Verify the hub dashboard is loaded (nav links, practice logo, Manage Appointments/Billing buttons)

## What's Next

- [ ] Appointment scheduling tests (golden path)
- [ ] Billing & invoices tests
- [ ] API/GraphQL validation tests
- [ ] Test plan document
- [ ] Process document

## Progress Log

### Day 1 — April 15, 2026

- Set up the project: Playwright, TypeScript, dotenv, environment config
- Explored the staging app to understand the login flow and hub structure
- Discovered the login is a two-step process: hub landing page → OAuth form (separate URL at `/users/login`)
- Built Page Object Model with `LoginPage` and `HomePage`
- Implemented and stabilized 2 login tests (both passing)
- Mapped the hub dashboard: Home, Appointments, Billing navigation; practice info; upcoming appointments; billing summary
