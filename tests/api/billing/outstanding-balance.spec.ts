import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return outstanding balance as a number', async ({ request }) => {
  const token = getAuthToken();
  const data = await graphqlRequest(request, token, `query {
    outstanding_balance { amount }
  }`);

  expect(data.outstanding_balance).toBeDefined();
  expect(typeof data.outstanding_balance.amount).toBe('string');
  expect(parseFloat(data.outstanding_balance.amount)).not.toBeNaN();
});
