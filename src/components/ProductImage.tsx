import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, ShoppingBag, Heart, Home, Smartphone, HelpCircle } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className = "w-full h-full object-cover" }: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [failedOnce, setFailedOnce] = useState(false);
  const [useUiFallback, setUseUiFallback] = useState(false);

  // Clean stable Unsplash images that are extremely reliable
  const getFallbackImage = (text: string) => {
    const query = (text || '').toLowerCase();
    
    if (query.includes('shampoo') || query.includes('cabelo') || query.includes('beleza') || query.includes('modelador') || query.includes('ondulador') || query.includes('cetim') || query.includes('skin') || query.includes('maquiagem')) {
      return "https://images.unsplash.com/photo-1522337360788-8b13edd793be?auto=format&fit=crop&q=80&w=400";
    }
    if (query.includes('cozinha') || query.includes('alimento') || query.includes('mop') || query.includes('processador') || query.includes('selador') || query.includes('organizador') || query.includes('limpeza') || query.includes('esfregão')) {
      return "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400";
    }
    if (query.includes('fone') || query.includes('earphone') || query.includes('led') || query.includes('lamp') || query.includes('tecnologia') || query.includes('gatinho') || query.includes('rgb') || query.includes('auricular') || query.includes('sunset')) {
      return "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400";
    }
    if (query.includes('garrafa') || query.includes('térmica') || query.includes('esporte') || query.includes('academia') || query.includes('fit') || query.includes('legging') || query.includes('calça')) {
      return "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400";
    }
    if (query.includes('aspirador') || query.includes('carro') || query.includes('suporte')) {
      return "https://images.unsplash.com/photo-1563130103-40555f398ef3?auto=format&fit=crop&q=80&w=400";
    }
    // High quality neutral fallback e-commerce product image
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400";
  };

  useEffect(() => {
    setLoading(true);
    setFailedOnce(false);
    setUseUiFallback(false);
    
    const checkUrl = src || '';
    // Prevent bad hotlinking TikTok Shop CDN URLs
    if (!checkUrl || checkUrl.includes('tiktokcdn') || checkUrl.includes('ibytedtos.com') || checkUrl.trim() === '') {
      setCurrentSrc(getFallbackImage(alt));
    } else {
      setCurrentSrc(checkUrl);
    }
  }, [src, alt]);

  const handleError = () => {
    if (!failedOnce) {
      setFailedOnce(true);
      // Try Unsplash fallback
      const fallback = getFallbackImage(alt);
      if (currentSrc === fallback) {
        // If the fallback itself failed, go straight to CSS fallback
        setUseUiFallback(true);
        setLoading(false);
      } else {
        setCurrentSrc(fallback);
      }
    } else {
      // Failed both primary and Unsplash, use CSS fallback
      setUseUiFallback(true);
      setLoading(false);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  // Curated elegant gradients and icons based on product names/category
  const getUiPlaceholder = () => {
    const query = (alt || '').toLowerCase();
    
    if (query.includes('shampoo') || query.includes('cabelo') || query.includes('beleza') || query.includes('modelador') || query.includes('ondulador') || query.includes('cetim') || query.includes('skin') || query.includes('maquiagem')) {
      return {
        gradient: "from-[#FE2C55]/20 via-[#F43F5E]/15 to-[#0F0F16]",
        border: "border-pink-500/30",
        text: "text-pink-450",
        icon: <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />,
        label: "Beleza & Cosméticos"
      };
    }
    if (query.includes('cozinha') || query.includes('mop') || query.includes('processador') || query.includes('selador') || query.includes('organizador') || query.includes('gaveta') || query.includes('esfregão')) {
      return {
        gradient: "from-blue-600/20 via-indigo-650/15 to-[#0F0F16]",
        border: "border-indigo-500/30",
        text: "text-indigo-400",
        icon: <Home className="w-8 h-8 text-indigo-400" />,
        label: "Casa & Utilidades"
      };
    }
    if (query.includes('fone') || query.includes('earphone') || query.includes('led') || query.includes('tecnologia') || query.includes('gatinho') || query.includes('rgb') || query.includes('auricular')) {
      return {
        gradient: "from-[#25F4EE]/20 via-cyan-900/15 to-[#0F0F16]",
        border: "border-cyan-500/30",
        text: "text-cyan-400",
        icon: <Smartphone className="w-8 h-8 text-[#25F4EE] animate-pulse" />,
        label: "Tecnologia & Games"
      };
    }
    if (query.includes('garrafa') || query.includes('térmica') || query.includes('esporte') || query.includes('academia') || query.includes('fit') || query.includes('legging') || query.includes('calça')) {
      return {
        gradient: "from-emerald-600/20 via-[#06B6D4]/15 to-[#0F0F16]",
        border: "border-emerald-500/30",
        text: "text-emerald-450",
        icon: <Heart className="w-8 h-8 text-emerald-400" />,
        label: "Esportes & Saúde"
      };
    }
    
    return {
      gradient: "from-[#FE2C55]/15 via-purple-950/10 to-[#0F0F16]",
      border: "border-purple-500/20",
      text: "text-purple-400",
      icon: <ShoppingBag className="w-8 h-8 text-[#FE2C55]" />,
      label: "Achados do TikTok"
    };
  };

  const uiTheme = getUiPlaceholder();

  if (useUiFallback) {
    return (
      <div className={`relative w-full h-full min-h-[120px] flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b ${uiTheme.gradient} border ${uiTheme.border} rounded-lg overflow-hidden`}>
        {uiTheme.icon}
        <span className="text-[10px] font-black text-white mt-1.5 uppercase tracking-widest line-clamp-1">{alt}</span>
        <span className="text-[8px] text-[#8888AA] font-bold mt-0.5 tracking-wider uppercase">{uiTheme.label}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent flex items-center justify-center min-h-[90px]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/90 z-10 space-y-1.5 animate-pulse">
          <Loader2 className="w-5 h-5 text-[#FE2C55] animate-spin" />
          <span className="text-[8px] text-[#8888AA] font-black tracking-widest uppercase">Carregando Imagem...</span>
        </div>
      )}
      
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}
          onError={handleError}
          onLoad={handleLoad}
          referrerPolicy="no-referrer"
        />
      ) : null}

      {failedOnce && !loading && (
        <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-[#FE2C55] flex items-center gap-0.5 pointer-events-none scale-[0.8] select-none shadow">
          <Sparkles className="w-2.5 h-2.5 text-[#FE2C55]" />
          <span className="text-[7.5px] font-black uppercase tracking-wider">Foto Auxiliar</span>
        </div>
      )}
    </div>
  );
}
