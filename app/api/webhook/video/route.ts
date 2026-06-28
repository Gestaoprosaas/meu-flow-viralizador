import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Webhook handler to receive video generation status updates from Kling status or manual callbacks
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Webhook de Vídeo recebido corrido:', body);

    const { jobId, status, videoUrl, error } = body;

    if (!jobId) {
      return NextResponse.json({ error: 'Identificador do job ausente (jobId).' }, { status: 400 });
    }

    if (!status || !['completed', 'failed', 'processing'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido recebido no callback.' }, { status: 400 });
    }

    // Since webhook is server-to-server and lacks browser cookies, 
    // we bypass default cookie storage parsing using a non-cookie server client
    // with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or anon key depending on your rules)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return []; },
        setAll() {}
      }
    });

    // Update video_generations row based on Kling callback outcomes
    const { data: updatedRecord, error: updateError } = await supabase
      .from('video_generations')
      .update({
        status: status as 'processing' | 'completed' | 'failed',
        video_url: videoUrl || null,
        created_at: new Date().toISOString() // refresh timestamp to bubble-up
      })
      .eq('id', jobId)
      .select()
      .single();

    if (updateError) {
      console.error('Falha ao atualizar registro de vídeo via Webhook:', updateError);
      return NextResponse.json({ error: 'Falha interna ao sincronizar webhook com o banco de dados.' }, { status: 500 });
    }

    console.log(`[Webhook Sucesso] Vídeo com jobId ${jobId} atualizado para status "${status}" com URL "${videoUrl}"`);

    return NextResponse.json({ 
      success: true, 
      message: 'Status do vídeo atualizado com sucesso via callback.',
      data: updatedRecord 
    });

  } catch (err: any) {
    console.error('Erro geral no processador de webhook de vídeo:', err);
    return NextResponse.json({ error: err.message || 'Falha no processamento do webhook.' }, { status: 500 });
  }
}
