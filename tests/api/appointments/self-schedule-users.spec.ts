import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return self-schedule users with scheduling options', async ({ request }) => {
  const token = getAuthToken();
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
