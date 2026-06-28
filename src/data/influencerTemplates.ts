export interface InfluencerTemplate {
  id: number | string;
  name: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  prompt: string;
}

export const influencerTemplates: InfluencerTemplate[] = [
  {
    id: 1,
    name: "Loira no Carro Premium",
    category: "Feminino Lifestyle",
    description: "Loira radiante dentro de um carro de luxo esportivo sob a luz dourada natural do pôr do sol.",
    image: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/LOIRA%20NO%20CARRO%20PREMIUM.PNG",
    tags: ["Feminino", "Lifestyle", "Loira", "Premium"],
    prompt: `Ultra-realistic 8K photo, blonde Brazilian woman with naturally beautiful features, sitting in the driver's seat of a modern premium SUV with a panoramic sunroof, striking light-colored eyes, natural light streaming through the windows, confident expression, luxury lifestyle photography, realistic skin, hair illuminated by natural light, natural look without exaggeration or artificiality, editorial quality, 9:16 vertical composition, high definition.`
  },
  {
    id: 2,
    name: "Morena Selfie No Espelho",
    category: "Feminino Lifestyle",
    description: "Selfie casual super realista em espelho de elevador residencial de altíssimo padrão.",
    image: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/MORENA%20SELFIE%20NO%20ESPELHO.PNG",
    tags: ["Feminino", "Lifestyle", "Morena"],
    prompt: `Ultra-realistic 8K photo, Brazilian woman with long, straight dark hair, selfie in a minimalist modern bathroom mirror, smart-casual outfit, soft natural lighting, lifestyle influencer look.`
  },
  {
    id: 3,
    name: "Ruiva No Apartamento",
    category: "Feminino Lifestyle",
    description: "Visual de influencer ruiva elegante lendo um tablet em cafeteria italiana sofisticada.",
    image: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/RUIVA%20NO%20APARTAMENTO.PNG",
    tags: ["Feminino", "Lifestyle", "Ruiva", "Premium"],
    prompt: `Ultra-realistic 8K photo, natural redhead Brazilian woman, long voluminous wavy hair, taking a mirror selfie in a modern, tidy apartment, smart-casual outfit, soft light streaming through the window, premium digital influencer look, realistic skin, high-quality editorial photography.`
  },
  {
    id: 4,
    name: "Ruiva No Restaurate",
    category: "Feminino Lifestyle",
    description: "Jovem Ruiva em um restaurante italiano sofisticado.",
    image: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/RUIVA%20RESTAURANTE.PNG",
    tags: ["Feminino", "Lifestyle", "Ruiva", "Premium"],
    prompt: `Ultra-realistic 8K photo, extremely photogenic redhead Brazilian woman sitting in a sophisticated restaurant, elegant ambient lighting, soft natural smile, casual-chic outfit, cinematic depth of field, premium lifestyle photography.`
  },
  {
    id: 5,
    name: "Loira no Aeroporto ",
    category: "Feminino Lifestyle",
    description: "Visual influencer loira influencer em um terminal de aeroporto.",
    image: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Loira%20No%20Aeroporto.PNG",
    tags: ["Feminino", "Lifestyle", "Loira"],
    prompt: `Ultra-realistic 8K photo, blonde Brazilian influencer in a modern international airport terminal, stylish suitcase nearby, sophisticated natural lighting, premium casual outfit, editorial photography. Features a highly realistic and lifelike setting.`
  },
  {
    id: 6,
    name: "Loira Na Academia",
    category: "Feminino Lifestyle",
    description: "Loira em ambiente acadêmico moderno.",
    image: "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Loira%20Na%20Academia.PNG",
    tags: ["Feminino", "Lifestyle", "Loira"],
    prompt: `Ultra-realistic 8K photo, Brazilian woman around 23 years old, extremely beautiful, natural and healthy fitness look, proportional athletic female physique, defined waist, toned legs, long voluminous slightly wavy hair, realistic skin with natural texture, no exaggerated filters. The influencer is in a modern, high-end gym, surrounded by premium equipment and elegant lighting. She is standing near the machines, looking at the camera with a confident and friendly expression, conveying energy, discipline, and a healthy lifestyle. Premium fitness outfit consisting of a fitted sports bra and high-waisted leggings in sophisticated neutral tones. Natural fabric drape, nothing exaggerated. Authentic fitness lifestyle influencer look. Natural lighting mixed with ambient gym light, creating depth and realism. Slightly blurred background, keeping full focus on the influencer. Professional editorial fitness photography, magazine quality, 9:16 vertical composition. Extremely photogenic, successful fitness content creator look, elegant posture, soft natural smile, no artificial poses. Ultra-realistic, hyper-detailed, DSLR photography, natural skin texture, realistic hair strands, authentic gym environment, premium lifestyle photography, high-end fitness influencer aesthetic, professional composition, shallow depth of field, cinematic realism, 8K quality. NEGATIVE: No AI look, no exaggerated beauty filters, no plastic skin, no distorted anatomy, no masculinized muscles, no excessive makeup, no low resolution, no text, no logos, no watermarks. Very realistic and human-like.`
  },
  {
    id: 7,
    name: "Influenciadora Morena Minimalista",
    category: "Feminino Lifestyle",
    description: "Retrato clean e minimalista de morena com maquiagem soft-glow em ambiente contemporâneo iluminado.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    tags: ["Feminino", "Lifestyle", "Morena", "Premium"],
    prompt: `Minimalist high-fashion editorial portrait of a stunning 23-year-old brunette female influencer. Soft makeup, luminous clean skin with natural pores and fine details, wearing a simple silk white tank top. Set against a textured warm plaster wall with a soft artistic shadow cast from a monstera leaf. High contrast soft studio light, elegant side profile, highly detailed dark brown eyes, realistic fabric texture, 8K, commercial quality.`
  },
  {
    id: 8,
    name: "Ruiva em Estilo Casual Street",
    category: "Feminino Lifestyle",
    description: "Look de rua ruiva estilosa com jaqueta de couro e acessórios modernos de prata.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
    tags: ["Feminino", "Lifestyle", "Ruiva"],
    prompt: `Cinematic urban portrait of a trendy 24-year-old redhead female influencer wearing a classic black leather motorcycle jacket and silver hoop earrings. Nighttime street scene with colorful neon signs of Tokyo creating vivid pink and cyan highlights on her skin and hair. Wet asphalt reflection in the background, cinematic bokeh, captured on anamorphic lens, masterpiece of realistic shadows, dramatic mood, deep dark levels, highly detailed hair, photorealistic 8k.`
  }
];
