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
    id: 'curated_quarto_gamer',
    name: 'Quarto Gamer Neon',
    type: 'Pronto',
    description: 'Estilo gamer moderno com luzes de LED neon azul e rosa, cadeira ergonômica premium ao fundo.',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=300',
    referenceImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
    isCurated: true
  },
  {
    id: 'curated_estudio_podcast',
    name: 'Estúdio Podcast Pro',
    type: 'Pronto',
    description: 'Estúdio profissional acústico com microfone de mesa premium e iluminação indireta quente.',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=300',
    referenceImageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    isCurated: true
  },
  {
    id: 'curated_cafe_paris',
    name: 'Varanda Café Paris',
    type: 'Pronto',
    description: 'Ambiente externo de uma cafeteria europeia clássica com mesas de metal e calçada charmosa.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=300',
    referenceImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    isCurated: true
  },
  {
    id: 'curated_cozinha_chef',
    name: 'Cozinha Gourmet Luxo',
    type: 'Pronto',
    description: 'Cozinha de luxo moderna com ilha de mármore branco e armários planejados de tom sóbrio.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=300',
    referenceImageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    isCurated: true
  },
  {
    id: 'curated_escritorio_executivo',
    name: 'Escritório Faria Lima',
    type: 'Pronto',
    description: 'Escritório corporativo moderno em andar alto de vidro, vista para a cidade e luz do dia abundante.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=300',
    referenceImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    isCurated: true
  },
  {
    id: 'curated_academia_fit',
    name: 'Espaço Crossfit / Musculação',
    type: 'Pronto',
    description: 'Ambiente fitness de alto padrão com halteres, barras e paredes de concreto rústico industrial.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300',
    referenceImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    isCurated: true
  }
];
