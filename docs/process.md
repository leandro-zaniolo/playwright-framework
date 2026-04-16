# Process Document — Atlas Patient Hub QA Assessment

## Approach

I started by exploring the staging application manually to understand the user flows before writing any automation. The Patient Hub has three main areas: **Home** (practice info, contact links), **Appointments** (scheduling), and **Billing** (invoices, payments, credit cards). Understanding these flows first was critical — writing tests against assumptions leads to fragile automation.

### Tooling Decision

I chose **Playwright with TypeScript** for several reasons:

- Native support for both UI and API testing in a single framework
- Built-in auto-waiting and retry logic reduces flaky tests
- Excellent support for Stripe iframes (critical for the billing module)
- First-class CI/CD support with GitHub Actions

### Architecture

I followed the **Page Object Model (POM)** pattern and organized tests into **feature folders** (one spec file per test case). This makes the suite easy to navigate, and a failure in one test doesn't cascade into others. The project structure mirrors how a real QA team would organize a growing test suite.

## Progress

### Discovery Phase

- Navigated the hub and mapped out all three modules
- Identified the login flow: hub landing → OAuth form → callback redirect → dashboard
- Discovered the GraphQL API endpoint (`/graphql_q91f/patient`) by inspecting network requests
- Learned that authentication uses an `access_token_id` from cookies, not a standard Bearer JWT
- Found that the API requires both the auth header and session cookies to work

### Auth Strategy

The staging server has a **rate limiter** (12-minute lockout after too many failed attempts) and tokens expire after **15 minutes**. I built a token caching mechanism: the auth setup saves the token to `.auth/token.json` and skips login if the token is still valid. This avoids unnecessary logins and prevents rate limiting during development.

### Test Implementation

I built **27 test cases** covering:

- **Login & Home** (2 tests): Landing page validation, dashboard with contact links
- **Appointments** (7 tests): Full scheduling flow, error handling, cancellation, edge cases
- **Billing** (8 tests): Payments, Stripe card management, validation errors, cleanup
- **API contracts** (10 tests): GraphQL schema validation for all patient hub data

### CI/CD

I set up a GitHub Actions pipeline that runs on push, PR, and nightly (weekdays at 3 AM UTC). The staging server blocks GitHub Actions IPs (returns 403 Forbidden), so CI runs are limited. This is a server-side restriction, not a test issue — the tests pass consistently when run locally.

## Struggles & Challenges

### 1. Headless Browser Detection

The staging server rejects requests from headless Chrome. Running tests without `--headed` locally failed with "Sorry, but there was an error processing your request." The fix was using `channel: 'chrome'` in the Playwright config to use the real Chrome browser, which the server accepts. Adding `--disable-blink-features=AutomationControlled` as a launch arg actually made things worse — it changed Chrome's fingerprint and triggered the server's firewall.

### 2. Rate Limiting

The OAuth login endpoint has aggressive rate limiting. During development, failed login attempts (from wrong selectors, headless detection, etc.) triggered the 12-minute lockout multiple times. I addressed this by:

- Caching auth tokens to avoid re-login
- Adding rate limit detection in the LoginPage POM
- Reducing retry attempts to avoid burning login attempts

### 3. OAuth Login Flow

The login is a two-step process — the hub landing page has a "Log In" button that redirects to a separate OAuth form at `/users/login`. The form field names (`oauth_email`, `password`) are different from what a standard login form would use. Discovering this required exploring the actual DOM rather than guessing selectors.

### 4. Stripe Iframes

The credit card form uses Stripe Elements, which renders card fields inside iframes. Playwright requires `frameLocator()` to interact with iframe content. Each Stripe field (card number, expiry, CVC) is in a separate iframe, and the iframe names are dynamic. I had to query the iframe names at runtime.

### 5. Credit Card Cleanup

The "add credit card" tests create real cards on the Stripe test account. Without cleanup, repeated test runs accumulate cards. I built cleanup logic into the delete test — after any add-card test runs, the delete test removes extras keeping at most 2 cards.

### 6. GraphQL API Auth

The API doesn't use standard Bearer token auth. Instead, it uses a raw `access_token_id` in the `authorization` header, plus session cookies. The token is extracted from the `access_token_data` cookie after browser login. I discovered this by inspecting the browser's network requests — the curl from Chrome DevTools revealed the full auth mechanism.

### 7. Dynamic Scheduling Data

The appointment scheduling form shows available time slots that change based on existing bookings. Hardcoding slot times (like "09:15 AM") caused flaky tests when those slots were already booked. I switched to dynamically selecting the first available slot, which made the tests resilient across runs.

## Decisions Made


| Decision                                | Reasoning                                                   |
| --------------------------------------- | ----------------------------------------------------------- |
| Desktop web only (2000px viewport)      | Per the client's direction to keep scope focused            |
| Playwright over Cypress/Selenium        | Native API testing, better iframe support, faster execution |
| Feature-folder test organization        | Each test is isolated; failures don't cascade               |
| Token caching over fresh login per test | Avoids rate limiting; reduces test runtime                  |
| One spec file per test case             | Clear 1:1 mapping with test case documentation              |
| Stripe test card 4242 4242 4242 4242    | Standard Stripe test card number                            |
| Dynamic slot selection for appointments | Prevents flaky tests from booked slots                      |
| Card cleanup in delete test             | No separate cleanup step; self-contained suite              |


## What I Would Add With More Time

- **Billing invoice download**: Verify PDF download functionality
- **Password change flow**: Test the change password modal
- **Profile/demographics**: Edit patient info via the profile section
- **Mobile responsive tests**: Run the same suite at mobile viewport widths
- **Visual regression**: Screenshot comparison for layout stability
- **Performance baselines**: Track page load times across runs
- **Negative API tests**: Send malformed GraphQL queries, expired tokens, unauthorized requests

