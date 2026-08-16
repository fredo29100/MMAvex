'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => {
        if (mounted) setIsAdmin(!!d.admin);
      })
      .catch(() => {
        if (mounted) setIsAdmin(false);
      });
    return () => { mounted = false; };
  }, []);

  async function logout() {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch (e) {
      // ignore
    }
    setIsAdmin(false);
    router.push('/admin/login');
  }

  return (
    <header className="bg-[#0B0B0B] border-b border-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="MMAvex" className="h-10 w-auto" />
              <span className="hidden sm:inline-block text-white font-bold">MMAvex</span>
            </a>

            <nav className="hidden md:flex items-center gap-6 ml-6">
              <a href="/" className="text-sm text-gray-200 hover:text-white">Accueil</a>
              <a href="/search" className="text-sm text-gray-200 hover:text-white">Combattants</a>
              <a href="/orgs" className="text-sm text-gray-200 hover:text-white">Organisations</a>
              <a href="/weights" className="text-sm text-gray-200 hover:text-white">Catégories de poids</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-80">
              <SearchBar />
            </div>

            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <button onClick={logout} className="px-3 py-2 bg-[#1F1F1F] rounded text-gray-200">Déconnexion</button>
              )}
            </div>

            <div className="md:hidden">
              {/* Mobile: lightweight search icon that opens full search page */}
              <a href="/search" className="p-2 bg-[#1F1F1F] rounded-md text-gray-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
