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
docs/
  test-cases.md                          # Full test case matrix (27 cases)
tests/
  setup/
    auth.setup.ts                        # Login + save auth token and cookies
  pages/
    login.page.ts                        # POM: login landing + OAuth form
    home.page.ts                         # POM: hub dashboard
    appointments.page.ts                 # POM: scheduling form + modals
    billing.page.ts                      # POM: payments, cards, Stripe
  helpers/
    graphql.helper.ts                    # Shared GraphQL request helper
  ui/
    login/
      landing-page.spec.ts               # Login landing page
    home/
      home-page.spec.ts                  # Practice info, contacts, billing
    appointments/
      navigation.spec.ts                 # TC-01: Home → Appointments nav
      schedule-happy-path.spec.ts        # TC-02: Full scheduling flow
      schedule-without-description.spec.ts # TC-03: Missing description error
      cancel-scheduling.spec.ts          # TC-04: Cancel on confirmation modal
      dismiss-modal.spec.ts              # TC-05: Dismiss error modal
      long-name-display.spec.ts          # TC-06: Long name edge case
      no-slots-available.spec.ts         # TC-07: No slots for professional
    billing/
      layout-validation.spec.ts          # TC-20: Billing sections visible
      success-payment.spec.ts            # TC-21: $1 payment via Stripe
      cancel-payment.spec.ts             # TC-22: Cancel at confirmation
      missing-payment-method.spec.ts     # TC-23: No card selected error
      invalid-amount.spec.ts             # TC-24: Negative amount error
      add-card-different.spec.ts         # TC-25: Add via "different card"
      add-card-direct.spec.ts            # TC-26: Add via dedicated button
      delete-credit-card.spec.ts         # TC-27: Delete + cleanup extras
  api/
    patient/
      patient-fields.spec.ts             # TC-10: Patient fields contract
      clinic-contract.spec.ts            # TC-11: Clinic address/contact
      family-members.spec.ts             # TC-12: Patient family members
    appointments/
      appointments-list.spec.ts          # TC-13: Appointments array
      appointment-contract.spec.ts       # TC-14: Appointment data structure
      self-schedule-users.spec.ts        # TC-15: Schedulable users
    billing/
      invoices-contract.spec.ts          # TC-16: Invoices contract
      outstanding-balance.spec.ts        # TC-17: Outstanding balance
      credit-cards-contract.spec.ts      # TC-18: Credit cards contract
      bank-accounts-contract.spec.ts     # TC-19: Bank accounts contract
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

**27 test cases** across UI and API — full matrix available in [`docs/test-cases.md`](docs/test-cases.md).

### UI Tests (17 tests)

| Area | Tests |
|------|-------|
| Login | Landing page validation |
| Home | Practice info, address, contact links (tel/email/sms), billing card |
| Appointments | Navigation, happy path, missing description, cancel, modal dismiss, long names, no slots |
| Billing | Layout, success payment, cancel payment, missing method, invalid amount, add card (2 flows), delete + cleanup |

### API Tests (10 tests)

| Area | Tests |
|------|-------|
| Patient & Clinic | Patient fields, clinic address/contact, family members |
| Appointments | List validation, contract per entry, self-schedule users |
| Billing | Invoices, outstanding balance, credit cards, bank accounts |

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
- Added CI/CD pipeline with GitHub Actions (push, PR, nightly)
- Added 7 appointment scheduling UI tests (TC-01 through TC-07)
- Added 8 billing UI tests (TC-20 through TC-27) including Stripe card management
- Restructured to feature-folder pattern with one spec file per test case
- Created test case documentation (27 cases) in `docs/test-cases.md`
