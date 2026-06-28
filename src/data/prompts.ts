export interface MovementPreset {
  id: string;
  name: string;
  type: string;
  description: string;
  imageUrl: string;
  promptText: string;
  videoUrl?: string;
  format?: string;
}

export const MOVEMENTS_PRESETS: MovementPreset[] = [
  {
    id: 'cta_beijo',
    name: 'CTA Beijo',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar manda beijo para a câmera com gesto suave e simpático',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://www.youtube.com/watch?v=qgzQu8s0BiQ',
    promptText: 'UGC style, beautiful female presenter looking into camera, smiling warmly and blowing a gentle kiss with a soft hand gesture, highly natural, aesthetic framing, 9:16 vertical.'
  },
  {
    id: 'hook_tapar_camera',
    name: 'Hook Tapar Câmera',
    type: 'POV',
    format: 'Video',
    description: 'A avatar leva a mão até a lente, como se fosse “tapar a câmera” para criar transição',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://www.youtube.com/watch?v=HlwNLwmq16c',
    promptText: '9:16 portrait video, a young woman steps forward and brings her hand directly towards the lens to cover it, creating a perfect smooth slide transition effect, realistic movement.'
  },
  {
    id: 'hook_andando_pacote',
    name: 'Hook Andando com Pacote TikTok',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar anda segurando pacote, com movimento de entrada natural e dinâmica social',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-sunset-41712-large.mp4',
    promptText: 'UGC fashion vlog, a young cheerful woman walking towards the camera holding a delivery package, smiling in natural golden hour lighting, social media influencer style.'
  },
  {
    id: 'hook_roupa_passinho',
    name: 'Hook Roupa Passinho Frente',
    type: 'Look',
    format: 'Video',
    description: 'A avatar segura ou mostra a roupa na frente do corpo com leve passinho',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-look-of-the-day-fashion-video-41584-large.mp4',
    promptText: '9:16 video, stylish influencer steps forward showcasing her trendy outfit, holding the fabric gently, doing a cute little front step to display the clothing folds and fit, high definition.'
  },
  {
    id: 'hook_apresentacao_fashion',
    name: 'Hook Apresentação Fashion',
    type: 'Look',
    format: 'Video',
    description: 'Pose de apresentação de look, com postura elegante e destaque para a roupa',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-showing-her-look-41587-large.mp4',
    promptText: 'Editorial fashion presentation, elegant model strikes confident poses, full body showcase, highlighting the textures, seams, and fit of a high-end luxury streetwear outfit.'
  },
  {
    id: 'selfie_cabelo',
    name: 'Selfie Cabelo',
    type: 'Selfie',
    format: 'Video',
    description: 'A avatar faz selfie com uma mão no cabelo, movimento leve e sedutor',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-touching-her-long-hair-41589-large.mp4',
    promptText: '9:16 portrait video, young woman holds phone for a selfie, gently playing with her long beautiful hair, soft smile, flirtatious look under cozy natural room lighting.'
  },
  {
    id: 'espelho_textura',
    name: 'Espelho Textura',
    type: 'Selfie',
    format: 'Video',
    description: 'Selfie em espelho mostrando textura/tecido/acabamento da roupa ou produto',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-showing-her-outfit-in-the-mirror-40283-large.mp4',
    promptText: 'Mirror selfie close-up video, focusing on the fine fabric texture and premium weaving while the creator rotates side to side, capturing real light reactions on the textile.'
  },
  {
    id: 'mostrando_look_cta',
    name: 'Mostrando Look + CTA',
    type: 'Look',
    format: 'Video',
    description: 'A avatar mostra o look inteiro e termina com gesto de chamada para ação',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-posing-in-front-of-a-mirror-40282-large.mp4',
    promptText: 'A aesthetic woman presents her complete look in a mirror reflection, concluding with a friendly finger-pointing gesture towards the bio link or "Shop Now" text.'
  },
  {
    id: 'passando_produto_rosto',
    name: 'Passando Produto no Rosto',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar aplica produto no rosto de forma natural e realista',
    imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-woman-putting-on-makeup-41595-large.mp4',
    promptText: 'UGC beauty tutorial, female host directly applying a skincare serum/cream to her cheek in circular motions, glowing hydrated dewy skin texture, extremely natural.'
  },
  {
    id: 'giro_lento_360',
    name: 'Giro Lento 360 Controlled',
    type: 'Movimentos',
    format: 'Video',
    description: 'Giro lento e suave, mostrando corpo/roupa em rotação controlada',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-showing-her-look-41587-large.mp4',
    promptText: 'High quality 360 camera turn, model spin slow and controlled in studio showing the outfit fit and flow from all angles, 4k vertical resolution.'
  },
  {
    id: 'pov_capinha',
    name: 'POV Capinha',
    type: 'POV',
    format: 'Video',
    description: 'Mão segurando capinha/case em POV, com foco total no produto',
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    promptText: 'First-person perspective POV shot of hands holding a premium aesthetic phone case, tilting it around to catch the light, showing high material contrast.'
  },
  {
    id: 'pov_sapatos',
    name: 'POV Sapatos',
    type: 'POV',
    format: 'Video',
    description: 'Mão segurando sapato em POV, destacando forma e acabamento',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-look-of-the-day-fashion-video-41584-large.mp4',
    promptText: 'POV shot looking down at elegant designer shoes being rotated and held, showing premium leather details and flawless sole craftsmanship, bright social lighting.'
  },
  {
    id: 'pov_produto_pequeno',
    name: 'POV Produto Pequeno',
    type: 'POV',
    format: 'Video',
    description: 'Produto pequeno de beleza/maquiagem em close, com mão em destaque',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    promptText: 'POV close up on a small beauty cosmetic bottle held gracefully in clean manicured hands, smooth micro camera movements showing product labels and matte design.'
  },
  {
    id: 'mesclagem_tiktok_shop',
    name: 'Mesclagem Pacote TikTok Shop',
    type: 'Movimentos',
    format: 'Video',
    description: 'Cena de unboxing / mesclagem de pacote TikTok Shop, com cara de conteúdo viral',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-new-delivery-box-at-home-41602-large.mp4',
    promptText: 'TikTok Shop social-first unboxing style video, hands playfully pulling out fresh clothing from a custom mailer bag, energetic and fast-paced aesthetic.'
  },
  {
    id: 'espelho_academia',
    name: 'Espelho na Academia',
    type: 'Selfie',
    format: 'Video',
    description: 'Selfie em espelho de academia, com postura esportiva e iluminação realista',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fitness-woman-posing-for-selfie-41611-large.mp4',
    promptText: 'Active lifestyle look, fit gorgeous creator doing a mirror selfie at a high-end gym, showing activewear athletic curves and high-end workout gears.'
  },
  {
    id: 'espelho_provador',
    name: 'Espelho Provador',
    type: 'Selfie',
    format: 'Video',
    description: 'Selfie em provador/loja, com look de moda e cenário de boutique',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-showing-her-outfit-in-the-mirror-40283-large.mp4',
    promptText: 'Fitting room vlog mirror selfie, warm indirect boutique lighting, trying on stylish outfits with real reactions, showing retail luxury ambient flavor.'
  },
  {
    id: 'selfie_qualquer_produto',
    name: 'Selfie com Qualquer Produto',
    type: 'Selfie',
    format: 'Video',
    description: 'Avatar segurando produto na mão, próximo ao rosto, como UGC comercial',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    promptText: 'Commercial vertical UGC presentation, model holding the item near her face while smiling beautifully and talking happily to the front camera lens.'
  },
  {
    id: 'selfie_proximo_rosto',
    name: 'Selfie Próximo ao Rosto',
    type: 'Selfie',
    format: 'Video',
    description: 'Close no rosto com pose bonita, mão próxima ao rosto e olhar confiante',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blowing-a-kiss-to-the-camera-40748-large.mp4',
    promptText: 'Flawless clean makeup close up, young confident girl poses very close to camera with high skin realism, smiling gently, dewy soft skin and gorgeous light reflection.'
  },
  {
    id: 'selfie_jaqueta_couro',
    name: 'Selfie Jaqueta de Couro',
    type: 'Selfie',
    format: 'Video',
    description: 'Avatar usando jaqueta de couro com selfie fashion, vibe editorial',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-posing-funny-for-the-camera-39906-large.mp4',
    promptText: 'Bad boy and cool girl editorial aesthetics, wearing a heavy modern black leather jacket, doing real selfie pose with cool retro look and raw studio vibe.'
  },
  {
    id: 'look_casual',
    name: 'Look Casual',
    type: 'Look',
    format: 'Video',
    description: 'Look casual natural, postura relaxada e estética lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-sunset-41712-large.mp4',
    promptText: 'A aesthetic street lifestyle, model wearing comfortable beige and white casual wear during a day out, relaxed candid walking look with sunset warm background.'
  },
  {
    id: 'torcedora_brasil_premium',
    name: 'Torcedora Brasil Premium',
    type: 'Look',
    format: 'Video',
    description: 'Avatar com camiseta do Brasil, pose alegre e vibe premium',
    imageUrl: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blowing-a-kiss-to-the-camera-40748-large.mp4',
    promptText: 'UGC influencer styled in a premium Brazil national football team athletic jersey, celebrating happily, golden sun rays, high energy, professional cinematic grading.'
  },
  {
    id: 'cenario_quarto_casual',
    name: 'Cenário Quarto Casual',
    type: 'Cenário',
    format: 'Imagem',
    description: 'Cena em quarto casual, iluminado e aconchegante, para uso lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400',
    videoUrl: '',
    promptText: 'Cozy luxurious modern light-filled bedroom background, warm bokeh depth of field, unmade bed with clean white linens, soft plants in the background, high contrast rendering.'
  },
  {
    id: 'estilo_casual_home',
    name: 'Estilo Casual Home',
    type: 'Look',
    format: 'Video',
    description: 'Look casual em casa, com sensação real de rotina e conforto',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-touching-her-long-hair-41589-large.mp4',
    promptText: 'Homely Sunday lifestyle, cute woman wearing cozy cotton sweatpants and crop top relaxed on an elegant couch at home, drinking tea, natural lighting.'
  },
  {
    id: 'selfie_espelho_elegante',
    name: 'Selfie Espelho Elegante',
    type: 'Selfie',
    format: 'Video',
    description: 'Selfie no espelho com pose refinada, visual sofisticado e feminino',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-showing-her-outfit-in-the-mirror-40283-large.mp4',
    promptText: 'High class feminine style mirror selfie, looking graceful in a chic high-end dinner dress, marble walls and gold details in background, golden reflections.'
  },
  {
    id: 'torcedora_brasil',
    name: 'Torcedora Brasil',
    type: 'Look',
    format: 'Video',
    description: 'Pose casual com camiseta do Brasil, vibe social e descontraída',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-posing-funny-for-the-camera-39906-large.mp4',
    promptText: 'A cute local fan wearing a vintage Brazil yellow cropped t-shirt, gesturing peace sign to camera with a playful smile, young joyful casual vibe.'
  }
];
