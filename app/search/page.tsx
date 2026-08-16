import React from 'react';
import Header from '../../components/Header';
import FighterCard from '../../components/FighterCard';
import SearchFilters from '../../components/SearchFilters';

type SearchParams = { q?: string; org?: string; weight?: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function SearchPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ?? {};
  const slugs = ['jean-duc', 'maria-rosa'];

  const fighters = (
    await Promise.all(
      slugs.map(async (s) => {
        try {
          const res = await fetch(`${SITE_URL}/api/fighters/${s}`, { cache: 'no-store' });
          if (!res.ok) return null;
          return await res.json();
        } catch (e) {
          return null;
        }
      })
    )
  ).filter(Boolean);

  // derive filter options from data
  const orgOptions = Array.from(new Set(fighters.flatMap((f: any) => (f.organizations ?? []).map((o: any) => o.name))));
  const weightOptions = Array.from(new Set(fighters.map((f: any) => f.weight_category?.name).filter(Boolean)));

  // server-side filtering based on query params
  const q = (params.q ?? '').toLowerCase().trim();
  const org = params.org ?? '';
  const weight = params.weight ?? '';

  const filtered = fighters.filter((f: any) => {
    if (q) {
      const inName = (f.display_name || '').toLowerCase().includes(q) || ((f.first_name || '') + ' ' + (f.last_name || '')).toLowerCase().includes(q);
      const inOrg = (f.organizations || []).some((o: any) => (o.name || '').toLowerCase().includes(q));
      const inWeight = (f.weight_category?.name || '').toLowerCase().includes(q);
      if (!(inName || inOrg || inWeight)) return false;
    }
    if (org) {
      if (!((f.organizations || []).some((o: any) => o.name === org))) return false;
    }
    if (weight) {
      if ((f.weight_category?.name || '') !== weight) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-lg bg-gradient-to-b from-[#0B0B0B] via-[#0F0F0F] to-[#111111] p-6 shadow-md mb-6">
          <h1 className="text-2xl font-extrabold">Recherche de combattants</h1>
          <p className="mt-1 text-gray-400">Recherchez et filtrez les combattants — utilises les exemples disponibles.</p>

          <div className="mt-4">
            {/* Search form + filters (client) */}
            {/* @ts-ignore Server component importing client */}
            <SearchFilters initialQ={params.q ?? ''} initialOrg={params.org ?? ''} initialWeight={params.weight ?? ''} orgOptions={orgOptions} weightOptions={weightOptions} />
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold mb-4">Résultats ({filtered.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.length > 0 ? (
              filtered.map((f: any) => (
                <FighterCard key={f.slug ?? f.id} fighter={f} />
              ))
            ) : (
              <div className="text-gray-400 bg-[#0F0F0F] p-6 rounded">Aucun combattant ne correspond à votre recherche.</div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1F1F1F] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} MMAvex — Prototype</div>
      </footer>
    </div>
  );
}
