import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  FileText,
  Image as ImageIcon,
  Video,
  Coins,
  Code,
  Terminal,
  ArrowRight,
  ExternalLink,
  Activity
} from 'lucide-react';

interface ScreenUpgradeProps {
  profile: any;
  onRefreshProfile: () => void;
  onNavigate: (path: string) => void;
}

export default function ScreenUpgrade({ profile, onRefreshProfile, onNavigate }: ScreenUpgradeProps) {
  const [isAnnual, setIsAnnual ] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab ] = useState<'costs' | 'tech' | 'checkout_links'>('checkout_links');
  const [simulating, setSimulating] = useState<string | null>(null);
  const [simulatedLog, setSimulatedLog] = useState<string[]>([]);

  const [starterUrlInput, setStarterUrlInput] = useState(profile?.applyfy_starter_url || "");
  const [proUrlInput, setProUrlInput] = useState(profile?.applyfy_pro_url || "");
  const [savingUrls, setSavingUrls] = useState(false);

  // Fallback public gateway checkout links
  const [appflyMonthly, setAppflyMonthly] = useState<string>("");
  const [appflyLifetime, setAppflyLifetime] = useState<string>("");

  useEffect(() => {
    // Load config URLs
    fetch("/api/public-settings")
      .then(res => res.json())
      .then(data => {
        if (data.appfly_monthly_url) setAppflyMonthly(data.appfly_monthly_url);
        if (data.appfly_lifetime_url) setAppflyLifetime(data.appfly_lifetime_url);
      })
      .catch(err => {
        console.warn("Could not load checkout links from public settings", err);
      });
  }, []);

  useEffect(() => {
    if (profile?.applyfy_starter_url !== undefined) {
      setStarterUrlInput(profile.applyfy_starter_url || "");
    }
    if (profile?.applyfy_pro_url !== undefined) {
      setProUrlInput(profile.applyfy_pro_url || "");
    }
  }, [profile?.applyfy_starter_url, profile?.applyfy_pro_url]);

  const handleSaveCheckoutUrls = async () => {
    setSavingUrls(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applyfy_starter_url: starterUrlInput,
          applyfy_pro_url: proUrlInput
        })
      });

      if (response.ok) {
        onRefreshProfile();
        setSuccessMsg("Links de checkout do Applyfy salvos com sucesso! Agora, o botão 'Adquirir Plano' levará seu cliente diretamente a esta página de vendas.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Erro ao salvar URLs do Applyfy:", err);
    } finally {
      setSavingUrls(false);
    }
  };

  const handleSimulateWebhook = async (planKey: string, price: number) => {
    setSimulating(planKey);
    setSimulatedLog([
      `[Applyfy] Iniciando chamada simulada às ${new Date().toLocaleTimeString()}`,
      `[Applyfy] Preparando payload JSON (status="approved", email="${profile?.email || 'gestaoprosaas@gmail.com'}", plan="${planKey}", value=${price})`,
      `[Applyfy] Disparando requisição POST para /api/webhook/applyfy...`
    ]);

    try {
      const response = await fetch('/api/webhook/applyfy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          email: profile?.email || 'gestaoprosaas@gmail.com',
          name: profile?.name || 'Gestão Pro SaaS',
          amount: price,
          plan: planKey
        })
      });

      if (response.ok) {
        const bodyData = await response.json();
        setSimulatedLog(prev => [
          ...prev,
          `[HTTP ${response.status}] Resposta recebida com sucesso!`,
          `[Servidor Express] Assinatura ativada no perfil do usuário!`,
          `[Servidor Express] Gerando novo registro de auditoria "RECARGA_APPLYFY"`,
          `[SaaS Feed] Plano do usuário atualizado para "${planKey.toUpperCase()}"!`,
          `[SaaS Feed] Créditos recarregados com sucesso!`
        ]);
        
        // Notify parent
        setTimeout(() => {
          onRefreshProfile();
        }, 1500);
      } else {
        setSimulatedLog(prev => [
          ...prev,
          `[ERRO HTTP ${response.status}] Houve um problema ao simular o webhook.`
        ]);
      }
    } catch (err: any) {
      setSimulatedLog(prev => [
        ...prev,
        `[ERRO CONEXÃO] ${err.message}`
      ]);
    } finally {
      setSimulating(null);
    }
  };

  const handleSelectPlan = async (planKey: string, price: number) => {
    // Check if real Checkout link is configured for designated key
    const starterUrl = profile?.applyfy_starter_url;
    const proUrl = profile?.applyfy_pro_url;

    let checkoutUrl = "";
    if (planKey === 'starter') {
      checkoutUrl = starterUrl || appflyMonthly || "";
    } else if (planKey === 'pro') {
      checkoutUrl = proUrl || appflyLifetime || "";
    }

    if (checkoutUrl) {
      let targetUrl = checkoutUrl.trim();
      
      // Append pre-fill email attribute
      if (profile?.email) {
        const separator = targetUrl.includes('?') ? '&' : '?';
        targetUrl = `${targetUrl}${separator}email=${encodeURIComponent(profile.email)}`;
      }

      setSuccessMsg(`Redirecionando de forma segura ao seu checkout da Applyfy (${planKey.toUpperCase()})...`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }, 1000);
      return;
    }

    // Otherwise, run local playground Sandbox simulation
    setLoadingPlan(planKey);
    setSuccessMsg("");
    try {
      // Fetch upgrade response
      const res = await fetch('/api/profile/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey })
      });

      if (res.ok) {
        // Also simulate an Asaas PAYMENT_CONFIRMED webhook call to mimic background systems and trigger Resend welcome emails
        await fetch('/api/webhook/asaas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'PAYMENT_CONFIRMED',
            value: price,
            customerEmail: profile?.email || 'gestaoprosaas@gmail.com',
            customerName: profile?.name || 'Gestão Pro SaaS'
          })
        });

        // Trigger parent state reload
        onRefreshProfile();
        setSuccessMsg(`[Modo Simulação] Plano ${planKey.toUpperCase()} ativado no seu perfil (Sem redirecionamento pois não há Link cadastrado na aba abaixo).`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error("Falha ao processar assinatura no playground:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  const getMonthlyPrice = (planKey: string) => {
    if (planKey === 'free') return 0;
    if (planKey === 'starter') return 245;
    if (planKey === 'pro') return 497;
    return 0;
  };

  const plans = [
    {
      key: 'starter',
      name: 'Plano Mensal',
      description: 'Acesso completo com recorrência mensal conveniente.',
      badge: 'Assinatura',
      accent: 'border-[#1E1E2E] hover:border-[#7C3AED]/30 bg-[#111118]',
      priceDesc: 'Cancelamento sem taxas adicionais',
      priceLabel: '/mês',
      limits: { text: '100', video: '10', prompts: '5/dia' },
      features: [
        'Até 100 Roteiros de alta conversão/mês',
        '10 Vídeos com IA por mês',
        'Apenas 5 prompts de imagem por dia (Limite)',
        'Otimizador de Prompts Premium para Flow/Flux',
        'Criação de Webhooks e Configurações Ilimitados',
        'Acesso completo a Biblioteca Viral e Scripts',
        'Suporte por email prioritário'
      ]
    },
    {
      key: 'pro',
      name: 'Plano Vitalício',
      popular: true,
      description: 'Pague uma única vez e ganhe acesso para sempre.',
      badge: 'Melhor Custo x Benefício 🏆',
      accent: 'border-[#7C3AED] shadow-xl shadow-[#7C3AED]/15 bg-[#16132D]/45',
      priceDesc: 'Acesso vitalício sem mensalidades',
      priceLabel: ' único',
      limits: { text: '999', video: '50', prompts: '5/dia' },
      features: [
        'Roteiros premium ilimitados para sempre',
        '50 Vídeos com IA por mês',
        'Apenas 5 prompts de imagem por dia (Limite)',
        'Otimizador de Prompts Premium para Flow/Flux',
        'Criação de Webhooks e Configurações Ilimitados',
        'Acesso completo a Biblioteca Viral e Scripts',
        'Suporte prioritário via WhatsApp'
      ]
    }
  ];

  const currentPlan = profile?.plan || 'starter';

  return (
    <div className="space-y-8 animate-fade-in text-[#F0F0FF] pb-12" id="upgrade-pricing-frame">
      {/* Header Promo Banner */}
      <div className="text-center py-6 bg-gradient-to-b from-[#181530] to-transparent border border-[#7C3AED]/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
        
        <span className="flex items-center gap-1.5 text-xs text-yellow-400 font-extrabold uppercase bg-yellow-400/10 px-3.5 py-1 rounded-full border border-yellow-400/20 w-fit mx-auto mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Acesso Completo e Ilimitado
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
          Escolha o Plano Ideal para a sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">Escala de Vendas</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#8888AA] max-w-xl mx-auto mt-2">
          Gere roteiros hipnotizantes, crie prompts de modelo realistas e multiplique visualizações em minutos.
        </p>

        {/* Toggle Billing Option Switcher */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-xs font-bold ${!isAnnual ? 'text-white' : 'text-[#8888AA]'}`}>Mensal</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-[#1A1A26] border border-[#2B2B3D] p-1 flex items-center transition relative"
            id="toggle-annual-sub"
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition duration-200 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold flex items-center gap-1 ${isAnnual ? 'text-white' : 'text-[#8888AA]'}`}>
            Anual
            <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
              Economize 20%
            </span>
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Cards - Centered and scaled beautifully for exactly 2 plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {plans.map((p) => {
          const mPrice = getMonthlyPrice(p.key);
          const isSelected = currentPlan.toLowerCase() === p.key.toLowerCase();

          return (
            <div 
              key={p.key}
              className={`border rounded-2xl p-5 md:p-6 flex flex-col justify-between relative transition duration-300 ${p.accent} ${p.popular ? 'border-t-4 border-t-[#7C3AED]' : ''}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-[9px] font-extrabold uppercase text-white shadow-md whitespace-nowrap">
                  {p.badge}
                </div>
              )}

              {!p.popular && p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#1E1E2E] border border-[#1E1E2E] text-[9px] font-bold uppercase text-[#8888AA] whitespace-nowrap">
                  {p.badge}
                </div>
              )}

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">{p.name}</h3>
                  <p className="text-[10px] text-[#8888AA] mt-0.5 leading-snug">{p.description}</p>
                  
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">R$ {mPrice}</span>
                    <span className="text-[10px] text-[#8888AA] font-bold tracking-wide">{p.priceLabel}</span>
                  </div>
                  <span className="text-[10px] text-[#555577] block mt-0.5">{p.priceDesc}</span>
                </div>

                {/* Quotas */}
                <div className="grid grid-cols-3 gap-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2 text-center text-[10px] items-center">
                  <div>
                    <div className="font-extrabold text-white flex items-center justify-center gap-0.5">
                      <FileText className="w-2.5 h-2.5 text-[#7C3AED]" />
                      {p.limits.text}
                    </div>
                    <div className="text-[8px] text-[#8888AA]">Roteiros</div>
                  </div>
                  <div className="border-l border-[#1E1E2E]">
                    <div className="font-extrabold text-white flex items-center justify-center gap-0.5">
                      <Video className="w-2.5 h-2.5 text-red-500" />
                      {p.limits.video}
                    </div>
                    <div className="text-[8px] text-[#8888AA]">Vídeos</div>
                  </div>
                  <div className="border-l border-[#1E1E2E]">
                    <div className="font-extrabold text-white flex items-center justify-center gap-0.5">
                      <ImageIcon className="w-2.5 h-2.5 text-pink-500" />
                      {p.limits.prompts}
                    </div>
                    <div className="text-[8px] text-[#8888AA]">Imagens</div>
                  </div>
                </div>

                {/* Features checklist */}
                <ul className="space-y-2 pt-2 border-t border-[#1E1E2E]">
                  {p.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-[11px] text-[#A0A0C0] leading-snug">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase Button */}
              <div className="mt-6">
                <button
                  disabled={isSelected || loadingPlan !== null}
                  onClick={() => handleSelectPlan(p.key, mPrice)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition ${
                    isSelected
                      ? 'bg-[#1E1E2E] text-[#8888AA]/55 border border-transparent cursor-not-allowed'
                      : p.popular
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 text-white shadow-lg shadow-[#7C3AED]/20'
                      : 'bg-[#1A1A26] border border-[#1E1E2E] hover:bg-[#20202F] text-white'
                  }`}
                >
                  {loadingPlan === p.key ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-white rounded-full border-t-transparent inline-block" />
                      Autorizando Pix...
                    </span>
                  ) : isSelected ? (
                    'Plano Ativo'
                  ) : (
                    'Adquirir Plano'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-3 items-start">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Transações Criptografadas com Garantia Asaas</h4>
            <p className="text-[11px] text-[#8888AA]">Toda a nossa infraestrutura de checkout é intermediada pela Asaas IP S/A, com certificação PCI-DSS e pagamentos compensados via PIX ou cartão de crédito em menos de 3 segundos.</p>
          </div>
        </div>
        
        <button 
          onClick={() => onNavigate('/configuracoes')} 
          className="text-white hover:underline text-xs font-bold shrink-0 py-2 bg-[#1A1A26] border border-[#1E1E2E] px-4 rounded-xl"
        >
          Minha Conta e Cobranças
        </button>
      </div>

      {/* SEÇÃO INTEGRAÇÃO APPLYFY */}
      <div className="bg-[#0F0F16] border border-[#1E1E2E] rounded-3xl p-6 sm:p-8 space-y-6" id="applyfy-integration-box">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E2E]/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase rounded border border-indigo-500/20">
                Integração Guia & API
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Gateway Pronto</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2" id="applyfy-title">
              <Coins className="w-5 h-5 text-[#7C3AED]" />
              Como Integrar o Applyfy ao seu Sistema
            </h2>
            <p className="text-xs text-[#8888AA]">Habilite assinaturas automáticas e cobranças integrando canais de checkout da Applyfy.</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-[#07070F] p-1 rounded-xl border border-[#1E1E2E] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('checkout_links')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                activeTab === 'checkout_links'
                  ? 'bg-[#1E1E2E] text-white shadow-sm'
                  : 'text-[#8888AA] hover:text-white'
              }`}
            >
              Configurar Checkouts
            </button>
            <button
              onClick={() => setActiveTab('costs')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                activeTab === 'costs'
                  ? 'bg-[#1E1E2E] text-white shadow-sm'
                  : 'text-[#8888AA] hover:text-white'
              }`}
            >
              Custos e Taxas
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                activeTab === 'tech'
                  ? 'bg-[#1E1E2E] text-white shadow-sm'
                  : 'text-[#8888AA] hover:text-white'
              }`}
            >
              Integração Técnica (Webhook)
            </button>
          </div>
        </div>

        {activeTab === 'checkout_links' ? (
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 sm:p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E1E2E]/60 pb-3 gap-2">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#7C3AED]" />
                  Insira seus Links de Venda / Checkout do Applyfy
                </h4>
                <p className="text-[11px] text-[#8888AA] mt-0.5">
                  Insira abaixo os links das páginas de checkout que você gerou no painel do Applyfy para receber pagamentos reais.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase rounded border border-indigo-500/25 self-start sm:self-auto">
                Redirecionamento Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Link de Checkout do PLANO MENSAL (Starter)</span>
                  <span className="text-[9px] text-[#8888AA] normal-case font-normal">(R$ 245/mês)</span>
                </label>
                <input
                  type="url"
                  placeholder="Ex: https://checkout.applyfy.com/p/mensal-starter"
                  value={starterUrlInput}
                  onChange={(e) => setStarterUrlInput(e.target.value)}
                  className="w-full bg-[#07070F] text-xs text-white border border-[#2B2B3D] rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED] transition placeholder-[#555577]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Link de Checkout do PLANO VITALÍCIO (Pro)</span>
                  <span className="text-[9px] text-[#8888AA] normal-case font-normal">(R$ 497 único)</span>
                </label>
                <input
                  type="url"
                  placeholder="Ex: https://checkout.applyfy.com/p/vitalicio-pro"
                  value={proUrlInput}
                  onChange={(e) => setProUrlInput(e.target.value)}
                  className="w-full bg-[#07070F] text-xs text-white border border-[#2B2B3D] rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED] transition placeholder-[#555577]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <p className="text-[10px] text-[#8888AA] leading-relaxed max-w-lg">
                💡 <strong className="text-white">Melhor Conversão:</strong> O e-mail do seu cliente logado (<code className="text-[#06B6D4]">{profile?.email}</code>) será incluído automaticamente no checkout para acelerar a finalização do pagamento!
              </p>
              <button
                onClick={handleSaveCheckoutUrls}
                disabled={savingUrls}
                className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md transition shrink-0 flex items-center gap-1.5 self-end sm:self-auto"
              >
                {savingUrls ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white rounded-full border-t-transparent inline-block" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Links do Applyfy'
                )}
              </button>
            </div>
          </div>
        ) : activeTab === 'costs' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" id="applyfy-costs-panel">
            {/* Card 1: Custos Fixos */}
            <div className="bg-[#111118] border border-[#1E1E2E] p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg inline-block w-fit">
                  <Coins className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-sm text-white">Sem Mensalidades</h4>
                <p className="text-xs text-[#8888AA] leading-relaxed">
                  Criar conta e colocar seu sistema no ar usando o Applyfy tem <strong className="text-white">custo fixo ZERO</strong>. Você não paga mensalidades nem taxas de adesão.
                </p>
              </div>
              <div className="text-xs text-[#555577] border-t border-[#1E1E2E]/60 pt-3">
                Conta 100% gratuita para iniciar
              </div>
            </div>

            {/* Card 2: Taxas Transacionais */}
            <div className="bg-[#111118] border border-[#1E1E2E] p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="p-2 bg-[#7C3AED]/10 text-[#7C3AED]/90 rounded-lg inline-block w-fit">
                  <Activity className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-sm text-white">Taxas de Transação</h4>
                <p className="text-xs text-[#8888AA] leading-relaxed">
                  O Applyfy funciona baseado em taxa por venda aprovada. A taxa padrão gira em torno de <strong className="text-white">4,99% a 5,99% + R$ 1,00</strong> por transação (PIX costuma ser menor).
                </p>
              </div>
              <div className="text-xs text-indigo-400 font-semibold border-t border-[#1E1E2E]/60 pt-3 flex items-center justify-between">
                <span>PIX compensa na hora</span>
                <span>CC em até 14 dias</span>
              </div>
            </div>

            {/* Card 3: O que inclui */}
            <div className="bg-[#111118] border border-[#1E1E2E] p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="p-2 bg-[#06B6D4]/10 text-[#06B6D4] rounded-lg inline-block w-fit">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-sm text-white">Recursos Inclusos</h4>
                <p className="text-xs text-[#8888AA] leading-relaxed">
                  Checkout de alta conversão adaptado a celulares, suporte integrado a PIX/Cartão, sistema de anti-fraude e recuperação automática nativa do Pix pelo WhatsApp.
                </p>
              </div>
              <div className="text-xs text-[#8888AA] border-t border-[#1E1E2E]/60 pt-3 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recuperação automática ativa</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in" id="applyfy-tech-panel">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Passo a Passo */}
              <div className="space-y-4 text-xs text-[#8888AA]">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                  Como funciona o fluxo técnico:
                </h4>
                <ol className="space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                  <li>
                    <strong className="text-white">Criar Produto / Plano:</strong> Crie seus planos (Starter, Pro, Agência) no painel do Applyfy e vincule cada um a um link de checkout exclusivo.
                  </li>
                  <li>
                    <strong className="text-white">Configurar o Webhook:</strong> No painel das integrações da Applyfy, cadastre a URL de Webhook do seu sistema de cobrança.
                  </li>
                  <li>
                    <strong className="text-white">URL de Recepção do Webhook:</strong> Use o endpoint correspondente que acabamos de configurar no servidor:
                    <div className="mt-1.5 flex items-center gap-1 bg-[#07070F] text-amber-400 font-mono px-2.5 py-1.5 rounded-xl border border-[#1E1E2E] select-all break-all overflow-x-auto text-[10px]">
                      {window.location.origin}/api/webhook/applyfy
                    </div>
                  </li>
                  <li>
                    <strong className="text-white">Liberação Instantânea:</strong> Quando a compra for aprovada, o Applyfy envia um callback estruturado com o e-mail do cliente, atualizando o profile dele na mesma hora.
                  </li>
                </ol>
              </div>

              {/* Simulador Interativo */}
              <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    Simulador Ativo de Webhook da Applyfy
                  </h4>
                  <p className="text-[10px] text-[#8888AA] mt-1 leading-relaxed">
                    Clique em um botão abaixo para simular chamadas de webhook enviadas do Applyfy diretamente para a sua API Express na sua conta atual (<span className="text-[#06B6D4] font-medium">{profile?.email || 'gestaoprosaas@gmail.com'}</span>):
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={simulating !== null}
                    onClick={() => handleSimulateWebhook('starter', 97)}
                    className="py-2.5 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/20 text-indigo-300 font-bold text-[10px] sm:text-xs rounded-xl flex flex-col items-center justify-center gap-0.5 transition"
                  >
                    <span>Starter</span>
                    <span className="text-[9px] text-[#8888AA]">R$ 97</span>
                  </button>
                  <button
                    disabled={simulating !== null}
                    onClick={() => handleSimulateWebhook('pro', 197)}
                    className="py-2.5 bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 text-purple-300 font-bold text-[10px] sm:text-xs rounded-xl flex flex-col items-center justify-center gap-0.5 transition"
                  >
                    <span>Pro AI</span>
                    <span className="text-[9px] text-[#8888AA]">R$ 197</span>
                  </button>
                  <button
                    disabled={simulating !== null}
                    onClick={() => handleSimulateWebhook('agency', 497)}
                    className="py-2.5 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/20 text-cyan-300 font-bold text-[10px] sm:text-xs rounded-xl flex flex-col items-center justify-center gap-0.5 transition"
                  >
                    <span>Agência</span>
                    <span className="text-[9px] text-[#8888AA]">R$ 497</span>
                  </button>
                </div>

                {/* Simulated log feedback */}
                <div className="bg-[#07070F] rounded-xl p-3 border border-[#1E1E2E] font-mono text-[9px] text-[#8888AA] h-28 overflow-y-auto space-y-1 scrollbar-thin">
                  <div className="text-amber-400 font-bold border-b border-[#1E1E2E] pb-1 flex items-center justify-between">
                    <span>CONSOLE DO SIMULADOR</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  {simulatedLog.length === 0 ? (
                    <div className="text-[#555577] italic pt-5 text-center">Clique em um plano para simular o recebimento...</div>
                  ) : (
                    simulatedLog.map((log, idx) => (
                      <div key={idx} className="leading-relaxed break-all">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Código Modelo de Payload */}
            <div className="bg-[#07070F] border border-[#1E1E2E] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#8888AA]">
                <div className="flex items-center gap-1.5 text-white">
                  <Code className="w-3.5 h-3.5 text-[#06B6D4]" />
                  Código Real do Endpoint de Integração (Express.js + TypeScript)
                </div>
                <span className="text-[9px] text-[#555577]">TypeScript / Node.js</span>
              </div>
              <pre className="text-[9px] text-[#A0A0C0] bg-[#030308] border border-[#11111A] rounded-xl p-3.5 overflow-x-auto font-mono leading-relaxed select-all">
{`app.post("/api/webhook/applyfy", (req, res) => {
  const payload = req.body || {};
  const status = payload.status || payload.event;
  const email = payload.email || (payload.customer && payload.customer.email);
  const amount = Number(payload.amount || payload.price || 0);
  const plan = payload.plan || "starter";

  // Verifica se o pagamento foi concluído com sucesso
  const isApproved = ["approved", "paid"].includes(status?.toLowerCase());

  if (isApproved && email) {
    // Implemente a lógica de upgrade do plano do seu cliente aqui no Banco de Dados
    console.log(\`Liberando plano \${plan} para o cliente \${email}\`);
  }

  return res.status(200).json({ success: true, gateway: "applyfy", processed: true });
});`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
