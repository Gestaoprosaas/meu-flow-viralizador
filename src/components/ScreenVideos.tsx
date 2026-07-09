import React, { useState, useEffect } from 'react';
import { LazyVideo } from './LazyVideo';
import { Target, Sparkles, Video, Volume2, Music, Check, RefreshCw, Download, ChevronRight, Play, FileText, ArrowRight } from 'lucide-react';
import { VideoGeneration, ScriptGeneration } from '../types';

interface ScreenVideosProps {
  videos: VideoGeneration[];
  scripts: ScriptGeneration[];
  onVideoGenerated: (newVid: VideoGeneration) => void;
  initialPreFillState?: any;
}

export default function ScreenVideos({
  videos,
  scripts,
  onVideoGenerated,
  initialPreFillState
}: ScreenVideosProps) {
  const [step, setStep] = useState(1);
  const [scriptText, setScriptText] = useState(initialPreFillState?.preFilledScriptText || '');
  const [voice, setVoice] = useState('Masculina BR (ElevenLabs Marcus)');
  const [style, setStyle] = useState('Dinâmico');
  const [bgMusic, setBgMusic] = useState('Energética');
  const [subtitles, setSubtitles] = useState(true);

  // Loading animation controls
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [createdVideo, setCreatedVideo] = useState<VideoGeneration | null>(null);

  const generationProgressSteps = [
    "Sintetizando locução com Inteligência Artificial ElevenLabs...",
    "Explorando cenas de ganchos virais...",
    "Renderizando cortes cinemáticos de alta retenção no Kling AI...",
    "Mixando áudio, trilha sonora e aplicando legendas animadas automáticas...",
    "Finalizado com sucesso!"
  ];

  // Auto load script text if user transitions with pre-filled script state
  useEffect(() => {
    if (initialPreFillState?.preFilledScriptText) {
      setScriptText(initialPreFillState.preFilledScriptText);
    }
  }, [initialPreFillState]);

  const loadMostRecentScript = () => {
    if (scripts.length > 0) {
      setScriptText(scripts[0].script_body);
    }
  };

  const handleGenerate = async () => {
    if (!scriptText) return;
    setIsGenerating(true);
    setProgressStep(0);
    setStep(3);

    // simulated step processing intervals
    const progressInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < generationProgressSteps.length - 2) return prev + 1;
        clearInterval(progressInterval);
        return prev;
      });
    }, 1800);

    try {
      const response = await fetch('/api/gerar-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script_text: scriptText,
          voice,
          visual_style: style,
          bg_music: bgMusic,
          subtitles,
          script_id: initialPreFillState?.script_id || (scripts[0]?.id || null)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado na renderização.");
      }

      // Finish step polling visual lag
      setTimeout(() => {
        clearInterval(progressInterval);
        setProgressStep(4);
        onVideoGenerated(data);
        setCreatedVideo(data);
      }, 7500);

    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in">
      
      {/* Header Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Video className="w-6 h-6 text-[#10B981]" />
          Criatório de Vídeos Viral IA
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Gere narração brasileira ultra realista, sincronize transições e monte vídeos virais prontos para atrair o público.</p>
      </div>

      {/* stepper menu indicator */}
      <div className="grid grid-cols-3 max-w-xl bg-[#111118] border border-[#1E1E2E] rounded-xl p-1.5 text-xs text-center font-bold">
        <button
          onClick={() => !isGenerating && setStep(1)}
          className={`py-1.5 rounded-lg transition ${
            step === 1 ? 'bg-[#1E1E2E] text-[#10B981]' : 'text-[#8888AA]'
          }`}
        >
          1. Roteiro e Texto
        </button>
        <button
          onClick={() => !isGenerating && scriptText && setStep(2)}
          disabled={!scriptText}
          className={`py-1.5 rounded-lg transition ${
            step === 2 ? 'bg-[#1E1E2E] text-[#10B981]' : 'text-[#8888AA] disabled:opacity-40'
          }`}
        >
          2. Voz e Trilhas
        </button>
        <button
          disabled
          className={`py-1.5 rounded-lg transition ${
            step === 3 ? 'bg-[#1E1E2E] text-[#10B981]' : 'text-[#8888AA]'
          }`}
        >
          3. Renderizando
        </button>
      </div>

      {/* Step Contents */}

      {/* STEP 1: Script Input */}
      {step === 1 && (
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#1E1E2E] pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#10B981]" />
              Roteiro de Narrador
            </h3>
            {scripts.length > 0 && (
              <button
                onClick={loadMostRecentScript}
                className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
              >
                Importar Roteiro Recente
              </button>
            )}
          </div>

          <div className="space-y-4">
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              rows={8}
              placeholder="Cole seu roteiro detalhado aqui. Adicione marcações de pausas [PAUSA] ou exibições de produto [MOSTRAR] para coordenar o ritmo da voz e cenas."
              className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs sm:text-sm text-[#F0F0FF] focus:border-[#10B981] outline-none resize-none"
            />

            <div className="flex justify-between items-center text-xs text-[#8888AA]">
              <span>Contagem de Caracteres: {scriptText.length}</span>
              <span>Duração estimada: {Math.max(5, Math.floor(scriptText.length / 14))}s</span>
            </div>

            <div className="flex justify-end">
              <button
                disabled={!scriptText}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1 transition disabled:opacity-40"
              >
                Avançar Configurações
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Configure Narration / Media styles */}
      {step === 2 && (
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2">Configurações de Áudio e Visual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: ElevenLabs Narrator selectors */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />
                  Locutor Narrador (ElevenLabs)
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] p-2.5 rounded-lg text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#10B981]"
                >
                  <option value="Masculina BR (ElevenLabs Marcus)">Masculina BR - Marcus (Vendedor Animado) 🔥</option>
                  <option value="Feminina BR (ElevenLabs Ana)">Feminina BR - Ana (Estética e Skincare) ✨</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#10B981]" />
                  Música de Fundo
                </label>
                <select
                  value={bgMusic}
                  onChange={(e) => setBgMusic(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] p-2.5 rounded-lg text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#10B981]"
                >
                  <option value="Energética">Energética (Forte para Ganchos Rápidos)</option>
                  <option value="Suave">Suave (Aconchegante e Relaxante)</option>
                  <option value="Emocional">Emocional (De Perto, Sincero)</option>
                  <option value="Sem música">Sem Música de Fundo</option>
                </select>
              </div>
            </div>

            {/* Right side: Visual and text styling */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] block">Pacing de Cenas Visual</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] p-2.5 rounded-lg text-xs sm:text-sm text-[#F0F0FF] outline-none focus:border-[#10B981]"
                >
                  <option value="Dinâmico">Dinâmico (Cortes rápidos a cada 2s + CapCut Zoom)</option>
                  <option value="Minimalista">Estético Minimalista (Transições Limpas Suaves)</option>
                  <option value="Colorido">Colorido Neon (TikTok Vibrante)</option>
                </select>
              </div>

              {/* Subtitles flag toggle */}
              <div className="flex items-center justify-between p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg">
                <div>
                  <span className="text-xs font-bold text-white block">Adicionar Legendas Animadas?</span>
                  <span className="text-[10px] text-[#8888AA]">Transcrições dinâmicas das falas com estilo TikTok</span>
                </div>
                <input
                  type="checkbox"
                  checked={subtitles}
                  onChange={(e) => setSubtitles(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1E1E2E] text-[#10B981] focus:ring-[#10B981]"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-[#8888AA] text-xs sm:text-sm rounded-lg"
            >
              Voltar ao Roteiro
            </button>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#06B6D4] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              ✨ Renderizar Vídeo Final
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Rendering Simulator Progress or Output Player */}
      {step === 3 && (
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-6">
          {progressStep < 4 ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <RefreshCw className="w-12 h-12 text-[#10B981] animate-spin" />
                <Video className="w-5 h-5 text-[#06B6D4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Misturador de Criativos Ativado</h3>
                <p className="text-xs text-[#8888AA] max-w-sm">{generationProgressSteps[progressStep]}</p>
              </div>

              {/* Progress Bar mockup */}
              <div className="w-full max-w-sm bg-[#0A0A0F] h-1.5 rounded-full overflow-hidden border border-[#1E1E2E]">
                <div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] transition-all duration-1000"
                  style={{ width: `${(progressStep + 1) * 20}%` }}
                />
              </div>
            </div>
          ) : (
            /* Finished Output Player State */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column Player */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative rounded-2xl overflow-hidden border border-[#1E1E2E] bg-black shadow-lg aspect-[9/16] w-[220px] sm:w-[250px]">
                  {createdVideo ? (
                    <LazyVideo
                      src={createdVideo.video_url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-white">Carregando player...</div>
                  )}
                </div>
              </div>

              {/* Right Column details */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#10B981]/20 border border-[#10B981]/30 rounded-full text-[10px] text-[#10B981] font-extrabold uppercase">
                  Vídeo Pronto
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Criativo Gerado com Sucesso! 🚀</h3>
                  <p className="text-xs text-[#8888AA]">Locução sintetizada rítmica para prender o público nos primeiros segundos.</p>
                </div>

                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-3 text-xs space-y-2">
                  <div className="flex justify-between border-b border-[#1E1E2E] pb-1.5">
                    <span>Motor de renderização:</span>
                    <strong className="text-white">Kling AI Pro + ElevenLabs NLP</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#1E1E2E] pb-1.5">
                    <span>Voz:</span>
                    <strong className="text-[#10B981]">{voice}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <strong className="text-white">
                      {createdVideo?.duration_seconds || 15} segundos
                    </strong>
                  </div>
                </div>

                {/* CTA operations buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={createdVideo?.video_url}
                    target="_blank"
                    className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    Baixar Vídeo MP4
                  </a>
                  <button
                    onClick={() => {
                      setStep(1);
                      setIsGenerating(false);
                      setCreatedVideo(null);
                    }}
                    className="px-5 py-2.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white text-xs font-bold rounded-xl text-center"
                  >
                    Gerar Novo Vídeo
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}
