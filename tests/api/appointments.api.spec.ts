import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../helpers/graphql.helper';

test.describe('API — Appointments', () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  test('should return appointments as an array', async ({ request }) => {
    const data = await graphqlRequest(request, token, `query {
      appointments {
        appointment_start_time
        appointment_doctor { name }
        patient { id, first_name, last_name }
      }
    }`);

    expect(Array.isArray(data.appointments)).toBeTruthy();
  });

  test('should have valid contract for each appointment', async ({ request }) => {
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

  test('should return self-schedule users with scheduling options', async ({ request }) => {
    const data = await graphqlRequest(request, token, `query {
      self_schedule_users {
        id
        name
        email
        phone_number
        self_scheduling_options { how_far }
      }
    }`);

    expect(Array.isArray(data.self_schedule_users)).toBeTruthy();

    for (const user of data.self_schedule_users) {
      expect(user.id).toBeDefined();
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(user.email).toContain('@');

      expect(user.self_scheduling_options).toBeDefined();
      expect(user.self_scheduling_options.how_far).toBeDefined();
      expect(Number(user.self_scheduling_options.how_far)).not.toBeNaN();
    }
  });
});
