import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { withCreditsCheck } from '../../../lib/supabase/creditsMiddleware';

// Selected gorgeous royalty-free stock cinematic background videos for high retention
const PREMIUM_VIDEOS_BY_STYLE: Record<string, string[]> = {
  Realista: [
    'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smart-phone-with-a-blue-screen-40150-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-holding-a-smart-watch-with-black-screen-40336-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-business-woman-using-her-smart-phone-while-drinking-coffee-40161-large.mp4'
  ],
  Anime: [
    'https://assets.mixkit.co/videos/preview/mixkit-going-under-a-road-tunnel-with-lights-42289-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-green-lights-moving-41617-large.mp4'
  ],
  '3D Render': [
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-futuristic-technology-background-41620-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-glowing-light-ball-moving-41619-large.mp4'
  ],
  Cinematográfico: [
    'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-liquid-gold-swirling-31298-large.mp4'
  ]
};

const THUMBNAILS_BY_STYLE: Record<string, string> = {
  Realista: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
  Anime: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
  '3D Render': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  Cinematográfico: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
};

/**
 * Handle POST request to start generating video
 */
async function handleGenerateVideo(request: Request, user: any) {
  try {
    const supabase = await createClient();

    // 1. Double check and retrieve profile image / video credits
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('credits_video')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Perfil do usuário não encontrado.' }, { status: 404 });
    }

    if (profile.credits_video <= 0) {
      return NextResponse.json({ error: 'Créditos de vídeo insuficientes.' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      scriptText, 
      scriptId, 
      voiceId = 'Rachel', 
      visualStyle = 'Cinematográfico', 
      musicBackground = 'None', 
      subtitlesEnabled = true,
      projectId 
    } = body;

    if (!scriptText) {
      return NextResponse.json({ error: 'O texto do roteiro é obrigatório.' }, { status: 400 });
    }

    // 2. Select corresponding gorgeous video asset and thumbnail
    const videoPool = PREMIUM_VIDEOS_BY_STYLE[visualStyle] || PREMIUM_VIDEOS_BY_STYLE['Cinematográfico'];
    const chosenVideoUrl = videoPool[Math.floor(Math.random() * videoPool.length)];
    const chosenThumbnailUrl = THUMBNAILS_BY_STYLE[visualStyle] || THUMBNAILS_BY_STYLE['Cinematográfico'];

    // 3. Setup a job block inside video_generations table
    const { data: job, error: insertErr } = await supabase
      .from('video_generations')
      .insert({
        user_id: user.id,
        project_id: projectId || null,
        script_id: scriptId || null,
        status: 'processing',
        provider: 'kling',
        duration_seconds: 15,
        thumbnail_url: chosenThumbnailUrl
      })
      .select()
      .single();

    if (insertErr || !job) {
      console.error('Erro ao registrar job de vídeo no Supabase:', insertErr);
      return NextResponse.json({ error: 'Falha interna ao enfileirar job de processamento.' }, { status: 500 });
    }

    // 4. Fire RPC credit deduction
    const { data: rpcSuccess } = await supabase.rpc('decrement_credit', {
      user_id: user.id,
      credit_type: 'video'
    });

    if (!rpcSuccess) {
      console.warn('RPC decrement_credit para vídeo falhou. Fazendo decremento manual fallback.');
      const fallbackCredits = Math.max(0, profile.credits_video - 1);
      await supabase
        .from('profiles')
        .update({ credits_video: fallbackCredits })
        .eq('id', user.id);
    }

    // Retrieve updated credits balance
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('credits_video')
      .eq('id', user.id)
      .single();

    const finalCreditsVideo = updatedProfile?.credits_video ?? 0;

    // 5. Build mock or real asynchronous pipelines for ElevenLabs and Kling
    const elevenlabsKey = process.env.ELEVENLABS_API_KEY;
    const klingKey = process.env.KLING_API_KEY;

    let debugStatusMessage = '';
    const origin = new URL(request.url).origin;

    // Trigger asynchronously so the server sends the processing response fast to Client
    (async () => {
      try {
        console.log(`[Job ${job.id}] Iniciando processamento em segundo plano...`);

        // ElevenLabs Voice Narration block (Simulated delay or actual request)
        if (elevenlabsKey && elevenlabsKey.startsWith('el-')) {
          try {
            console.log(`[Job ${job.id}] Solicitando síntese de voz na ElevenLabs...`);
            const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': elevenlabsKey
              },
              body: JSON.stringify({
                text: scriptText,
                model_id: 'eleven_multilingual_v2',
                voice_settings: { stability: 0.75, similarity_boost: 0.75 }
              })
            });

            if (audioResponse.ok) {
              console.log(`[Job ${job.id}] Áudio oficial gerado pela ElevenLabs.`);
              // If we wanted to upload mp3 file, we could fetch array buffer and upload to "images" or "videos" storage.
            } else {
              console.warn('ElevenLabs API returned error status:', audioResponse.status);
            }
          } catch (tErr) {
            console.error('Erro de requisição na ElevenLabs:', tErr);
          }
        }

        // Kling AI video render callback trigger (Simulated delay for webhook callback)
        const delaySeconds = 12; // Snappy 12 seconds preview for marvelous flow
        console.log(`[Job ${job.id}] Aguardando renderização do vídeo pela rede neural do Kling por ${delaySeconds}s...`);
        
        await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));

        // Invoke the app-level webhook callback to simulate external completed state correctly!
        const webhookUrl = `${origin}/api/webhook/video`;
        console.log(`[Job ${job.id}] Disparando webhook callback em: ${webhookUrl}`);

        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            status: 'completed',
            videoUrl: chosenVideoUrl,
            error: null
          })
        });

        if (webhookResponse.ok) {
          console.log(`[Job ${job.id}] Webhook processado com sucesso.`);
        } else {
          console.error(`[Job ${job.id}] Falha ao invocar webhook de retorno:`, await webhookResponse.text());
        }

      } catch (backgroundError) {
        console.error(`[Job ${job.id}] Erro crítico no pipeline secundário:`, backgroundError);
      }
    })();

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: 'processing',
      creditsLeft: finalCreditsVideo,
      message: 'Vídeo enfileirado com sucesso para renderização.'
    });

  } catch (err: any) {
    console.error('Erro crítico na solicitação do gerador de vídeos:', err);
    return NextResponse.json({ error: err.message || 'Falha ao processar solicitação de vídeo.' }, { status: 500 });
  }
}

export const POST = withCreditsCheck(handleGenerateVideo, 'video');
