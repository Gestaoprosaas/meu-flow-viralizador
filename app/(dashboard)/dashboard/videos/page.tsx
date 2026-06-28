"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Video, 
  History, 
  Play, 
  Download, 
  Music, 
  Volume2, 
  Languages, 
  Film, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  RefreshCw,
  FileText,
  Import,
  Smartphone
} from 'lucide-react';
import UpgradeModal from '../../../../components/dashboard/UpgradeModal';
import { useCredits } from '../../../../hooks/useCredits';
import { createClient } from '../../../../lib/supabase/client';

export default function VideosPage() {
  const router = useRouter();
  const { credits, refetch: refetchCredits } = useCredits();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [scriptText, setScriptText] = useState('');
  const [voice, setVoice] = useState('Rachel');
  const [style, setStyle] = useState('Cinematográfico');
  const [bgMusic, setBgMusic] = useState('None');
  const [subtitles, setSubtitles] = useState(true);

  // States for generation & polling
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'processing' | 'completed' | 'failed' | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Loading phase messages to rotate
  const [progressMessage, setProgressMessage] = useState('Enfileirando projeto com inteligência artificial...');
  const [progressPercent, setProgressPercent] = useState(10);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const loadingMessages = [
    { text: 'Conectando ao sintetizador ElevenLabs NLP...', pct: 25 },
    { text: 'Sintetizando locução em português (BR) de alta retenção...', pct: 40 },
    { text: 'Iniciando inteligência geradora Kling AI...', pct: 55 },
    { text: 'Renderizando cortes automáticos de alta fidelidade visual...', pct: 70 },
    { text: 'Coordenando trilha sonora e sobrepondo legendas estéticas...', pct: 90 },
    { text: 'Sincronizando arquivo de mídia final...', pct: 98 }
  ];

  // History states
  const [scriptsHistory, setScriptsHistory] = useState<any[]>([]);
  const [videosHistory, setVideosHistory] = useState<any[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  // Fetch script history and past videos
  const fetchLocalHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Script history
      const { data: scripts, error: scriptsErr } = await supabase
        .from('script_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (scripts && !scriptsErr) {
        setScriptsHistory(scripts);
      }

      // Past videos history
      const { data: videos, error: videosErr } = await supabase
        .from('video_generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (videos && !videosErr) {
        setVideosHistory(videos);
      }
    } catch (err) {
      console.error('Falha ao obter histórico local do banco:', err);
    }
  };

  useEffect(() => {
    fetchLocalHistory();
  }, [supabase]);

  // Toast trigger
  const triggerToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  // Start processing background delay messages
  const startProgressRotation = () => {
    let msgIndex = 0;
    setProgressPercent(15);
    setProgressMessage('Contatando servidores centrais...');

    progressTimerRef.current = setInterval(() => {
      if (msgIndex < loadingMessages.length) {
        setProgressMessage(loadingMessages[msgIndex].text);
        setProgressPercent(loadingMessages[msgIndex].pct);
        msgIndex++;
      }
    }, 2500);
  };

  // Poll job status every 5 seconds as requested!
  const startPollingStatus = (targetJobId: string) => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);

    pollingTimerRef.current = setInterval(async () => {
      try {
        console.log(`Polling job ${targetJobId} no Supabase...`);
        const { data: job, error } = await supabase
          .from('video_generations')
          .select('*')
          .eq('id', targetJobId)
          .single();

        if (error) {
          console.error('Erro ao consultar job de vídeo:', error);
          return;
        }

        if (job) {
          if (job.status === 'completed') {
            clearInterval(pollingTimerRef.current!);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);

            setGenerationStatus('completed');
            setVideoUrl(job.video_url);
            setThumbnailUrl(job.thumbnail_url);
            setProgressPercent(100);
            setIsGenerating(false);

            triggerToast('Seu vídeo foi renderizado e sincronizado com maestria! 🚀', 'success');
            refetchCredits();
            fetchLocalHistory();
          } else if (job.status === 'failed') {
            clearInterval(pollingTimerRef.current!);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);

            setGenerationStatus('failed');
            setErrorMessage('A rede neural Kling encontrou um entrave ao compilar seu visual.');
            setIsGenerating(false);
            triggerToast('Falha na geração do vídeo.', 'error');
            refetchCredits();
          }
        }
      } catch (pollErr) {
        console.error('Erro ao rodar polling de status de vídeo:', pollErr);
      }
    }, 5000); // Poll exactly every 5 seconds!
  };

  // Start generation handler
  const handleGenerateVideo = async () => {
    if (!scriptText.trim()) {
      triggerToast('Insira o roteiro do locutor para iniciar.', 'error');
      return;
    }

    const hasVideoCredits = credits && (credits.plan === 'agency' || (credits.videoLimit - credits.videoUsed) > 0);
    if (!hasVideoCredits) {
      setUpgradeOpen(true);
      return;
    }

    try {
      setIsGenerating(true);
      setStep(3);
      setGenerationStatus('processing');
      setErrorMessage(null);
      setVideoUrl(null);

      // Start messages
      startProgressRotation();

      const response = await fetch('/api/gerar-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText,
          voiceId: voice,
          visualStyle: style,
          musicBackground: bgMusic,
          subtitlesEnabled: subtitles
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Erro na requisição para gerar vídeo.');
      }

      setJobId(resData.jobId);
      
      // Start polling status as requested!
      startPollingStatus(resData.jobId);

    } catch (err: any) {
      console.error(err);
      setGenerationStatus('failed');
      setErrorMessage(err.message || 'Houve um erro técnico de inicialização.');
      setIsGenerating(false);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    }
  };

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const selectHistoryScript = (text: string) => {
    setScriptText(text);
    setShowHistoryModal(false);
    triggerToast('Roteiro importado com sucesso.', 'success');
  };

  // Calculate remaining video credits
  const videoCreditsLeft = credits ? Math.max(0, credits.videoLimit - credits.videoUsed) : 0;

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-[#F0F0FF]">
      
      {/* Toast Alert */}
      {toast.message && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
            : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E2E] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-[#10B981]" />
            Criatório de Vídeos Viral IA
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA] mt-1">
            Gere narrações com realismo extremo (ElevenLabs), ordene cenários visuais (Kling AI) e monte criativos lucrativos de alta retenção.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 py-2.5 flex items-center gap-3">
            <div>
              <span className="text-[10px] text-[#8888AA] font-bold block uppercase tracking-wider">Créditos de Vídeo</span>
              <strong className="text-sm text-[#10B981] font-black">{videoCreditsLeft} Disponíveis</strong>
            </div>
            {videoCreditsLeft === 0 && (
              <button
                onClick={() => setUpgradeOpen(true)}
                className="px-2.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STEPPER BAR */}
      <div className="grid grid-cols-3 max-w-xl bg-[#111118] border border-[#1E1E2E] rounded-2xl p-1.5 text-[11px] sm:text-xs text-center font-bold">
        <button
          onClick={() => !isGenerating && setStep(1)}
          className={`py-2 rounded-xl transition ${
            step === 1 ? 'bg-[#1E1E2E] text-[#10B981] shadow-sm' : 'text-[#8888AA] hover:text-[#F0F0FF]'
          }`}
        >
          1. Roteiro & Texto
        </button>
        <button
          onClick={() => !isGenerating && scriptText.trim() && setStep(2)}
          disabled={!scriptText.trim()}
          className={`py-2 rounded-xl transition ${
            step === 2 ? 'bg-[#1E1E2E] text-[#10B981] shadow-sm' : 'text-[#8888AA] hover:text-[#F0F0FF] disabled:opacity-40'
          }`}
        >
          2. Voz & Trilha
        </button>
        <button
          disabled
          className={`py-2 rounded-xl transition ${
            step === 3 ? 'bg-[#1E1E2E] text-[#10B981] shadow-sm' : 'text-[#8888AA]'
          }`}
        >
          3. Processando
        </button>
      </div>

      {/* CORE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Flow step contents */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEP 1: Script Input */}
          {step === 1 && (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#1E1E2E] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#10B981]" />
                  Escreva ou Importe o Roteiro
                </h3>
                {scriptsHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-1 bg-[#10B981]/10 border border-[#10B981]/25 px-2.5 py-1 rounded-xl transition"
                  >
                    <Import className="w-3.5 h-3.5" />
                    Importar Histórico
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  rows={9}
                  placeholder="Cole ou redija o roteiro corrido aqui. Use marcações opcionais como [PAUSA] ou [NARRADOR ANIMADO] para estruturar um roteiro premium. Ideal de 200 a 800 caracteres para melhor sincronização estética do vídeo."
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 text-xs sm:text-sm text-[#F0F0FF] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none resize-none transition"
                />

                <div className="flex justify-between items-center text-xs text-[#8888AA]">
                  <span>Caracteres: <strong className="text-white">{scriptText.length}</strong></span>
                  <span>Tempo Locução Estimado: <strong className="text-white">{Math.max(5, Math.floor(scriptText.length / 14))}s</strong></span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={!scriptText.trim()}
                    onClick={() => setStep(2)}
                    className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2.5 transition shadow-lg shadow-[#10B981]/10 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Prosseguir Configurações
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Configure Voices and Soundtrack */}
          {step === 2 && (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-3 flex items-center gap-2">
                <SlidersIcon className="w-4 h-4 text-[#10B981]" />
                Personalização de Áudio e Coberturas Estéticas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Voice selecting elements */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8888AA] flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#10B981]" />
                      Locução IA (ElevenLabs)
                    </label>
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#10B981] transition"
                    >
                      <option value="Rachel">Feminina: Rachel (Vendedora Skincare & Moda) ✨</option>
                      <option value="Bella">Feminina: Bella (Estética e Beleza Externa) 💄</option>
                      <option value="Adam">Masculina: Adam (Empolgante & Ganchos Fortes)  🔥</option>
                      <option value="Antoni">Masculina: Antoni (Narrador de Curiosidades e Tech) 🎙️</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8888AA] flex items-center gap-2">
                      <Music className="w-4 h-4 text-[#10B981]" />
                      Trilha Musical de Fundo
                    </label>
                    <select
                      value={bgMusic}
                      onChange={(e) => setBgMusic(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#10B981] transition"
                    >
                      <option value="None">Silenciar (Sem trilha de fundo)</option>
                      <option value="Energética">Energética (Batida eletrônica para conversões rápidas)</option>
                      <option value="Suave">Suave (Acústicos calmos e lo-fi de fundo)</option>
                      <option value="Emocional">Emocional (Sinfonias crescentes para motivar)</option>
                    </select>
                  </div>
                </div>

                {/* Cover Styles selectors */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8888AA] flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#10B981]" />
                      Estilo do Filtro Visual (Kling AI)
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-xl text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#10B981] transition"
                    >
                      <option value="Cinematográfico">Cinematográfico 4K (Cores profundas e iluminação premium)</option>
                      <option value="Realista">Realista Comercial (Filmagem estética do dia a dia)</option>
                      <option value="Anime">Anime (Vibrante estilo desenho animado)</option>
                      <option value="3D Render">Estilo Render 3D (Texturas refinadas futuristas)</option>
                    </select>
                  </div>

                  {/* Subtitles flag */}
                  <div className="flex items-center justify-between p-4 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Adicionar Legendas TikTok?</span>
                      <span className="text-[10px] text-[#8888AA]">Transcrições dinâmicas das falas com zoom estético</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subtitles}
                        onChange={(e) => setSubtitles(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-[#1E1E2E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10B981]"></div>
                    </label>
                  </div>
                </div>

              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#1E1E2E]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8888AA] hover:text-white text-xs sm:text-sm font-semibold rounded-xl transition"
                >
                  Voltar ao Roteiro
                </button>

                <button
                  onClick={handleGenerateVideo}
                  className="px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#06B6D4] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-[#10B981]/25"
                >
                  <Sparkles className="w-4 h-4" />
                  Gerar Vídeo Viral IA (-1 Crédito)
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Generation results and status screen */}
          {step === 3 && (
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 space-y-6 shadow-sm">
              
              {generationStatus === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <RefreshCw className="w-14 h-14 text-[#10B981] animate-spin" />
                    <Video className="w-6 h-6 text-[#06B6D4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  <div className="text-center space-y-2 max-w-sm">
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Loader2 className="w-4 h-4 text-[#10B981] animate-spin" />
                      Misturador Neural em Alta
                    </h3>
                    <p className="text-xs text-[#8888AA] leading-normal">{progressMessage}</p>
                  </div>

                  {/* Aesthetic progress meter bar */}
                  <div className="w-full max-w-md bg-[#0A0A0F] h-2 rounded-full overflow-hidden border border-[#1E1E2E]">
                    <div 
                      className="h-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-[#8888AA] flex items-center gap-1.5 bg-[#0D0D15] px-3 py-1.5 rounded-full border border-[#1E1E2E]">
                    <Smartphone className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Processando na nossa GPU de renderização rápida.</span>
                  </div>
                </div>
              )}

              {generationStatus === 'completed' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    
                    {/* Left screen vertical mobile size video player */}
                    <div className="w-full max-w-[250px] flex-shrink-0 flex justify-center">
                      <div className="relative rounded-2xl overflow-hidden border border-[#1E1E2E] bg-black shadow-2xl aspect-[9/16] w-full">
                        {videoUrl ? (
                          <video 
                            src={videoUrl}
                            poster={thumbnailUrl || undefined}
                            controls
                            autoPlay
                            loop
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-[#8888AA]">Carregando player...</div>
                        )}
                      </div>
                    </div>

                    {/* Right text layout details */}
                    <div className="flex-1 space-y-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/15 border border-[#10B981]/25 rounded-full text-[10px] text-[#10B981] font-extrabold uppercase tracking-wider">
                        Criativo Viral Completado!
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white">Criativo Final Pronto para Download</h3>
                        <p className="text-xs text-[#8888AA] leading-relaxed">
                          Sua narração foi mesclada e sincronizada com as melhores transições da inteligência artificial. Pronto para postar no TikTok Shop ou Instagram Reels!
                        </p>
                      </div>

                      <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 text-xs space-y-2">
                        <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                          <span className="text-[#8888AA]">Motor Gerencial:</span>
                          <strong className="text-white">Kling AI + ElevenLabs Voice</strong>
                        </div>
                        <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                          <span className="text-[#8888AA]">Estilo Cobertura:</span>
                          <strong className="text-white">{style}</strong>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-[#8888AA]">Configuração Áudio:</span>
                          <strong className="text-[#10B981]">Voz ({voice}) + Música ({bgMusic})</strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <a 
                          href={videoUrl || undefined}
                          download="criativo_viral_forge.mp4"
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition hover:scale-105 shadow-md shadow-[#10B981]/15"
                        >
                          <Download className="w-4 h-4" />
                          Baixar Vídeo MP4
                        </a>

                        <button
                          onClick={() => {
                            setStep(1);
                            setIsGenerating(false);
                            setGenerationStatus(null);
                          }}
                          className="px-4 py-3 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white font-semibold text-xs sm:text-sm rounded-xl transition"
                        >
                          Produzir Novo Vídeo
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {generationStatus === 'failed' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <h3 className="text-sm font-bold text-white">Falha ao construir criativo viral</h3>
                    <p className="text-xs text-[#8888AA] leading-relaxed">
                      {errorMessage || 'Incompatibilidade na coordenação de voz e transições de tela.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStep(1);
                      setIsGenerating(false);
                      setGenerationStatus(null);
                    }}
                    className="mt-2 px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white text-xs font-semibold rounded-xl transition"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right column: Historical completed videos list */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-[#10B981]" />
              Meus Vídeos Sincronizados
            </h3>

            {videosHistory.length === 0 ? (
              <div className="py-8 text-center bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl flex flex-col items-center justify-center p-4">
                <Video className="w-6 h-6 text-[#1E1E2E] mb-2" />
                <p className="text-[11px] text-[#8888AA]">Nenhum vídeo enfileirado para o perfil ainda.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {videosHistory.map((video) => (
                  <div 
                    key={video.id} 
                    className="bg-[#0A0A0F] border border-[#1E1E2E] hover:border-[#10B981]/30 rounded-xl p-3 flex gap-3 transition group relative"
                  >
                    <div className="relative w-12 h-16 bg-[#161622] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-[#1E1E2E]">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt="thumbnail" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Video className="w-4 h-4 text-[#8888AA]" />
                      )}
                      
                      {video.status === 'completed' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                          <Play className="w-4 h-4 text-white fill-white cursor-pointer" onClick={() => {
                            setStep(3);
                            setGenerationStatus('completed');
                            setVideoUrl(video.video_url);
                            setThumbnailUrl(video.thumbnail_url);
                            setJobId(video.id);
                          }} />
                        </div>
                      )}

                      {video.status === 'processing' && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                          <RefreshCw className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <span className="text-[9px] text-[#8888AA] block uppercase font-bold">Rendimento Kling</span>
                        <h4 className="text-xs font-bold text-white truncate my-0.5">Criativo #{video.id.substring(0, 8)}</h4>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-black ${
                          video.status === 'completed' ? 'text-[#10B981]' : video.status === 'failed' ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {video.status === 'completed' ? 'CONCLUÍDO' : video.status === 'failed' ? 'FALHADO' : 'GERANDO...'}
                        </span>
                        
                        {video.status === 'completed' && (
                          <a 
                            href={video.video_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[#10B981] hover:underline font-bold"
                          >
                            Download
                          </a>
                        )}

                        {video.status === 'processing' && (
                          <button
                            onClick={() => {
                              setStep(3);
                              setGenerationStatus('processing');
                              setJobId(video.id);
                              startPollingStatus(video.id);
                            }}
                            className="text-[#10B981] hover:underline"
                          >
                            Acompanhar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* HISTORICAL SCRIPT SELECT MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden relative shadow-2xl animate-scale-in">
            <div className="p-4 border-b border-[#1E1E2E] flex justify-between items-center">
              <h3 className="font-extrabold text-[#F0F0FF] text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-[#10B981]" />
                Selecione um Roteiro Gerado
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-xs text-[#8888AA] hover:text-white font-bold bg-[#1E1E2E] px-2 py-1 rounded-lg"
              >
                Fechar
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {scriptsHistory.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8888AA]">Nenhum roteiro disponível histórico.</div>
              ) : (
                scriptsHistory.map((script) => (
                  <div 
                    key={script.id}
                    onClick={() => selectHistoryScript(script.script_body)}
                    className="bg-[#0A0A0F] hover:bg-[#111118] border border-[#1E1E2E] hover:border-[#10B981]/40 rounded-xl p-3 cursor-pointer transition text-left space-y-2 group"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#10B981] font-bold uppercase">{script.product_name}</span>
                      <span className="text-[#8888AA]">{new Date(script.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-[11px] text-[#8888AA] line-clamp-3 group-hover:text-white transition">
                      {script.script_body}
                    </p>
                    <div className="text-[10px] text-[#10B981] font-bold text-right group-hover:underline">
                      Selecionar Roteiro →
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {upgradeOpen && (
        <UpgradeModal
          currentPlan={credits?.plan || 'free'}
          onUpgradeComplete={() => {
            setUpgradeOpen(false);
            refetchCredits();
          }}
          onClose={() => setUpgradeOpen(false)}
        />
      )}

    </div>
  );
}

// Simple dynamic inline slider icon replacement if needed
function SlidersIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}
