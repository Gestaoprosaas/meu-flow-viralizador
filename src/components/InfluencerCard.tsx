import React from 'react';
import { Copy, Check, Sparkles, User, Tag, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { InfluencerTemplate } from '../data/influencerTemplates';

interface InfluencerCardProps {
  template: InfluencerTemplate;
  isCopied: boolean;
  onCopy: () => void;
}

export default function InfluencerCard({ template, isCopied, onCopy }: InfluencerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`relative flex flex-col bg-[#0A0A0F]/80 border ${
        isCopied ? 'border-[#10B981]' : 'border-[#1E1E2E] hover:border-[#FE2C55]/50'
      } rounded-2xl overflow-hidden transition-all duration-300 group shadow-lg`}
      id={`influencer-card-${template.id}`}
    >
      {/* Visual glowing aura on copied state */}
      {isCopied && (
        <div className="absolute inset-0 bg-[#10B981]/5 pointer-events-none rounded-2xl animate-pulse" />
      )}

      {/* Image container with tags on top */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={template.image}
          alt={template.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Subtle dark gradient overlay over image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-black/40 pointer-events-none" />

        {/* Tags absolute badges on top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[90%]">
          {template.tags.map((tag, idx) => (
            <span
              key={`${tag}-${idx}`}
              className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Category absolute badge on bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#FE2C55]/15 border border-[#FE2C55]/35 text-[#FE2C55] uppercase tracking-wider">
            {template.category}
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="text-base font-black text-white group-hover:text-[#FE2C55] transition-colors flex items-center gap-1.5">
            {template.name}
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#FE2C55]" />
          </h3>
          <p className="text-xs text-[#8888AA] line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {template.description}
          </p>
        </div>

        {/* Truncated Prompt Preview block */}
        <div className="bg-[#050508] border border-[#161622] rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#161622]/60 pb-1.5 mb-1.5">
            <span className="text-[9px] font-mono text-[#555577] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#25F4EE]" /> Prompt de Geração
            </span>
            <span className="text-[8px] font-mono text-[#444455]">
              {template.prompt.length} chars
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#8888AA] line-clamp-3 leading-relaxed whitespace-pre-line select-none">
            {template.prompt}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none" />
        </div>

        {/* Copy CTA Action Button */}
        <button
          onClick={onCopy}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 ${
            isCopied
              ? 'bg-[#10B981] text-black shadow-lg shadow-[#10B981]/20'
              : 'bg-white text-black hover:bg-[#FE2C55] hover:text-white shadow-md hover:shadow-[#FE2C55]/20'
          }`}
          id={`btn-copy-prompt-${template.id}`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 stroke-[3px]" />
              Prompt Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar Prompt Premium
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
