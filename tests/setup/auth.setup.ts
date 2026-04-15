import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import fs from 'fs';

const AUTH_DIR = '.auth';
const STORAGE_STATE = `${AUTH_DIR}/state.json`;
const TOKEN_FILE = `${AUTH_DIR}/token.json`;

function hasValidToken(): boolean {
  if (!fs.existsSync(TOKEN_FILE) || !fs.existsSync(STORAGE_STATE)) return false;

  try {
    const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    const stillValid = data.expiresAt > Date.now() / 1000;
    if (stillValid) console.log('Reusing existing token (still valid)');
    return stillValid;
  } catch {
    return false;
  }
}

setup('login and save auth', async ({ page, context }) => {
  if (hasValidToken()) return;

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);

  await context.storageState({ path: STORAGE_STATE });

  const cookies = await context.cookies();
  const tokenCookie = cookies.find(c => c.name === 'access_token_data');
  if (!tokenCookie) throw new Error('access_token_data cookie not found after login');

  const tokenData = JSON.parse(decodeURIComponent(tokenCookie.value));

  fs.writeFileSync(TOKEN_FILE, JSON.stringify({
    token: tokenData.access_token_id,
    expiresAt: tokenData.expires_at,
  }, null, 2));

  console.log('Auth token saved');
});
