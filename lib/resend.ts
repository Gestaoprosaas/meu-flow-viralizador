/**
 * Resend Email Integration Module
 * Handles sending beautiful HTML emails for subscription welcome and payment overdue events.
 */

const getResendApiKey = () => {
  return process.env.RESEND_API_KEY;
};

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Common REST dispatcher for Resend APIs.
 */
async function sendEmail(input: SendEmailInput) {
  const apiKey = getResendApiKey();

  if (!apiKey) {
    console.warn("\n=== [SIMULATED EMAIL NOTIFICATION] ===");
    console.warn(`Para: ${input.to}`);
    console.warn(`Assunto: ${input.subject}`);
    console.warn(`Conteúdo HTML resumido:\n${input.html.substring(0, 300)}...`);
    console.warn("=======================================\n");
    return { id: `sim_email_${Date.now()}`, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: "ViralForge AI <onboarding@resend.dev>", // Resend Sandbox default domain or custom domain if authenticated
        to: [input.to],
        subject: input.subject,
        html: input.html
      })
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error(`Resend API Error: ${res.status} - ${errMsg}`);
      throw new Error(`Resend Error: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Failed to send email via Resend:", error);
    // Shield the server from crashing by absorbing error but logging it
    return { success: false, error: error.message };
  }
}

/**
 * Sends a welcome email upon successful plan subscription.
 */
export async function sendWelcomeEmail(to: string, name: string, planName: string) {
  const planCredits = {
    starter: "50 Roteiros, 30 Imagens e 3 Vídeos",
    pro: "200 Roteiros, 100 Imagens e 15 Vídeos",
    agency: "999 Roteiros, 500 Imagens e 60 Vídeos"
  }[planName.toLowerCase()] || "Seus créditos de teste";

  const welcomeHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A0A0F; color: #F0F0FF; border-radius: 12px; border: 1px solid #1E1E2E;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #7C3AED; font-weight: 800; font-size: 24px;">🚀 ViralForge AI</h1>
        <p style="color: #06B6D4; font-size: 14px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Sua Assinatura está Ativa!</p>
      </div>
      
      <p style="font-size: 15px; line-height: 1.6; color: #D0D0E0;">Olá, <strong>${name}</strong>!</p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #D0D0E0;">Seja muito bem-vindo ao <strong>ViralForge AI</strong>. Seu upgrade para o plano <span style="color: #7C3AED; font-weight: bold; text-transform: capitalize;">${planName}</span> foi confirmado com sucesso e seus créditos já foram liberados!</p>
      
      <div style="background-color: #111118; padding: 16px; border-radius: 8px; border: 1px solid #7C3AED/20; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #FFFFFF; font-size: 14px;">⚡ Limite do seu Plano Mensal:</h3>
        <p style="font-size: 16px; font-weight: bold; color: #06B6D4; margin-bottom: 0;">${planCredits}</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #8888AA;">Todos os meses no dia do vencimento da sua assinatura seus limites serão recarregados de forma totalmente automatizada pelo nosso sistema.</p>

      <div style="text-align: center; margin: 32px 0 20px 0;">
        <a href="${process.env.APP_URL || 'https://viralforge.ai'}/dashboard" style="background-color: #7C3AED; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Começar a Criar Vídeos Virais</a>
      </div>

      <hr style="border: none; border-top: 1px solid #1E1E2E; margin: 30px 0 20px 0;" />
      <p style="font-size: 11px; text-align: center; color: #555577;">Copyright &copy; 2026 ViralForge AI. Todos os direitos reservados. Se você tiver alguma dúvida, fale com nosso suporte via painel.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Bem-vindo ao ViralForge AI! Plano ${planName.toUpperCase()} Ativado`,
    html: welcomeHtml
  });
}

/**
 * Sends a reminder email when payment is overdue.
 */
export async function sendPaymentOverdueEmail(to: string, name: string) {
  const overdueHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0A0A0F; color: #F0F0FF; border-radius: 12px; border: 1px solid #EF4444/30;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #EF4444; font-weight: 800; font-size: 24px;">⚠️ ViralForge AI</h1>
        <p style="color: #FBBF24; font-size: 14px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Notificação de Vencimento de Cobrança</p>
      </div>
      
      <p style="font-size: 15px; line-height: 1.6; color: #D0D0E0;">Olá, <strong>${name}</strong>!</p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #D0D0E0;">Identificamos que o pagamento da sua fatura recorrente do ViralForge AI está pendente ou atrasado. Para evitar a suspensão temporária dos seus créditos diários e o cancelamento dos renderizadores ativos, regularize sua situação o quanto antes.</p>
      
      <div style="background-color: #111118; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #EF4444/20;">
        <p style="font-size: 13px; color: #A0A0C0; margin: 0;">Você pode efetuar o pagamento via PIX copiando a chave diretamente ou acessando sua área de configurações no painel.</p>
      </div>

      <div style="text-align: center; margin: 32px 0 20px 0;">
        <a href="${process.env.APP_URL || 'https://viralforge.ai'}/configuracoes" style="background-color: #EF4444; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">Ir para Configurações e Cobrança</a>
      </div>

      <hr style="border: none; border-top: 1px solid #1E1E2E; margin: 30px 0 20px 0;" />
      <p style="font-size: 11px; text-align: center; color: #555577;">ViralForge AI - Cobranças Recorrentes via Asaas SDK.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject: "Aviso Importante: Fatura em Aberto no ViralForge AI",
    html: overdueHtml
  });
}
