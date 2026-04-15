import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../helpers/graphql.helper';

test.describe('API — Patient & Clinic', () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  test('should return patient with required fields', async ({ request }) => {
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

  test('should return clinic with valid address and contact info', async ({ request }) => {
    const data = await graphqlRequest(request, token, `query {
      clinic {
        name
        address_1
        address_2
        city
        state_abbr
        zip
        phone_number
        email
      }
    }`);

    const clinic = data.clinic;
    expect(clinic).toBeDefined();
    expect(typeof clinic.name).toBe('string');
    expect(clinic.name.length).toBeGreaterThan(0);

    expect(typeof clinic.address_1).toBe('string');
    expect(clinic.address_2).toBeDefined();
    expect(typeof clinic.city).toBe('string');
    expect(typeof clinic.state_abbr).toBe('string');
    expect(clinic.state_abbr).toHaveLength(2);
    expect(typeof clinic.zip).toBe('string');
    expect(clinic.zip).toMatch(/^\d{5}/);

    expect(typeof clinic.phone_number).toBe('string');
    expect(typeof clinic.email).toBe('string');
    expect(clinic.email).toContain('@');
  });

  test('should return patient family members', async ({ request }) => {
    const data = await graphqlRequest(request, token, `query {
      patient_family {
        id
        first_name
        last_name
        is_head_of_family
      }
    }`);

    expect(Array.isArray(data.patient_family)).toBeTruthy();

    for (const member of data.patient_family) {
      expect(member.id).toBeDefined();
      expect(typeof member.first_name).toBe('string');
      expect(typeof member.last_name).toBe('string');
      expect(member.is_head_of_family).toBeDefined();
    }
  });
});
