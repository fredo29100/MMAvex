'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const encoded = encodeURIComponent(q.trim());
    if (!encoded) return;
    router.push(`/search?q=${encoded}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <label htmlFor="search" className="sr-only">Rechercher un combattant</label>
      <div className="relative w-full">
        <input
          id="search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un combattant, une organisation..."
          className="w-full bg-[#0F0F0F] text-[#F5F5F5] placeholder-gray-400 rounded-md py-2 pl-3 pr-10 border border-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#E10600]"
        />
        <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded text-sm bg-[#E10600] text-black font-semibold hover:bg-[#FF4D4D]">
          Rechercher
        </button>
      </div>
    </form>
  );
}
