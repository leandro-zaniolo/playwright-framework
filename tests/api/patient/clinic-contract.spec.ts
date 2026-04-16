import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return clinic with valid address and contact info', async ({ request }) => {
  const token = getAuthToken();
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
