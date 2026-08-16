'use client';
import React, { useEffect, useState } from 'react';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

export default function AdminEditor() {
  const [fighters, setFighters] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchFighters();
  }, []);

  async function fetchFighters() {
    setLoading(true);
    const res = await fetch('/api/admin/fighters');
    const data = await res.json();
    setFighters(data);
    setLoading(false);
  }

  function newEmpty() {
    const empty = {
      id: Date.now().toString(),
      slug: 'nouveau-combattant',
      display_name: '',
      first_name: '',
      last_name: '',
      nickname: '',
      nationality: '',
      birth_date: '',
      height_cm: null,
      reach_cm: null,
      stance: '',
      photo_url: '/images/placeholder-fighter.svg',
      weight_category: { id: '', name: '', slug: '' },
      organizations: [],
      record_wins: 0,
      record_losses: 0,
      record_draws: 0,
      record_nc: 0,
      rank: null,
      bio: '',
      fights: []
    };
    setSelected('new');
    setFighters((prev) => ({ ...prev, ['new']: empty }));
  }

  function editExisting(slug: string) {
    setSelected(slug);
  }

  function updateField(keyPath: string, value: any) {
    if (!selected) return;
    setFighters((prev) => {
      const copy = { ...prev };
      const obj = { ...(copy[selected] || {}) };
      // support nested keys like weight_category.name
      if (keyPath.includes('.')) {
        const [k, sub] = keyPath.split('.');
        obj[k] = { ...(obj[k] || {}) };
        obj[k][sub] = value;
      } else {
        obj[keyPath] = value;
      }
      copy[selected] = obj;
      return copy;
    });
  }

  function updateFight(index: number, field: string, value: any) {
    if (!selected) return;
    setFighters((prev) => {
      const copy = { ...prev };
      const obj = { ...(copy[selected] || {}) };
      obj.fights = Array.isArray(obj.fights) ? [...obj.fights] : [];
      obj.fights[index] = { ...(obj.fights[index] || {}) , [field]: value };
      copy[selected] = obj;
      return copy;
    });
  }

  function addFight() {
    if (!selected) return;
    setFighters((prev) => {
      const copy = { ...prev };
      const obj = { ...(copy[selected] || {}) };
      obj.fights = Array.isArray(obj.fights) ? [...obj.fights] : [];
      obj.fights.push({ id: Date.now().toString(), date: '', event_name: '', opponent_name: '', method: '', round: '', time: '', result: '' });
      copy[selected] = obj;
      return copy;
    });
  }

  function removeFight(index: number) {
    if (!selected) return;
    setFighters((prev) => {
      const copy = { ...prev };
      const obj = { ...(copy[selected] || {}) };
      obj.fights = obj.fights.filter((_: any, i: number) => i !== index);
      copy[selected] = obj;
      return copy;
    });
  }

  async function save() {
    if (!selected) return;
    const fighter = fighters[selected];
    const slug = fighter.slug || slugify(fighter.display_name || `${fighter.first_name} ${fighter.last_name}`);
    fighter.slug = slug;

    try {
      let res;
      if (selected === 'new' || !Object.keys(fighters).includes(slug)) {
        res = await fetch('/api/admin/fighters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fighter) });
      } else {
        res = await fetch(`/api/admin/fighters/${encodeURIComponent(selected)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fighter) });
      }
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Erreur');
      } else {
        setMessage('Enregistré');
        // refresh list
        await fetchFighters();
        setSelected(null);
      }
    } catch (e) {
      setMessage('Erreur réseau');
    }
  }

  async function remove() {
    if (!selected || selected === 'new') return;
    if (!confirm('Supprimer ce combattant ?')) return;
    const res = await fetch(`/api/admin/fighters/${encodeURIComponent(selected)}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Erreur suppression');
    } else {
      setMessage('Supprimé');
      await fetchFighters();
      setSelected(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin — Gestion des combattants</h1>
          <div className="flex gap-2">
            <button onClick={newEmpty} className="px-3 py-2 bg-[#E10600] text-black rounded font-semibold">Nouveau</button>
            <a href="/" className="px-3 py-2 bg-[#1F1F1F] rounded">Retour site</a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-[#0F0F0F] p-4 rounded">
            <div className="text-sm text-gray-400 mb-2">Combattants</div>
            {loading ? <div>Chargement...</div> : (
              <ul className="space-y-2 max-h-[60vh] overflow-auto">
                {Object.keys(fighters).length === 0 && <li className="text-gray-400">Aucun</li>}
                {Object.entries(fighters).map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between">
                    <button onClick={() => editExisting(k)} className="text-left w-full py-2 text-sm hover:underline">{v.display_name || k}</button>
                    <button onClick={async () => { if (confirm('Supprimer ?')) { await fetch(`/api/admin/fighters/${encodeURIComponent(k)}`, { method: 'DELETE' }); await fetchFighters(); } }} className="ml-2 text-xs px-2 py-1 bg-[#1F1F1F] rounded">X</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="md:col-span-2 bg-[#0F0F0F] p-4 rounded">
            {selected ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Prénom</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.first_name || ''} onChange={(e) => updateField('first_name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Nom</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.last_name || ''} onChange={(e) => updateField('last_name', e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Nom affiché</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.display_name || ''} onChange={(e) => updateField('display_name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Surnom</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.nickname || ''} onChange={(e) => updateField('nickname', e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Nationalité (ISO)</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.nationality || ''} onChange={(e) => updateField('nationality', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Date de naissance</label>
                    <input type="date" className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.birth_date || ''} onChange={(e) => updateField('birth_date', e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Taille (cm)</label>
                    <input type="number" className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.height_cm || ''} onChange={(e) => updateField('height_cm', e.target.value ? Number(e.target.value) : null)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Allonge (cm)</label>
                    <input type="number" className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.reach_cm || ''} onChange={(e) => updateField('reach_cm', e.target.value ? Number(e.target.value) : null)} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Catégorie (nom)</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.weight_category?.name || ''} onChange={(e) => updateField('weight_category.name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Organisation (nom)</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={(fighters[selected]?.organizations && fighters[selected].organizations[0]?.name) || ''} onChange={(e) => updateField('organizations', [{ id: '', name: e.target.value, slug: '' }])} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400">Photo URL</label>
                    <input className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.photo_url || ''} onChange={(e) => updateField('photo_url', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Rank</label>
                    <input type="number" className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.rank || ''} onChange={(e) => updateField('rank', e.target.value ? Number(e.target.value) : null)} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400">Bio</label>
                    <textarea className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" value={fighters[selected]?.bio || ''} onChange={(e) => updateField('bio', e.target.value)} rows={3}></textarea>
                  </div>

                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Combats</h3>
                  <div className="space-y-3">
                    {(fighters[selected]?.fights || []).map((f: any, idx: number) => (
                      <div key={f.id || idx} className="bg-[#0B0B0B] p-3 rounded border border-[#1F1F1F]">
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                          <input placeholder="Date" value={f.date || ''} onChange={(e) => updateFight(idx, 'date', e.target.value)} className="p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" />
                          <input placeholder="Événement" value={f.event_name || ''} onChange={(e) => updateFight(idx, 'event_name', e.target.value)} className="p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" />
                          <input placeholder="Adversaire" value={f.opponent_name || ''} onChange={(e) => updateFight(idx, 'opponent_name', e.target.value)} className="p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" />
                          <input placeholder="Méthode" value={f.method || ''} onChange={(e) => updateFight(idx, 'method', e.target.value)} className="p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" />
                          <input placeholder="Round" value={f.round || ''} onChange={(e) => updateFight(idx, 'round', e.target.value)} className="p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" />
                          <div className="flex items-center gap-2">
                            <select value={f.result || ''} onChange={(e) => updateFight(idx, 'result', e.target.value)} className="p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]">
                              <option value="">Résultat</option>
                              <option value="win">Win</option>
                              <option value="loss">Loss</option>
                              <option value="draw">Draw</option>
                            </select>
                            <button type="button" onClick={() => removeFight(idx)} className="px-2 py-1 bg-[#1F1F1F] rounded">Suppr</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <button type="button" onClick={addFight} className="px-3 py-2 bg-[#E10600] text-black rounded">Ajouter combat</button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button onClick={save} className="px-4 py-2 bg-[#E10600] text-black rounded font-semibold">Enregistrer</button>
                  <button onClick={() => setSelected(null)} className="px-3 py-2 bg-[#1F1F1F] rounded">Annuler</button>
                  {selected !== 'new' && <button onClick={remove} className="px-3 py-2 bg-[#2B0000] text-[#FF9B9B] rounded">Supprimer</button>}
                </div>

                {message && <div className="mt-3 text-sm text-gray-300">{message}</div>}

              </div>
            ) : (
              <div className="text-gray-400">Sélectionnez un combattant à modifier ou créez-en un nouveau.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
