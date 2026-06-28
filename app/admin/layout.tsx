"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  BookOpen,
  DollarSign,
  Settings,
  ShieldAlert,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const adminMenu = [
    { name: 'Usuários', icon: Users, path: '/admin/usuarios' },
    { name: 'Assinaturas', icon: CreditCard, path: '/admin/assinaturas' },
    { name: 'Estatísticas', icon: BarChart3, path: '/admin/geracoes' },
    { name: 'Produtos (CRUD)', icon: TrendingUp, path: '/admin/produtos' },
    { name: 'Biblioteca (CRUD)', icon: BookOpen, path: '/admin/biblioteca' },
    { name: 'Aprovar Saques', icon: DollarSign, path: '/admin/afiliados' },
    { name: 'Chaves de API', icon: Settings, path: '/admin/configuracoes' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F0F0FF] font-sans flex overflow-hidden">
      
      {/* Sidebar for Admin */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111118] border-r border-[#1E1E2E] flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Brand */}
          <div className="h-16 px-6 border-b border-[#1E1E2E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-extrabold text-white">
                A
              </div>
              <span className="font-extrabold text-sm tracking-wide text-white">
                ViralForge <span className="text-red-500">Admin</span>
              </span>
            </div>
            
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#8888AA] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menus List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase text-[#555577] tracking-wider mb-2">
              SaaS Control Panel
            </div>
            {adminMenu.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-red-500/10 text-white border-l-2 border-red-500'
                      : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2E]/60'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-red-500' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Exit back to Dashboard */}
        <div className="p-4 border-t border-[#1E1E2E] bg-[#0E0E15]/50 space-y-2">
          <div className="flex items-center gap-1 text-[10px] text-[#8888AA] font-extrabold uppercase">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>Acesso Restrito</span>
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#12121A] hover:bg-[#1E1E30] text-xs font-bold rounded-lg transition border border-[#1E1E2E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao App
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header bar */}
        <header className="h-16 border-b border-[#1E1E2E] bg-[#111118]/80 backdrop-blur-md px-6 flex items-center justify-between lg:hidden relative z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-extrabold text-white text-sm">
              A
            </div>
            <span className="font-extrabold text-xs text-white">ViralForge Admin</span>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[#8888AA] hover:text-white focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Main nested route element viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-20">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}
