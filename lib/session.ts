import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || 'dev-session-secret';
const COOKIE_NAME = 'mmavex_session';

function base64url(input: Buffer | string) {
  const b = typeof input === 'string' ? Buffer.from(input) : input;
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function signSession(payload: Record<string, any>) {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, iat: Date.now() }));
  const signature = base64url(crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest());
  return `${header}.${body}.${signature}`;
}

export function verifySession(token?: string) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, body, sig] = parts;
    const expected = base64url(crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest());
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
    const payload = JSON.parse(Buffer.from(body, 'base64').toString('utf-8'));
    // Optional: check token age (e.g., 7 days)
    if (payload.iat && Date.now() - payload.iat > 1000 * 60 * 60 * 24 * 7) return false;
    return true;
  } catch (e) {
    return false;
  }
}

export { COOKIE_NAME };
