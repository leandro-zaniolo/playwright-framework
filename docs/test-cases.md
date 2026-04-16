# Test Cases — Atlas Patient Hub

## Appointment Scheduling

| ID | Title | Description | Steps | Expected Result | Automated |
|----|-------|-------------|-------|-----------------|-----------|
| TC-01 | Navigation to Appointments | Verify that the "Manage Appointments" button redirects the user correctly. | 1. Access the Home page. 2. Click on "Manage Appointments" button. | User is redirected to the Appointments page; the scheduling form is visible. | `appointments/navigation.spec.ts` |
| TC-02 | Create Appointment (Happy Path) | Successfully schedule a new appointment with all required fields. | 1. Go to Appointments page. 2. Select a Doctor, Date, and Time. 3. Enter a description in the "Purpose" field. 4. Click "Schedule Appointment". 5. Click "Confirm and Schedule" in the modal. | "Appointment Successfully Scheduled" modal appears. | `appointments/schedule-happy-path.spec.ts` |
| TC-03 | Schedule Without Description (Negative) | Validate error handling when mandatory description is missing. | 1. Select a time slot. 2. Leave "Purpose" field empty. 3. Click "Schedule Appointment". | Error modal appears with text: "Please describe the purpose of your appointment". | `appointments/schedule-without-description.spec.ts` |
| TC-04 | Cancel Appointment Scheduling | Verify that clicking cancel on the confirmation modal stops the process. | 1. Fill all scheduling fields. 2. Click "Schedule Appointment". 3. On the confirmation modal, click "Cancel". | Modal closes; form data remains. | `appointments/cancel-scheduling.spec.ts` |
| TC-05 | Modal Closure | Ensure error modal can be dismissed via the close button. | 1. Trigger the error modal. 2. Click the "X" close button. | The modal disappears, and the page becomes interactive again. | `appointments/dismiss-modal.spec.ts` |
| TC-06 | Edge Case: Long Name Display | Verify UI stability with extremely long patient/doctor names. | 1. View the appointment list containing a very long doctor name. | The layout does not break; text stays within viewport bounds. | `appointments/long-name-display.spec.ts` |
| TC-07 | No Slots Available | Verify the system's behavior when a selected professional has no available time slots. | 1. Navigate to the Appointments page. 2. Select "Amanda" in the Responsible dropdown. | The message "No slots available." is displayed. No time slots are clickable. | `appointments/no-slots-available.spec.ts` |

## Billing Module

| ID | Title | Description | Steps | Expected Result | Automated |
|----|-------|-------------|-------|-----------------|-----------|
| TC-20 | Billing Layout | Verify presence of essential Billing sections. | 1. Navigate to Billing page. | "Invoices", "Make a Payment", and "Credit Cards" sections are visible. | `billing/layout-validation.spec.ts` |
| TC-21 | Success Payment | Process a $1 payment using an existing card. | 1. Select payment method. 2. Set amount to 1. 3. Click "Send Payment". 4. Click "Confirm and Process". | "Payment Completed Successfully" modal is displayed. | `billing/success-payment.spec.ts` |
| TC-22 | Cancel Payment | Ensure cancellation works at the confirmation stage. | 1. Select payment method and amount. 2. Click "Send Payment". 3. On modal, click "Cancel". | Modal closes; user remains on Billing page. | `billing/cancel-payment.spec.ts` |
| TC-23 | Missing Payment Method | Validate error when no card is selected. | 1. Set amount to 1. 2. Click "Send Payment" without selecting a method. | Error modal appears: "Please select a payment method". | `billing/missing-payment-method.spec.ts` |
| TC-24 | Invalid Amount (Negative) | Validate error for values below the minimum threshold. | 1. Select payment method. 2. Enter "-1". 3. Click "Send Payment". | Error modal appears: "The amount must be at least $0.50". | `billing/invalid-amount.spec.ts` |
| TC-25 | Add Card (Different) | Add a new card through "Pay with different card" link. | 1. Click "Pay with a different card". 2. Enter 4242 4242 4242 4242. 3. Set expiry (current year + 2). 4. Click "Add". | "Credit card added successfully" modal appears. | `billing/add-card-different.spec.ts` |
| TC-26 | Add Card (Direct) | Add a new card via the dedicated button. | 1. Click "Add New Credit Card". 2. Enter valid card data (4242...). 3. Click "Add". | Card is added successfully. | `billing/add-card-direct.spec.ts` |
| TC-27 | Delete Credit Cards | Verify deletion flow and clean up extras. | 1. Click delete icon on a card. 2. Click "Confirm". 3. Repeat until at most 2 cards remain. | Cards are deleted; success modal appears; list shows at most 2 cards. | `billing/delete-credit-card.spec.ts` |

## Login & Dashboard

| ID | Title | Description | Steps | Expected Result | Automated |
|----|-------|-------------|-------|-----------------|-----------|
| TC-08 | Login Landing Page | Verify login page displays correctly. | 1. Navigate to the hub URL. | "Log In" button and "Create Account" link are visible. | `login/landing-page.spec.ts` |
| TC-09 | Home Page | Verify home page displays practice info, contact links, and billing. | 1. Log in. 2. Navigate to the hub. | Practice info, address (Google Maps link), phone/email/SMS links with correct hrefs, Billing card visible. | `home/home-page.spec.ts` |

## API — GraphQL Contract Validation

| ID | Title | Description | Steps | Expected Result | Automated |
|----|-------|-------------|-------|-----------------|-----------|
| TC-10 | Patient Fields | Validate patient query contract. | POST GraphQL query for patient data. | Returns id, first_name, last_name, birthdate, gender, user (id, name, email, phone). | `patient/patient-fields.spec.ts` |
| TC-11 | Clinic Contract | Validate clinic query contract. | POST GraphQL query for clinic data. | Returns name, address_1, address_2, city, state_abbr (2 chars), zip (5 digits), phone, email. | `patient/clinic-contract.spec.ts` |
| TC-12 | Patient Family | Validate patient_family query contract. | POST GraphQL query for family data. | Returns array with id, first_name, last_name, is_head_of_family. | `patient/family-members.spec.ts` |
| TC-13 | Appointments List | Validate appointments query returns array. | POST GraphQL query for appointments. | Returns array of appointments. | `appointments/appointments-list.spec.ts` |
| TC-14 | Appointment Contract | Validate each appointment's data structure. | POST GraphQL query for appointments. | Each entry has valid datetime, doctor name, patient id/name. | `appointments/appointment-contract.spec.ts` |
| TC-15 | Self-Schedule Users | Validate self_schedule_users query contract. | POST GraphQL query for schedulable users. | Returns id, name, email, phone, scheduling options (how_far is numeric). | `appointments/self-schedule-users.spec.ts` |
| TC-16 | Invoices Contract | Validate invoices query contract. | POST GraphQL query for invoices. | Returns textual, date, current, amount (numeric), outstanding (numeric). | `billing/invoices-contract.spec.ts` |
| TC-17 | Outstanding Balance | Validate outstanding_balance query. | POST GraphQL query for balance. | Returns amount as numeric string. | `billing/outstanding-balance.spec.ts` |
| TC-18 | Credit Cards Contract | Validate credit_cards query contract. | POST GraphQL query for credit cards. | Returns id, last4 (4 digits), type, exp_month (1-12), exp_year, is_hsa, is_autocharge. | `billing/credit-cards-contract.spec.ts` |
| TC-19 | Bank Accounts Contract | Validate bank_accounts query contract. | POST GraphQL query for bank accounts. | Returns id, bank_name, account_holder_name, last4, status, is_autocharge. | `billing/bank-accounts-contract.spec.ts` |
