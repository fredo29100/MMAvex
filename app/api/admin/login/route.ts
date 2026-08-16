import { NextResponse } from 'next/server';
import { signSession } from '../../../../lib/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body?.password;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = signSession({ user: 'admin' });

    const res = NextResponse.json({ ok: true });
    // set a signed httpOnly cookie
    res.cookies.set('mmavex_session', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('mmavex_session', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
