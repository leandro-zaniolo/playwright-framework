import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return bank accounts with valid contract', async ({ request }) => {
  const token = getAuthToken();
  const data = await graphqlRequest(request, token, `query {
    bank_accounts {
      id
      bank_name
      is_autocharge_enabled
      account_holder_name
      last4
      status
    }
  }`);

  expect(Array.isArray(data.bank_accounts)).toBeTruthy();

  for (const account of data.bank_accounts) {
    expect(account.id).toBeDefined();
    expect(typeof account.bank_name).toBe('string');
    expect(typeof account.account_holder_name).toBe('string');
    expect(typeof account.last4).toBe('string');
    expect(typeof account.status).toBe('string');
    expect(account.is_autocharge_enabled).toBeDefined();
  }
});
