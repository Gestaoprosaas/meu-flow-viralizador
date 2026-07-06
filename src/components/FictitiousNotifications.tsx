import React, { useState, useEffect } from 'react';

const NOMES_FICTICIOS = [
  'Ana S.', 'Carlos M.', 'Juliana P.', 'Roberto F.',
  'Fernanda L.', 'Lucas A.', 'Patrícia O.', 'Diego R.',
  'Camila T.', 'Bruno N.', 'Larissa C.', 'Marcos V.',
  'Bianca G.', 'Felipe H.', 'Natalia K.'
];

const CIDADES = [
  'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG',
  'Curitiba, PR', 'Salvador, BA', 'Fortaleza, CE',
  'Manaus, AM', 'Recife, PE', 'Porto Alegre, RS', 'Goiânia, GO'
];

const PRODUTOS_FICTICIOS = [
  'Escova Alisadora 5 em 1',
  '50 Envelopes Figurinha Copa 2026',
  'Jogo de Panelas Monaco Platinum',
  'Jaqueta Sarja Masculina com Capuz',
  'Coberdrom Casal Queen Sherpa',
  'Kit Body Splash Barbarius',
  'Protetor Solar FPS 60 com Cor',
  'Calça Legging Flare Flanelada',
  'Air Fryer Mini 3,5L Digital',
  'Sérum Peptídeos de Cobre GHK-CU',
  'Fita LED RGB Inteligente 5m',
  'Corda de Pular com Contador Digital',
  'Mini Aspirador USB Portátil',
  'Difusor Umidificador LED 400ml',
  'Conjunto Fitness Feminino Academia',
];

const MENSAGENS_PRODUTO = [
  (nome: string, cidade: string, produto: string) => `${nome} de ${cidade} comprou ${produto} agora mesmo! 🛒`,
  (nome: string, cidade: string, produto: string) => `Nova venda! ${nome} (${cidade}) adquiriu ${produto} 🔥`,
  (nome: string, cidade: string, produto: string) => `${nome} de ${cidade} acabou de comprar ${produto} há poucos segundos ⚡`,
  (nome: string, cidade: string, produto: string) => `🛍️ ${produto} vendido para ${nome} em ${cidade}!`,
  (nome: string, cidade: string, produto: string) => `${nome} (${cidade}) garantiu o ${produto} agora! 🎉`,
];

const MENSAGENS_AVALIACAO = [
  (nome: string, cidade: string, produto: string) => `${nome} de ${cidade} avaliou com 5 estrelas: ${produto} ⭐`,
  (nome: string, cidade: string, produto: string) => `⭐ ${nome} (${cidade}) amou a compra de ${produto}!`,
];

const MENSAGENS_LIVE = [
  (nome: string, cidade: string, produto: string) => `🔥 Na Live, ${nome} de ${cidade} comprou ${produto}!`,
  (nome: string, cidade: string, produto: string) => `${nome} (${cidade}) aproveitou o preço de Live e levou ${produto}! 💥`,
];

export function FictitiousNotifications() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleShowNotification = (e: any) => {
      setNotification(e.detail.message);
      setTimeout(() => setNotification(null), 4000);
    };

    window.addEventListener('SHOW_FICTITIOUS_NOTIFICATION', handleShowNotification);
    return () => window.removeEventListener('SHOW_FICTITIOUS_NOTIFICATION', handleShowNotification);
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] animate-fade-in flex max-w-xs">
      <div className="bg-[#111118] border border-[#1E1E35] rounded-xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1 animate-pulse" />
        <div>
          <p className="text-white text-sm font-bold leading-tight">{notification}</p>
          <p className="text-zinc-500 text-[10px] mt-1">há alguns segundos</p>
        </div>
      </div>
    </div>
  );
}

export const startFictitiousNotifications = (interval: number, type: 'all' | 'compra' | 'avaliacao' | 'live' = 'all') => {
  stopFictitiousNotifications(); // ensure single timer
  
  const tocarSom = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => osc.stop(), 200);
    } catch (e) {
      console.warn("Audio playback not allowed without interaction", e);
    }
  };

  (window as any).fictitiousNotificationTimer = setInterval(() => {
    const nome = NOMES_FICTICIOS[Math.floor(Math.random() * NOMES_FICTICIOS.length)];
    const cidade = CIDADES[Math.floor(Math.random() * CIDADES.length)];
    const produto = PRODUTOS_FICTICIOS[Math.floor(Math.random() * PRODUTOS_FICTICIOS.length)];
    
    let messagesToUse = MENSAGENS_PRODUTO;
    if (type === 'compra') {
      messagesToUse = MENSAGENS_PRODUTO;
    } else if (type === 'avaliacao') {
      messagesToUse = MENSAGENS_AVALIACAO;
    } else if (type === 'live') {
      messagesToUse = MENSAGENS_LIVE;
    } else {
      // all / mixed
      const rand = Math.random();
      if (rand < 0.6) {
        messagesToUse = MENSAGENS_PRODUTO;
      } else if (rand < 0.8) {
        messagesToUse = MENSAGENS_AVALIACAO;
      } else {
        messagesToUse = MENSAGENS_LIVE;
      }
    }

    const msgFn = messagesToUse[Math.floor(Math.random() * messagesToUse.length)];
    const msg = msgFn(nome, cidade, produto);
    
    window.dispatchEvent(new CustomEvent('SHOW_FICTITIOUS_NOTIFICATION', { detail: { message: msg } }));
    tocarSom();
  }, interval);
};

export const stopFictitiousNotifications = () => {
  if ((window as any).fictitiousNotificationTimer) {
    clearInterval((window as any).fictitiousNotificationTimer);
    (window as any).fictitiousNotificationTimer = null;
  }
};
