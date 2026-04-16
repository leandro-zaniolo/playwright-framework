import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return credit cards with valid contract', async ({ request }) => {
  const token = getAuthToken();
  const data = await graphqlRequest(request, token, `query {
    credit_cards {
      id
      last4
      type
      exp_month
      exp_year
      is_hsa
      is_autocharge_enabled
    }
  }`);

  expect(Array.isArray(data.credit_cards)).toBeTruthy();

  for (const card of data.credit_cards) {
    expect(card.id).toBeDefined();
    expect(typeof card.last4).toBe('string');
    expect(card.last4).toMatch(/^\d{4}$/);
    expect(typeof card.type).toBe('string');
    const expMonth = Number(card.exp_month);
    expect(expMonth).not.toBeNaN();
    expect(expMonth).toBeGreaterThanOrEqual(1);
    expect(expMonth).toBeLessThanOrEqual(12);
    const expYear = Number(card.exp_year);
    expect(expYear).not.toBeNaN();
    expect(card.is_hsa).toBeDefined();
    expect(card.is_autocharge_enabled).toBeDefined();
  }
});
