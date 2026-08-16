// app/fighters/[slug]/page.tsx

import React from 'react';
import FighterCard from '../../../components/FighterCard';

type Params = { params: { slug: string } };

export default async function Page({ params }: Params) {
  const slug = params.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  // Fetch fighter data from the API route. In production set NEXT_PUBLIC_SITE_URL.
  const res = await fetch(`${siteUrl}/api/fighters/${slug}`, { cache: 'no-store' });

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Combattant introuvable</h1>
          <p className="mt-2 text-gray-400">Le combattant "{slug}" est introuvable.</p>
        </div>
      </div>
    );
  }

  const fighter = await res.json();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] p-6">
      <div className="max-w-4xl mx-auto">
        <FighterCard fighter={fighter} />

        <section className="mt-8 bg-[#111111] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Historique des combats</h2>
          {fighter.fights && fighter.fights.length > 0 ? (
            <ul className="space-y-3">
              {fighter.fights.map((f: any) => (
                <li key={f.id} className="flex items-center justify-between p-3 bg-[#0F0F0F] rounded">
                  <div>
                    <div className="text-sm text-gray-300">{new Date(f.date).toLocaleDateString()}</div>
                    <div className="font-medium">{f.event_name} — {f.opponent_name}</div>
                    <div className="text-sm text-gray-400">{f.method} · R{f.round} · {f.time}</div>
                  </div>
                  <div className={`px-3 py-1 rounded font-semibold ${f.result === 'win' ? 'bg-[#002B18] text-[#00C48C]' : f.result === 'loss' ? 'bg-[#2B0000] text-[#FF9B9B]' : 'bg-[#222] text-gray-300'}`}>
                    {f.result.toUpperCase()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">Aucun combat répertorié.</div>
          )}
        </section>

      </div>
    </div>
  );
}
