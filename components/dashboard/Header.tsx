"use client";

import React, { useEffect, useState } from 'react';
import { Menu, LogOut, Clock, User, LogIn } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { useCredits } from '../../hooks/useCredits';
import { createClient } from '../../lib/supabase/client';
import CreditsBadge from './CreditsBadge';

interface HeaderProps {
  onMenuToggle: () => void;
  onUpgradeClick?: () => void;
}

export default function Header({ onMenuToggle, onUpgradeClick }: HeaderProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { credits, loading: creditsLoading } = useCredits();
  const [timeStr, setTimeStr] = useState<string>('');

  const supabase = createClient();

  // Setup ticking clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Redirect user to signin screen
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Derive credit quantities safely
  const textLeft = credits ? credits.textLimit - credits.textUsed : 0;
  const textLimit = credits ? credits.textLimit : 10;
  const imageLeft = credits ? credits.imageLimit - credits.imageUsed : 0;
  const imageLimit = credits ? credits.imageLimit : 5;
  const videoLeft = credits ? credits.videoLimit - credits.videoUsed : 0;
  const videoLimit = credits ? credits.videoLimit : 0;
  const activePlan = credits ? credits.plan : 'free';

  return (
    <header className="h-16 border-b border-[#1E1E2E] bg-[#111118]/80 backdrop-blur-md px-6 flex items-center justify-between relative z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 bg-[#1E1E2E] text-white rounded-lg hover:bg-[#2A2A3E] transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Real-time Clock indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#8888AA] bg-[#111118] border border-[#1E1E2E] rounded-full px-3 py-1">
          <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Brasília: <strong>{timeStr}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Credit Limits Dashboard display badge */}
        {!creditsLoading && (
          <CreditsBadge
            textCredits={textLeft}
            textLimit={textLimit}
            imageCredits={imageLeft}
            imageLimit={imageLimit}
            videoCredits={videoLeft}
            videoLimit={videoLimit}
            plan={activePlan}
            onUpgradeClick={onUpgradeClick}
          />
        )}

        {/* User Info / Profile Preview */}
        <div className="hidden md:flex items-center gap-2 border-l border-[#1E1E2E] pl-4">
          <div className="w-8 h-8 rounded-full bg-[#1E1E2E] flex items-center justify-center border border-[#7C3AED]/30 text-[#7C3AED]">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white leading-none">
              {profileLoading ? 'Carregando...' : profile?.name || 'Vendedor Viral'}
            </p>
            <p className="text-[10px] text-[#8888AA] leading-none mt-1">
              {profileLoading ? '...' : profile?.email || 'creator@viralforge.ai'}
            </p>
          </div>
        </div>

        {/* Action button to sign out */}
        <button
          onClick={handleLogout}
          className="p-1.5 bg-[#111118] border border-[#1E1E2E] text-[#8888AA] hover:text-[#FF4D4D] rounded-lg transition"
          title="Sair da Conta"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
