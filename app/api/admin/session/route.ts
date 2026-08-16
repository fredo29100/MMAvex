import { NextResponse } from 'next/server';
import { verifySession } from '../../../../lib/session';

function parseCookies(header?: string | null) {
  const obj: Record<string, string> = {};
  if (!header) return obj;
  header.split(';').forEach((part) => {
    const [k, v] = part.split('=');
    if (!k) return;
    obj[k.trim()] = decodeURIComponent((v || '').trim());
  });
  return obj;
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const token = cookies['mmavex_session'];
    const ok = verifySession(token);
    return NextResponse.json({ admin: !!ok });
  } catch (e) {
    return NextResponse.json({ admin: false });
  }
}
