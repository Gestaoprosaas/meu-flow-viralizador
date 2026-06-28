import React, { useState } from 'react';
import { Target, Sparkles, FileText, Copy, ArrowRight, Bookmark, Check, Layers, RefreshCw, Volume2 } from 'lucide-react';
import { ScriptGeneration } from '../types';

interface ScreenRoteirosProps {
  scripts: ScriptGeneration[];
  onScriptGenerated: (newScript: ScriptGeneration) => void;
  onNavigate: (path: string, payload?: any) => void;
  initialPreFill?: any;
}

export default function ScreenRoteiros({
  scripts,
  onScriptGenerated,
  onNavigate,
  initialPreFill
}: ScreenRoteirosProps) {
  // Form State
  const [produto, setProduto] = useState(initialPreFill?.product_name || '');
  const [descricao, setDescricao] = useState(initialPreFill?.product_description || '');
  const [publicoAlvo, setPublicoAlvo] = useState(initialPreFill?.target_audience || '');
  const [dorPrincipal, setDorPrincipal] = useState('');
  const [desejoPrincipal, setDesejoPrincipal] = useState('');
  
  const [tom, setTom] = useState<'empolgante' | 'urgente' | 'emocional' | 'informativo' | 'engraçado'>('empolgante');
  const [plataforma, setPlataforma] = useState<'tiktok' | 'reels' | 'youtube_shorts'>('tiktok');
  const [duracao, setDuracao] = useState<'15s' | '30s' | '60s'>('30s');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'s1' | 's2' | 's3'>('s1');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedScript, setSelectedScript] = useState<ScriptGeneration | null>(scripts[0] || null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savedToLib, setSavedToLib] = useState(false);

  // Sync selectedScript reference with real-time updates from Parent
  React.useEffect(() => {
    if (scripts.length > 0) {
      if (!selectedScript || !scripts.some(s => s.id === selectedScript.id)) {
        setSelectedScript(scripts[0]);
      } else {
        const found = scripts.find(s => s.id === selectedScript.id);
        if (found) setSelectedScript(found);
      }
    } else {
      setSelectedScript(null);
    }
  }, [scripts, selectedScript]);

  const steps = [
    "Analisando produto & mercado...",
    "Estruturando ganchos (hooks) de retenção 3s...",
    "Compilando roteiro de storytelling rítmico...",
    "Gerando variações persuasivas para escala..."
  ];

  const handleCopy = (text: string, title: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn("Erro ao copiar para a área de transferência:", err);
    }
    setCopiedSection(title);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produto || !descricao) {
      setErrorMsg("Nome e descrição do produto são obrigatórios.");
      return;
    }

    setErrorMsg('');
    setIsGenerating(true);
    setCurrentStep(0);
    setSavedToLib(false);

    // Simulated loading animation stepping
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1200);

    try {
      const response = await fetch('/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto,
          descricao,
          publico_alvo: publicoAlvo,
          dor_principal: dorPrincipal,
          desejo_principal: desejoPrincipal,
          tom,
          plataforma,
          duracao
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo deu errado");
      }

      onScriptGenerated(data);
      setSelectedScript(data);
      setActiveTab('s1');
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão.");
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleSaveToLibrary = async () => {
    if (!selectedScript) return;
    try {
      await fetch('/api/viral-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Script: ${selectedScript.product_name}`,
          content: selectedScript.script_body,
          type: 'script',
          niche: 'Geral',
          emotion: selectedScript.tone,
          platform: selectedScript.platform
        })
      });
      setSavedToLib(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in">
      
      {/* Header Info */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#7C3AED]" />
          Crie Seu Roteiro IA
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA]">Escreva o seu produto e consiga ganchos e scripts viciantes, prontos para gravar ou rodar anúncios.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Campaign Creator Form */}
        <div className="lg:col-span-5 bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#7C3AED]" />
            Dados do Produto
          </h2>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 text-red-400 text-xs rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

            {/* Campaign Name & Product */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8888AA] block">Nome do Produto</label>
              <input
                type="text"
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                placeholder="Ex: Massageador Elétrico de Pescoço"
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs sm:text-sm text-[#F0F0FF] focus:border-[#7C3AED] outline-none"
              />
            </div>

            {/* Product Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8888AA] block">Descrição Curta</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                placeholder="Descreva o que ele faz e quais os benefícios mais marcantes..."
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs sm:text-sm text-[#F0F0FF] focus:border-[#7C3AED] outline-none resize-none"
              />
            </div>

            {/* Public details */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#8888AA] block">Público-Alvo (Opcional)</label>
              <input
                type="text"
                value={publicoAlvo}
                onChange={(e) => setPublicoAlvo(e.target.value)}
                placeholder="Ex: Pessoas com dor crônica, atletas, idosos..."
                className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] focus:border-[#7C3AED] outline-none"
              />
            </div>

            {/* Pain Point */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] block">Dor Principal (Opcional)</label>
                <input
                  type="text"
                  value={dorPrincipal}
                  onChange={(e) => setDorPrincipal(e.target.value)}
                  placeholder="Ex: Cansaço após o PC"
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8888AA] block">Desejo Principal (Opcional)</label>
                <input
                  type="text"
                  value={desejoPrincipal}
                  onChange={(e) => setDesejoPrincipal(e.target.value)}
                  placeholder="Ex: Alívio em 5 min"
                  className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-[#F0F0FF] focus:border-[#7C3AED] outline-none"
                />
              </div>
            </div>

            {/* Customizer: Tone, Platform, Duration */}
            <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-3 rounded-lg space-y-3">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Personalização da Audiência</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8888AA]">Tom Vocabular</label>
                  <select
                    value={tom}
                    onChange={(e: any) => setTom(e.target.value)}
                    className="w-full bg-[#111118] border border-[#1E1E2E] rounded p-2 text-xs text-[#F0F0FF] outline-none focus:border-[#7C3AED]"
                  >
                    <option value="empolgante">Empolgante 🔥</option>
                    <option value="urgente">Urgente ⚠️</option>
                    <option value="emocional">Emocional 🥹</option>
                    <option value="informativo">Informativo 📑</option>
                    <option value="engraçado">Engraçado 😂</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#8888AA]">Rede de Destino</label>
                  <select
                    value={plataforma}
                    onChange={(e: any) => setPlataforma(e.target.value)}
                    className="w-full bg-[#111118] border border-[#1E1E2E] rounded p-2 text-xs text-[#F0F0FF] outline-none focus:border-[#7C3AED]"
                  >
                    <option value="tiktok">TikTok Shop 🎵</option>
                    <option value="reels">Instagram Reels 📸</option>
                    <option value="youtube_shorts">YouTube Shorts 🎥</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              ✨ Gerar Campanha Completa
            </button>
          </form>
        </div>

        {/* Right Side: Copywriting Editor & Dynamic Results */}
        <div className="lg:col-span-7 bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 min-h-[450px] flex flex-col">
          
          {/* Loading Animation Placeholder */}
          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <RefreshCw className="w-12 h-12 text-[#7C3AED] animate-spin" />
                <Sparkles className="w-5 h-5 text-[#06B6D4] absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Configurando Algoritmos</h4>
                <p className="text-xs text-[#8888AA] max-w-xs">{steps[currentStep]}</p>
                
                {/* Visual tiny step dots */}
                <div className="flex gap-1.5 justify-center mt-3">
                  {steps.map((_, sidx) => (
                    <div
                      key={sidx}
                      className={`w-1.5 h-1.5 rounded-full transition duration-300 ${
                        sidx === currentStep ? 'bg-[#7C3AED]/90 scale-125' : 'bg-[#1E1E2E]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Blank Slate state */}
          {!isGenerating && !selectedScript && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <FileText className="w-12 h-12 text-[#1E1E2E] mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-[#F0F0FF] mb-1">Roteiro pronto te espera</h3>
              <p className="text-xs text-[#8888AA] max-w-xs">Preencha os dados do seu produto na barra lateral e clique em gerar cópia para reescrever as regras do jogo.</p>
            </div>
          )}

          {/* Real AI text generator Output viewer */}
          {!isGenerating && selectedScript && (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Output Header Tabs */}
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2">
                <div className="flex gap-2 bg-[#0A0A0F] border border-[#1E1E2E] p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('s1')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      activeTab === 's1' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-[#F0F0FF]'
                    }`}
                  >
                    Script Principal
                  </button>
                  <button
                    onClick={() => setActiveTab('s2')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      activeTab === 's2' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-[#F0F0FF]'
                    }`}
                  >
                    Variação 2
                  </button>
                  <button
                    onClick={() => setActiveTab('s3')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      activeTab === 's3' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-[#F0F0FF]'
                    }`}
                  >
                    Variação 3
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToLibrary}
                    disabled={savedToLib}
                    className="p-1.5 bg-[#0A0A0F] hover:bg-[#1E1E2E] border border-[#1E1E2E] text-[#8888AA] hover:text-white rounded-lg transition"
                    title="Salvar na Biblioteca Viral"
                  >
                    <Bookmark className={`w-4 h-4 ${savedToLib ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Tab Display Area */}
              <div className="space-y-5 flex-1">
                {activeTab === 's1' ? (
                  <div className="space-y-4">
                    {/* Hook Section */}
                    <div className="p-3 bg-[#111118] border-l-2 border-[#7C3AED] bg-[#0A0A0F] rounded-r-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider block">Hook Matador (Primeiros 3s)</span>
                        <button
                          onClick={() => handleCopy(selectedScript.hook, 'hook')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'hook' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{selectedScript.hook}</p>
                    </div>

                    {/* Full Script body */}
                    <div className="space-y-1.5 p-3.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider block">Roteiro Narrado Detalhado</span>
                        <button
                          onClick={() => handleCopy(selectedScript.script_body, 'body')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'body' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-[#8888AA] leading-relaxed whitespace-pre-line text-justify h-[180px] overflow-y-auto pr-1">
                        {selectedScript.script_body}
                      </p>
                    </div>

                    {/* Social caption suggestions */}
                    <div className="p-3 bg-gradient-to-r from-[#111118] to-[#17152F] border border-[#1E1E2E] rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-wider">Legenda + Hashtags sugeridas</span>
                        <button
                          onClick={() => handleCopy(selectedScript.legenda_sugerida || '', 'caption')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'caption' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-[#8888AA] leading-relaxed italic">{selectedScript.legenda_sugerida}</p>
                    </div>

                    {/* Tips and recordings tricks */}
                    {selectedScript.tips && selectedScript.tips.length > 0 && (
                      <div className="p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl text-xs space-y-1.5">
                        <span className="font-bold text-white block">Dicas de Gravação Visual:</span>
                        <ul className="space-y-1 text-[#8888AA] pl-4 list-disc">
                          {selectedScript.tips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                ) : activeTab === 's2' ? (
                  <div className="space-y-4">
                    {/* Variation 2 */}
                    <div className="p-3 border-l-2 border-[#06B6D4] bg-[#0A0A0F] rounded-r-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider block">Gacho Alternativo (Chocante)</span>
                        <button
                          onClick={() => handleCopy(selectedScript.variations[0]?.hook || '', 'v2hook')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'v2hook' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{selectedScript.variations[0]?.hook}</p>
                    </div>

                    <div className="space-y-1.5 p-3.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider block">Corpo narrado rápido</span>
                        <button
                          onClick={() => handleCopy(selectedScript.variations[0]?.script_completo || '', 'v2body')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'v2body' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-[#8888AA] leading-relaxed whitespace-pre-line h-[160px] overflow-y-auto pr-1">
                        {selectedScript.variations[0]?.script_completo}
                      </p>
                    </div>

                    <div className="p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">CTA Especial</span>
                        <button
                          onClick={() => handleCopy(selectedScript.variations[0]?.cta || '', 'v2cta')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'v2cta' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-white">{selectedScript.variations[0]?.cta}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Variation 3 */}
                    <div className="p-3 border-l-2 border-[#10B981] bg-[#0A0A0F] rounded-r-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider block">Gancho de Humor ou Desafio</span>
                        <button
                          onClick={() => handleCopy(selectedScript.variations[1]?.hook || '', 'v3hook')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'v3hook' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white">{selectedScript.variations[1]?.hook}</p>
                    </div>

                    <div className="space-y-1.5 p-3.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider block">Roteiro corrido</span>
                        <button
                          onClick={() => handleCopy(selectedScript.variations[1]?.script_completo || '', 'v3body')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'v3body' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-[#8888AA] leading-relaxed whitespace-pre-line h-[160px] overflow-y-auto pr-1">
                        {selectedScript.variations[1]?.script_completo}
                      </p>
                    </div>

                    <div className="p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8888AA] uppercase tracking-wider">CTA de Urgência</span>
                        <button
                          onClick={() => handleCopy(selectedScript.variations[1]?.cta || '', 'v3cta')}
                          className="p-1 hover:bg-[#1E1E2E] text-[#8888AA] hover:text-[#F0F0FF] rounded transition"
                        >
                          {copiedSection === 'v3cta' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs text-white">{selectedScript.variations[1]?.cta}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Action to Video Converter */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#1E1E2E]">
                <button
                  onClick={() => {
                    const txt = activeTab === 's1' ? selectedScript.script_body : activeTab === 's2' ? selectedScript.variations[0]?.script_completo : selectedScript.variations[1]?.script_completo;
                    onNavigate('/videos', { preFilledScriptText: txt, script_id: selectedScript.id });
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95 duration-150"
                >
                  <Volume2 className="w-4 h-4" />
                  Gerar Vídeo IA com Narrador
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <button
                  onClick={() => handleCopy(selectedScript.script_body, 'fullCopy')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#1E1E2E] hover:bg-[#2A2A3E] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition"
                >
                  {copiedSection === 'fullCopy' ? <span className="text-[#10B981]">Copiado com sucesso!</span> : "Copiar Roteiro Corrido"}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
