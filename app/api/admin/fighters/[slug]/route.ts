import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { verifySession } from '../../../../../lib/session';
import { validateFighter } from '../../../../../lib/validators';

const DATA_PATH = new URL('../../../../../data/fighters.json', import.meta.url);

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

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { slug } = params;
    const payload = await req.json();

    const errors = validateFighter(payload);
    if (errors.length > 0) return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });

    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!data[slug]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // If slug changed, handle rename
    const newSlug = payload.slug || slug;
    if (newSlug !== slug) {
      delete data[slug];
    }
    data[newSlug] = payload;

    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ ok: true, fighter: payload });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { slug } = params;
    const raw = await readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!data[slug]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    delete data[slug];
    await writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
