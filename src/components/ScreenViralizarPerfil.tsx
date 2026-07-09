import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Flame, CheckCircle, Zap, Eye, Heart, Share2, Users, 
  ChevronLeft, ChevronRight, X, Copy, Play, ArrowRight, BookOpen, AlertCircle
} from 'lucide-react';

import { ESTRATEGIAS_VIRAIS } from '../data/estrategiasVirais';

const AnimatedCounter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easeProgress * end);
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);
  
  return <>{count.toLocaleString('pt-BR')}</>;
};

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(25)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white/20 animate-particle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

const PROMPT_TEMPLATE = `📐 MANDATORY VIDEO FORMAT 9:16 VERTICAL:
All videos MUST be generated exclusively in vertical format (9:16 aspect ratio).
- Aspect ratio must ALWAYS be 9:16 (vertical)
- Optimized for TikTok, Instagram Reels, and YouTube Shorts
- Avatar centered within 9:16 safe area

📍 TAKE 1 de 2 — VÍDEO VIRAL PARA CRESCIMENTO
Duração: 8s (0s a 8s)
Total: 16s em 2 takes
Tipo: {{TIPO}}
Intensidade: {{INTENSIDADE}}

🎭 AVATAR:
{{AVATAR_NOME}}, {{AVATAR_DESCRICAO}}
Consistência visual absoluta.

📍 CENÁRIO:
{{CENARIO}}

🎙️ VOZ:
Gênero: {{VOZ_GENERO}}
Energia: {{VOZ_ENERGIA}}
Idioma: pt-BR

🎬 ESTRUTURA DESTE TAKE:
🪝 0s–2s → HOOK (gancho forte)
😰 2s–8s → TENSÃO INICIAL (criar curiosidade, NÃO revelar)
➡️ Terminar com ponte pro Take 2 (frase completa, suspense).

📜 GLOBAL MULTI-TAKE RULES (HARD):
Take 1 define TUDO. Takes seguintes são CONTINUAÇÕES.
🚫 NEVER change: scene, lighting, framing, avatar, clothes, style, mood.
Cada take começa e termina com frase completa. NUNCA cortar palavra.

🔥 TIPO VIRAL: {{TIPO_VIRAL}}
Micro-tensões a cada 3-4s. Nunca revelar tudo.

🎤 FALA TAKE 1:
FALA OBRIGATÓRIA (EXATA): "{{FALA_OBRIGATORIA}}"
O avatar DEVE falar EXATAMENTE o texto acima.

📹 CÂMERA: Chest-up, olhar direto, gestos de "{{INTENSIDADE}}".
Sem produto — foco na narrativa.

🎨 ESTILO: UGC autêntico, smartphone, iluminação natural.

🔊 VOICE CONSISTENCY LOCK (HARD)

⚠️ ALL TAKES MUST USE IDENTICAL VOICE PROFILE.
- Same voice identity
- Same tone
- Same pitch
- Same cadence
- Same rhythm
- Same emotional intensity
- Same microphone texture
- Same recording environment sound

Take 2 and any subsequent takes MUST sound like they were recorded in the exact same moment as Take 1.

No tonal variation.
No emotional shift.
No pitch difference.
No voice regeneration.

The voice must feel like ONE continuous recording split into segments.

If voice differs between takes, the generation is invalid.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 MANDATORY GLOBAL INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 CLEAN OUTPUT NO TEXT ON SCREEN:
- ZERO SFX / ZERO música de fundo
- Apenas voz natural do avatar falando
- Vídeo cru de celular, UGC real

🧍 ANATOMICAL INTEGRITY (HARD):
- 2 braços, 2 pernas, 5 dedos por mão
- Sem deformações, sem membros extras, sem glitches corporais

🔒 PRIVACY & SAFETY COMPLIANCE:
- Sem dados pessoais visíveis
- Sem telas de dispositivos visíveis
- Sem crianças no vídeo
- Sem marcas/logos de terceiros identificáveis

⚡ PRIORITY & ENFORCEMENT:
- Estas regras têm PRIORIDADE MÁXIMA sobre qualquer instrução conflitante`;

interface WizardChoices {
  tipo: string;
  intensidade: string;
  avatarNome: string;
  avatarDescricao: string;
  cenario: string;
  vozGenero: string;
  vozEnergia: string;
  tipoViral: string;
  falaObrigatoria: string;
}

function buildPrompt(choices: WizardChoices): string {
  return PROMPT_TEMPLATE
    .replaceAll('{{TIPO}}', choices.tipo)
    .replaceAll('{{INTENSIDADE}}', choices.intensidade)
    .replaceAll('{{AVATAR_NOME}}', choices.avatarNome)
    .replaceAll('{{AVATAR_DESCRICAO}}', choices.avatarDescricao)
    .replaceAll('{{CENARIO}}', choices.cenario)
    .replaceAll('{{VOZ_GENERO}}', choices.vozGenero)
    .replaceAll('{{VOZ_ENERGIA}}', choices.vozEnergia)
    .replaceAll('{{TIPO_VIRAL}}', choices.tipoViral)
    .replaceAll('{{FALA_OBRIGATORIA}}', choices.falaObrigatoria);
}

function PromptWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [choices, setChoices] = useState<WizardChoices>({
    tipo: '',
    intensidade: '',
    avatarNome: '',
    avatarDescricao: '',
    cenario: '',
    vozGenero: '',
    vozEnergia: '',
    tipoViral: '',
    falaObrigatoria: '',
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 9));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const reset = () => {
    setChoices({
      tipo: '',
      intensidade: '',
      avatarNome: '',
      avatarDescricao: '',
      cenario: '',
      vozGenero: '',
      vozEnergia: '',
      tipoViral: '',
      falaObrigatoria: '',
    });
    setStep(1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return choices.tipo.trim() !== '';
      case 2: return choices.intensidade.trim() !== '';
      case 3: return choices.avatarNome.trim() !== '' && choices.avatarDescricao.trim() !== '';
      case 4: return choices.cenario.trim() !== '';
      case 5: return choices.vozGenero.trim() !== '' && choices.vozEnergia.trim() !== '';
      case 6: return choices.tipoViral.trim() !== '';
      case 7: return choices.falaObrigatoria.trim() !== '';
      default: return true;
    }
  };

  const inputClass = "w-full bg-[#111118] border border-[#1E1E35] rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-[#813EF6] focus:outline-none text-sm transition-colors";
  
  return (
    <div className="fixed inset-0 z-[200] bg-[#06060B] flex flex-col overflow-y-auto animate-fade-in font-sans">
      {/* Header / Progress */}
      <div className="sticky top-0 z-10 bg-[#0A0A14] border-b border-[#1E1E35] p-4 flex items-center justify-between">
        {step > 1 && step < 9 ? (
          <button onClick={prevStep} className="p-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : <div className="w-9" />}
        
        {step < 9 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === i ? 'bg-[#FE2C55] text-white' : 
                  step > i ? 'bg-[#813EF6] text-white' : 
                  'bg-[#1E1E35] text-zinc-600'
                }`}>
                  {step > i ? <CheckCircle className="w-3 h-3" /> : i}
                </div>
                {i < 8 && (
                  <div className={`w-2 h-[2px] mx-1 ${step > i ? 'bg-[#813EF6]' : 'bg-[#1E1E35]'}`} />
                )}
              </div>
            ))}
          </div>
        )}
        
        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-6 sm:p-8 flex flex-col pt-8 pb-10">
        {step === 1 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">Que tipo de personagem você quer criar?</h2>
            <p className="text-zinc-400 mb-8">Escolha um arquétipo viral ou escreva o seu</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { emoji: '🧓', label: 'Vovô da Roça' },
                { emoji: '👧', label: 'Menina da Roça' },
                { emoji: '🏠', label: 'Dona de Casa' },
                { emoji: '🎓', label: 'Jovem Universitário' },
                { emoji: '🤠', label: 'Sertanejo' },
                { emoji: '👨‍👧', label: 'Pai de Família' },
                { emoji: '💼', label: 'Empreendedor' },
                { emoji: '🌟', label: 'Influencer Iniciante' },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setChoices(c => ({ ...c, tipo: opt.label }));
                    setTimeout(nextStep, 200);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors ${
                    choices.tipo === opt.label 
                      ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' 
                      : 'bg-[#111118] border-[#1E1E35] hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
            
            <input
              type="text"
              value={choices.tipo}
              onChange={e => setChoices(c => ({ ...c, tipo: e.target.value }))}
              placeholder="Ou descreva seu próprio tipo..."
              className={inputClass}
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">Qual a intensidade emocional do vídeo?</h2>
            <p className="text-zinc-400 mb-8">Isso define a energia do avatar e da câmera</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { emoji: '😢', label: 'Triste' },
                { emoji: '😂', label: 'Engraçado' },
                { emoji: '😏', label: 'Sarcástico' },
                { emoji: '🔥', label: 'Animado' },
                { emoji: '😮', label: 'Emotivo' },
                { emoji: '😤', label: 'Indignado' },
                { emoji: '🥺', label: 'Nostálgico' },
                { emoji: '😱', label: 'Chocado' },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setChoices(c => ({ ...c, intensidade: opt.label }));
                    setTimeout(nextStep, 200);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-center transition-colors ${
                    choices.intensidade === opt.label 
                      ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' 
                      : 'bg-[#111118] border-[#1E1E35] hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
            
            <input
              type="text"
              value={choices.intensidade}
              onChange={e => setChoices(c => ({ ...c, intensidade: e.target.value }))}
              placeholder="Ou descreva a intensidade..."
              className={inputClass}
            />
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">Descreva o seu avatar</h2>
            <p className="text-zinc-400 mb-8">Nome e aparência visual detalhada</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Nome do avatar</label>
                <input
                  type="text"
                  value={choices.avatarNome}
                  onChange={e => setChoices(c => ({ ...c, avatarNome: e.target.value }))}
                  placeholder="Ex: Sofia, Valdir, Maria..."
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-zinc-300">Descrição visual</label>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    '👧 Jovem e natural',
                    '🧓 Idoso e simpático',
                    '💪 Forte e confiante',
                    '🥺 Frágil e emotivo'
                  ].map(sug => (
                    <button
                      key={sug}
                      onClick={() => setChoices(c => ({ ...c, avatarDescricao: sug }))}
                      className="px-3 py-1.5 bg-[#1E1E35] hover:bg-[#2A2A4A] rounded-lg text-xs font-medium text-zinc-300 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                <textarea
                  value={choices.avatarDescricao}
                  onChange={e => setChoices(c => ({ ...c, avatarDescricao: e.target.value }))}
                  placeholder="Ex: jovem brasileira do campo, corpo natural com curvas, usa blusa cropped e saia curta estilo roça..."
                  className={`${inputClass} min-h-[100px] resize-y`}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">Onde acontece o vídeo?</h2>
            <p className="text-zinc-400 mb-8">Escolha um ambiente ou descreva o seu</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { label: '🌾 Fazenda/Roça', desc: 'Fazenda simples no interior do Brasil, com cerca de madeira, gado ao fundo, vegetação verde, luz natural quente do fim de tarde' },
                { label: '🏠 Casa Simples', desc: 'Sala de casa simples, sofá gasto, televisão velha ao fundo, paredes com marcas de umidade, iluminação amarela de lâmpada comum' },
                { label: '🍳 Cozinha Humilde', desc: 'Cozinha pequena e humilde, fogão a lenha ou antigo, panelas velhas, chão de cerâmica simples, janela com vista para quintal' },
                { label: '🌳 Quintal com Varal', desc: 'Quintal de fazenda simples com bacia d\'água, varal de roupas ao vento, vegetação verde ao fundo, luz natural quente' },
                { label: '🏙️ Apartamento Pequeno', desc: 'Apartamento pequeno e simples, quarto com cama de solteiro, janela com vista urbana, iluminação natural da manhã' },
                { label: '🌅 Campo Aberto', desc: 'Campo aberto com horizonte amplo, céu azul com nuvens, vegetação seca do cerrado, luz dourada do sol' },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setChoices(c => ({ ...c, cenario: opt.desc }))}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    choices.cenario === opt.desc 
                      ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' 
                      : 'bg-[#111118] border-[#1E1E35] hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  <span className="text-sm font-semibold">{opt.label}</span>
                </button>
              ))}
            </div>
            
            <textarea
              value={choices.cenario}
              onChange={e => setChoices(c => ({ ...c, cenario: e.target.value }))}
              placeholder="Descreva o cenário em detalhes: Ex: quintal de fazenda com bacia d'água, varal de roupas, vegetação verde ao fundo, luz natural quente..."
              className={`${inputClass} min-h-[100px] resize-y`}
              rows={4}
            />
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">Como vai ser a voz do avatar?</h2>
            <p className="text-zinc-400 mb-8">Gênero e energia da fala</p>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-zinc-300 mb-3">Gênero</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'Masculino', label: '♂️ Masculino' },
                  { id: 'Feminino', label: '♀️ Feminino' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setChoices(c => ({ ...c, vozGenero: opt.id }))}
                    className={`py-6 rounded-xl border text-center transition-colors ${
                      choices.vozGenero === opt.id 
                        ? 'bg-[#FE2C55]/10 border-[#FE2C55] text-white' 
                        : 'bg-[#111118] border-[#1E1E35] hover:border-zinc-600 text-zinc-300'
                    }`}
                  >
                    <span className="text-lg font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-3">Energia da voz</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  '😏 sarcastic, ironic smirk',
                  '😢 emotional, teary voice',
                  '🔥 excited, high energy',
                  '😌 calm, warm, sincere',
                  '😤 frustrated, desperate',
                  '🥺 vulnerable, shaky voice',
                  '😂 playful, comedic timing',
                  '😮 shocked, breathless'
                ].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setChoices(c => ({ ...c, vozEnergia: opt }))}
                    className={`p-3 rounded-xl border text-left transition-colors text-sm ${
                      choices.vozEnergia === opt 
                        ? 'bg-[#813EF6]/10 border-[#813EF6] text-white' 
                        : 'bg-[#111118] border-[#1E1E35] hover:border-zinc-600 text-zinc-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={choices.vozEnergia}
                onChange={e => setChoices(c => ({ ...c, vozEnergia: e.target.value }))}
                placeholder="Ou descreva a energia da voz em inglês..."
                className={inputClass}
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">Qual o tipo de conteúdo viral?</h2>
            <p className="text-zinc-400 mb-8">Define o padrão narrativo do vídeo</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'rotina-roca', icon: '🌾', label: 'rotina-roca', desc: 'Drama do interior' },
                { id: 'drama-familiar', icon: '👨‍👩‍👧', label: 'drama-familiar', desc: 'Conflito emocional' },
                { id: 'comedia-relatable', icon: '😂', label: 'comedia-relatable', desc: 'Situação cômica' },
                { id: 'motivacional', icon: '💪', label: 'motivacional', desc: 'Superação pessoal' },
                { id: 'revelacao-segredo', icon: '🤫', label: 'revelacao-segredo', desc: 'Exclusividade' },
                { id: 'reacao-viral', icon: '👀', label: 'reacao-viral', desc: 'Reação a algo' },
                { id: 'storyline-serie', icon: '📖', label: 'storyline-serie', desc: 'Jornada contínua' },
                { id: 'ugc-produto', icon: '🛍️', label: 'ugc-produto', desc: 'Produto natural' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setChoices(c => ({ ...c, tipoViral: opt.id }));
                    setTimeout(nextStep, 200);
                  }}
                  className={`flex flex-col p-5 rounded-xl border text-left transition-colors ${
                    choices.tipoViral === opt.id 
                      ? 'bg-[#813EF6]/10 border-[#813EF6] text-white' 
                      : 'bg-[#111118] border-[#1E1E35] hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  <span className="text-2xl mb-2">{opt.icon}</span>
                  <span className="font-bold text-sm mb-1">{opt.label}</span>
                  <span className="text-xs text-zinc-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-white mb-2">O que o avatar vai falar?</h2>
            <p className="text-zinc-400 mb-8">Digite o texto EXATO que o avatar deve falar</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { label: '📌 CTA Seguir', text: 'Moço você vai embora sem me seguir, não faz isso comigo não uai, aperta no mais da minha foto e fica pertinho de mim' },
                { label: '📌 CTA Comprar', text: 'Olha gente eu precisava mostrar isso pra vocês, achei esse produto e não consigo acreditar no preço, clica no link que tá no meu perfil' },
                { label: '📌 Drama Emocional', text: 'Gente eu nunca pensei que fosse acontecer isso comigo, não sei mais o que fazer, alguém me ajuda por favor' },
                { label: '📌 Curiosidade', text: 'Espera, você sabia que existe um segredo que ninguém fala sobre isso? Fica aqui que eu vou te contar tudo' }
              ].map(sug => (
                <button
                  key={sug.label}
                  onClick={() => setChoices(c => ({ ...c, falaObrigatoria: sug.text }))}
                  className="px-3 py-1.5 bg-[#1E1E35] hover:bg-[#2A2A4A] rounded-lg text-xs font-medium text-zinc-300 transition-colors"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            <textarea
              value={choices.falaObrigatoria}
              onChange={e => setChoices(c => ({ ...c, falaObrigatoria: e.target.value }))}
              placeholder="Ex: Moço você vai embora sem me seguir, não faz isso comigo não uai..."
              className={`${inputClass} min-h-[150px] resize-y mb-2`}
              rows={6}
            />
            <div className="text-right text-xs text-zinc-500 mb-6">
              {choices.falaObrigatoria.length} caracteres
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-500 mb-1">Aviso Importante</p>
                <p className="text-xs text-amber-500/80 leading-relaxed">
                  A fala será exatamente essa!.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="animate-fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">✅ Seu prompt está pronto!</h2>
              <p className="text-zinc-400">Copie e cole no AI Studios Flow</p>
            </div>
            
            <div className="bg-[#111118] border border-[#1E1E35] rounded-2xl p-6 mb-6">
              <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                {buildPrompt(choices)}
              </pre>
            </div>

            <button
              onClick={() => handleCopy(buildPrompt(choices))}
              className="w-full py-4 bg-[#FE2C55] hover:bg-[#e0243d] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors mb-6 shadow-[0_0_20px_rgba(254,44,85,0.3)]"
            >
              {copied ? (
                <><CheckCircle className="w-5 h-5" /> ✅ Copiado!</>
              ) : (
                <><Copy className="w-5 h-5" /> 📋 Copiar Prompt</>
              )}
            </button>

            <div className="h-px bg-[#1E1E35] w-full mb-6" />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 bg-[#111118] border border-[#1E1E35] hover:bg-[#1E1E35] text-zinc-300 rounded-xl font-bold text-sm transition-colors"
              >
                🔄 Criar Outro Prompt
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-[#111118] border border-[#1E1E35] hover:bg-red-500/20 hover:text-red-500 text-zinc-400 rounded-xl font-bold text-sm transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Botão Próximo — inline, sempre visível abaixo do conteúdo */}
        {step < 8 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`px-8 py-4 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
                isStepValid()
                  ? 'bg-[#FE2C55] hover:bg-[#e0243d] text-white shadow-[0_0_20px_rgba(254,44,85,0.3)]'
                  : 'bg-[#1E1E35] text-zinc-500 cursor-not-allowed opacity-50'
              }`}
            >
              {step === 7 ? '🚀 Gerar Prompt' : 'Próximo'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default function ScreenViralizarPerfil() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextStrategy = () => {
    setCurrentIndex((prev) => (prev === ESTRATEGIAS_VIRAIS.length - 1 ? 0 : prev + 1));
  };

  const prevStrategy = () => {
    setCurrentIndex((prev) => (prev === 0 ? ESTRATEGIAS_VIRAIS.length - 1 : prev - 1));
  };

  const currentStrategy = ESTRATEGIAS_VIRAIS[currentIndex];

  return (
    <div className="w-full space-y-8 font-sans pb-20 animate-fade-in bg-[#06060B] min-h-screen">
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
        }
        .animate-particle {
          animation: float-particle 10s infinite ease-in-out;
        }
        .bg-grid-pattern {
          background-size: 30px 30px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
      `}</style>

      {/* HERO SECTION */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0A0A14] border border-[#1E1E35] shadow-2xl p-8 sm:p-16 flex flex-col items-center justify-center text-center min-h-[500px]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#813EF6]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FE2C55]/20 rounded-full blur-[100px] pointer-events-none" />
        <Particles />

        <div className="relative z-10 flex flex-col items-center max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Rocket className="w-4 h-4 text-[#FE2C55]" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Projeto Explosão Orgânica</span>
          </div>

          <div className="mb-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              DE 0 A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE2C55] to-[#813EF6]">
                <AnimatedCounter end={1000} duration={3000} />
              </span> SEGUIDORES<br />
              NO TIKTOK EM 30 DIAS
            </h1>
          </div>

          <p className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            Usando os mesmos métodos dos criadores que explodiram do nada.
            Sem pagar tráfego. Sem comprar seguidores. 100% orgânico.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] border border-[#1E1E35] rounded-xl shadow-lg">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-300">Método Testado e Validado</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] border border-[#1E1E35] rounded-xl shadow-lg">
              <Flame className="w-4 h-4 text-[#FE2C55]" />
              <span className="text-xs font-bold text-zinc-300">Usado por +500 Criadores</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] border border-[#1E1E35] rounded-xl shadow-lg">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-300">Resultados em 7 dias</span>
            </div>
          </div>

          {/* CTA HERO — abre o wizard */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setWizardOpen(true)}
              className="group relative px-10 py-5 bg-gradient-to-r from-[#FE2C55] to-[#813EF6] rounded-2xl font-black text-lg text-white shadow-[0_0_40px_rgba(254,44,85,0.3)] hover:shadow-[0_0_60px_rgba(254,44,85,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 rounded-2xl animate-ping opacity-20 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3">
                <Rocket className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                VIRALIZAR MEU PERFIL AGORA
              </div>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group px-8 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold text-sm text-zinc-300 transition-colors hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Ver Estratégias Prontas
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* SEÇÃO DE PROVA SOCIAL E PILARES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-0">
        <div className="bg-[#111118] border border-[#1E1E35] p-8 rounded-3xl hover:border-[#FE2C55]/30 transition-colors group">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FE2C55]/20 to-[#813EF6]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#FE2C55]/20 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🎭</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">O Gatilho da Curiosidade</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Vídeos que fazem o espectador PRECISAR ver até o final. Novelinhas, cliffhangers, histórias incompletas — o algoritmo ama quem prende as pessoas.
          </p>
        </div>

        <div className="bg-[#111118] border border-[#1E1E35] p-8 rounded-3xl hover:border-[#813EF6]/30 transition-colors group">
          <div className="w-14 h-14 bg-gradient-to-br from-[#813EF6]/20 to-[#25F4EE]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#813EF6]/20 group-hover:scale-110 transition-transform">
            <span className="text-2xl">💘</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">O Gatilho da Identificação</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Conteúdo que faz a pessoa pensar "isso sou eu!". Situações cotidianas, dramas relacionáveis, emoções reais — isso gera salvar e compartilhar.
          </p>
        </div>

        <div className="bg-[#111118] border border-[#1E1E35] p-8 rounded-3xl hover:border-[#25F4EE]/30 transition-colors group">
          <div className="w-14 h-14 bg-gradient-to-br from-[#25F4EE]/20 to-[#FE2C55]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#25F4EE]/20 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🔁</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">O Gatilho da Repetição</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Consistência de formato cria público fiel. Séries, personagens fixos, bordões — o seguidor vira fã e arrasta outros para o seu perfil.
          </p>
        </div>
      </div>

      {/* MÉTRICAS ANIMADAS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="bg-gradient-to-r from-[#111118] via-[#1E1E35]/40 to-[#111118] border border-[#1E1E35] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-white font-black text-lg">
                +<AnimatedCounter end={847} />%
              </div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Taxa de retenção</div>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-[#1E1E35]" />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FE2C55]/10 rounded-lg">
              <Heart className="w-5 h-5 text-[#FE2C55]" />
            </div>
            <div>
              <div className="text-white font-black text-lg">
                3.2x
              </div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Mais curtidas</div>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-[#1E1E35]" />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#813EF6]/10 rounded-lg">
              <Share2 className="w-5 h-5 text-[#813EF6]" />
            </div>
            <div>
              <div className="text-white font-black text-lg">
                5x
              </div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Mais compartilhamentos</div>
            </div>
          </div>
          
          <div className="hidden md:block w-px h-10 bg-[#1E1E35]" />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-white font-black text-lg">
                <AnimatedCounter end={1000} />
              </div>
              <div className="text-xs text-zinc-500 font-bold uppercase">Seguidores em 30 dias</div>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE DE 30 DIAS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-0 pt-10">
        <h3 className="text-center text-xl font-bold text-white mb-10">O Plano de 30 Dias</h3>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          {/* Linha conectora desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1E1E35] via-[#813EF6]/50 to-[#1E1E35] -translate-y-1/2 z-0" />
          
          {/* Linha conectora mobile */}
          <div className="md:hidden absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-[#1E1E35] via-[#813EF6]/50 to-[#1E1E35] z-0" />

          {/* Steps */}
          {[
            { sem: "Semana 1", title: "Criar os", sub: "primeiros vídeos", icon: "🎬" },
            { sem: "Semana 2", title: "Consistência", sub: "diária (3x/sem)", icon: "📅" },
            { sem: "Semana 3", title: "Engajamento", sub: "com público e trends", icon: "🤝" },
            { sem: "Semana 4", title: "1.000", sub: "seguidores 🎉", icon: "🏆", highlight: true }
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-1/4">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl border-4 border-[#06060B] shadow-xl shrink-0 ${
                step.highlight 
                  ? 'bg-gradient-to-br from-[#FE2C55] to-[#813EF6] text-white animate-pulse' 
                  : 'bg-[#111118] text-white'
              }`}>
                {step.icon}
              </div>
              <div className="md:text-center">
                <div className="text-[#813EF6] text-xs font-bold uppercase tracking-wider mb-1">{step.sem}</div>
                <div className="text-white font-bold">{step.title}</div>
                <div className="text-zinc-400 text-sm">{step.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE ESTRATÉGIAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0A0A14] w-full h-full sm:h-[90vh] sm:max-w-5xl sm:rounded-[2.5rem] flex flex-col overflow-hidden border border-[#1E1E35] shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#1E1E35] bg-[#0A0A14] z-10 shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={prevStrategy}
                  className="p-2 bg-[#111118] hover:bg-[#1E1E35] rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mb-0.5 sm:mb-1">
                    [{currentIndex + 1}/{ESTRATEGIAS_VIRAIS.length}] Estratégia
                  </div>
                  <h2 className="text-sm sm:text-lg font-black text-white line-clamp-1">{currentStrategy.nome}</h2>
                </div>
                <button 
                  onClick={nextStrategy}
                  className="p-2 bg-[#111118] hover:bg-[#1E1E35] rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-[#111118] hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Split View on Desktop */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
              
              {/* Left Side - Image/Preview */}
              <div className="w-full h-48 md:h-full md:w-[40%] relative bg-[#111118] flex-shrink-0">
                {currentStrategy.videoUrl ? (
                  <video
                    src={currentStrategy.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  // Placeholder enquanto videoUrl não está configurado
                  <div className="w-full h-full bg-zinc-900 rounded-xl flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <span className="text-5xl select-none animate-bounce">
                      {currentStrategy.categoria === 'DRAMA' ? '🎭' :
                       currentStrategy.categoria === 'COMÉDIA' ? '😂' :
                       currentStrategy.categoria === 'INSPIRAÇÃO' ? '✨' :
                       currentStrategy.categoria === 'MOTIVAÇÃO' ? '💪' :
                       currentStrategy.categoria === 'PRODUTO' ? '🛍️' :
                       currentStrategy.categoria === 'SÉRIE' ? '🎬' :
                       currentStrategy.categoria === 'ENGAJAMENTO' ? '🔥' : '📹'}
                    </span>
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Vídeo em breve</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0A0A14]/50 md:to-[#0A0A14] pointer-events-none" />
                
                {/* Categoría Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 z-10">
                  <Flame className="w-3.5 h-3.5 text-[#FE2C55]" />
                  {currentStrategy.categoria}
                </div>
              </div>

              {/* Right Side - Info & Prompt (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 pb-8">
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 border-b border-[#1E1E35] pb-4 sm:pb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#813EF6]/10 rounded-md">
                      <BookOpen className="w-4 h-4 text-[#813EF6]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Tempo Médio</div>
                      <div className="text-sm font-semibold text-white">{currentStrategy.tempoResultado}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-md">
                      <Zap className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Dificuldade</div>
                      <div className="text-sm font-semibold text-white">{currentStrategy.dificuldade}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FE2C55]" />
                    Como funciona:
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {currentStrategy.descricao}
                  </p>
                </div>

                {/* Prompt Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Copy className="w-4 h-4 text-[#813EF6]" />
                      PROMPT PARA O FLOW:
                    </h3>
                  </div>
                  
                  <div className="relative group">
                    <div className="bg-[#111118] border border-[#1E1E35] rounded-xl p-4 sm:p-5 text-sm text-zinc-300 font-mono leading-relaxed relative z-10 selection:bg-[#FE2C55]/30">
                      {currentStrategy.prompt}
                    </div>
                    
                    <button
                      onClick={() => handleCopy(currentStrategy.prompt)}
                      className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-[#1E1E35] hover:bg-[#2A2A4A] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-lg border border-[#1E1E35]"
                    >
                      {copied ? (
                        <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copiado!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copiar Prompt</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors">
                    <Play className="w-4 h-4" />
                    Usar Esta Estratégia no Flow
                  </button>
                  <p className="text-center text-[10px] text-zinc-500 mt-3 font-medium">
                    Copie o prompt acima e cole no módulo de geração de vídeos.
                  </p>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      )}

      {wizardOpen && (
        <PromptWizard onClose={() => setWizardOpen(false)} />
      )}
    </div>
  );
}
