export interface ScenarioPreset {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  format?: string;
}

export interface CuratedScenarioPreset extends ScenarioPreset {
  referenceImageUrl: string;
  isCurated: true;
}

export const SCENARIOS_PRESETS: ScenarioPreset[] = [
  {
    id: 'quarto',
    name: 'Quarto',
    type: 'Residencial',
    description: 'Ambiente de quarto aconchegante com cordões de luz quente (fairy lights) de fundo.',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'estudio',
    name: 'Estúdio',
    type: 'Profissional',
    description: 'Estúdio de gravação comercial limpo, spots de luz dedicados, luzes de neon e fundo cinza estético.',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'ar_livre',
    name: 'Ar Livre',
    type: 'Externo',
    description: 'Parque natural ensolarado com bastante grama, flores sob iluminação solar agradável.',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'academia',
    name: 'Academia',
    type: 'Fitness',
    description: 'Instalação fitness moderna com esteiras, anilhas de peso e luzes em trilho de LED.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    type: 'Residencial',
    description: 'Cozinha integrada premium com bancada de quartzo clara e louças decorativas ao fundo.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'escritorio',
    name: 'Escritório',
    type: 'Corporativo',
    description: 'Escritório executivo contemporâneo com mesa de carvalho, plantas e notebook.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'banheiro',
    name: 'Banheiro',
    type: 'Residencial',
    description: 'Banheiro luxuoso de hotel cinco estrelas com espelho iluminado por fita de LED quente.',
    imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'Comercial',
    description: 'Vitrines comerciais elegantes e corredores iluminados, plano de fundo com bokeh fino.',
    imageUrl: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'natureza',
    name: 'Natureza',
    type: 'Externo',
    description: 'Montanhas verdejantes distantes sob um lindo céu ensolarado de verão.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'minimalista',
    name: 'Minimalista',
    type: 'Interior',
    description: 'Sala escandinava clean e vazia repleta de luz suave do pôr do sol entrando pela lateral.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300'
  }
];

export const CURATED_SCENARIOS_PRESETS: CuratedScenarioPreset[] = [
  {
    id: 'Fundo Espelho + Porta',
    name: 'Fundo Espelho + Porta',
    type: 'Pronto',
    description: 'Ambiente interno de quarto com fundo de espelho e porta, iluminação natural suave.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.04.13.jpeg',
    referenceImageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.04.13.jpeg',
    isCurated: true
  },
  {
    id: 'Guarda Roupa Com Luminária Atrás',
    name: 'Guarda Roupa Com Luminária Atrás',
    type: 'Pronto',
    description: 'Ambiente interno de quarto com guarda-roupa e luminária atrás, iluminação suave e aconchegante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.18.04.jpeg',
    referenceImageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.18.04.jpeg',
    isCurated: true
  },
  {
    id: 'Sala + Cortina feixe de luz',
    name: 'Sala + Cortina feixe de luz',
    type: 'Pronto',
    description: 'Ambiente interno de sala com cortina e feixe de luz, iluminação suave e aconchegante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.21.jpeg',
    referenceImageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.21.jpeg',
    isCurated: true
  },
  {
    id: 'Quarto Rústico',
    name: 'Quarto Rústico',
    type: 'Pronto',
    description: 'Ambiente interno de quarto rústico com elementos de madeira e texturas naturais.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.21%20(1).jpeg',
    referenceImageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.21%20(1).jpeg',
    isCurated: true
  },
  {
    id: 'Parede Com Piso',
    name: 'Parede Com Piso',
    type: 'Pronto',
    description: 'Ambiente interno com parede e piso em materiais naturais, criando um espaço acolhedor e rústico.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.22.jpeg',
    referenceImageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.22.jpeg',
    isCurated: true
  },
  {
    id: 'Meio Da Cozinha Entre a Sala',
    name: 'Meio Da Cozinha Entre a Sala',
    type: 'Pronto',
    description: 'Ambiente interno com cozinha e sala conectadas, criando um espaço funcional e aconchegante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.42.14.jpeg',
    referenceImageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.42.14.jpeg',
    isCurated: true
  }
];