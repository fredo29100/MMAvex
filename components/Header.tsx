import React from 'react';
import dynamic from 'next/dynamic';
const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });

export default function Header() {
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
