"use client";

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'purple' | 'cyan' | 'emerald' | 'amber';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  subtext,
  trend,
  color = 'purple'
}: StatsCardProps) {
  // Styles depending on selected color theme
  const colorSchemes = {
    purple: {
      border: 'border-[#7C3AED]/20 hover:border-[#7C3AED]/50',
      bg: 'bg-[#7C3AED]/5',
      iconColor: 'text-[#7C3AED]'
    },
    cyan: {
      border: 'border-[#06B6D4]/20 hover:border-[#06B6D4]/50',
      bg: 'bg-[#06B6D4]/5',
      iconColor: 'text-[#06B6D4]'
    },
    emerald: {
      border: 'border-[#10B981]/20 hover:border-[#10B981]/50',
      bg: 'bg-[#10B981]/5',
      iconColor: 'text-[#10B981]'
    },
    amber: {
      border: 'border-[#F59E0B]/20 hover:border-[#F59E0B]/50',
      bg: 'bg-[#F59E0B]/5',
      iconColor: 'text-[#F59E0B]'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.purple;

  return (
    <div className={`bg-[#111118] border ${scheme.border} p-5 rounded-2xl transition duration-300 relative overflow-hidden group`}>
      {/* Background glow shadow */}
      <div className={`absolute -right-12 -top-12 w-24 h-24 rounded-full ${scheme.bg} blur-xl opacity-50 group-hover:scale-150 transition-transform duration-500`} />

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-[12px] font-semibold text-[#8888AA] tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
            {value}
          </h3>
        </div>

        {/* Floating icon */}
        <div className={`p-3 rounded-xl ${scheme.bg} border border-[#1E1E2E] ${scheme.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Footer trends/subtext */}
      {(subtext || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-[#1E1E2E]/60">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span className={`flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded ${
                trend.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}
              </span>
              <span className="text-[#8888AA]">{subtext}</span>
            </div>
          ) : (
            <span className="text-[#8888AA]">{subtext}</span>
          )}
        </div>
      )}
    </div>
  );
}
