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
- **GitHub Actions** — CI/CD pipeline

## Project Structure

```
tests/
  setup/
    auth.setup.ts            # Login + save auth token and cookies
  pages/
    login.page.ts            # POM: login landing + OAuth form
    home.page.ts             # POM: hub dashboard
  helpers/
    graphql.helper.ts        # Shared GraphQL request helper
  ui/
    login.spec.ts            # UI: login landing page
    home.spec.ts             # UI: hub dashboard validation
  api/
    patient.api.spec.ts      # API: patient, clinic, family
    appointments.api.spec.ts # API: appointments, scheduling
    billing.api.spec.ts      # API: invoices, balance, cards, banks
```

## Setup

```bash
npm install
npx playwright install chrome
```

Copy `.env.example` to `.env` and fill in your credentials:

```
HUB_URL=https://atlas.atlasdevel5.com/hub/
GRAPHQL_ENDPOINT=https://atlas.atlasdevel5.com/graphql_q91f/patient
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password-here
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

## CI/CD

Tests run automatically via GitHub Actions:

- On every **push** to `main`
- On every **pull request** to `main`
- **Nightly** at 3 AM UTC, weekdays only (Mon–Fri)
- **Manually** via workflow dispatch

The workflow installs dependencies and Chrome, runs the full suite (auth → UI → API), and uploads the Playwright HTML report as an artifact. On CI, tests get 1 retry to handle flaky network conditions.

Credentials are stored as GitHub repository secrets (`HUB_URL`, `GRAPHQL_ENDPOINT`, `USER_EMAIL`, `USER_PASSWORD`).

## Test Coverage

### UI Tests (2 tests)

| Test | What it validates |
|------|-------------------|
| Login landing page | Log In button and Create Account link are visible |
| Hub dashboard | Practice info, navigation (Home/Appointments/Billing), Manage buttons |

### API Tests (10 tests)

| Test | What it validates |
|------|-------------------|
| Patient fields | id, first_name, last_name, birthdate, gender, user (id, name, email, phone) |
| Clinic contract | name, address_1, address_2, city, state_abbr (2 chars), zip (5 digits), phone, email |
| Patient family | Array of members with id, first_name, last_name, is_head_of_family |
| Appointments list | Returns array |
| Appointment contract | Valid datetime, doctor name (non-empty), patient id/name |
| Self-schedule users | id, name, email (@), phone, scheduling options (how_far is numeric) |
| Invoices contract | textual, date, current, amount (numeric), outstanding (numeric) |
| Outstanding balance | amount is defined and numeric |
| Credit cards contract | id, last4 (4 digits), type, exp_month (1-12), exp_year, is_hsa, is_autocharge |
| Bank accounts contract | id, bank_name, account_holder_name, last4, status, is_autocharge |

## Progress Log

### Day 1

- Set up the project: Playwright, TypeScript, dotenv, environment config
- Explored the staging app to understand the login flow and hub structure
- Discovered the login is a two-step process: hub landing page → OAuth form
- Built Page Object Model with `LoginPage` and `HomePage`
- Implemented and stabilized 2 UI tests (login landing, hub dashboard)
- Discovered the GraphQL API endpoint and auth mechanism (token from cookies)
- Built token caching to avoid unnecessary logins and rate limiting
- Implemented 10 API tests covering patient, clinic, appointments, billing with full contract validation
- Added CI/CD pipeline with GitHub Actions
