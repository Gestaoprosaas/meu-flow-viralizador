import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#111118]/60 border border-[#1E1E2E] rounded-xl">
      <div className="w-12 h-12 rounded-full bg-[#7C3AED]/10 flex items-center justify-center mb-4 text-[#7C3AED] border border-[#7C3AED]/20">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-[#F0F0FF] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-[#8888AA] max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-medium rounded-lg transition active:scale-95 duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
