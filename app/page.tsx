import React from 'react';
import Header from '../components/Header';
import FighterCard from '../components/FighterCard';

type Fighter = any;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function HomePage() {
  const slugs = ['jean-duc', 'maria-rosa'];

  // Fetch sample fighters from the stub API
  const fighters: Fighter[] = await Promise.all(
    slugs.map(async (s) => {
      try {
        const res = await fetch(`${SITE_URL}/api/fighters/${s}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    })
  ).then(arr => arr.filter(Boolean));

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="pb-10">
          <div className="rounded-lg bg-gradient-to-b from-[#0B0B0B] via-[#0F0F0F] to-[#111111] p-8 shadow-md">
            <div className="md:flex md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">MMAvex — Encyclopédie MMA</h1>
                <p className="mt-2 text-gray-400 max-w-2xl">
                  Fiches de combattants, résultats, organisations et catégories de poids — design moderne noir/rouge.
                </p>
              </div>

              <div className="mt-6 md:mt-0 w-full md:w-1/2">
                {/* SearchBar is a client component; Header already mounts it on desktop */}
                <div className="shadow-sm">
                  {/* empty placeholder for layout symmetry on server render */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Quelques combattants</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fighters.length > 0 ? (
              fighters.map((f: Fighter) => (
                <FighterCard key={f.slug ?? f.id} fighter={f} />
              ))
            ) : (
              <div className="text-gray-400">Aucun combattant d'exemple trouvé. Assurez-vous que l'API stub est en place.</div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1F1F1F] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MMAvex — Prototype
        </div>
      </footer>
    </div>
  );
}
