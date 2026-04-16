import { test, expect } from '@playwright/test';
import { getAuthToken, graphqlRequest } from '../../helpers/graphql.helper';

test('should return invoices with valid contract', async ({ request }) => {
  const token = getAuthToken();
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
