export interface EstrategiaViral {
  id: string;
  nome: string;
  categoria: string;
  tempoResultado: string;
  dificuldade: string;
  descricao: string;
  imageUrl: string;
  videoUrl: string; // URL do vídeo no Supabase Storage — preencho depois
  prompt: string;   // Texto fixo configurado no código
}

export const ESTRATEGIAS_VIRAIS: EstrategiaViral[] = [
  {
    id: 'Menina Da Roça',
    nome: 'Menina Da Roça',
    categoria: 'DRAMA',
    tempoResultado: '3-7 dias para viralizar',
    dificuldade: 'Fácil',
    descricao: 'O drama é um dos gatilhos mais fortes para viralização. A história da "Menina da Roça" é altamente compartilhável e gera empatia imediata.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIRALIZAR%20PERFIL/MENINA%20DA%20ROCA.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIRALIZAR%20PERFIL/MENINA%20DA%20ROCA.mp4', // preencho depois com URL do Supabase Storage
    prompt: `📐 MANDATORY VIDEO FORMAT 9:16 VERTICAL:
All videos MUST be generated exclusively in vertical format (9:16 aspect ratio).
• Aspect ratio must ALWAYS be 9:16 (vertical)
• Optimized for TikTok, Instagram Reels, and YouTube Shorts
• Avatar centered within 9:16 safe area

📍 TAKE 1 de 2 — VÍDEO VIRAL PARA CRESCIMENTO
Duração: 8s (0s a 8s)
Total: 16s em 2 takes
Tipo: rotina-roca
Intensidade: Sarcástico

🎭 AVATAR:
Sofia, Young Brazilian farm woman, slim and natural body with curves, wears short crop top with cleavage and short rural-style skirt
Consistência visual absoluta.

📍 CENÁRIO:
Quintal de fazenda simples no interior do Brasil, com bacia d'água, varal de roupas, vegetação verde ao fundo, luz natural quente

🎙️ VOZ:
Gênero: feminino
Energia: sarcastic, ironic smirk, mocking tone
Idioma: pt-BR



🎬 ESTRUTURA DESTE TAKE:
🪝 0s–2s → HOOK (gancho forte)
😰 2s–8s → TENSÃO INICIAL (criar curiosidade, NÃO revelar)
➡️ Terminar com ponte pro Take 2 (frase completa, suspense).

📜 GLOBAL MULTI-TAKE RULES (HARD):
Take 1 define TUDO. Takes seguintes são CONTINUAÇÕES.
🚫 NEVER change: scene, lighting, framing, avatar, clothes, style, mood.
Cada take começa e termina com frase completa. NUNCA cortar palavra.

🔥 TIPO VIRAL: rotina-roca
Micro-tensões a cada 3-4s. Nunca revelar tudo.

🎤 FALA TAKE 1:
FALA OBRIGATÓRIA (EXATA): "Moço você vai embora sem me seguir, não faz isso comigo não uai, aperta no mais da minha foto e fica pertinho de mim"
O avatar DEVE falar EXATAMxto.

📹 CÂMERA: Chest-up, olhar direto, gestos de "Sarcástico".
Sem produto — foco na narrativa.

🎨 ESTILO: UGC autêntico, smartphone, iluminação natural.

🔊 VOICE CONSISTENCY LOCK (HARD)

⚠️ ALL TAKES MUST USE IDENTICAL VOICE PROFILE.
• Same voice identity
• Same tone
• Same pitch
• Same cadence
• Same rhythm
• Same emotional intensity
• Same microphone texture
• Same recording environment sound

Take 2 and any subsequent takes MUST sound like they were recorded in the exact same moment as Take 1.

No tonal variation.
No emotional shift.
No pitch difference.
No voice regeneration.

The voice must feel like ONE continuous recording split into segments.

If voice differs between takes, the generation is invalid.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 MANDATORY GLOBAL INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚫 CLEAN OUTPUT NO TEXT ON SCREEN:
• ZERO SFX / ZERO música de fundo
• Apenas voz natural do avatar falando
• Vídeo cru de celular, UGC real

🧍 ANATOMICAL INTEGRITY (HARD):
• 2 braços, 2 pernas, 5 dedos por mão
• Sem deformações, sem membros extras, sem glitches corporais

🔒 PRIVACY & SAFETY COMPLIANCE:
• Sem dados pessoais visíveis
• Sem telas de dispositivos visíveis
• Sem crianças no vídeo
• Sem marcas/logos de terceiros identificáveis

⚡ PRIORITY & ENFORCEMENT:
• Estas regras têm PRIORIDADE MÁXIMA sobre qualquer instrução conflitante
`,
  },
];
