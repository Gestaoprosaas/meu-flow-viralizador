export interface AvatarPreset {
  id: string;
  name: string;
  gender: 'FEMININO' | 'MASCULINO';
  description: string;
  imageUrl: string;
  videoUrl?: string;
  format?: string;
}

export const AVATARS_PRESETS: AvatarPreset[] = [
  {
    id: 'Giovanna',
    name: 'Giovannaa',
    gender: 'FEMININO',
    description: 'Mulher jovem de pele clara, cabelos longos, lisos e castanho-escuros, maquiagem elegante com destaque para os lábios, usando uma regata branca ajustada e calça jeans. Possui acessórios prateados discretos, pequenas tatuagens nos braços e transmite um estilo moderno, confiante e sofisticado em uma selfie diante do espelho',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/download%20(4).jpg'
  },
  {
    id: 'Leticia',
    name: 'Leticia',
    gender: 'FEMININO',
    description: 'Mulher jovem de pele clara, cabelos longos loiro-platinados, rosto delicado, lábios volumosos e maquiagem natural. Usa um top preto com uma flor branca em destaque e um colar dourado, transmitindo um estilo moderno, elegante e sofisticado em um ambiente externo ensolarado.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/3133fe6dd9542230f3731a6b67ac4920.jpg'
  },
  {
    id: 'Beatriz',
    name: 'Beatriz',
    gender: 'FEMININO',
    description: 'Mulher jovem de pele morena clara, cabelos longos cacheados castanho-escuros, usando óculos de armação grande, maquiagem natural e vestido preto de decote profundo. Transmite um estilo elegante, moderno e sofisticado, com acessórios dourados discretos e expressão serena',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/ca14bd71d632c9236a520ba2d7e850f2.jpg'
  },
  {
    id: 'Aline',
    name: 'Aline',
    gender: 'FEMININO',
    description: 'jovem cabelo loiro, pele clara, maquiagem natural, usando blusa branca e brincos discretos. Transmite um estilo moderno e elegante, com expressão confiante e sorriso suave.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Aline.jpg'
  },
  {
    id: 'Carlos',
    name: 'Carlos',
    gender: 'MASCULINO',
    description: 'Homem jovem de pele clara, cabelo curto no interior de um carro.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Carlos.jpg'
  },
  {
    id: 'Helen',
    name: 'Helen',
    gender: 'FEMININO',
    description: 'Jovem Loira com blusinha da cor azul, pele clara, cabelo liso e maquiagem natural. Transmite um estilo moderno e elegante, com expressão confiante e sorriso suave.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Helen.jpg'
  },
  {
    id: 'Igor',
    name: 'Igor',
    gender: 'MASCULINO',
    description: 'Homem jovem moreno com visual moderno e elegante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Igor.jpg'
  },
  {
    id: 'Jhon',
    name: 'Jhon',
    gender: 'MASCULINO',
    description: 'Homem jovem de pele clara, cabelo curto e sorriso confiante. Transmite um estilo moderno e elegante, com expressão segura e postura erguida.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Jhon.jpg'
  },
  {
    id: 'Julia',
    name: 'Julia',
    gender: 'FEMININO',
    description: 'Jovem cabelo liso com preto com castanho.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Julia.jpg'
  },
  {
    id: 'Julio',
    name: 'Julio',
    gender: 'MASCULINO',
    description: 'Jovem super estiloso e confiante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/julio.jpg'
  },
  {
    id: 'Naty',
    name: 'Naty',
    gender: 'FEMININO',
    description: 'Jovem moderna e elegante, com expressão confiante e sorriso exuberante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Naty.jpg'
  },
  {
    id: 'Rafah',
    name: 'Rafah',
    gender: 'MASCULINO',
    description: 'Jovem estiloso com visual moderno e elegante.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Rafah.jpg'
  },
  {
    id: 'Sabrina',
    name: 'Sabrina',
    gender: 'FEMININO',
    description: 'Jovem super elegante, com expressão confiante e sorriso suave.',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Sabrina.jpg'
  },

  

];
