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
    image: "/images/avatares/LOIRA NO CARRO PREMIUM.PNG",
    tags: ["Feminino", "Lifestyle", "Loira", "Premium"],
    prompt: `Ultra-realistic 8K photo, blonde Brazilian woman with naturally beautiful features, sitting in the driver's seat of a modern premium SUV with a panoramic sunroof, striking light-colored eyes, natural light streaming through the windows, confident expression, luxury lifestyle photography, realistic skin, hair illuminated by natural light, natural look without exaggeration or artificiality, editorial quality, 9:16 vertical composition, high definition.`
  },
  {
    id: 2,
    name: "Morena Selfie No Espelho",
    category: "Feminino Lifestyle",
    description: "Selfie casual super realista em espelho de elevador residencial de altíssimo padrão.",
    image: "/images/avatares/MORENA SELFIE NO ESPELHO.PNG",
    tags: ["Feminino", "Lifestyle", "Morena"],
    prompt: `Ultra-realistic 8K photo, Brazilian woman with long, straight dark hair, selfie in a minimalist modern bathroom mirror, smart-casual outfit, soft natural lighting, lifestyle influencer look.`
  },
  {
    id: 3,
    name: "Ruiva No Apartamento",
    category: "Feminino Lifestyle",
    description: "Visual de influencer ruiva elegante lendo um tablet em cafeteria italiana sofisticada.",
    image: "/images/avatares/RUIVA NO APARTAMENTO.PNG",
    tags: ["Feminino", "Lifestyle", "Ruiva", "Premium"],
    prompt: `Ultra-realistic 8K photo, natural redhead Brazilian woman, long voluminous wavy hair, taking a mirror selfie in a modern, tidy apartment, smart-casual outfit, soft light streaming through the window, premium digital influencer look, realistic skin, high-quality editorial photography.`
  },
  {
    id: 4,
    name: "Ruiva No Restaurate",
    category: "Feminino Lifestyle",
    description: "Jovem Ruiva em um restaurante italiano sofisticado.",
    image: "/images/avatares/RUIVA RESTAURANTE.PNG",
    tags: ["Feminino", "Lifestyle", "Ruiva", "Premium"],
    prompt: `Ultra-realistic 8K photo, extremely photogenic redhead Brazilian woman sitting in a sophisticated restaurant, elegant ambient lighting, soft natural smile, casual-chic outfit, cinematic depth of field, premium lifestyle photography.`
  },
  {
    id: 5,
    name: "Loira no Aeroporto ",
    category: "Feminino Lifestyle",
    description: "Visual influencer loira influencer em um terminal de aeroporto.",
    image: "/images/avatares/Loira No Aeroporto.PNG",
    tags: ["Feminino", "Lifestyle", "Loira"],
    prompt: `Ultra-realistic 8K photo, blonde Brazilian influencer in a modern international airport terminal, stylish suitcase nearby, sophisticated natural lighting, premium casual outfit, editorial photography. Features a highly realistic and lifelike setting.`
  },
  {
    id: 6,
    name: "Loira Na Academia",
    category: "Feminino Lifestyle",
    description: "Loira em ambiente acadêmico moderno.",
    image: "/images/avatares/Loira Na Academia.PNG",
    tags: ["Feminino", "Lifestyle", "Loira"],
    prompt: `Ultra-realistic 8K photo, Brazilian woman around 23 years old, extremely beautiful, natural and healthy fitness look, proportional athletic female physique, defined waist, toned legs, long voluminous slightly wavy hair, realistic skin with natural texture, no exaggerated filters. The influencer is in a modern, high-end gym, surrounded by premium equipment and elegant lighting. She is standing near the machines, looking at the camera with a confident and friendly expression, conveying energy, discipline, and a healthy lifestyle. Premium fitness outfit consisting of a fitted sports bra and high-waisted leggings in sophisticated neutral tones. Natural fabric drape, nothing exaggerated. Authentic fitness lifestyle influencer look. Natural lighting mixed with ambient gym light, creating depth and realism. Slightly blurred background, keeping full focus on the influencer. Professional editorial fitness photography, magazine quality, 9:16 vertical composition. Extremely photogenic, successful fitness content creator look, elegant posture, soft natural smile, no artificial poses. Ultra-realistic, hyper-detailed, DSLR photography, natural skin texture, realistic hair strands, authentic gym environment, premium lifestyle photography, high-end fitness influencer aesthetic, professional composition, shallow depth of field, cinematic realism, 8K quality. NEGATIVE: No AI look, no exaggerated beauty filters, no plastic skin, no distorted anatomy, no masculinized muscles, no excessive makeup, no low resolution, no text, no logos, no watermarks. Very realistic and human-like.`
  },
  {
    id: 7,
    name: "Homem Carro Premium",
    category: "Masculino Lifestyle",
    description: "Homem elegante em um carro premium.",
    image: "/images/avatares/Homem Carro Premium.png",
    tags: ["Masculino", "Lifestyle","Premium"],
    prompt: `Ultra-realistic 8K photo, young Brazilian man, elegant and confident look, sitting in a modern premium car with a sophisticated interior, wearing understated sunglasses, natural light, premium men's lifestyle photography, high definition, realistic appearance, no exaggerated filters.`
  },
  {
    id: 8,
    name: "Homem Na Academia",
    category: "Masculino Lifestyle",
    description: "Homem fitness em ambiente acadêmico moderno.",
    image: "/images/avatares/Homem Academia.png",
    tags: ["Masculino", "Lifestyle"],
    prompt: `Ultra-realistic 8K photo, athletic Brazilian man in a premium modern gym, natural lighting, stylish sportswear, realistic fitness photography; highly realistic and lifelike.`
  },
  {
    id: 9,
    name: "Empresário Jovem",
    category: "Masculino Lifestyle",
    description: "Empresário jovem em ambiente corporativo moderno.",
    image: "/images/avatares/Empresario Jovem.png",
    tags: ["Masculino"],
    prompt: `Ultra-realistic 8K photo, Brazilian man around 28 years old, naturally attractive appearance, sitting in a high-end contemporary office, open laptop, soft lighting, digital entrepreneur style.`
  },
  {
    id: 10,
    name: "Mulher Cobertura Moderna",
    category: "Feminino Lifestyle",
    description: "Mulher jovem em uma cobertura moderna com vista panorâmica da cidade.",
    image: "/images/avatares/Mulher Cobertura Moderna.png",
    tags: ["Feminino", "Lifestyle"],
    prompt: `Ultra-realistic 8K photo, Brazilian influencer in a high-end modern penthouse, sophisticated setting, contemporary décor, premium editorial photography; highly realistic and natural-looking.`
  }
];
