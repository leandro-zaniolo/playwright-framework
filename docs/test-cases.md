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

## Login & Dashboard

| ID | Title | Description | Steps | Expected Result | Automated |
|----|-------|-------------|-------|-----------------|-----------|
| TC-08 | Login Landing Page | Verify login page displays correctly. | 1. Navigate to the hub URL. | "Log In" button and "Create Account" link are visible. | `login/landing-page.spec.ts` |
| TC-09 | Hub Dashboard | Verify dashboard loads after authentication. | 1. Log in. 2. Navigate to the hub. | Practice info, nav links (Home/Appointments/Billing), and Manage buttons are visible. | `login/dashboard.spec.ts` |

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
