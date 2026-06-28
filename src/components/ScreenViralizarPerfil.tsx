import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  MessageSquare, 
  VolumeX, 
  Volume2, 
  Compass, 
  Sparkles, 
  User, 
  Image as ImageIcon,
  Activity,
  AlertTriangle,
  Heart,
  Music,
  Tv,
  Info,
  CheckCircle2,
  RefreshCw,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Profile } from '../types';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail_url: string;
  is_active: boolean;
  order_position: number;
}

interface Hook {
  id: string;
  template_category: string;
  hook_text: string;
  example_line: string;
  is_active: boolean;
}

interface AvatarPreset {
  id: string;
  name: string;
  gender: 'FEMININO' | 'MASCULINO';
  description: string;
  imageUrl: string;
}

interface ScenarioPreset {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
}

const AVATARS_PRESETS: AvatarPreset[] = [];

const SCENARIOS_PRESETS: ScenarioPreset[] = [
  {
    id: 'quarto',
    name: 'Quarto',
    type: 'Residencial',
    description: 'Ambiente de quarto aconchegante com cordões de luz quente (fairy lights) de fundo.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'estudio',
    name: 'Estúdio',
    type: 'Profissional',
    description: 'Estúdio de gravação comercial limpo, spots de luz dedicados, luzes de neon e fundo cinza estético.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'ar_livre',
    name: 'Ar Livre',
    type: 'Externo',
    description: 'Parque natural ensolarado com bastante grama, flores sob iluminação solar agradável.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    type: 'Residencial',
    description: 'Cozinha integrada premium com bancada de quartzo clara e louças decorativas ao fundo.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300'
  }
];

interface ScreenViralizarPerfilProps {
  profile: Profile;
  onRefresh?: () => void;
}

export default function ScreenViralizarPerfil({
  profile,
  onRefresh
}: ScreenViralizarPerfilProps) {
  // Navigation & state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [allAvatars, setAllAvatars] = useState<AvatarPreset[]>(AVATARS_PRESETS);
  const [loading, setLoading] = useState(false);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});

  // Wizard state flow
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [step, setStep] = useState<number>(0); // 0 = Gallery, 1 = Hook/Gancho, 2 = Avatar, 3 = Scenario, 4 = Prompt

  // Selection states inside wizard
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('giovanna');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('quarto');
  const [poseSelected, setPoseSelected] = useState<string>('De Frente');
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch Templates, Hooks, and custom Avatars
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTemplates, resHooks, resAvatars] = await Promise.all([
        fetch('/api/viral-templates'),
        fetch('/api/viral-hooks'),
        fetch('/api/avatars').catch(() => null)
      ]);

      if (resTemplates.ok) {
        const t = await resTemplates.json();
        setTemplates(t.filter((item: Template) => item.is_active));
      }

      if (resHooks.ok) {
        const h = await resHooks.json();
        setHooks(h.filter((item: Hook) => item.is_active));
      }

      if (resAvatars && resAvatars.ok) {
        const customAvs = await resAvatars.json();
        if (Array.isArray(customAvs) && customAvs.length > 0) {
          const formatted = customAvs.map((a: any) => ({
            id: a.id,
            name: a.name,
            gender: a.gender || 'FEMININO',
            description: a.description || 'Avatar customizado',
            imageUrl: a.imageUrl || a.image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'
          }));
          setAllAvatars([...AVATARS_PRESETS, ...formatted]);
        }
      }
    } catch (err) {
      console.error("Erro ao obter metadados da Biblioteca Viral:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleRealtimeUpdate = (event: any) => {
      fetchData();
    };

    window.addEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    };
  }, []);

  const handleStartWithTemplate = (template: Template) => {
    setSelectedTemplate(template);
    // Find first active hook matching this category
    const categoryHooks = hooks.filter(h => h.template_category === template.category);
    if (categoryHooks.length > 0) {
      setSelectedHook(categoryHooks[0]);
    } else {
      setSelectedHook(null);
    }
    setStep(1); // Move to Hook selection
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
      setSelectedTemplate(null);
    } else {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedHook) {
      alert("Por favor, selecione um Gancho antes de prosseguir!");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleRestart = () => {
    setSelectedTemplate(null);
    setSelectedHook(null);
    setSelectedAvatarId('giovanna');
    setSelectedScenarioId('quarto');
    setPoseSelected('De Frente');
    setStep(0);
  };

  const toggleMute = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMutedStates(prev => ({
      ...prev,
      [templateId]: !prev[templateId]
    }));
  };

  // Icon Badge Builder based on Template Category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Novelinha Viral':
        return <MessageSquare className="w-4 h-4 text-[#FE2C55]" />;
      case 'Objetos Falantes':
        return <Activity className="w-4 h-4 text-[#25F4EE]" />;
      case 'Polêmicas / Curiosidades':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Menina da Roça':
        return <Heart className="w-4 h-4 text-emerald-400" />;
      case 'Dancinhas':
        return <Music className="w-4 h-4 text-[#FE2C55]" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  // Prompt Generator Logic
  const generatePromptText = () => {
    if (!selectedTemplate || !selectedHook) return "";

    const avatarObj = allAvatars.find(a => a.id === selectedAvatarId) || allAvatars[0];
    const scenarioObj = SCENARIOS_PRESETS.find(s => s.id === selectedScenarioId) || SCENARIOS_PRESETS[0];

    return `PROMPT DE CRIAÇÃO PARA O FLOW (Geração de Vídeo)

[APRESENTADOR VIRTUAL]
Personagem/Modelo Humano Realista que será utilizado: ${avatarObj.name}.
Visual do Apresentador: ${avatarObj.description}.
Instruções: O usuário fará o upload manual do arquivo de imagem do apresentador "${avatarObj.name}" diretamente no Flow como imagem de referência estática de base. O Flow deve respeitar rigorosamente as suas características faciais.

[CENÁRIO DA CENA]
Cenário de Fundo: ${scenarioObj.name} (${scenarioObj.description}).
Enquadramento & Pose Corporal: O apresentador de IA posicionado "${poseSelected}" olhando diretamente para a câmera, enquadramento em plano médio/close comercial, luz suave e cinematográfica. Estilo estético altamente retentivo de feed orgânico do TikTok.

[SALA DE DUBLAGEM & ÁUDIO REALISTA]
Locução dublada integrada com sincronização labial perfeita (Lip-Sync profissional).
Idioma da fala do vídeo: Português Brasileiro (PT-BR).
O apresentador deve pronunciar exatamente com tom persuasivo, entonação natural e ritmo dinâmico de TikToker a seguinte frase:
"${selectedHook.example_line}"

[DETALHES DA PRODUÇÃO VIRALIZAR PERFIL]
Tipo de Template Escolhido: ${selectedTemplate.title}
Instruções do Formato: ${selectedTemplate.description}
Objetivo: Engajar telespectadores no TikTok Shop, estimular cliques e conquistar novos seguidores para ultrapassar o patamar mínimo dos 2.000 seguidores.`;
  };

  const handleCopyPrompt = () => {
    const prompt = generatePromptText();
    navigator.clipboard.writeText(prompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0F]/90 border border-[#1E1E2E] p-4 sm:p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-l from-[#FE2C55]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#FE2C55]/15 p-1.5 rounded-xl border border-[#FE2C55]/30">
              <Flame className="w-5 h-5 text-[#FE2C55] animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">Viralizar Perfil 🚀</h1>
              <span className="text-[10px] sm:text-xs font-bold text-[#8888AA]">Ganhe seguidores orgânicos para desbloquear o TikTok Shop (Meta: 2.000 seguidores)</span>
            </div>
          </div>
        </div>

        {step > 0 && (
          <button 
            onClick={handleRestart}
            className="px-4 py-2 bg-zinc-900 border border-[#1E1E2E] rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center gap-2 z-10"
          >
            Voltar Galeria
          </button>
        )}
      </div>

      {/* GALLERY SCREEN (STEP 0) */}
      {step === 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#111118] border border-[#1E1E2E] p-4.5 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-[#25F4EE] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-white">Como funciona o Viralizar Perfil?</h3>
              <p className="text-xs text-[#8888AA] leading-relaxed">
                Formatos de vídeo de alta retenção e ganchos personalizados configurados diretamente nas configurações do seu painel administrativo. Escolha um dos modelos disponíveis abaixo, ajuste o gancho de voz, selecione o apresentador e gere o prompt perfeito para criar seu conteúdo de alta conversão.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-[#FE2C55] animate-spin" />
              <span className="text-xs font-bold text-[#8888AA]">Carregando formatos de vídeo...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="bg-[#0A0A0F]/60 border border-[#1E1E2E] p-12 text-center rounded-2xl">
              <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h4 className="text-sm font-black text-white">Nenhum template viral ativo</h4>
              <p className="text-xs text-[#8888AA] mt-1 max-w-sm mx-auto">Configure novos modelos e ganchos na aba de configurações do portal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates.map((temp) => {
                const isMuted = !!mutedStates[temp.id];
                return (
                  <div 
                    key={temp.id}
                    className="group bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl overflow-hidden hover:border-[#FE2C55]/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Card Media Header */}
                    <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden bg-zinc-950">
                      <img 
                        src={temp.thumbnail_url} 
                        alt={temp.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Category icon badge top-left */}
                      <div className="absolute top-2.5 left-2.5 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                        {getCategoryIcon(temp.category)}
                        <span className="text-[9px] font-black tracking-wide text-white uppercase">{temp.category}</span>
                      </div>

                      {/* Mute icon top-right */}
                      <button 
                        onClick={(e) => toggleMute(temp.id, e)}
                        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 text-[#8888AA] hover:text-white transition"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Dark gradient overlay bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    {/* Meta info & button body */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-white group-hover:text-[#FE2C55] transition">{temp.title}</h3>
                        <p className="text-[11px] text-[#8888AA] leading-normal line-clamp-2 h-[34px]">
                          {temp.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartWithTemplate(temp)}
                        className="w-full py-2 bg-[#FE2C55] hover:bg-[#FE1E4E] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5"
                      >
                        Usar Template Estético
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STEPPED ASSISTANT SCREEN */}
      {step > 0 && selectedTemplate && (
        <div className="space-y-5 animate-fade-in">
          
          {/* STEP PROGRESS INDICATOR */}
          <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8888AA]">Formato ativo:</span>
              <span className="px-2.5 py-1 bg-[#FE2C55]/10 border border-[#FE2C55]/20 text-[#FE2C55] text-[10px] font-black rounded-lg">
                {selectedTemplate.title}
              </span>
            </div>

            {/* Steps bar */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((stepIdx) => {
                const isCompleted = step > stepIdx;
                const isActive = step === stepIdx;
                return (
                  <React.Fragment key={stepIdx}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center border transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-[#030307]' 
                          : isActive 
                            ? 'bg-[#FE2C55] border-[#FE2C55] text-white scale-110 shadow-[0_0_12px_rgba(254,44,85,0.2)]' 
                            : 'bg-zinc-950 border-[#1E1E2E] text-[#8888AA]'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[4]" /> : stepIdx}
                      </div>
                      <span className={`text-[10px] font-black uppercase text-zinc-500 hidden sm:inline ${isActive ? 'text-white' : ''}`}>
                        {stepIdx === 1 ? 'Gancho' : stepIdx === 2 ? 'Avatar' : stepIdx === 3 ? 'Cenário' : 'Prompt'}
                      </span>
                    </div>
                    {stepIdx < 4 && <div className={`w-8 h-0.5 rounded-full ${step > stepIdx ? 'bg-emerald-500' : 'bg-[#1E1E2E]'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* STEP 1: GANCHO / HOOK SELECTION */}
          {step === 1 && (
            <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block">PASSO 1 — LOCUÇÃO E GANCHO DE RETENÇÃO</span>
                <h3 className="text-base font-black text-white">Escolha a Fração de Gancho do Vídeo</h3>
                <p className="text-xs text-[#8888AA]">Frases projetadas especificamente para parar o scroll do usuário no TikTok.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                {hooks.filter(h => h.template_category === selectedTemplate.category).length === 0 ? (
                  <div className="col-span-2 p-10 bg-[#030307] border border-[#1E1E2E] text-center rounded-xl text-xs font-bold text-[#8888AA]">
                    Nenhum gancho configurado especificamente para esta categoria. Cadastre ganchos no Admin.
                  </div>
                ) : (
                  hooks.filter(h => h.template_category === selectedTemplate.category).map((hk) => {
                    const isSelected = selectedHook?.id === hk.id;
                    return (
                      <button
                        key={hk.id}
                        type="button"
                        onClick={() => setSelectedHook(hk)}
                        className={`text-left p-4.5 bg-[#030307] border rounded-2xl flex flex-col justify-between gap-3 transition-all relative ${
                          isSelected 
                            ? 'border-[#FE2C55] ring-1 ring-[#FE2C55] scale-[0.99] bg-[#FE2C55]/5' 
                            : 'border-[#1E1E2E] hover:border-zinc-700'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#FE2C55] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                          </div>
                        )}
                        <div className="space-y-1 pr-6">
                          <span className="text-xs font-black text-white">{hk.hook_text}</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-[8px] font-black text-[#8888AA] uppercase border border-zinc-900 block w-max">
                            {hk.template_category}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-wider text-zinc-500 block mb-0.5">Texto falado no Flow:</span>
                          <p className="text-[11px] text-emerald-400 font-mono italic leading-relaxed">
                            "{hk.example_line}"
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STEP 2: AVATAR SELECTION */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {allAvatars.map((av) => {
                  const isSelected = selectedAvatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`group text-left bg-[#0A0A0F] border rounded-2xl overflow-hidden transition-all duration-300 relative ${
                        isSelected 
                          ? 'ring-2 ring-[#FE1E4E] border-[#FE1E4E] scale-[0.98]' 
                          : 'border-[#1E1E2E] hover:border-[#25F4EE]/40'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2_5 right-2_5 z-10 w-4 h-4 rounded-full bg-[#FE2C55] flex items-center justify-center border border-white/20">
                          <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                        </div>
                      )}

                      <div className="relative h-28 xs:h-36 sm:h-44 overflow-hidden bg-zinc-900">
                        <img 
                          src={av.imageUrl} 
                          alt={av.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-2.5 pt-6 flex flex-col justify-end">
                          <span className="text-xs font-black text-white">{av.name}</span>
                          <span className="text-[8px] font-bold text-[#8888AA] uppercase">{av.gender}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-[#030307] border-t border-[#1E1E2E]/60">
                        <p className="text-[9px] text-[#A0A0C0] line-clamp-2 leading-relaxed h-[24px]">
                          {av.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CENARIO SELECTION */}
          {step === 3 && (
            <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block font-sans">PASSO 3 — CENÁRIO / POSE DO APRESENTADOR</span>
                <h3 className="text-base font-black text-white">Escolha o Cenário e Ângulo</h3>
                <p className="text-xs text-[#8888AA]">Selecione onde o apresentador virtual estará posicionado durante a locução do gancho.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto">
                {SCENARIOS_PRESETS.map((sc) => {
                  const isSelected = selectedScenarioId === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(sc.id)}
                      className={`group text-left bg-[#030307] border rounded-2xl overflow-hidden transition-all duration-300 relative ${
                        isSelected 
                          ? 'ring-2 ring-[#FE1E4E] border-[#FE1E4E] scale-[0.98]' 
                          : 'border-[#1E1E2E] hover:border-[#25F4EE]/40'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10 w-4 h-4 rounded-full bg-[#FE2C55] flex items-center justify-center border border-white/20">
                          <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
                        </div>
                      )}

                      <div className="relative h-20 sm:h-28 overflow-hidden bg-zinc-900">
                        <img 
                          src={sc.imageUrl} 
                          alt={sc.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-2 pt-5 flex flex-col justify-end">
                          <span className="text-[10px] sm:text-xs font-black text-white leading-tight">{sc.name}</span>
                          <span className="text-[7px] sm:text-[8px] font-bold text-[#8888AA] uppercase">{sc.type}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Angle / Pose slide selector */}
              <div className="space-y-2 bg-[#030307] border border-[#1E1E2E] p-3.5 rounded-xl font-sans">
                <span className="text-[9px] text-[#FE2C55] font-black uppercase tracking-widest block">Pose do Apresentador</span>
                <div className="flex flex-wrap gap-1.5">
                  {['De Frente', 'De Lado', 'Ângulo 3/4', 'Sentado(a)', 'Andando'].map((pose) => (
                    <button
                      key={pose}
                      type="button"
                      onClick={() => setPoseSelected(pose)}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg border transition-all ${
                        poseSelected === pose 
                        ? 'bg-[#FE2C55] border-[#FE2C55] text-white' 
                        : 'bg-zinc-950 border-[#1E1E2E] text-[#8888AA] hover:text-white'
                      }`}
                    >
                      {pose}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROMPT GENERATION */}
          {step === 4 && (
            <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-5 rounded-2xl space-y-4 animate-fade-in">
              <div className="space-y-0.5">
                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GERAÇÃO DE ROTEIRO COMPLETADA COM SUCESSO
                </span>
                <h3 className="text-base font-black text-white">Pronto para Geração no Flow!</h3>
                <p className="text-xs text-[#8888AA]">Copie o prompt parametrizado de alta fidelidade abaixo e leve-o ao terminal Flow para fabricar seu criativo viral.</p>
              </div>

              {/* Prompt box */}
              <div className="relative">
                <textarea
                  readOnly
                  value={generatePromptText()}
                  className="w-full bg-[#030307] border border-[#1E1E2E] p-4 rounded-2xl text-xs text-white h-72 resize-none font-mono leading-relaxed focus:outline-none focus:ring-0"
                />
                
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyPrompt}
                    className="px-4 py-2 bg-[#fe2c55] hover:bg-[#FE1E4E] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-black/60"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white stroke-[4]" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar Prompt Completo
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-2xl flex items-start gap-3">
                <Zap className="w-5 h-5 text-[#FE2C55] shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white">Como renderizar este vídeo?</h4>
                  <ol className="text-xs text-[#8888AA] list-decimal list-inside space-y-1">
                    <li>Copie o prompt estético acima clicando no botão vermelho.</li>
                    <li>
                      Vá até o painel central do <strong>Flow</strong> e upe a imagem do avatar de referência escolhida no Passo 2.
                    </li>
                    <li>Insira o nosso prompt no campo de engenharia de instruções e execute a renderização.</li>
                    <li>Em poucos minutos seu vídeo dublado com sincronia labial impecável estará disponível!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* BACK AND NEXT NAVIGATION */}
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-zinc-950 border border-[#1E1E2E] hover:bg-zinc-900 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Anterior
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-[#FE2C55] hover:bg-[#FE1E4E] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 ml-auto"
              >
                Próximo Passo
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-[#25F4EE] hover:bg-[#25F4EE]/85 text-[#050510] rounded-xl text-xs font-black transition flex items-center gap-1.5 ml-auto"
              >
                Criar Mais Vídeos
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
