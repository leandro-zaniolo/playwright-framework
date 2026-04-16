import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return appointments as an array', async ({ request }) => {
  const token = getAuthToken();
  const data = await graphqlRequest(request, token, `query {
    appointments {
      appointment_start_time
      appointment_doctor { name }
      patient { id, first_name, last_name }
    }
  }`);

  expect(Array.isArray(data.appointments)).toBeTruthy();
});
