import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import fs from 'fs';

const TOKEN_FILE = '.auth/token.json';

export function getAuthToken(): string {
  if (!fs.existsSync(TOKEN_FILE)) {
    throw new Error('Auth token not found. Run auth setup first.');
  }
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8')).token;
}

export async function graphqlRequest(request: APIRequestContext, token: string, query: string) {
  const response = await request.post(process.env.GRAPHQL_ENDPOINT!, {
    headers: { authorization: token, 'content-type': 'application/json' },
    data: { query, variables: {} },
  });

  const body = await response.json();

  if (!response.ok()) {
    console.log('API error:', response.status(), JSON.stringify(body));
  }

  expect(response.ok(), `API returned ${response.status()}`).toBeTruthy();
  expect(body.errors).toBeUndefined();
  return body.data;
}
