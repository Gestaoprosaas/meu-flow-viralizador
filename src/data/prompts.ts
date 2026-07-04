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
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/360%20CONTROLADO.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/360%20CONTROLADO.mp4',
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
    id: 'Animação Natural',
    name: 'Animação Natural',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar realiza movimentos naturais e fluidos, com postura relaxada e expressão facial suave',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/animacaonatural.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/animacaonatural.mp4',
    promptText: '{  "animation_style": "realistic_fashion_presentation",  "camera": {    "fixed": true,    "no_zoom": true,    "no_reframe": true  },  "motion": {    "type": "continuous",    "speed": "natural_slightly_fast",    "no_pause": true,    "no_freeze": true  },  "position": {    "stay_near_same_spot": true,    "small_natural_steps": true,    "no_large_movement": true  },  "sequence": {    "start": "facing_camera",    "action": {      "type": "natural_flow",      "description": "subject keeps moving naturally all the time"    },    "fabric": {      "type": "light_touch",      "area": "clothing",      "no_pull": true    },    "movement": {      "type": "small_side_shift",      "max_angle": "10_degrees",      "no_turn": true,      "no_spin": true,      "no_360": true    }  },  "body": {    "hip": "subtle_continuous",    "weight": "always_shifting",    "no_static": true  },  "face": {    "expression": "natural",    "smile": "brief_subtle",    "no_constant": true  },  "rules": {    "no_rotation": true,    "no_360": true,    "no_freeze": true,    "no_exaggeration": true  },  "final": "natural continuous movement, no rotation, no freeze"}\\n\\nGENERATE ANIMATED BACKGROUND MUSIC'
  },
  {
    id: 'Colocando Capuz',
    name: 'Colocando Capuz',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar coloca um capuz de forma natural e fluida, com movimentos suaves e expressão facial agradável',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/colocando%20capus.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/colocando%20capus.mp4',
    promptText: 'Animate the subject as a REAL person in a soft ultra-realistic diagonal back-view fashion video.MAIN ACTION (PUTTING ON HOOD):– The subject uses BOTH hands together during the entire motion– She naturally raises both hands toward the hood area behind the neck– Both hands softly grab the sides of the hoodie hood– The motion should feel casual, feminine and realistic– She gently lifts the hood upward and naturally pulls it over the hair– The hood softly slides over the back of the head and partially covers the hair– The movement must feel smooth, relaxed and authentic– No exaggerated motionHOOD MOVEMENT DETAILS:– Hair starts naturally loose outside the hoodie– Both hands lift the hood slowly upward– Fingers softly hold the hood fabric realistically– Elbows lift naturally and softly– The hood smoothly settles over the head– Some loose hair strands remain naturally visible near the sides/front– After placing the hood on:the hands softly adjust the hood edges briefly– Then the hands naturally relax downwardREALISTIC FABRIC & HAIR PHYSICS:– Hoodie fabric must react naturally with realistic weight– Hood movement must feel soft and believable– No stiff fabric– Hair movement must come ONLY from hand and hood interaction– Hair keeps realistic gravity and weight– No floating hair– No wind effect– Natural loose strands around neck and shouldersIMPORTANT ANTI-BUG RULES:– Keep the subject ALWAYS in the same diagonal back-facing angle– Do NOT allow the subject to rotate toward camera– No front-facing frames– No sudden head turns– Camera remains completely fixed– No zoom– No reframing– Prevent hand deformation– Prevent hood clipping through hair/bodyBODY MOVEMENT STYLE:– Minimal torso movement– Slight natural shoulder lift while lifting the hood'
  },
  {
    id: 'CTA 1',
    name: 'CTA 1',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar apresenta o look completo em espelho, finalizando com gesto de apontar para o link da bio ou texto "Compre Agora"',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta1.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta1.mp4',
    promptText: 'Animate the subject as a REAL person presenting clothing in a POV-style video.⸻🔥 START OF ANIMATION (UPDATED FOR THIS OUTFIT):– The subject starts very close to the camera– She makes a small, natural adjustment to the outfit:  • A subtle touch near the waistline or skirt area  • OR a light adjustment on the side of the top– The gesture is casual and realistic, like preparing before recording– No chest pulling– No emphasis– No posing– After this quick adjustment, she naturally steps back into a comfortable position– Smooth transition into the rest of the animation⸻GENERAL MOTION STYLE:– Natural, confident, fluid movements– Not static– Not exaggerated– Not robotic– Real human timing⸻BODY MOVEMENTS:– One hand naturally rests on the waist– Gentle hip movement (side-to-side, very subtle)– One foot slightly forward, highlighting the skirt slit– The other foot relaxed behind– Natural posture, relaxed shoulders⸻CLOTHING PRESENTATION (TOP + SKIRT):– Small, natural movements to highlight the outfit– Subtle leg positioning to show the skirt slit naturally– Slight torso rotation to show fit and fabric– No aggressive posing– No runway-style movement– Movements feel spontaneous and casual⸻FACIAL EXPRESSION (VERY IMPORTANT – CTA TIMING):– The subject does NOT smile continuously– Facial expression changes naturally throughout the video– During most of the presentation:  • Neutral, relaxed expression  • Lips softly closed  • Calm, confident face  • Natural eye contact  • No smile held for long periods– Occasionally:  • A very brief, subtle smile appears  • Smile is soft and quickly fades  • No exaggerated cheek movement  • No frozen smile⸻FINAL NATURAL ACTION (END OF VIDEO):– At the very end of the video– The subject walks normally toward the camera– Movement feels casual, like approaching to stop recording– No rush– No posing– As she gets close to the camera:  • She casually raises one hand  • Makes a simple, brief downward pointing gesture with the index finger  • The gesture is relaxed and natural  • No holding the pose– EXACT SMILE TIMING:  • The smile opens ONLY at this moment  • A warm, genuine smile appears  • She slightly turns her face to one side while smiling  • Natural cheek movement  • Smile feels spontaneous and human  • After the gesture, the smile naturally relaxes⸻PERSONALITY:– Sympathetic– Approachable– Comfortable– Feels like a real person casually recording a video at home⸻CAMERA & POV:– POV perspective, as if the phone is held or placed naturally– Very subtle handheld micro-movements– No camera shake– No zoom– Camera remains at chest/face height⸻TIMING:– Movements are continuous– No freezing– No looping poses– Smooth transitions between gestures⸻REALISM RULES:– Preserve original facial identity– Preserve skin texture– Preserve hair movement (slight natural motion)– Natural fabric physics for both top and skirt– No beauty filters– No smoothing– No stylization⸻RESTRICTIONS:– No talking– No text– No UI– No effects– No exaggerated dance– No influencer posing clichés⸻FINAL RESULT:A hyper-realistic POV fashion video with natural facial expression changes, neutral moments throughout, and a genuine smile appearing only at the final moment while approaching the camera and pointing downward — subtle, human and indistinguishable from a real TikTok recording.GENERATE ANIMATED BACKGROUND MUSIC'
  },
  {
    id: 'CTA 2',
    name: 'CTA 2',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar apresenta o look completo em espelho, finalizando com gesto de apontar para o link da bio ou texto "Compre Agora"',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta2.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta2.mp4',
    promptText: '{  "version": "3.1",  "aspectRatio": "9:16",  "durationSeconds": 8,  "seed": 12345,  "subjectRef": "usar a imagem enviada como âncora de identidade, mantendo exatamente as mesmas feições, tom de pele, cor de cabelo, mesma cor, mesma textura, mesmo volume e mesmo comprimento durante TODO o vídeo, sem qualquer alteração em nenhum momento",  "referenceStyle": "realismo cinematográfico natural, interação direta com a câmera estilo gravação em celular",  "negativePrompt": "sem falas, sem áudio vocal, sem movimento labial articulando palavras, sem legendas, sem texto na tela, sem logos, sem marcas d’água, sem deformações corporais, sem dedos extras, sem distorção de mãos, sem artefatos de IA, sem mudança de cor do cabelo, sem mudança de textura do cabelo, sem mudança de estilo do cabelo, sem alteração de iluminação que modifique a cor do cabelo",  "safety": {     "allowMinorViolence": false,     "allowNudity": false   },  "shots": [    {      "scene": "ambiente interno residencial com moldura de madeira e iluminação quente natural",      "action": "ela dá um passo natural para frente, inclina o tronco entre 30 e 40 graus em direção à câmera, mantém contato visual constante com um sorriso cativante e vendedor durante toda a cena. Sem falar absolutamente nada e sem articular palavras com os lábios. Ela levanta a mão direita e posiciona o dedo indicador claramente apontado para baixo (direção inferior da tela, não para a lente). O gesto é intencional e expressivo, realizando um leve movimento repetido de cima para baixo com o dedo indicador, como uma chamada visual para ação. O sorriso permanece natural, envolvente e confiante do início ao fim. O cabelo permanece visualmente idêntico durante toda a ação, sem qualquer alteração de cor, brilho, forma ou volume.",      "camera": "dolly-in sutil acompanhando o passo; 50mm; 24fps; 1/120; foco contínuo no rosto; profundidade de campo rasa mantendo o fundo levemente desfocado",      "lighting": "luz quente lateral suave com leve preenchimento frontal; iluminação estável e constante, sem variação de temperatura de cor ao longo do vídeo",      "environment": "fundo levemente desfocado; movimento natural dos cabelos ao inclinar; leve sensação de profundidade realista sem distorção de mãos; manter consistência total de aparência do cabelo do início ao fim"    }  ]}GENERATE ANIMATED BACKGROUND MUSIC\n'
  },
  {
    id: 'CTA 3',
    name: 'CTA 3',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar apresenta o look completo em espelho, finalizando com gesto de apontar para o link da bio ou texto "Compre Agora"',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta3.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta3.mp4',
    promptText: '{  "animation_style": "realistic_fashion_cta",  "camera": {    "tripod_mode": true,    "absolute_static": true,    "no_movement": true,    "no_drift": true,    "no_reframe": true  },  "motion_timing": {    "tempo": "natural_medium_fast",    "responsive_speed": true,    "no_slow_motion": true  },  "sequence": {    "start_pose": "facing_camera_neutral",    "action_1": {      "type": "small_waist_adjustment",      "motion": "quick_natural",      "shoulder_and_hip_micro_shift": true    },    "action_2": {      "type": "step_forward",      "steps": 1,      "speed": "natural_quick",      "no_rush": true    },    "action_3": {      "type": "downward_point",      "gesture": "index_finger_down",X      "duration": "brief"    },    "action_4": {      "type": "warm_confident_smile",      "timing": "only_during_point",      "natural_cheek_movement": true,      "brief_duration": true    }  },  "mouth_behavior": {    "lips_closed": true,    "no_speaking": true,    "no_lip_sync": true  },  "movement_rules": {    "no_spinning": true,    "no_exaggeration": true,    "natural_weight_transfer": true  },  "realism": {    "preserve_identity": true,    "natural_fabric_physics": true,    "natural_hair_physics": true,    "no_filters": true  },  "final_intent": "natural_fashion_cta_with_step_forward_point_down_and_brief_genuine_smile"}GENERATE ANIMATED BACKGROUND MUSIC'
  },
  {
    id: 'Gancho Normal',
    name: 'Gancho Normal',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar segura um produto com as duas mãos e realiza um movimento de gancho, como se estivesse mostrando o produto para a câmera',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/gancho%20normal.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/gancho%20normal.mp4',
    promptText: 'Animate the subject as a REAL person presenting clothing in a POV-style video (first-person perspective).⸻🔥 START OF THE ANIMATION (UPDATED):– The subject starts at a natural distance from the camera– She calmly takes two small, natural steps toward the camera– While approaching, she gently touches and lightly holds a detail of the clothing– The gesture is delicate, subtle, and realistic, like someone naturally showing a clothing detail– No emphasis, no posing, and no exaggeration– The movement feels spontaneous and casual– After briefly touching the clothing, she takes a small step backward, returning to her original position– Smooth transition into the rest of the animation⸻GENERAL MOVEMENT STYLE:– Natural, confident, and fluid movements– She should not remain completely still– No exaggerated movements– No robotic appearance– Realistic human pacing and motion⸻BODY MOVEMENTS:– One hand naturally rests on the waist– Subtle side-to-side hip movement– One foot slightly forward while the other remains relaxed behind– Natural posture with relaxed shoulders⸻CLOTHING PRESENTATION:– Small natural movements to highlight the outfit– Slight torso rotations to showcase the fit and fabric– No aggressive posing– No exaggerated fashion runway movements– Movements should feel spontaneous and casual⸻FACIAL EXPRESSIONS (VERY IMPORTANT — REALISTIC TIMING):– The subject does NOT smile continuously– Facial expressions naturally change throughout the video– While approaching the camera:• Neutral and relaxed expression• Lips gently closed• Calm and confident gaze– While touching the clothing:• A brief subtle smile appears• The smile is soft and natural, without exaggeration• Only a slight movement of the cheeks– After presenting the clothing:• The expression returns to neutral• Relaxed face and natural breathing– Later in the animation:• She slightly turns her head to one side• Another brief and welcoming smile appears• The smile lasts only a moment and fades naturally– Smile behavior:• Appears and disappears naturally• No frozen smile• No constant smile• No exaggerated facial tension⸻PERSONALITY:– Friendly– Approachable– Comfortable and natural– Feels like a real person casually recording a video⸻CAMERA AND POV:– POV perspective, as if the phone is being held by another person– Small natural handheld micro-movements– No shaking– No zoom– The camera remains at face/chest height⸻TIMING AND RHYTHM:– Movements are continuous– No freezing– No repeated looping poses– Smooth transitions between gestures⸻REALISM RULES:– Preserve the original facial identity– Preserve the natural skin texture– Preserve natural hair movement (light motion)– Natural fabric physics– No beauty filters– No artificial skin smoothing– No stylization– Avoid excessive saturation and use natural daylight lighting⸻RESTRICTIONS:– No speaking– No text– No on-screen interface– No effects– No exaggerated dancing– No cliché influencer poses⸻FINAL RESULT:A hyper-realistic POV fashion video where the subject appears alive and genuinely human, with natural facial expression changes, occasional subtle smiles, neutral moments in between, and slight head movements — indistinguishable from a casual recording made with a real smartphone.GENERATE ANIMATED BACKGROUND MUSIC'
  },
  {
    id: 'Mexendo no Cabelo',
    name: 'Mexendo no Cabelo',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar mexe no cabelo de forma natural e sedutora, com leve sorriso',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/mexendo%20cabelo.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/mexendo%20cabelo.mp4',
    promptText: 'Animate the subject as a REAL person in a soft ultra-realistic diagonal back-view fashion video.⸻MAIN ACTION (BOTH HANDS TYING HAIR):– The subject uses BOTH hands together during the entire motion– She naturally raises both hands toward the back of the head– Both hands gather the hair softly near the upper back/head area– The motion should feel like she is casually pretending to tie her hair into a ponytail– Natural feminine gesture only– Soft realistic movement– No exaggerated styling motion⸻HAIR TYING MOTION DETAILS:– Hair starts naturally loose– Both hands slide upward through the hair together– Fingers naturally collect the hair backward– Elbows lift softly and naturally– The subject gently holds the gathered hair briefly behind the head– She lightly twists or adjusts the hair as if preparing to tie it– The motion is subtle and relaxed– The hair should NOT become perfectly tied– It should feel like a casual “fixing the hair” moment– After briefly holding the hair, she softly relaxes the hands slightly⸻REALISTIC HAIR PHYSICS (CRITICAL):– Hair movement must come ONLY from both-hand contact and natural head motion– Hair must have realistic weight and gravity– No floating hair– No wind effect– No exaggerated bounce– No zero-gravity movement– Hair tension must feel realistic while being gathered– Loose strands remain natural around the neck and shoulders– Hair should naturally loosen slightly after the motion⸻IMPORTANT ANTI-BUG RULES:– Keep the subject ALWAYS in the same diagonal back-facing angle– Do NOT allow the subject to look at the camera– Do NOT rotate body toward camera– No front-facing frames– No sudden head turns– No camera shake– No zoom– No reframing– Camera remains completely fixed– Prevent hand and finger deformation– Prevent hair clipping through arms/body– Prevent arms from bending unnaturally⸻BODY MOVEMENT STYLE:– Minimal torso movement– Slight natural shoulder lift while gathering the hair– Very subtle hip balance shift– Calm feminine movement– No exaggerated posing– No dance movement– Maintain the same diagonal body angle tikthroughout the clip⸻HAND & ARM MOVEMENT:– Both arms move softly and naturally together– Elbows remain relaxed and feminine– Fingers softly compress and hold the hair realistically– No robotic synchronized motion– No stiff elbows– Natural real-time movement only⸻CAMERA:– Fixed tripod camera– No camera movement– No zoom– No perspective changes– Maintain exact original framing and crop⸻REALISM RULES:– Ultra realistic real-time motion– Natural arm weight and physics– Realistic shoulder mechanics– Realistic fabric response– Preserve skin texture– Preserve identity– Preserve realistic indoor lighting– No beauty filter– No CGI look– No smoothing– No stylization⸻TIMING:– Soft continuous pacing– Slightly slowed realistic motion– No sudden acceleration– No freezing– No looping– Smooth transitions between gestures⸻RESTRICTIONS:– No talking– No text– No UI– No effects– No influencer posing clichés– No direct eye contact– No front-facing pose– No aggressive motion– No floating hair physics⸻FINAL RESULT:A hyper-realistic diagonal back-view fashion animation where the subject softly raises BOTH hands, naturally gathers the hair behind the head as if casually tying a ponytail, briefly adjusts the hair with realistic feminine movement, and maintains stable framing, realistic weighted hair physics, and calm natural body motion throughout the entire clip.GENERATE ANIMATED BACKGROUND MUSIC, no music\n'
  },
  {
    id: 'Pacote Tiktok Shop',
    name: 'Pacote TikTok Shop',
    type: 'Movimentos',
    format: 'Video',
    description: 'Cena de unboxing / mesclagem de pacote TikTok Shop, com cara de conteúdo viral',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/pacote%20tiktok.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/pacote%20tiktok.mp4',
    promptText: 'HOOK MOVEMENT REFINEMENT (CRITICAL):The subject must WALK TOGETHER with the package toward the camera naturally.Do NOT keep the body static.Do NOT only stretch the arms forward.Do NOT create elastic-arm movement.The body, shoulders, torso, and package must all move forward together naturally.CORRECT MOVEMENT FLOW:– The subject starts already holding the package naturally with both hands– She takes ONE natural small step forward WITH her full body– Her torso naturally moves closer to the camera together with the package– The package stays close to the chest/body during the movement– Arms remain naturally bent– The subject physically walks closer instead of only extending the arms– Natural body weight shift while stepping– Natural shoulder movement– Natural posture balance– Smooth continuous movement– No sudden accelerationIMPORTANT REALISM FIX:– The package must approach the camera because the SUBJECT walks closer– NOT because the arms unnaturally stretch outward– The body must visibly move closer to the lens– Natural forward leaning is allowed near the end– Realistic arm follow-through only– No mannequin movement– No stiff elbowsPACKAGE PRESENTATION:– As she gets closer,she naturally lifts the package slightly upward toward the camera– The package should slowly become larger in frame naturally– Natural package sway and realistic plastic wrinkles are encouraged– Realistic finger grip pressure– Package must feel physically real and lightweightDATA COVERING ACTION (VERY IMPORTANT):– AFTER walking close to the camera,ONE hand naturally slides over the shipping information area– She casually covers the address/shipping data with her fingers– The motion must feel natural and subtle– Similar to a real influencer hiding personal information before showing a package on camera– Fingers must rest naturally on the label– No floating fingers– No clipping– No broken anatomy– No glitchy hand movementFINAL POSITION:– The subject ends VERY close to the camera– The package fills most of the frame– The covered shipping information remains hidden by the hand– The face can remain partially visible behind or beside the package– Final frame should feel like a realistic TikTok-style transitionFACIAL BEHAVIOR FIX (VERY IMPORTANT):– Mouth must remain naturally closed most of the time– Do NOT generate talking behavior– Do NOT simulate speech– Do NOT create lip-sync motion– No random mouth opening– No exaggerated facial animationExpression should remain:• soft• relaxed• natural• slightly happyA very subtle smile is allowed briefly, but:– lips mostly closed– no exaggerated grin– no visible talking motionMOTION QUALITY:– Real-time natural motion– No slow motion– No delay– No robotic timing– No jitter– No frame skipping– No looping behaviorCAMERA:– Stable POV camera– Very subtle handheld micro movement only– No zoom– No cinematic motion– No shakeFINAL FEELING:The animation should feel like a real girl naturally walking closer to the phone while holding a TikTok Shop package, physically approaching the camera together with the package, then casually covering the shipping information with one hand near the lens for a realistic TikTok-style transition.GENERATE ANIMATED BACKGROUND MUSIC, no music, sem musica, somente o moviment, as informações da embalagem tem que estar em portugues\n'
  },
  {
    id: 'Ultra Realista Mexendo Cabelo',
    name: 'Ultra Realista Mexendo Cabelo',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar mexe no cabelo de forma ultra realista, com movimentos suaves e naturais, expressão facial confiante e olhar direto para a câmera',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/ULTRA%20REALISTA%20MEXENDO%20CABELO.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/ULTRA%20REALISTA%20MEXENDO%20CABELO.mp4',
    promptText: 'Animate the subject as a REAL person presenting clothing in a POV-style video.The subject remains in the same position and starts moving immediately.From the beginning, she moves her hair and body at the SAME TIME.She brings one hand into her hair and runs her fingers  through it quickly and naturally, then lightly tosses it.While touching her hair, her body is continuously moving:she shifts her weight between legs,moves her hips slightly side to side,keeps a natural rhythm in her torso,and makes small natural posture adjustments.Her body MUST NOT stop while touching the hair.Hair movement and body movement happen together as one continuous action.The motion should feel alive, fluid and human, never paused, never separated, never robotic.Her expression starts neutral, then a soft natural smile appears briefly during the movement and fades.After finishing the hair movement, she continues with subtle natural body motion without freezing.Movement speed is natural and slightly quick, not slow motion and not exaggerated.Camera remains stable, no zoom, no major movement.åPreserve identity, natural hair physics, natural fabric behavior, no stylization.Final result should feel like a real person casually moving her hair while naturally shifting her body, fully synchronized and lifelike.GENERATE ANIMATED BACKGROUND MUSIC, no music, sem musica, somente o movimento, sem somm.\nsomente o movimento, sem musica, so a animação\n'
  },
  {
    id: 'Virando De Costa',
    name: 'Virando de Costa',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar vira de costas para a câmera de forma natural e fluida, com movimentos suaves e expressão facial confiante',
    imageUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/VIRANDO%20DE%20COSTA.mp4',
    videoUrl: 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/VIRANDO%20DE%20COSTA.mp4',
    promptText: '{  "intent": "dress_forward_back_pose_flow",  "camera": {    "tripod": true,    "locked": true,    "no_movement": true,    "no_reframe": true,    "no_zoom": true  },  "audio": {    "enabled": false,    "no_speaking": true,    "lips_closed": true  },  "timing": {    "tempo": "fast_natural",    "no_slow_motion": true,    "natural_speed": true  },  "sequence": [    {      "action": "start_pose",      "pose": "front_facing",      "hands": "one_on_hip_one_relaxed",      "expression": "soft_friendly"    },    {      "action": "step_forward",      "steps": 1,      "direction": "straight_forward",      "body_behavior": "natural_confident",      "no_rotation": true    },    {      "action": "hold_front_position",      "duration": "short",      "expression": "soft_smile"    },    {      "action": "step_back",      "steps": 2,      "direction": "straight_back",      "no_rotation": true,      "no_side_shift": true,      "body_stays_front": true    },    {      "action": "final_pose",      "pose": "slight_hip_shift",      "hand": "one_hand_on_hip",      "body_angle": "very_small_side",      "expression": "soft_confident_smile"    }  ],  "movement": {    "no_spinning": true,    "no_360": true,    "no_turning_while_walking": true,    "no_diagonal_movement": true,    "only_straight_forward_and_back": true  },  "body_language": {    "natural_confident": true,    "subtle_hip_movement": true,    "no_exaggeration": true,    "no_robotic_motion": true  },  "realism": {    "preserve_identity": true,    "natural_fabric_physics": true,    "natural_body_motion": true,    "no_beauty_filter": true  }}\n\nGENERATE ANIMATED BACKGROUND MUSIC\n'
  },
 ];