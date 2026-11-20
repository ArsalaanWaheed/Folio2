import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const sessionName = 'portfolio-admin';
const sessionSeconds = 8 * 60 * 60;
const configuredPassword = () => {
  const password = process.env.PORTFOLIO_ADMIN_PASSWORD;
  return password && password.length >= 16 ? password : undefined;
};
const digest = (value: string) => createHash('sha256').update(value).digest();
const signature = (expiry: string, password: string) =>
  createHmac('sha256', password).update('portfolio-admin:' + expiry).digest('base64url');

export const adminConfigured = () => Boolean(configuredPassword());

export async function isAdmin() {
  const password = configuredPassword();
  const session = (await cookies()).get(sessionName)?.value;
  if (!password || !session) return false;
  const [expiry, token] = session.split('.');
  if (!/^\d+$/.test(expiry) || !token || Number(expiry) <= Date.now()) return false;
  return timingSafeEqual(digest(token), digest(signature(expiry, password)));
}

let failures = 0;
let windowEnds = 0;

export async function signIn(attempt: string) {
  const password = configuredPassword();
  if (!password) return 'Set PORTFOLIO_ADMIN_PASSWORD to at least 16 characters to enable sign-in.';
  const now = Date.now();
  if (now >= windowEnds) {
    failures = 0;
    windowEnds = now + 60_000;
  }
  if (failures >= 8) return 'Too many attempts. Try again in a minute.';
  if (!timingSafeEqual(digest(attempt), digest(password))) {
    failures++;
    return 'Incorrect password.';
  }
  failures = 0;
  const expiry = String(now + sessionSeconds * 1000);
  (await cookies()).set(sessionName, expiry + '.' + signature(expiry, password), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: sessionSeconds,
  });
  return null;
}

export async function signOut() {
  (await cookies()).delete(sessionName);
}
