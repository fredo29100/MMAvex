import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { verifySession } from '../../../../lib/session';
import { validateFighter } from '../../../../lib/validators';

const DATA_PATH = new URL('../../../../data/fighters.json', import.meta.url);

export async function GET(req: Request) {
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Data not available' }, { status: 500 });
  }
}

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

function isAuthorized(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  const token = cookies['mmavex_session'];
  return verifySession(token);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = await req.json();
    if (!payload || !payload.slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const errors = validateFighter(payload);
    if (errors.length > 0) return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });

    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);

    if (data[payload.slug]) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

    data[payload.slug] = payload;
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, fighter: payload });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
