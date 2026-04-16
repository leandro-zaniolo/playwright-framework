import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return patient with required fields', async ({ request }) => {
  const token = getAuthToken();
  const data = await graphqlRequest(request, token, `query {
    patient {
      id
      first_name
      last_name
      birthdate
      gender
      user { id, name, email, phone_number }
    }
  }`);

  const patient = data.patient;
  expect(patient).toBeDefined();
  expect(patient.id).toBeDefined();
  expect(typeof patient.first_name).toBe('string');
  expect(typeof patient.last_name).toBe('string');
  expect(patient.first_name.length).toBeGreaterThan(0);
  expect(patient.last_name.length).toBeGreaterThan(0);
  expect(patient.birthdate).toBeDefined();
  expect(patient.gender).toBeDefined();

  const user = patient.user;
  expect(user).toBeDefined();
  expect(user.id).toBeDefined();
  expect(typeof user.name).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(user.email).toContain('@');
  expect(typeof user.phone_number).toBe('string');
});
