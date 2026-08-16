import React from 'react';
import Header from '../../components/Header';
import dynamic from 'next/dynamic';
const AdminEditor = dynamic(() => import('../../components/AdminEditor'), { ssr: false });
import { cookies } from 'next/headers';

export default function AdminPage() {
  const cookie = cookies().get('mmavex_admin')?.value;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (!cookie || cookie !== ADMIN_PASSWORD) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
        <Header />
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-[#0F0F0F] p-6 rounded">
            <h1 className="text-xl font-bold">Espace administration</h1>
            <p className="mt-2 text-gray-400">Vous n'êtes pas connecté. <a className="text-[#E10600] underline" href="/admin/login">Se connecter</a></p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <AdminEditor />
    </div>
  );
}
