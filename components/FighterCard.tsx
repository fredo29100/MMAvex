import React from 'react';

type FightSummary = {
  id: string;
  date: string;
  event_name: string;
  opponent_name: string;
  method: string;
  round: number;
  time: string;
  result: 'win' | 'loss' | 'draw' | 'nc' | string;
};

type Fighter = {
  id: string;
  slug?: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  nationality?: string; // ISO code, e.g. "FR"
  birth_date?: string;
  height_cm?: number;
  reach_cm?: number;
  stance?: string;
  photo_url?: string;
  weight_category?: { id: string; name: string; slug?: string };
  organizations?: { id: string; name: string; slug?: string }[];
  record_wins?: number;
  record_losses?: number;
  record_draws?: number;
  record_nc?: number;
  rank?: number | null;
  fights?: FightSummary[];
  bio?: string;
};

export default function FighterCard({ fighter }: { fighter: Fighter }) {
  const wins = fighter.record_wins ?? 0;
  const losses = fighter.record_losses ?? 0;
  const draws = fighter.record_draws ?? 0;
  const nc = fighter.record_nc ?? 0;
  const kda = `${wins}-${losses}${draws ? `-${draws}` : ''}${nc ? ` (NC:${nc})` : ''}`;

  return (
    <article className="bg-[#111111] rounded-lg overflow-hidden shadow-sm">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gradient-to-b from-[#0B0B0B] to-[#111111] p-6 flex items-center justify-center">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden border-2 border-[#1F1F1F]">
            <img
              src={fighter.photo_url ?? '/images/placeholder-fighter.png'}
              alt={fighter.display_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="md:w-2/3 p-6 space-y-4">
          <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#F5F5F5]">
                {fighter.display_name}
              </h1>
              <div className="mt-1 text-sm text-gray-400">
                {fighter.first_name || fighter.last_name ? `${fighter.first_name ?? ''} ${fighter.last_name ?? ''}`.trim() : null}
                {fighter.nationality ? (
                  <span className="ml-3 inline-flex items-center gap-2">
                    <span className={`flag-icon flag-${(fighter.nationality || '').toLowerCase()}`} />
                    <span className="text-xs">{fighter.nationality}</span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {fighter.rank ? (
                <div className="text-center">
                  <div className="text-sm text-gray-400">Rank</div>
                  <div className="text-xl font-bold text-[#E10600]">#{fighter.rank}</div>
                </div>
              ) : null}

              <div className="text-right">
                <div className="text-sm text-gray-400">Palmarès</div>
                <div className="text-lg font-semibold text-[#F5F5F5]">{kda}</div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#0F0F0F] rounded">
              <div className="text-xs text-gray-400">Catégorie</div>
              <div className="font-medium">{fighter.weight_category?.name ?? '—'}</div>
            </div>
            <div className="p-3 bg-[#0F0F0F] rounded">
              <div className="text-xs text-gray-400">Stance</div>
              <div className="font-medium">{fighter.stance ?? '—'}</div>
            </div>
            <div className="p-3 bg-[#0F0F0F] rounded">
              <div className="text-xs text-gray-400">Reach / Taille</div>
              <div className="font-medium">{fighter.reach_cm ?? '—'} cm / {fighter.height_cm ?? '—'} cm</div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-sm text-gray-300 font-semibold mb-1">Organisations</h3>
            <div className="flex flex-wrap gap-2">
              {(fighter.organizations ?? []).length > 0 ? (
                fighter.organizations!.map(org => (
                  <span key={org.id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F1F] text-sm text-gray-200 border border-[#222]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#E10600" className="inline-block">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    {org.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Aucune organisation</span>
              )}
            </div>
          </div>

          {fighter.bio ? (
            <div className="pt-3 text-sm text-gray-300 leading-relaxed">
              {fighter.bio}
            </div>
          ) : null}

          <footer className="pt-4">
            <div className="text-sm text-gray-400 mb-2">Statistiques récentes</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 p-3 bg-[#0F0F0F] rounded">
                <div className="text-xs text-gray-400">Derniers combats</div>
                <div className="mt-2 space-y-2">
                  {fighter.fights && fighter.fights.length > 0 ? (
                    fighter.fights.slice(0, 3).map(f => (
                      <div key={f.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium">{f.opponent_name}</div>
                          <div className="text-xs text-gray-500">{f.event_name} • {new Date(f.date).toLocaleDateString()}</div>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs font-semibold ${f.result === 'win' ? 'bg-[#002B18] text-[#00C48C]' : f.result === 'loss' ? 'bg-[#2B0000] text-[#FF9B9B]' : 'bg-[#222] text-gray-300'}`}>
                          {String(f.result).toUpperCase()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Aucun combat récent</div>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-48 p-3 bg-[#0F0F0F] rounded">
                <div className="text-xs text-gray-400">Age</div>
                <div className="text-lg font-medium">{fighter.birth_date ? Math.max(0, new Date().getFullYear() - new Date(fighter.birth_date).getFullYear()) + ' ans' : '—'}</div>
                <div className="mt-3 text-xs text-gray-400">ID</div>
                <div className="text-sm text-gray-300">{fighter.slug ?? fighter.id}</div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
