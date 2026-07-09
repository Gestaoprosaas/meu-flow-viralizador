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
    id: 'novelinha-dramatica',
    nome: 'Novelinha Dramática em 3 Partes',
    categoria: 'DRAMA',
    tempoResultado: '3-7 dias para viralizar',
    dificuldade: 'Fácil',
    descricao: 'As pessoas adoram fofoca e drama. Criar um mini-drama que precisa de parte 2 é a forma mais rápida de gerar seguidores ansiosos pelo próximo capítulo.',
    imageUrl: 'https://images.unsplash.com/photo-1516280440508-251f2249e0c7?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '', // preencho depois com URL do Supabase Storage
    prompt: `Create a vertical 9:16 TikTok video. Brazilian female avatar, 22 years old, emotional expression. Scene 1 (0-3s): Avatar looks directly at camera with teary eyes and says "I can't believe he did this to me". Scene 2 (3-6s): Avatar turns away dramatically. Scene 3 (6-9s): Avatar looks back with determined expression "but I'll show everyone". Dramatic music, subtitle text visible, realistic bedroom background, cinematic lighting. End with "Part 2 coming tomorrow" text overlay. No audio narration needed, just expressions and subtitle text.`,
  },
  {
    id: 'pov-relatable',
    nome: 'POV Situação Relatable',
    categoria: 'COMÉDIA',
    tempoResultado: '1-3 dias',
    dificuldade: 'Muito Fácil',
    descricao: 'Situações do dia a dia geram o sentimento de "eu também passo por isso". Esses vídeos são altamente compartilháveis.',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 TikTok POV video. Brazilian avatar, casual home environment. Text overlay at top: "POV: você chegou em casa depois de um dia horrível". Avatar enters door looking exhausted, drops bag, collapses on couch dramatically. Comedic timing, relatable energy. Add subtitle: "todo dia a mesma coisa 😭". Realistic lighting, 8-10 seconds. Trending audio style.`,
  },
  {
    id: 'transformacao-antes-depois',
    nome: 'Transformação Antes e Depois',
    categoria: 'INSPIRAÇÃO',
    tempoResultado: '2-5 dias',
    dificuldade: 'Fácil',
    descricao: 'O contraste entre o "antes" e o "depois" prende o olhar. Mostre resultados expressivos nos primeiros 3 segundos.',
    imageUrl: 'https://images.unsplash.com/photo-1522849696084-818b29cf3733?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 transformation TikTok video. Split screen or transition effect. Brazilian female avatar. Left/Before: casual clothes, no makeup, tired expression. Right/After: styled outfit, confident smile, energetic pose. Transition with flash effect at center. Text overlay: "30 dias depois 🔥". Motivational energy, trending transformation music style. 8 seconds total.`,
  },
  {
    id: 'segredo-revelado',
    nome: 'Segredo que Ninguém Te Contou',
    categoria: 'EDUCAÇÃO',
    tempoResultado: '1-2 dias',
    dificuldade: 'Fácil',
    descricao: 'O gatilho da exclusividade. Falar baixo e agir como se estivesse revelando um segredo obscuro prende a atenção imediatamente.',
    imageUrl: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 TikTok "secret reveal" video. Brazilian avatar, close-up shot, conspiratorial expression, finger over lips gesture at start. Text overlay: "o segredo que os grandes criadores escondem 🤫". Avatar leans toward camera and whispers. Dramatic zoom in. Text builds up: "consistência > perfeição". End with avatar pointing at viewer. 10 seconds, dark aesthetic, trending audio.`,
  },
  {
    id: 'resposta-hater',
    nome: 'Resposta à Hater (Motivacional)',
    categoria: 'MOTIVAÇÃO',
    tempoResultado: '24-48 horas',
    dificuldade: 'Fácil',
    descricao: 'Histórias de superação contra críticos geram empatia imediata e milhares de comentários de apoio.',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 TikTok motivational response video. Brazilian avatar, confident posture, direct eye contact with camera. Text overlay at top: "alguém me disse que eu nunca ia crescer no TikTok". Avatar smiles confidently. Text appears: "hoje tenho X seguidores". Avatar shrugs and winks. End text: "acredite em você mesmo 💜". Empowerment energy, 8-10 seconds, bright studio lighting.`,
  },
  {
    id: 'trend-produto',
    nome: 'Trend com Produto (UGC Viral)',
    categoria: 'PRODUTO',
    tempoResultado: '2-4 dias',
    dificuldade: 'Médio',
    descricao: 'O jeito perfeito de vender sem parecer que está vendendo. Usar trends nativas com produtos gera curiosidade natural.',
    imageUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 TikTok UGC product trend video. Brazilian female avatar, aesthetic home background. Avatar holds product and does trending "pointing" gesture revealing product. Text overlay: "achei o produto que todo mundo tá procurando 👀". Close up on product. Avatar's genuine surprised/excited reaction. Trending audio style. 8 seconds. Viral unboxing energy.`,
  },
  {
    id: 'storyline-7-dias',
    nome: 'Storyline de 7 Dias',
    categoria: 'SÉRIE',
    tempoResultado: '7-14 dias',
    dificuldade: 'Médio',
    descricao: 'Documentar uma jornada gera forte conexão emocional e incentiva as pessoas a te seguirem para acompanhar o resultado.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 TikTok series intro video. Brazilian avatar, direct camera address. Text: "Dia 1: vou documentar tudo". Avatar speaks earnestly: "hoje começo do zero. sem seguidores, sem nada". Determination in eyes. Text overlay: "acompanha essa jornada comigo 🙏". End with "Dia 2 amanhã" card. Authentic vlog style, natural lighting. 10 seconds.`,
  },
  {
    id: 'dueto-stitch-comentario',
    nome: 'Dueto/Stitch Comentário Viral',
    categoria: 'ENGAJAMENTO',
    tempoResultado: '24 horas',
    dificuldade: 'Muito Fácil',
    descricao: 'Aproveitar o engajamento de um vídeo que já está viral é a estratégia mais rápida para roubar tráfego.',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600&h=800',
    videoUrl: '',
    prompt: `Create a vertical 9:16 TikTok reaction/comment video. Brazilian avatar, casual setting, genuinely surprised expression. Text: "eu precisava comentar sobre isso 👀". Avatar reacts dramatically with hand over mouth gesture. Speaks directly to camera with urgency. Text builds: "vocês precisam ver isso também". Share/tag gesture at end. 8 seconds, authentic energy, trending reaction style.`,
  },
];
