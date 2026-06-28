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
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Beijo%20+%20CTA.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Beijo%20+%20CTA.mp4',
    promptText: `Versão 3.1. Aspect ratio 9:16. Duração de 8 segundos. Seed 12345.

Usar a imagem enviada como âncora de identidade, mantendo exatamente as mesmas feições, tom de pele, cor de cabelo, mesma textura, mesmo volume e mesmo comprimento durante TODO o vídeo, sem qualquer alteração em nenhum momento.

Estilo de referência: realismo cinematográfico natural, interação direta com a câmera estilo gravação em celular.

Prompt negativo: sem falas, sem áudio vocal, sem movimento labial articulando palavras, sem legendas, sem texto na tela, sem logos, sem marcas d'água, sem deformações corporais, sem dedos extras, sem distorção de mãos, sem artefatos de IA, sem mudança de cor do cabelo, sem mudança de textura do cabelo, sem mudança de estilo do cabelo, sem alteração de iluminação que modifique a cor do cabelo, sem movimentos exagerados, sem câmera lenta, sem sorriso travado, sem movimentos robóticos.

Segurança: não permitir violência contra menores. Não permitir nudez.

Cena: ambiente interno residencial com moldura de madeira e iluminação quente natural.

Ação: ela dá um passo natural para frente e inclina levemente o tronco entre 30 e 40 graus em direção à câmera. Mantém contato visual constante com um sorriso suave, simpático e vendedor. Sem falar absolutamente nada e sem articular palavras com os lábios. Logo após se inclinar, ela leva uma mão naturalmente até a boca e faz um gesto delicado de mandar um beijo para a câmera, soltando a mão suavemente para frente de forma feminina e natural. O gesto do beijo é rápido, elegante e casual, sem exagero e sem teatralidade. Após o beijo, ela naturalmente abaixa a mão e aponta claramente o dedo indicador para baixo, direção inferior da tela, realizando um pequeno movimento visual de chamada para ação. O sorriso permanece natural e envolvente durante toda a cena. O cabelo permanece visualmente idêntico durante toda a ação, sem qualquer alteração de cor, brilho, forma ou volume.

Câmera: dolly-in sutil acompanhando o passo. Lente 50 mm. 24 fps. Obturador 1/120. Foco contínuo no rosto. Profundidade de campo rasa mantendo o fundo levemente desfocado.

Iluminação: luz quente lateral suave com leve preenchimento frontal. Iluminação estável e constante, sem variação de temperatura de cor ao longo do vídeo.

Ambiente: fundo levemente desfocado. Movimento natural dos cabelos ao inclinar. Leve sensação de profundidade realista. Mãos anatomicamente corretas. Sem distorção dos dedos. Manter consistência total da aparência do cabelo do início ao fim.`,
  },
  {
    id: 'hook_tapar_camera',
    name: 'Hook Tapar Câmera',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar leva a mão até a lente, como se fosse “tapar a câmera” para criar transição',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Tapar%20Camera.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Tapar%20Camera.mp4',
    promptText: `START OF ANIMATION: The subject starts standing naturally at a comfortable distance from the camera. She calmly takes two small natural steps forward toward the camera with relaxed posture, soft feminine body sway and realistic timing. While approaching: she lightly touches or adjusts a visible clothing detail naturally and casually. The movement must feel spontaneous and realistic. No exaggerated posing. No runway behavior. No robotic timing. As she gets closer to the camera: the subject softly smiles and naturally raises one hand toward the lens. The hand slowly moves closer until it softly covers the entire camera view for a smooth transition effect.
IMPORTANT:
– The hand movement must feel calm and natural
– No aggressive motion
– No fast movement
– No hard impact on the lens
– Smooth realistic pacing only

After covering the camera briefly: the subject naturally steps backward again to a comfortable distance with relaxed body flow. As she returns backward: one hand gradually moves to the waist naturally. At the final position: the subject slightly shifts her hip, softly lifts one leg forward in a feminine relaxed pose, keeps one hand on the waist, and gives a warm natural smile.

GENERAL MOTION: Natural fluid movement. Continuous body micro-adjustments. Relaxed shoulders. Gentle hip sway. Real human timing. No stiff motion.

FACIAL EXPRESSION: Soft neutral expression most of the time. Subtle natural smiles. No frozen smile. No exaggerated facial tension.

BODY LANGUAGE: Natural posture. Soft feminine energy. No dancing. No exaggerated influencer posing.

CAMERA: Stable casual phone-style recording. Very subtle handheld micro-movement only. No zoom. No camera shake. Chest-height framing.

REALISM: Preserve original identity. Natural skin texture. Natural hair movement. Natural fabric physics. No beauty filters. No smoothing. No stylization.

RESTRICTIONS: No talking. No text. No UI. No effects. No exaggerated movement. No robotic motion.

FINAL RESULT: A hyper-realistic casual fashion transition video where the subject naturally walks toward the camera, softly covers the lens with one hand for a transition, then steps back into a relaxed feminine final pose.`,
  },
  {
    id: 'Mexendo no Cabelo',
    name: 'Mexendo no Cabelo',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar mexe no cabelo de forma natural e sedutora, com leve sorriso',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Person_presenting_clothing_POV_202606281521.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Person_presenting_clothing_POV_202606281521.mp4',
    promptText: `Animate the subject as a REAL person presenting clothing in a POV-style video.

⸻

🔥 START OF ANIMATION (UPDATED):

– The subject starts at a natural distance from the camera

– She calmly takes two small, natural steps forward toward the camera

– While approaching, she gently touches and lightly holds the bow/lace detail on the chest area

– The gesture is delicate, subtle and realistic, like naturally showing a clothing detail

– No emphasis, no posing, no exaggeration

– The movement feels spontaneous and casual

– After briefly touching the bow, she naturally releases it

– She takes a small step back to her original position

– Smooth transition into the rest of the animation

⸻

GENERAL MOTION STYLE:

– Natural, confident, fluid movements  

– Not static  

– Not exaggerated  

– Not robotic  

– Real human timing  

⸻

BODY MOVEMENTS:

– One hand naturally rests on the waist  

– Gentle hip movement (side-to-side, very subtle)  

– One foot forward, the other relaxed behind  

– Natural posture, relaxed shoulders  

⸻

CLOTHING PRESENTATION:

– Small, natural movements to highlight the outfit  

– Slight torso rotation to show fit and fabric  

– No aggressive posing  

– No fashion runway exaggeration  

– Movements feel spontaneous and casual  

⸻

ADDITIONAL NATURAL GESTURE (VERY SUBTLE):

– After the main body movement sequence:

  • The subject briefly raises one hand

  • Lightly brushes her hair backward near the side of the head

  • The gesture lasts approximately one second

  • The motion is casual and unintentional, like a natural self-adjustment

  • No emphasis, no posing

  • The hand immediately returns to a relaxed neutral position

⸻

FACIAL EXPRESSION (VERY IMPORTANT – REAL HUMAN TIMING):

– The subject does NOT smile continuously

– Facial expression alternates naturally throughout the video

– While approaching the camera:

  • Neutral, relaxed expression

  • Lips softly closed

  • Calm, confident look

– During the bow/lace touch:

  • A brief, subtle smile appears

  • Smile is soft and natural, not exaggerated, não falar, no fala, só executar o movimento.`
  },
  {
    id: 'Giro 360 Controlado',
    name: 'Giro 360 Controlado',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar faz giro completo de 360 graus, mostrando corpo e roupa em rotação controlada',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Woman_rotating_360_degrees_202606281542.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Woman_rotating_360_degrees_202606281542.mp4',
    promptText: `{
  "version": "3.1",
  "aspectRatio": "9:16",
  "durationSeconds": 8,
  "seed": 12345,
  "subjectRef": "usar a imagem enviada como âncora de identidade, mantendo exatamente as mesmas feições, tom de pele",
  "referenceStyle": "realismo cinematográfico natural, apresentação de moda com movimento corporal suave",
  "negativePrompt": "sem falas, sem áudio vocal, sem movimento labial, sem texto na tela, sem logos, sem marcas d'água",
  "safety": { "allowMinorViolence": false, "allowNudity": false },
  "shots": [
    {
      "scene": "ambiente interno residencial com moldura de madeira e iluminação quente natural",
      "action": "ela permanece no mesmo lugar e realiza uma rotação completa de 360° de forma lenta, suave e segmentada, mostrando o look de todos os ângulos.",
      "camera": "fixa; 50mm; 24fps; sem movimento de câmera; foco contínuo; profundidade de campo leve",
      "lighting": "luz quente lateral suave com preenchimento frontal; iluminação constante sem variação",
      "environment": "fundo levemente desfocado; movimento natural do cabelo acompanhando o giro; sem distorções"
    }
  ],
  "motionControl": {
    "rotation_speed": "slow",
    "rotation_style": "segmented_smooth_turn",
    "no_fast_spin": true,
    "no_instant_360": true
  },
  "rules": {
    "stay_in_same_position": true,
    "no_forward_movement": true,
    "no_backward_movement": true,
    "no_fast_rotation": true,
    "must_be_slow_turn": true,
    "preserve_identity": true
  }
}`
  },
  {
    id: 'Segurando a Roupa e Andando Para Frente',
    name: 'Segurando a Roupa e Andando Para Frente',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar segura a roupa com uma mão e caminha para frente, mostrando o look em movimento',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Girl_stepping_forward_with_clothing_202606281557.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Girl_stepping_forward_with_clothing_202606281557.mp4',
    promptText: `HOOK MOVEMENT REFINEMENT (CRITICAL):

The subject must move naturally and calmly.

Do NOT rush aggressively toward the camera.
Do NOT run.
Do NOT lunge forward.
Do NOT create chaotic movement.
Do NOT create exaggerated fast motion.

The hook should feel smooth and controlled like a real casual influencer recording.

CORRECT MOVEMENT FLOW:
– The subject starts already holding the clothing/product naturally
– She takes ONE natural small step forward
– While stepping forward, she smoothly raises the clothing toward the camera
– The movement is fluid and continuous
– Calm natural pacing
– No sudden acceleration

The clothing should reach the camera naturally within around 1–2 seconds.

IMPORTANT:
– The subject body movement stays relaxed
– Natural shoulder movement
– Natural arm motion
– Natural posture balance
– No exaggerated hip movement
– No dramatic motion

FACIAL BEHAVIOR FIX (VERY IMPORTANT):
– Mouth must remain naturally closed most of the time
– Do NOT generate talking behavior
– Do NOT simulate speech
– Do NOT create lip-sync motion
– No random mouth opening
– No exaggerated facial animation

Expression should remain:
* soft
* neutral
* relaxed
* natural

A very subtle smile is allowed briefly, but:
– lips mostly closed
– no visible talking motion
– no exaggerated grin

MOTION QUALITY:
– Real-time natural motion
– No slow motion
– No delay
– No laggy movement
– No robotic timing
– No jitter
– No frame skipping
– No looping behavior

CAMERA:
– Stable POV camera
– Very subtle handheld micro movement only
– No zoom
– No cinematic motion
– No shake

FINAL FEELING:
The animation should feel like a real girl casually stepping forward and softly placing the clothing in front of the phone camera for a natural TikTok-style transition.`
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
