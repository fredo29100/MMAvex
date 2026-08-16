'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur');
        return;
      }
      router.push('/admin');
    } catch (e) {
      setError('Erreur réseau');
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-[#0F0F0F] rounded">
        <h1 className="text-2xl font-bold mb-4">Connexion admin</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 p-2 bg-[#0B0B0B] rounded border border-[#1F1F1F]" />
          </div>
          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#E10600] text-black rounded">Se connecter</button>
            <a href="/" className="px-3 py-2 bg-[#1F1F1F] rounded">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  );
}
