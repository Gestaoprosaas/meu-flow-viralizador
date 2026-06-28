"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Video,
  FolderLock,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Settings,
  X,
  Zap
} from 'lucide-react';
import { useCredits } from '../../hooks/useCredits';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

export default function Sidebar({ isOpen, onClose, onUpgradeClick }: SidebarProps) {
  const pathname = usePathname();
  const { credits, loading } = useCredits();

  // Defined Navigation items matching requirements
  const navigationItems = [
    { name: 'Painel Geral', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Roteiros IA', icon: FileText, path: '/dashboard/roteiros' },
    { name: 'Fotos Comerciais', icon: ImageIcon, path: '/dashboard/imagens' },
    { name: 'Vídeos IA', icon: Video, path: '/dashboard/videos' },
    { name: 'Campanhas / Pastas', icon: FolderLock, path: '/dashboard/projects' },
    { name: 'Biblioteca de Copias', icon: BookOpen, path: '/dashboard/biblioteca' },
    { name: 'Produtos em Alta', icon: TrendingUp, path: '/dashboard/produtos' },
    { name: 'Treinamentos Shop', icon: Award, path: '/dashboard/treinamentos' },
    { name: 'Painel Afiliados', icon: Users, path: '/dashboard/afiliados' },
    { name: 'Configurações', icon: Settings, path: '/dashboard/configuracoes' }
  ];

  // Safely grab available metrics
  const textLeft = credits ? credits.textLimit - credits.textUsed : 0;
  const imageLeft = credits ? credits.imageLimit - credits.imageUsed : 0;
  const planName = credits ? credits.plan : 'free';

  const textProgress = credits ? (credits.textUsed / credits.textLimit) * 100 : 0;
  const imageProgress = credits ? (credits.imageUsed / credits.imageLimit) * 100 : 0;

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#000]/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111118] border-r border-[#1E1E2E] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Brand */}
          <div className="h-16 px-6 border-b border-[#1E1E2E] flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center font-extrabold shadow-md shadow-[#7C3AED]/20 text-white">
                V
              </div>
              <span className="font-extrabold text-sm tracking-wide text-white">
                ViralForge <span className="text-[#06B6D4]">AI</span>
              </span>
            </Link>

            {/* Mobile close toggle */}
            <button onClick={onClose} className="lg:hidden text-[#8888AA] hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menus List (Scrollable) */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#7C3AED]/15 text-white border-l-2 border-[#7C3AED]'
                      : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2E]/60'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#7C3AED]' : 'text-inherit'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Limit Meters */}
        <div className="p-4 border-t border-[#1E1E2E] bg-[#0E0E15]/50 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#8888AA] font-bold uppercase">Uso de Recursos</span>
              <span className="text-yellow-400 font-extrabold uppercase">
                {loading ? '...' : planName === 'free' ? 'Grátis' : planName}
              </span>
            </div>

            {/* Quota Progress Trackers */}
            <div className="space-y-2 text-[9px] text-[#8888AA]">
              {/* Text generation limit */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Roteiros:</span>
                  <strong className="text-white">
                    {loading ? '...' : `${textLeft} restam`}
                  </strong>
                </div>
                <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7C3AED] transition-all duration-300"
                    style={{ width: `${Math.min(100, textProgress)}%` }}
                  />
                </div>
              </div>

              {/* Image generation limit */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Imagens:</span>
                  <strong className="text-white">
                    {loading ? '...' : `${imageLeft} restam`}
                  </strong>
                </div>
                <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#06B6D4] transition-all duration-300"
                    style={{ width: `${Math.min(100, imageProgress)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade sidebar callout CTA */}
          {planName === 'free' && onUpgradeClick && (
            <div className="bg-gradient-to-r from-[#17152F] to-[#111118] border border-[#7C3AED]/30 rounded-xl p-3 text-center space-y-2">
              <p className="text-[10px] text-[#8888AA] leading-normal">
                Faça upgrade e conquiste relevância ilimitada no TikTok Shop!
              </p>
              <button
                onClick={onUpgradeClick}
                className="w-full py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 transition"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                Subir de Plano
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
