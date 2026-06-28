import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { sendWelcomeEmail, sendPaymentOverdueEmail } from '../../../lib/resend';

// Helper to determine plan name based on transaction value
function getPlanByValue(value: number): 'starter' | 'pro' | 'agency' | 'free' {
  if (value >= 400) return 'agency';
  if (value >= 150) return 'pro';
  if (value >= 80) return 'starter';
  return 'free';
}

// Define matching limits for each plan level
function getPlanLimits(plan: 'free' | 'starter' | 'pro' | 'agency') {
  if (plan === 'starter') return { text: 50, image: 30, video: 3 };
  if (plan === 'pro') return { text: 200, image: 100, video: 15 };
  if (plan === 'agency') return { text: 999, image: 500, video: 60 };
  return { text: 10, image: 5, video: 0 }; // free
}

/**
 * Asaas Webhook Route Router
 * Parses PAYMENT_CONFIRMED, PAYMENT_OVERDUE, and SUBSCRIPTION_CANCELLED actions
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('[Asaas Webhook Received Payload]:', JSON.stringify(payload, null, 2));

    const { event, subscription: asaasSubscriptionId } = payload;
    
    // In Asaas, payment details reside inside the payment key or as direct properties for single charges
    const payment = payload.payment || {};
    const customerId = payment.customer || payload.customer || '';
    const paymentValue = payment.value || payload.value || 0;
    
    // We can extract customer email/name from payload metadata or mock it if missing
    const customerEmail = payment.customerEmail || payload.customerEmail || '';
    const customerName = payment.customerName || payload.customerName || 'Assinante Forge';

    if (!event) {
      return NextResponse.json({ error: 'Evento do webhook ausente.' }, { status: 400 });
    }

    // Initialize Supabase using service key context to bypass RLS for webhook synchronization
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return []; },
        setAll() {}
      }
    });

    let userId: string | null = null;
    let userEmail: string = customerEmail;
    let userName: string = customerName;

    // 1. LOOKUP USER BY SUBSCRIPTION ID OR CUSTOMER ID IN DATABASE
    if (asaasSubscriptionId) {
      const { data: dbSub, error: subError } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('asaas_subscription_id', asaasSubscriptionId)
        .maybeSingle();

      if (dbSub && dbSub.user_id) {
        userId = dbSub.user_id;
      }
    }

    // 2. FALLBACK LOOKUP BY EMAIL
    if (!userId && userEmail) {
      const { data: dbProfile, error: profError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('email', userEmail)
        .maybeSingle();

      if (dbProfile) {
        userId = dbProfile.id;
        if (dbProfile.name) userName = dbProfile.name;
        if (dbProfile.email) userEmail = dbProfile.email;
      }
    }

    if (!userId) {
      console.warn(`[Asaas Webhook] Usuário não localizado no banco de dados para email: "${userEmail}" ou sub: "${asaasSubscriptionId}"`);
      // Since it's a test/simulation, we can proceed with a 200 to acknowledge receipt of event
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook recebido, mas nenhum usuário corrispondente estava registrado no banco de dados.' 
      });
    }

    // 3. EXECUTE ACTIONS BASED ON EVENT TYPE
    switch (event) {
      case 'PAYMENT_CONFIRMED': {
        const assignedPlan = getPlanByValue(paymentValue);
        const limits = getPlanLimits(assignedPlan);

        console.log(`[Webhook Confirmado] Ativando Plano: "${assignedPlan}" para usuário: ${userId}`);

        // Update Profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            plan: assignedPlan,
            credits_text: limits.text,
            credits_image: limits.image,
            credits_video: limits.video
          })
          .eq('id', userId);

        if (profileError) {
          throw new Error(`Falha ao atualizar perfil com créditos e plano: ${profileError.message}`);
        }

        // Log sub confirm status
        if (asaasSubscriptionId) {
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              plan: assignedPlan,
              status: 'active',
              asaas_subscription_id: asaasSubscriptionId,
              current_period_end: new Date(Date.now() + 31 * 24 * 3600 * 1000).toISOString() // 1 month from now
            }, { onConflict: 'asaas_subscription_id' });
        }

        // Record Audit log
        await supabase
          .from('audit_logs')
          .insert({
            user_id: userId,
            action: 'RECARGA_ASSINATURA',
            resource: 'profiles',
            metadata: { event, plan: assignedPlan, value: paymentValue }
          });

        // Trigger welcome email notification via Resend wrapper
        if (userEmail) {
          await sendWelcomeEmail(userEmail, userName, assignedPlan);
        }

        break;
      }

      case 'PAYMENT_OVERDUE': {
        console.log(`[Webhook Vencido] Alerta de cobrança atrasada para usuário: ${userId}`);
        
        if (asaasSubscriptionId) {
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('asaas_subscription_id', asaasSubscriptionId);
        }

        await supabase
          .from('audit_logs')
          .insert({
            user_id: userId,
            action: 'COBRANCA_EM_ATRASO',
            resource: 'profiles',
            metadata: { event, email: userEmail }
          });

        // Trigger payment overdue email notification via Resend
        if (userEmail) {
          await sendPaymentOverdueEmail(userEmail, userName);
        }

        break;
      }

      case 'SUBSCRIPTION_CANCELLED': {
        console.log(`[Webhook Cancelado] Downgrade para Free: usuário ${userId}`);
        
        // Downgrade user back to free capabilities
        const freeLimits = getPlanLimits('free');
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            credits_text: freeLimits.text,
            credits_image: freeLimits.image,
            credits_video: freeLimits.video
          })
          .eq('id', userId);

        if (asaasSubscriptionId) {
          await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('asaas_subscription_id', asaasSubscriptionId);
        }

        await supabase
          .from('audit_logs')
          .insert({
            user_id: userId,
            action: 'CANCELAMENTO_PLANO',
            resource: 'profiles',
            metadata: { event, subscriptionId: asaasSubscriptionId }
          });

        break;
      }

      default:
        console.log(`[Asaas Webhook] Evento ignorado ou não rastreado: ${event}`);
    }

    return NextResponse.json({ 
      success: true, 
      event, 
      processedFor: userId 
    });

  } catch (err: any) {
    console.error('Erro geral no router de webhook do Asaas:', err);
    return NextResponse.json({ error: err.message || 'Falha no processamento.' }, { status: 500 });
  }
}
