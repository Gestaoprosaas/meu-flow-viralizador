import { NextResponse } from 'next/server';
import { createClient } from './server.js';

export type CreditType = 'text' | 'image' | 'video';

/**
 * Reusable wrapper middleware for Next.js API Route Handlers.
 * Verifies if user has available credits of standard type ('text', 'image', or 'video')
 * before processing the request. Rejects with 401 or 403 status if unauthorized or insufficient.
 */
export function withCreditsCheck(
  handler: (request: Request, user: any, ...args: any[]) => Promise<Response>,
  creditType: CreditType
) {
  return async (request: Request, ...args: any[]) => {
    try {
      const supabase = await createClient();

      // 1. Authenticate user session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json(
          { error: 'Sessão expirada. Por favor, faça login novamente.' },
          { status: 401 }
        );
      }

      // 2. Execute SQL RPC check_credits (or manual fallback query if RPC isn't deployed)
      const { data: hasCredits, error: rpcError } = await supabase.rpc('check_credits', {
        user_id: user.id,
        credit_type: creditType,
      });

      if (rpcError) {
        console.warn('RPC check_credits failed, attempting direct profile table fallback query...', rpcError);
        const { data: profile, error: dbError } = await supabase
          .from('profiles')
          .select('credits_text, credits_image, credits_video')
          .eq('id', user.id)
          .single();

        if (dbError || !profile) {
          return NextResponse.json(
            { error: 'Perfil do usuário não encontrado para verificação de quotas.' },
            { status: 404 }
          );
        }

        const balance =
          creditType === 'text'
            ? profile.credits_text
            : creditType === 'image'
            ? profile.credits_image
            : profile.credits_video;

        if (balance <= 0) {
          return NextResponse.json(
            { error: 'Créditos insuficientes de inteligência artificial. Adquira mais créditos!' },
            { status: 403 }
          );
        }
      } else if (!hasCredits) {
        return NextResponse.json(
          { error: 'Créditos insuficientes de inteligência artificial. Adquira mais créditos!' },
          { status: 403 }
        );
      }

      // 3. Delegate execution directly to the wrapped API Handler
      return await handler(request, user, ...args);
    } catch (err: any) {
      console.error('Credits checking middleware internal error:', err);
      return NextResponse.json(
        { error: 'Houve uma falha interna na validação de limites de crédito.' },
        { status: 500 }
      );
    }
  };
}
