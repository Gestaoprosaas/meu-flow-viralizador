import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MarketingFooterProps {
  onStart: () => void;
}

export default function MarketingFooter({ onStart }: MarketingFooterProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="marketing-footer" className="relative w-full bg-[#0A0A0F]/55 backdrop-blur-md border-t border-[#1E1E2E] overflow-hidden font-sans">
      
      {/* Background neon elements */}
      <div className="absolute top-[80%] left-[20%] w-[450px] h-[450px] bg-[#FE2C55]/3 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Upper Segment CTA */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-12 border-b border-white/[0.04] text-center space-y-8 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-full text-[10px] text-[#69C9D0] font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#69C9D0]" />
          <span>Acelere sua tração hoje</span>
        </div>

        <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Pronto para viralizar?
        </h3>

        <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Chega de perder tempo digitando ideias vagas e testando fotos feias. Crie sua conta grátis agora e domine os feeds nacionais de afiliados em minutos.
        </p>

        <div className="pt-4">
          <button
            onClick={onStart}
            className="px-8 py-4 sm:px-10 sm:py-5 bg-[#FE2C55] hover:bg-[#E01E45] text-white text-xs sm:text-sm font-black rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-[#FE2C55]/25 flex items-center gap-3.5 mx-auto uppercase tracking-widest cursor-pointer"
          >
            Começar Agora <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>

      </div>

      {/* Primary Links Segment Grid */}
      <div className="max-w-7xl mx-auto py-16 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 text-left">
        
        {/* Leftmost Column Brand */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FE2C55] to-[#69C9D0] flex items-center justify-center font-black text-white text-sm">
              V
            </div>
            <span className="font-extrabold text-white text-sm tracking-widest uppercase">
              Viral<span className="text-[#69C9D0]">Seller</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
            O primeiro hub de criação de roteiros persuasivos, estúdios ambientados e locuções humanas calibrados para o TikTok Shop e Shopee brasileiros.
          </p>
        </div>

        {/* Links Col 1 */}
        <div className="md:col-span-2.5 space-y-4">
          <h5 className="text-[11px] font-black uppercase text-white tracking-widest">Navegação</h5>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><a href="#problem-section" className="hover:text-white transition">O Problema</a></li>
            <li><a href="#how-it-works-section" className="hover:text-white transition">Como Funciona</a></li>
            <li><a href="#features-section" className="hover:text-white transition">Funcionalidades</a></li>
            <li><a href="#pricing-section" className="hover:text-white transition">Tabela de Preços</a></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div className="md:col-span-2.5 space-y-4">
          <h5 className="text-[11px] font-black uppercase text-white tracking-widest">Social & Contatos</h5>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><span className="cursor-not-allowed">TikTok Oficial</span></li>
            <li><span className="cursor-not-allowed">Instagram Premium</span></li>
            <li><span className="cursor-not-allowed">Comunidade Telegram</span></li>
            <li><span className="cursor-not-allowed">Suporte WhatsApp</span></li>
          </ul>
        </div>

        {/* Links Col 3 */}
        <div className="md:col-span-2 space-y-4">
          <h5 className="text-[11px] font-black uppercase text-white tracking-widest">Legal</h5>
          <ul className="space-y-2.5 text-xs text-gray-500 font-medium">
            <li><span className="cursor-not-allowed">Termos de Uso</span></li>
            <li><span className="cursor-not-allowed">Privacidade Segura</span></li>
            <li><span className="cursor-not-allowed">Rastreamento Cookies</span></li>
            <li><span className="cursor-not-allowed">Direitos de Autor</span></li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer Credits */}
      <div className="max-w-7xl mx-auto py-8 px-6 md:px-12 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 relative z-10 font-mono">
        <div>
          &copy; {currentYear} ViralSeller. Todos os direitos reservados.
        </div>
        <div className="flex gap-4">
          <span>Brasília, DF, Brasil</span>
          <span>&middot;</span>
          <button onClick={handleScrollToTop} className="hover:text-white transition cursor-pointer">Voltar ao Topo &uarr;</button>
        </div>
      </div>

    </footer>
  );
}
