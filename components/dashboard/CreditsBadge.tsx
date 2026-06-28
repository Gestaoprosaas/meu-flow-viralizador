"use client";

import React from 'react';
import { Sparkles, FileText, ImageIcon, Video, Zap } from 'lucide-react';

interface CreditsBadgeProps {
  textCredits: number;
  textLimit: number;
  imageCredits: number;
  imageLimit: number;
  videoCredits: number;
  videoLimit: number;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  onUpgradeClick?: () => void;
}

export default function CreditsBadge({
  textCredits,
  textLimit,
  imageCredits,
  imageLimit,
  videoCredits,
  videoLimit,
  plan,
  onUpgradeClick
}: CreditsBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2">
      {/* Plan Type Badge */}
      <span className="flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
        <Zap className="w-3 h-3 fill-yellow-400" />
        {plan === 'free' ? 'Grátis' : plan}
      </span>

      {/* Vertical Spacer */}
      <div className="hidden sm:block h-4 w-px bg-[#1E1E2E]" />

      {/* Text Credits Tracker */}
      <div className="flex items-center gap-1.5 text-xs text-[#8888AA]" title="Roteiros IA Restantes">
        <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
        <span className="font-mono text-[#F0F0FF]">
          <strong>{textCredits}</strong>/<span className="text-[#8888AA]/75">{textLimit}</span>
        </span>
      </div>

      {/* Image Credits Tracker */}
      <div className="flex items-center gap-1.5 text-xs text-[#8888AA]" title="Imagens Comerciais Restantes">
        <ImageIcon className="w-3.5 h-3.5 text-[#06B6D4]" />
        <span className="font-mono text-[#F0F0FF]">
          <strong>{imageCredits}</strong>/<span className="text-[#8888AA]/75">{imageLimit}</span>
        </span>
      </div>

      {/* Video Credits Tracker */}
      <div className="flex items-center gap-1.5 text-xs text-[#8888AA]" title="Vídeos IA Restantes">
        <Video className="w-3.5 h-3.5 text-[#10B981]" />
        <span className="font-mono text-[#F0F0FF]">
          <strong>{videoCredits}</strong>/<span className="text-[#8888AA]/75">{videoLimit}</span>
        </span>
      </div>

      {/* Action CTA for Limit Upgrades */}
      {plan === 'free' && onUpgradeClick && (
        <>
          <div className="hidden md:block h-4 w-px bg-[#1E1E2E]" />
          <button
            onClick={onUpgradeClick}
            className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 px-2.5 py-1 rounded-lg transition shadow-md shadow-[#7C3AED]/25"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            Upgrade
          </button>
        </>
      )}
    </div>
  );
}
