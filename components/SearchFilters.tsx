'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchFilters({ initialQ = '', initialOrg = '', initialWeight = '', orgOptions = [], weightOptions = [] }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(initialQ ?? (searchParams?.get('q') ?? ''));
  const [org, setOrg] = useState(initialOrg ?? (searchParams?.get('org') ?? ''));
  const [weight, setWeight] = useState(initialWeight ?? (searchParams?.get('weight') ?? ''));

  function applyFilters(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (org) params.set('org', org);
    if (weight) params.set('weight', weight);
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ''}`);
  }

  function resetFilters() {
    setQ('');
    setOrg('');
    setWeight('');
    router.push('/search');
  }

  return (
    <form onSubmit={applyFilters} className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex-1">
        <label htmlFor="q" className="sr-only">Rechercher</label>
        <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par nom, organisation, catégorie..." className="w-full bg-[#0F0F0F] text-[#F5F5F5] placeholder-gray-400 rounded-md py-2 px-3 border border-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#E10600]" />
      </div>

      <div className="w-full md:w-48">
        <label htmlFor="org" className="sr-only">Organisation</label>
        <select id="org" value={org} onChange={(e) => setOrg(e.target.value)} className="w-full bg-[#0F0F0F] text-[#F5F5F5] rounded-md py-2 px-3 border border-[#1F1F1F]">
          <option value="">Toutes les organisations</option>
          {orgOptions.map((o: string) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-48">
        <label htmlFor="weight" className="sr-only">Catégorie</label>
        <select id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-[#0F0F0F] text-[#F5F5F5] rounded-md py-2 px-3 border border-[#1F1F1F]">
          <option value="">Toutes les catégories</option>
          {weightOptions.map((w: string) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" className="px-4 py-2 bg-[#E10600] text-black font-semibold rounded hover:bg-[#FF4D4D]">Appliquer</button>
        <button type="button" onClick={resetFilters} className="px-3 py-2 bg-[#1F1F1F] text-gray-200 rounded border border-[#2A2A2A]">Réinitialiser</button>
      </div>
    </form>
  );
}
