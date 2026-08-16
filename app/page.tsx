import React from 'react';
import Header from '../components/Header';
import FighterCard from '../components/FighterCard';
import { readFile } from 'fs/promises';

const DATA_PATH = new URL('../data/fighters.json', import.meta.url);

type Fighter = any;

function formatNumber(n: number) {
  return n.toLocaleString();
}

export default async function HomePage() {
  // Load data from data/fighters.json
  let data: Record<string, Fighter> = {};
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    data = {};
  }

  const fighters = Object.values(data || {});

  // Stats
  const fightersCount = fighters.length;
  const fightsCount = fighters.reduce((acc, f) => acc + (Array.isArray(f.fights) ? f.fights.length : 0), 0);
  const orgSet = new Set<string>();
  const categorySet = new Set<string>();
  fighters.forEach((f) => {
    (f.organizations || []).forEach((o: any) => orgSet.add(o.name));
    if (f.weight_category && f.weight_category.name) categorySet.add(f.weight_category.name);
  });

  const orgCount = orgSet.size || 0;
  const categoryCount = categorySet.size || 0;

  // Popular fighters: prefer rank, then wins; fallback to all
  const popular = [...fighters]
    .sort((a, b) => {
      const ra = a.rank ?? 9999;
      const rb = b.rank ?? 9999;
      if (ra !== rb) return ra - rb;
      const wa = a.record_wins ?? 0;
      const wb = b.record_wins ?? 0;
      return wb - wa;
    })
    .slice(0, 6);

  // Organizations list (fixed)
  const organizations = [
    { key: 'ufc', name: 'UFC' },
    { key: 'pfl', name: 'PFL' },
    { key: 'one', name: 'ONE Championship' },
    { key: 'bellator', name: 'Bellator' },
    { key: 'rizin', name: 'RIZIN' },
  ];

  // Latest events: aggregate from fights and sort by date desc
  const eventsMap = new Map<string, { date?: string; name: string; count: number }>();
  fighters.forEach((f) => {
    (f.fights || []).forEach((ft: any) => {
      const key = ft.event_name || ft.id || 'Unknown';
      const existing = eventsMap.get(key) || { name: key, date: ft.date, count: 0 };
      if (!existing.date && ft.date) existing.date = ft.date;
      existing.count = (existing.count || 0) + 1;
      eventsMap.set(key, existing);
    });
  });

  const latestEvents = Array.from(eventsMap.values())
    .sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <section className="relative rounded-lg overflow-hidden bg-gradient-to-b from-[#070707] via-[#0b0b0b] to-[#111111] p-8 shadow-xl border border-[#1a1a1a]">
          <div className="md:flex md:items-center md:justify-between gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                L'encyclopédie mondiale du MMA
              </h1>
              <p className="mt-3 text-gray-400 max-w-2xl text-lg">
                Tout ce qu'il faut savoir sur les combattants, les organisations, les catégories et les événements — fiches complètes, résultats et statistiques.
              </p>

              <form
                action="/search"
                method="get"
                className="mt-6 flex w-full max-w-xl"
                onSubmit={(e) => {
                  // server component cannot access browser router; keep native submit
                }}
              >
                <label htmlFor="q" className="sr-only">Rechercher</label>
                <input
                  id="q"
                  name="q"
                  type="search"
                  placeholder="Rechercher un combattant, une organisation ou un événement..."
                  className="w-full px-4 py-3 rounded-l-md bg-[#0b0b0b] text-[#F5F5F5] placeholder-gray-400 border border-[#262626] focus:outline-none focus:ring-2 focus:ring-[#E10600]"
                />
                <button type="submit" className="px-5 py-3 bg-[#E10600] text-black font-semibold rounded-r-md hover:bg-[#ff4d4d]">
                  Rechercher
                </button>
              </form>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="inline-flex items-center gap-2">Nouveau : <span className="text-[#E10600] font-semibold">Exploration des combattants</span></span>
                <span className="mx-2">•</span>
                <a href="/search" className="text-gray-300 underline">Parcourir tous les combattants</a>
              </div>
            </div>

            <div className="hidden md:block md:w-1/3">
              <div className="rounded-lg overflow-hidden border border-[#222]">
                <img src="/images/placeholder-fighter.svg" alt="MMAvex hero" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#0b0b0b] rounded-lg border border-[#1f1f1f] shadow-sm">
            <div className="text-xs text-gray-400">Combattants</div>
            <div className="mt-2 text-2xl font-bold text-[#F5F5F5]">{formatNumber(fightersCount)}</div>
          </div>

          <div className="p-6 bg-[#0b0b0b] rounded-lg border border-[#1f1f1f] shadow-sm">
            <div className="text-xs text-gray-400">Combats enregistrés</div>
            <div className="mt-2 text-2xl font-bold text-[#F5F5F5]">{formatNumber(fightsCount)}</div>
          </div>

          <div className="p-6 bg-[#0b0b0b] rounded-lg border border-[#1f1f1f] shadow-sm">
            <div className="text-xs text-gray-400">Organisations</div>
            <div className="mt-2 text-2xl font-bold text-[#F5F5F5]">{formatNumber(orgCount)}</div>
          </div>

          <div className="p-6 bg-[#0b0b0b] rounded-lg border border-[#1f1f1f] shadow-sm">
            <div className="text-xs text-gray-400">Catégories</div>
            <div className="mt-2 text-2xl font-bold text-[#F5F5F5]">{formatNumber(categoryCount)}</div>
          </div>
        </section>

        {/* Popular fighters */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Combattants populaires</h2>
            <a href="/search" className="text-sm text-[#E10600] hover:underline">Voir tout</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.length > 0 ? (
              popular.map((f) => (
                <div key={f.slug ?? f.id} className="transform hover:-translate-y-1 transition-all duration-200">
                  <FighterCard fighter={f} />
                </div>
              ))
            ) : (
              <div className="text-gray-400">Aucun combattant disponible.</div>
            )}
          </div>
        </section>

        {/* Organizations */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Organisations</h2>
            <a href="/orgs" className="text-sm text-[#E10600] hover:underline">Voir toutes</a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {organizations.map((o) => (
              <div key={o.key} className="bg-[#0b0b0b] p-4 rounded-lg border border-[#1f1f1f] text-center hover:shadow-lg transition-shadow">
                <div className="h-12 flex items-center justify-center mb-2">
                  {/* Placeholder circle logo */}
                  <div className="w-12 h-12 rounded-full bg-[#111] border-2 border-[#2a2a2a] flex items-center justify-center text-sm font-bold text-[#E10600]">{o.name[0]}</div>
                </div>
                <div className="text-sm font-semibold">{o.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest events */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Derniers événements</h2>
            <a href="/events" className="text-sm text-[#E10600] hover:underline">Voir le calendrier</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestEvents.length > 0 ? (
              latestEvents.map((ev, i) => (
                <div key={i} className="p-4 bg-[#0b0b0b] rounded-lg border border-[#1f1f1f] hover:translate-y-0.5 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">{ev.date ? new Date(ev.date).toLocaleDateString() : 'Date inconnue'}</div>
                      <div className="mt-1 font-semibold text-lg">{ev.name}</div>
                    </div>
                    <div className="text-right text-sm text-gray-400">{ev.count} combat(s)</div>
                  </div>
                </div>
              ))
            ) : (
              // placeholders
              [1,2,3].map((n) => (
                <div key={n} className="p-4 bg-[#0b0b0b] rounded-lg border border-[#1f1f1f]">
                  <div className="text-sm text-gray-400">Date à venir</div>
                  <div className="mt-2 font-semibold text-lg">Événement {n}</div>
                  <div className="text-sm text-gray-400 mt-1">Lieu à confirmer</div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      <footer className="border-t border-[#151515] mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} MMAvex — Encyclopédie MMA</div>
      </footer>
    </div>
  );
}
