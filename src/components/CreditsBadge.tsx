import React from 'react';
import { Sparkles, FileText, ImageIcon, Video, Zap } from 'lucide-react';

interface CreditsBadgeProps {
  textCredits: number;
  imageCredits: number;
  videoCredits: number;
  onUpgradeClick?: () => void;
}

export default function CreditsBadge({
  textCredits,
  imageCredits,
  videoCredits,
  onUpgradeClick
}: CreditsBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-[#111118] border border-[#1E1E2E] rounded-full p-1.5 pl-3 pr-3 max-sm:gap-1 max-sm:px-2">
      <div className="flex items-center gap-3 text-xs font-semibold">
        {/* Text Credits */}
        <div className="flex items-center gap-1.5 text-[#F0F0FF]/90" title="Créditos de Roteiro (Texto)">
          <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>{textCredits}</span>
        </div>

        {/* Separator */}
        <div className="w-px h-3 bg-[#1E1E2E]" />

        {/* Video Credits */}
        <div className="flex items-center gap-1.5 text-[#F0F0FF]/90" title="Créditos de Vídeo">
          <Video className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{videoCredits}</span>
        </div>
      </div>
    </div>
  );
}
