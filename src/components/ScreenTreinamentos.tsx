import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Play,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Video,
  Lock,
  Sparkles,
  RefreshCw,
  Award
} from 'lucide-react';
import { Profile } from '../types';

interface Module {
  id: string;
  title: string;
  order_position: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id?: string;
  order_position: number;
  duration: string;
  is_published: boolean;
  is_premium: boolean;
}

interface ScreenTreinamentosProps {
  profile?: Profile;
  onNavigate?: (path: string) => void;
}

export default function ScreenTreinamentos({ profile, onNavigate }: ScreenTreinamentosProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active playing lesson state
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  
  // Accordion of modules expanded states: module ID -> boolean
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // User Plan Gating calculation helper
  const userPlan = (profile?.plan || 'free').toLowerCase();
  const hasPremiumAccess = ['starter', 'pro', 'agency'].includes(userPlan);

  // Fetch courses data on mount
  const fetchCourseData = async (shouldPreserveCurrentLesson = false) => {
    try {
      if (!shouldPreserveCurrentLesson) {
        setLoading(true);
      }
      setError(null);

      const [resModules, resLessons] = await Promise.all([
        fetch('/api/course-modules'),
        fetch('/api/course-lessons')
      ]);

      if (!resModules.ok || !resLessons.ok) {
        throw new Error("Erro ao consultar a base de cursos no servidor.");
      }

      const mData: Module[] = await resModules.json();
      const lData: Lesson[] = await resLessons.json();

      setModules(mData);
      setLessons(lData);

      // Default accordion state: expand all modules initially
      const initialExp: Record<string, boolean> = {};
      mData.forEach(m => {
        initialExp[m.id] = true;
      });
      setExpandedModules(prev => ({ ...initialExp, ...prev }));

      // Only published lessons are visible to normal users
      const visibleLessons = lData
        .filter(l => l.is_published)
        .sort((a, b) => a.order_position - b.order_position);

      if (shouldPreserveCurrentLesson && currentLesson) {
        const found = lData.find(l => l.id === currentLesson.id);
        if (found) {
          setCurrentLesson(found);
        } else if (visibleLessons.length > 0) {
          setCurrentLesson(visibleLessons[0]);
        }
      } else if (visibleLessons.length > 0 && !currentLesson) {
        // Find first lesson of first module
        const sortedM = [...mData].sort((a,b) => a.order_position - b.order_position);
        if (sortedM.length > 0) {
          const firstMId = sortedM[0].id;
          const firstMLessons = visibleLessons
            .filter(l => l.module_id === firstMId);
          
          if (firstMLessons.length > 0) {
            setCurrentLesson(firstMLessons[0]);
          } else {
            setCurrentLesson(visibleLessons[0]);
          }
        } else {
          setCurrentLesson(visibleLessons[0]);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha ao carregar conteúdos das aulas.");
    } finally {
      if (!shouldPreserveCurrentLesson) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCourseData();

    const handleRealtimeUpdate = (event: any) => {
      fetchCourseData(true);
    };

    window.addEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    };
  }, [currentLesson]);

  // YouTube Extractor helper
  function extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Filter published lessons for module
  const getVisibleLessonsForModule = (moduleId: string) => {
    return lessons
      .filter(l => l.module_id === moduleId && l.is_published)
      .sort((a, b) => a.order_position - b.order_position);
  };

  // Linear progression list of all currently displayed lessons (for prev/next sequence controls)
  const getLinearLessons = () => {
    const list: Lesson[] = [];
    const sortedMods = [...modules].sort((a, b) => a.order_position - b.order_position);
    sortedMods.forEach(m => {
      const modLessons = getVisibleLessonsForModule(m.id);
      list.push(...modLessons);
    });
    return list;
  };

  const linearLessons = getLinearLessons();
  const currentLinearIndex = currentLesson ? linearLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const hasPrevious = currentLinearIndex > 0;
  const hasNext = currentLinearIndex !== -1 && currentLinearIndex < linearLessons.length - 1;

  const handleNextLesson = () => {
    if (hasNext) {
      setCurrentLesson(linearLessons[currentLinearIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrevious) {
      setCurrentLesson(linearLessons[currentLinearIndex - 1]);
    }
  };

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  // Check if player is gated for currently selected lesson
  const isLessonLocked = currentLesson?.is_premium && !hasPremiumAccess;

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in pb-16 max-w-7xl mx-auto px-4" id="lessons-portal-screen">
      
      {/* Header section with theme styles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E1E2E]/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#7C3AED]" />
            Aulas &amp; Treinamentos
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA] mt-1">
            Grade de aulas práticas e roteiros personalizados configurados diretamente pelo administrador no painel de controle.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={fetchCourseData}
            disabled={loading}
            className="p-2 bg-[#111118] border border-[#1E1E2E] rounded-xl hover:border-zinc-700 transition"
            title="Atualizar Aulas"
          >
            <RefreshCw className={`w-4 h-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && modules.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl">
          <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin" />
          <span className="text-sm font-bold text-[#8888AA]">Carregando portal de estudos...</span>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-2xl max-w-xl mx-auto text-center space-y-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-lg font-bold text-red-400">Falha na Comunicação</h3>
          <p className="text-sm text-[#8888AA] leading-relaxed">{error}</p>
          <button
            onClick={fetchCourseData}
            className="px-4 py-2 bg-red-900/30 text-red-200 border border-red-800/40 rounded-xl font-bold text-xs hover:bg-red-800/40 transition"
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        <div className="space-y-6">

          {modules.length === 0 ? (
            <div className="text-center p-12 bg-[#09090E] border border-dashed border-[#1E1E2E] rounded-3xl space-y-4">
              <GraduationCap className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
              <h3 className="font-extrabold text-white text-base">Nenhum treinamento disponível</h3>
              <p className="text-xs text-[#8888AA] max-w-sm mx-auto leading-relaxed">
                As aulas estão sendo preparadas e logo estarão disponíveis aqui no seu painel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* LEFT COLUMN: Main Player (2/3 width) */}
              <div className="lg:col-span-2 space-y-4 font-sans">
                
                {/* Embedded Video Area */}
                <div className="relative aspect-video bg-black border border-[#1E1E2E]/80 rounded-2xl overflow-hidden group shadow-2xl">
                  {currentLesson ? (
                    <>
                      {isLessonLocked ? (
                        /* Gated Premium Screen */
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/95 backdrop-blur-md select-none">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600/30 to-purple-600/30 flex items-center justify-center border border-rose-500/40 text-rose-400 animate-pulse mb-4">
                            <Lock className="w-7 h-7" />
                          </div>
                          
                          <div className="max-w-md space-y-2">
                            <span className="bg-[#7C3AED]/15 text-[#7C3AED] border border-[#7C3AED]/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                              Conteúdo Premium 👑
                            </span>
                            <h2 className="text-lg sm:text-xl font-black text-white">Aula Exclusiva</h2>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Esta aula de estratégias avançadas está disponível para os planos <strong className="text-white">Starter, Pro ou Agency</strong>.
                            </p>
                          </div>

                          <div className="flex items-center gap-3 mt-6">
                            <span className="text-xs text-orange-400 font-bold bg-orange-400/5 px-4 py-2 border border-orange-400/10 rounded-xl">
                              Fale com o suporte para adquirir seu acesso!
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Standard Youtube iframe embed */
                        <iframe
                          className="w-full h-full object-cover"
                          src={`https://www.youtube-nocookie.com/embed/${currentLesson.youtube_video_id || extractYoutubeId(currentLesson.youtube_url)}?rel=0&showinfo=0&autoplay=0`}
                          title={currentLesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )}
                    </>
                  ) : (
                    /* Video placeholder state */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#050508]">
                      <Video className="w-12 h-12 text-[#8888AA]/40 mb-3 animate-pulse" />
                      <span className="text-xs text-[#8888AA] font-bold">Nenhuma aula selecionada</span>
                      <span className="text-[10px] text-zinc-500 mt-1">Clique em uma aula da listagem ao lado para iniciar</span>
                    </div>
                  )}
                </div>

                {/* Video info below */}
                {currentLesson && (
                  <div className="bg-[#111118] border border-[#1E1E2E]/60 rounded-2xl p-5 space-y-4 shadow-xl">
                    
                    {/* Header info / Sequence controllers */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#1E1E2E]/70 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-[#7C3AED]/10 text-[#7C3AED] font-black border border-[#7C3AED]/15 rounded px-2 py-0.5">
                            {modules.find(m => m.id === currentLesson.module_id)?.title.toUpperCase() || 'AULA'}
                          </span>
                          
                          {currentLesson.is_premium && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 font-extrabold border border-amber-500/20 rounded px-2 py-0.5 flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 fill-current" />
                              RESTRITO
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                          {currentLesson.title}
                        </h2>

                        <div className="flex items-center gap-3 text-[11px] text-[#8888AA]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Duração: {currentLesson.duration || '10:00'}
                          </span>
                          <span>•</span>
                          <span className="text-zinc-500">Format: Embed Oficial</span>
                        </div>
                      </div>

                      {/* Sequence Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handlePrevLesson}
                          disabled={!hasPrevious}
                          className="px-3.5 py-1.5 bg-[#1F1F2F]/80 hover:bg-[#7C3AED]/20 disabled:opacity-30 disabled:hover:bg-[#1F1F2F]/80 border border-[#2E2E3E]/75 text-xs font-black text-white rounded-xl transition flex items-center gap-1 select-none cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Anterior</span>
                        </button>
                        
                        <button
                          onClick={handleNextLesson}
                          disabled={!hasNext}
                          className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-30 disabled:hover:bg-[#7C3AED] text-xs font-black text-white rounded-xl transition flex items-center gap-1 select-none cursor-pointer"
                        >
                          <span>Próxima</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson description */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-black text-[#7C3AED] uppercase tracking-wider block">Sobre esta aula</span>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {currentLesson.description || "Esta aula não possui descrição ou materiais adicionais cadastrados."}
                      </p>
                    </div>

                    {/* Safety user disclaimer */}
                    <div className="bg-[#050508]/60 border border-[#1E1E2E]/40 p-3 rounded-xl flex items-start gap-2 text-[11px] text-[#8888AA]">
                      <Video className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span>
                        Se o player apresentar problemas, certifique-se de habilitar cookies ou conexões seguras com o domínio do YouTube.
                      </span>
                    </div>

                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Modules and Lessons index (1/3 width) */}
              <div className="space-y-4">
                
                <div className="bg-[#111118]/90 border border-[#1E1E2E]/80 rounded-2xl p-4 space-y-4 shadow-xl">
                  
                  <div className="border-b border-[#1E1E2E]/80 pb-2 flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-[#7C3AED]" />
                      Índice do Conteúdo
                    </h3>
                    <span className="text-[10px] font-bold text-[#8888AA] bg-[#1E1E2E] px-2 py-0.5 rounded-full">
                      {lessons.filter(l => l.is_published).length} aulas
                    </span>
                  </div>

                  {/* Modules Accordion Container */}
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                    
                    {[...modules]
                      .sort((a,b) => a.order_position - b.order_position)
                      .map((mod, modIdx) => {
                        const moduleLessonsList = getVisibleLessonsForModule(mod.id);
                        const isExpanded = !!expandedModules[mod.id];

                        return (
                          <div 
                            key={mod.id} 
                            className="border border-[#1E1E2E]/60 bg-[#0A0A0F] rounded-xl overflow-hidden transition"
                          >
                            
                            {/* Module header trigger */}
                            <div 
                              className="p-3 bg-[#111118] hover:bg-[#151522] flex items-center justify-between cursor-pointer gap-2 select-none"
                              onClick={() => toggleModuleAccordion(mod.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-black tracking-widest text-[#7C3AED] uppercase block mb-0.5">
                                  Módulo {String(modIdx + 1).padStart(2, '0')}
                                </span>
                                
                                <h4 className="text-xs font-black text-white truncate pr-1">
                                  {mod.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1 text-zinc-500">
                                <span className="text-[9px] font-bold">({moduleLessonsList.length})</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 shrink-0 transition" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 shrink-0 transition" />
                                )}
                              </div>
                            </div>

                            {/* Lessons List in Module */}
                            {isExpanded && (
                              <div className="divide-y divide-[#1E1E2E]/40 bg-[#06060A]">
                                {moduleLessonsList.length === 0 ? (
                                  <div className="p-4 text-center text-[10px] text-zinc-500 italic">
                                    Nenhuma aula disponível neste módulo.
                                  </div>
                                ) : (
                                  moduleLessonsList.map((les, lesIdx) => {
                                    const isPlaying = currentLesson?.id === les.id;
                                    const isLocked = les.is_premium && !hasPremiumAccess;

                                    return (
                                      <div key={les.id} className="group/lesson">
                                        
                                        <div
                                          onClick={() => setCurrentLesson(les)}
                                          className={`p-3 transition text-left cursor-pointer flex items-center justify-between gap-2.5 ${
                                            isPlaying
                                              ? 'bg-[#7C3AED]/10 border-l-[3px] border-l-[#7C3AED] text-white'
                                              : 'hover:bg-[#111118] text-[#8888AA] hover:text-white'
                                          }`}
                                        >
                                          <div className="flex items-start gap-2 min-w-0 font-sans">
                                            <div className="mt-0.5 shrink-0">
                                              {isPlaying ? (
                                                <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-current text-[#7C3AED]' : ''}`} />
                                              ) : (
                                                <span className="text-[10px] font-black text-zinc-500 font-mono group-hover/lesson:text-[#7C3AED]">
                                                  {String(lesIdx + 1).padStart(2, '0')}
                                                </span>
                                              )}
                                            </div>

                                            <div className="min-w-0">
                                              <span className={`text-xs block leading-snug truncate ${isPlaying ? 'font-black' : 'font-medium'}`}>
                                                {les.title}
                                              </span>
                                              
                                              <div className="flex items-center gap-2 text-[9px] text-[#8888AA] mt-0.5">
                                                <span className="flex items-center gap-0.5 font-mono">
                                                  <Clock className="w-2.5 h-2.5" />
                                                  {les.duration || '10:00'}
                                                </span>

                                                {les.is_premium && (
                                                  <span className="text-[8px] bg-amber-500/10 text-amber-400 font-black rounded px-1 flex items-center gap-0.5">
                                                    <Sparkles className="w-2 h-2 fill-current" />
                                                    PRO
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="shrink-0">
                                            {isLocked ? (
                                              <Lock className="w-3 h-3 text-[#7C3AED]/80" />
                                            ) : (
                                              <Play className="w-3 h-3 text-[#8888AA] opacity-0 group-hover/lesson:opacity-100 transition" />
                                            )}
                                          </div>
                                        </div>

                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}

                          </div>
                        );
                      })}
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
