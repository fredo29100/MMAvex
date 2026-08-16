import React from 'react';
import Header from '../../../components/Header';
import { readFile } from 'fs/promises';

const DATA_PATH = new URL('../../../../data/fighters.json', import.meta.url);

function countryCodeToEmoji(code?: string) {
  if (!code) return '';
  try {
    // Convert ISO country code (e.g. FR) to regional indicator symbols
    return code
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(0x1f1e6 - 65 + char.charCodeAt(0)));
  } catch {
    return '';
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export default async function FighterPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  let data: Record<string, any> = {};
  try {
    const raw = await readFile(DATA_PATH, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-[#0F0F0F] p-6 rounded">Erreur: données indisponibles.</div>
        </main>
      </div>
    );
  }

  const fighter = data[slug];
  if (!fighter) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-[#0F0F0F] p-6 rounded">Combattant introuvable: {slug}</div>
        </main>
      </div>
    );
  }

  const fullName = `${fighter.first_name ?? ''} ${fighter.last_name ?? ''}`.trim() || fighter.display_name;
  const nickname = fighter.nickname ?? null; // optional field
  const flag = countryCodeToEmoji(fighter.nationality);
  const wins = fighter.record_wins ?? 0;
  const losses = fighter.record_losses ?? 0;
  const draws = fighter.record_draws ?? 0;
  const nc = fighter.record_nc ?? 0;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-b from-[#0B0B0B] via-[#0F0F0F] to-[#111111] rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Left: photo */}
            <div className="md:w-1/3 bg-[#0E0E0E] p-6 flex items-center justify-center">
              <div className="w-full">
                <div className="w-full h-80 md:h-96 rounded-lg overflow-hidden border-2 border-[#1F1F1F] bg-[#0B0B0B]">
                  <img
                    src={fighter.photo_url ?? '/images/placeholder-fighter.svg'}
                    alt={fighter.display_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#0F0F0F] p-3 rounded">
                    <div className="text-xs text-gray-400">Taille</div>
                    <div className="font-medium">{fighter.height_cm ? `${fighter.height_cm} cm` : '—'}</div>
                  </div>
                  <div className="bg-[#0F0F0F] p-3 rounded">
                    <div className="text-xs text-gray-400">Allonge</div>
                    <div className="font-medium">{fighter.reach_cm ? `${fighter.reach_cm} cm` : '—'}</div>
                  </div>
                  <div className="bg-[#0F0F0F] p-3 rounded">
                    <div className="text-xs text-gray-400">Catégorie</div>
                    <div className="font-medium">{fighter.weight_category?.name ?? '—'}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right: info */}
            <div className="md:w-2/3 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F5F5]">{fighter.display_name}</h1>
                  <div className="mt-1 text-gray-400">
                    <span className="mr-3">{fullName}</span>
                    {nickname ? <span className="text-sm text-gray-300">"{nickname}"</span> : null}
                    {fighter.nationality ? (
                      <span className="ml-3 inline-flex items-center gap-2">
                        <span className="text-sm">{flag}</span>
                        <span className="text-xs text-gray-400">{fighter.nationality}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">Bilan</div>
                  <div className="text-2xl font-bold text-[#E10600]">{`${wins}-${losses}${draws ? `-${draws}` : ''}`}{nc ? ` (NC:${nc})` : ''}</div>
                  <div className="text-sm text-gray-400 mt-1">Rank: {fighter.rank ?? '—'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0F0F0F] p-4 rounded">
                  <div className="text-xs text-gray-400">Date de naissance</div>
                  <div className="font-medium">{formatDate(fighter.birth_date)}</div>

                  <div className="mt-3 text-xs text-gray-400">Organisation</div>
                  <div className="font-medium">{(fighter.organizations && fighter.organizations.length > 0) ? fighter.organizations.map((o:any)=>o.name).join(', ') : '—'}</div>

                  <div className="mt-3 text-xs text-gray-400">Stance</div>
                  <div className="font-medium">{fighter.stance ?? '—'}</div>
                </div>

                <div className="bg-[#0F0F0F] p-4 rounded">
                  <div className="text-xs text-gray-400">Palmarès détaillé</div>
                  <div className="mt-2 grid grid-cols-3 text-center">
                    <div>
                      <div className="text-sm text-gray-400">Victoires</div>
                      <div className="text-lg font-semibold">{wins}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Défaites</div>
                      <div className="text-lg font-semibold">{losses}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Nuls</div>
                      <div className="text-lg font-semibold">{draws}</div>
                    </div>
                  </div>
                  {nc ? (
                    <div className="mt-3 text-sm text-gray-400">No contests: {nc}</div>
                  ) : null}
                </div>
              </div>

              {fighter.bio ? (
                <div className="bg-[#0F0F0F] p-4 rounded text-sm text-gray-300">{fighter.bio}</div>
              ) : null}

              <div>
                <h2 className="text-xl font-bold mb-3">Historique des combats</h2>
                {fighter.fights && fighter.fights.length > 0 ? (
                  <div className="overflow-x-auto bg-[#0F0F0F] rounded">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-[#1F1F1F]">
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Événement</th>
                          <th className="px-4 py-2">Adversaire</th>
                          <th className="px-4 py-2">Méthode</th>
                          <th className="px-4 py-2">Round</th>
                          <th className="px-4 py-2">Résultat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fighter.fights.map((f: any) => (
                          <tr key={f.id} className="border-b border-[#151515] hover:bg-[#0E0E0E]">
                            <td className="px-4 py-3 align-top">{formatDate(f.date)}</td>
                            <td className="px-4 py-3 align-top">{f.event_name}</td>
                            <td className="px-4 py-3 align-top">{f.opponent_name}</td>
                            <td className="px-4 py-3 align-top">{f.method}</td>
                            <td className="px-4 py-3 align-top">{f.round}</td>
                            <td className="px-4 py-3 align-top">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${f.result === 'win' ? 'bg-[#002B18] text-[#00C48C]' : f.result === 'loss' ? 'bg-[#2B0000] text-[#FF9B9B]' : 'bg-[#222] text-gray-300'}`}>
                                {String(f.result).toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-400">Aucun combat enregistré.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
