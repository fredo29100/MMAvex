import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';

const DATA_PATH = new URL('../../../../data/fighters.json', import.meta.url);

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  let data: Record<string, any> = {};
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    return NextResponse.json({ error: 'Data not available' }, { status: 500 });
  }

  const fighter = data[slug];
  if (!fighter) {
    return NextResponse.json({ error: `Fighter '${slug}' not found` }, { status: 404 });
  }
  return NextResponse.json(fighter);
}
