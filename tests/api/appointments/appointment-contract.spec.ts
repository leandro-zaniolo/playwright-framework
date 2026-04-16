import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should have valid contract for each appointment', async ({ request }) => {
  const token = getAuthToken();
  const data = await graphqlRequest(request, token, `query {
    appointments {
      appointment_start_time
      appointment_doctor { name }
      patient { id, first_name, last_name }
    }
  }`);

  for (const appt of data.appointments) {
    expect(typeof appt.appointment_start_time).toBe('string');
    expect(new Date(appt.appointment_start_time).toString()).not.toBe('Invalid Date');

    expect(appt.appointment_doctor).toBeDefined();
    expect(typeof appt.appointment_doctor.name).toBe('string');
    expect(appt.appointment_doctor.name.length).toBeGreaterThan(0);

    expect(appt.patient).toBeDefined();
    expect(appt.patient.id).toBeDefined();
    expect(typeof appt.patient.first_name).toBe('string');
    expect(typeof appt.patient.last_name).toBe('string');
  }
});
