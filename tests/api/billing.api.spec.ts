import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../helpers/graphql.helper';

test.describe('API — Billing', () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  test('should return invoices with valid contract', async ({ request }) => {
    const data = await graphqlRequest(request, token, `query {
      invoices {
        textual
        date
        current
        amount
        outstanding
      }
    }`);

    expect(Array.isArray(data.invoices)).toBeTruthy();

    for (const invoice of data.invoices) {
      expect(typeof invoice.textual).toBe('string');
      expect(typeof invoice.date).toBe('string');
      expect(invoice.current).toBeDefined();
      expect(typeof invoice.amount).toBe('string');
      expect(typeof invoice.outstanding).toBe('string');

      expect(parseFloat(invoice.amount)).not.toBeNaN();
      expect(parseFloat(invoice.outstanding)).not.toBeNaN();
    }
  });

  test('should return outstanding balance as a number', async ({ request }) => {
    const data = await graphqlRequest(request, token, `query {
      outstanding_balance { amount }
    }`);

    expect(data.outstanding_balance).toBeDefined();
    expect(typeof data.outstanding_balance.amount).toBe('string');
    expect(parseFloat(data.outstanding_balance.amount)).not.toBeNaN();
  });

  test('should return credit cards with valid contract', async ({ request }) => {
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

  test('should return bank accounts with valid contract', async ({ request }) => {
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
});
