import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return patient family members', async ({ request }) => {
  const token = getAuthToken();
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
