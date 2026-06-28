import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Settings, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
  CreditCard, 
  CheckCircle, 
  ChevronRight, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Video,
  Plus,
  Upload,
  Trash2,
  Edit2,
  RotateCcw,
  Save,
  Tag,
  Eye,
  Info,
  Layers,
  ArrowRightCircle,
  Sun,
  Moon,
  Download,
  Copy,
  Check,
  Webhook,
  Globe,
  Activity,
  Award,
  Coins,
  Volume2,
  Play,
  UploadCloud,
  VolumeX,
  Music,
  GraduationCap,
  Youtube,
  Lock,
  Unlock,
  FolderPlus,
  ChevronUp,
  ChevronDown,
  Clock,
  X,
  EyeOff,
  Flame
} from 'lucide-react';
import { Profile, TrendingProduct } from '../types';
import AdminViralManager from './AdminViralManager';

interface ScreenConfiguracoesProps {
  profile: Profile;
  onUpdateProfile: (name: string, email: string) => void;
  onResetDatabase: () => void;
  onNavigate: (path: string) => void;
  trendingProducts: TrendingProduct[];
  onSetTrendingProducts: React.Dispatch<React.SetStateAction<TrendingProduct[]>>;
  theme: 'dark' | 'light';
  onToggleTheme: (newTheme: 'dark' | 'light') => void;
  simulatedSalesEnabled?: boolean;
  onSetSimulatedSalesEnabled?: (enabled: boolean) => void;
  simulatedSalesMinMin?: number;
  onSetSimulatedSalesMinMin?: (min: number) => void;
  simulatedSalesMaxMin?: number;
  onSetSimulatedSalesMaxMin?: (max: number) => void;
  simulatedSalesSound?: boolean;
  onSetSimulatedSalesSound?: (enabled: boolean) => void;
  simulatedSalesSoundUrl?: string | null;
  onSetSimulatedSalesSoundUrl?: (url: string | null) => void;
  onForceTriggerSale?: () => void;
}

// Default fallbacks to allow easy restorations
const DEFAULT_AVATARS = [];

const DEFAULT_SCENARIOS = [
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

const DEFAULT_MOVEMENTS = [
  {
    id: 'cta_beijo',
    name: 'CTA Beijo',
    type: 'Movimentos',
    format: 'Video',
    description: 'A avatar manda beijo para a câmera com gesto suave e simpático',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blowing-a-kiss-to-the-camera-40748-large.mp4',
    promptText: 'UGC style, beautiful female presenter looking into camera, smiling warmly and blowing a gentle kiss with a soft hand gesture, highly natural, aesthetic framing, 9:16 vertical.'
  },
  {
    id: 'hook_tapar_camera',
    name: 'Hook Tapar Câmera',
    type: 'POV',
    format: 'Video',
    description: 'A avatar leva a mão até a lente, como se fosse “tapar a câmera” para criar transição',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-posing-funny-for-the-camera-39906-large.mp4',
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
    promptText: 'Bad boy and cool girl editorial aesthetics, wearing a heavy modern black leather jacket, doing real selfie pose with retro look and raw studio vibe.'
  },
  {
    id: 'look_casual',
    name: 'Look Casual',
    type: 'Look',
    format: 'Video',
    description: 'Look casual natural, postura relaxada e estética lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-sunset-41712-large.mp4',
    promptText: 'Aesthetic street lifestyle, model wearing comfortable beige and white casual wear during a day out, relaxed candid walking look with sunset warm background.'
  },
  {
    id: 'torcedora_brasil_premium',
    name: 'Torcedora Brasil Premium',
    type: 'Look',
    format: 'Video',
    description: 'Avatar com camiseta do Brasil, pose alegre e vibe premium',
    imageUrl: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blowing-a-kiss-to-the-camera-40748-large.mp4',
    promptText: 'UGC influencer styled in a premium Brazil national football team jersey, celebrating happily, golden sun rays, high energy, professional cinematic grading.'
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
    promptText: 'High class feminine style mirror selfie, looking graceful in a chic dinner dress, marble walls and gold details in background, golden reflections.'
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

const DEFAULT_INTERACTIONS = [
  { id: 'A', name: "Vestindo o produto", description: "O avatar apresentador estará vestindo fisicamente o artigo de venda.", englishText: "Wearing the product, full body or half body shot, natural pose, product clearly visible as part of the outfit, soft natural lighting, realistic photography style" },
  { id: 'B', name: "Segurando o produto", description: "O avatar segura e manipula o objeto para as lentes, com foco nas texturas.", englishText: "Holding the product with both hands, close-up focus on product textures and details, hands and product in sharp focus, neutral background, studio-style lighting" },
  { id: 'C', name: "Selfie no espelho com o produto", description: "Estilo gravação íntima e carismática de unboxing rápido no reflexo do espelho.", englishText: "Taking a mirror selfie with the product, intimate and casual unboxing style, phone visible in reflection, candid expression, soft indoor lighting, vertical framing" },
  { id: 'D', name: "Selfie normal com o produto em destaque", description: "Celular em ângulo alto focado no rosto com o produto posicionado lateralmente.", englishText: "Taking a selfie with the product highlighted, high-angle phone shot focused on the face, product positioned to the side and clearly visible, natural expression, bright lighting" },
  { id: 'E', name: "POV: Mãos usando e testando", description: "Primeira pessoa (POV), apenas as mãos aparecem interagindo com o produto em câmera lenta (sem rosto/avatar).", englishText: "First-person POV tight close-up shot, only elegant hands visible interacting with and using the product in slow-motion, showing meticulous touch, weight, material texture and premium craftsmanship, clean background with high-end ambient studio lighting, no faces visible." },
  { id: 'F', name: "ASMR / Textura ultra aproximada", description: "Câmera macro extremamente próxima revelando material, tampa, brilho e detalhes em alta definição sem diálogos.", englishText: "Extreme macro close-up macro lens shot of the physical product, revealing intricate surface textures, gloss, fine lid details, metallic or matte finishes under premium glowing showroom light, serene calm atmosphere, focusing purely on aesthetic physical design with no people visible." },
  { id: 'G', name: "Problema → Solução (Gancho Rápido)", description: "Inicia mostrando um incômodo/dor real, com corte rápido e rítmico para o produto trazendo a solução perfeita.", englishText: "Dynamic multi-scene commercial sequence. Starts with a quick visual cue of daily life frustration or problem, followed immediately by a fast rhythmic sharp cut to the product smoothly solving it. High-contrast energetic video framing with perfect focus on the action." },
  { id: 'H', name: "Unboxing Estético / Unwrapping", description: "Abertura minuciosa e rítmica da caixa e do plástico, revelando o produto em câmera lenta brilhante.", englishText: "Aesthetic unboxing experience sequence, hands opening the high-end product packaging in direct focus, showcasing paper or cardboard sound rhythm, slow elegant peel action, revealing the pristine polished product layout beneath, commercial unearthing presentation." },
  { id: 'I', name: "\"TikTok made me buy\" / Reação Genuína", description: "Estilo depoimento real, mostrando o rosto se surpreendendo positivamente com a qualidade do item recebido.", englishText: "Fast-paced genuine reaction and testimonial style, lifestyle presentation, happy facial expressions, holding the product up showing off a dynamic reveal, as if expressing natural discovery, high engagement viral video vibes." },
  { id: 'J', name: "Antes e Depois (Corte Rítmico)", description: "Comparação de transição magnética e satisfatória: situação antes sem o produto versus resultado impecável com ele.", englishText: "Rhythmic split-screen or quick cut before-and-after visual presentation. First half showing the suboptimal state/setup, followed by a sudden aesthetic high-contrast transition frame showing the incredible transformation after applying the product, high conversion viral visual hook." },
  { id: 'K', name: "Lifestyle / Detalhes de Ambiente", description: "Produto repousando em mesa premium sob luz solar suave, com movimento de câmera lento e artístico (foco no ambiente).", englishText: "Premium quiet luxury ambient lifestyle shot. The product is beautifully placed on an elegant wooden table or custom decorated surface with natural soft volumetric light filtering through, gentle cinematic panning shot highlighting the surroundings with absolute zero focus on active presenters." },
  { id: 'L', name: "UGC (Criador Orgânico)", description: "📱 Celular vertical (9:16) com expressões reais, cenários domésticos e movimentos nativos virais.", englishText: "UGC (User Generated Content) style recording, 9:16 vertical video captured on a high-end smartphone camera. A natural presentation looking directly at the lens with friendly guestures and warm expressions. High-converting viral review look, showing the physical product naturally with selfie close-ups." }
];

const INTERACTION_MEDIA_MAP: Record<string, { imageUrl: string; videoUrl: string; category: string; format: string }> = {
  'A': {
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-look-of-the-day-fashion-video-41584-large.mp4',
    category: 'VISTA',
    format: 'Video'
  },
  'B': {
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    category: 'PRODUTO',
    format: 'Video'
  },
  'C': {
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-showing-her-outfit-in-the-mirror-40283-large.mp4',
    category: 'ESPELHO',
    format: 'Video'
  },
  'D': {
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-sunset-41712-large.mp4',
    category: 'SELFIE',
    format: 'Video'
  },
  'E': {
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
    category: 'POV',
    format: 'Video'
  },
  'F': {
    imageUrl: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gorgeous-woman-putting-on-makeup-41595-large.mp4',
    category: 'ASMR',
    format: 'Video'
  },
  'G': {
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-sunglasses-posing-funny-for-the-camera-39906-large.mp4',
    category: 'HOOK',
    format: 'Video'
  },
  'H': {
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-new-delivery-box-at-home-41602-large.mp4',
    category: 'UNBOXING',
    format: 'Video'
  },
  'I': {
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-blowing-a-kiss-to-the-camera-40748-large.mp4',
    category: 'REAÇÃO',
    format: 'Video'
  },
  'J': {
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-showing-her-look-41587-large.mp4',
    category: 'TRANSIÇÃO',
    format: 'Video'
  },
  'K': {
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-unboxing-a-new-delivery-box-at-home-41602-large.mp4',
    category: 'LIFESTYLE',
    format: 'Video'
  },
  'L': {
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-touching-her-long-hair-41589-large.mp4',
    category: 'UGC',
    format: 'Video'
  }
};

function InteractionPreviewHover({ imageUrl, videoUrl, name }: { imageUrl: string; videoUrl: string; name: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoUrl && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay was prevented or postponed:", err);
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full"
    >
      <img 
        src={imageUrl} 
        alt={name} 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
      />
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default function ScreenConfiguracoes({
  profile,
  onUpdateProfile,
  onResetDatabase,
  onNavigate,
  trendingProducts,
  onSetTrendingProducts,
  theme,
  onToggleTheme,
  simulatedSalesEnabled = false,
  onSetSimulatedSalesEnabled,
  simulatedSalesMinMin = 5,
  onSetSimulatedSalesMinMin,
  simulatedSalesMaxMin = 15,
  onSetSimulatedSalesMaxMin,
  simulatedSalesSound = true,
  onSetSimulatedSalesSound,
  simulatedSalesSoundUrl = null,
  onSetSimulatedSalesSoundUrl,
  onForceTriggerSale
}: ScreenConfiguracoesProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'cobranca' | 'flow' | 'webhooks' | 'gerenciar_aulas' | 'gerenciar_viralizar'>('geral');
  const [name, setName] = useState(profile.name);

  // --- STATE FOR GERENCIAR AULAS ADMIN TAB ---
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Form states for Module CRUD
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modEditingId, setModEditingId] = useState<string | null>(null);
  const [modTitle, setModTitle] = useState('');
  const [modOrder, setModOrder] = useState<number | ''>('');

  // Form states for Lesson CRUD
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lesEditingId, setLesEditingId] = useState<string | null>(null);
  const [lesModuleId, setLesModuleId] = useState('');
  const [lesTitle, setLesTitle] = useState('');
  const [lesDescription, setLesDescription] = useState('');
  const [lesYoutubeUrl, setLesYoutubeUrl] = useState('');
  const [lesDuration, setLesDuration] = useState('10:00');
  const [lesOrder, setLesOrder] = useState<number | ''>('');
  const [lesIsPublished, setLesIsPublished] = useState(true);
  const [lesIsPremium, setLesIsPremium] = useState(false);

  // Youtube Live Preview state
  const [inputVideoIdPreview, setInputVideoIdPreview] = useState<string | null>(null);
  const [email, setEmail] = useState(profile.email);
  const [notif, setNotif] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [copiedLogo, setCopiedLogo] = useState(false);

  // State for Sales Simulation Sound upload
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioPreviewElement, setAudioPreviewElement] = useState<HTMLAudioElement | null>(null);
  const [supabaseUploadConfig, setSupabaseUploadConfig] = useState<{ url: string; key: string } | null>(null);

  // Load admin settings to fetch Supabase credentials
  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok && active) {
          const data = await res.json();
          if (data.supabase_url && data.supabase_anon_key) {
            setSupabaseUploadConfig({
              url: data.supabase_url,
              key: data.supabase_anon_key
            });
          }
        }
      } catch (e) {
        console.warn("Failed to fetch settings for Supabase audio upload config:", e);
      }
    };
    fetchSettings();
    return () => {
      active = false;
    };
  }, []);

  // Cleanup playing preview on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewElement) {
        try {
          audioPreviewElement.pause();
        } catch (err) {}
      }
    };
  }, [audioPreviewElement]);

  // --- GERENCIAR AULAS ADMIN METHODS ---
  const fetchCourseData = async () => {
    try {
      setLessonsLoading(true);
      setLessonsError(null);

      const [resModules, resLessons] = await Promise.all([
        fetch('/api/course-modules'),
        fetch('/api/course-lessons')
      ]);

      if (!resModules.ok || !resLessons.ok) {
        throw new Error("Erro ao consultar a base de cursos no servidor.");
      }

      const mData = await resModules.json();
      const lData = await resLessons.json();

      setModules(mData);
      setLessons(lData);

      // Default accordion state: expand all modules initially
      const initialExp: Record<string, boolean> = {};
      mData.forEach((m: any) => {
        initialExp[m.id] = true;
      });
      setExpandedModules(prev => ({ ...initialExp, ...prev }));
    } catch (err: any) {
      console.error(err);
      setLessonsError(err.message || "Falha ao carregar conteúdos das aulas.");
    } finally {
      setLessonsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'gerenciar_aulas') {
      fetchCourseData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (lesYoutubeUrl) {
      setInputVideoIdPreview(extractYoutubeId(lesYoutubeUrl));
    } else {
      setInputVideoIdPreview(null);
    }
  }, [lesYoutubeUrl]);

  function extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  // --- CRUD FUNCTIONS FOR COURSE MODULE ---
  const handleOpenModuleCreate = () => {
    setModEditingId(null);
    setModTitle('');
    setModOrder(modules.length + 1);
    setShowModuleModal(true);
  };

  const handleOpenModuleEdit = (mod: any) => {
    setModEditingId(mod.id);
    setModTitle(mod.title);
    setModOrder(mod.order_position);
    setShowModuleModal(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modTitle.trim()) return;

    try {
      const payload = {
        title: modTitle.trim(),
        order_position: modOrder !== '' ? Number(modOrder) : modules.length + 1
      };

      const url = modEditingId ? `/api/course-modules/${modEditingId}` : '/api/course-modules';
      const method = modEditingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModuleModal(false);
        await fetchCourseData();
      } else {
        const d = await res.json();
        alert(d.error || "Houve uma falha ao salvar o módulo.");
      }
    } catch (err) {
      console.error(err);
      alert("Houve uma falha na conexão de rede.");
    }
  };

  const handleDeleteModule = async (modId: string) => {
    if (!confirm("Aviso: Excluir este módulo apagará permanentemente todas as suas aulas. Deseja prosseguir?")) {
      return;
    }

    try {
      const res = await fetch(`/api/course-modules/${modId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchCourseData();
      } else {
        alert("Erro ao excluir o módulo.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveModuleOrder = async (mod: any, direction: 'up' | 'down') => {
    const sorted = [...modules].sort((a,b) => a.order_position - b.order_position);
    const currIdx = sorted.findIndex(m => m.id === mod.id);
    if (currIdx === -1) return;

    const targetIdx = direction === 'up' ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const neighbor = sorted[targetIdx];
    
    const temp = mod.order_position;
    mod.order_position = neighbor.order_position;
    neighbor.order_position = temp;

    try {
      const res = await fetch('/api/course-modules/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: [
            { id: mod.id, order_position: mod.order_position },
            { id: neighbor.id, order_position: neighbor.order_position }
          ]
        })
      });

      if (res.ok) {
        await fetchCourseData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CRUD FUNCTIONS FOR COURSE LESSONS ---
  const handleOpenLessonCreate = (mId: string) => {
    setLesEditingId(null);
    setLesModuleId(mId);
    setLesTitle('');
    setLesDescription('');
    setLesYoutubeUrl('');
    setLesDuration('10:00');
    setLesOrder(lessons.filter(l => l.module_id === mId).length + 1);
    setLesIsPublished(true);
    setLesIsPremium(false);
    setShowLessonModal(true);
  };

  const handleOpenLessonEdit = (les: any) => {
    setLesEditingId(les.id);
    setLesModuleId(les.module_id);
    setLesTitle(les.title);
    setLesDescription(les.description || '');
    setLesYoutubeUrl(les.youtube_url);
    setLesDuration(les.duration || '10:00');
    setLesOrder(les.order_position);
    setLesIsPublished(les.is_published);
    setLesIsPremium(les.is_premium || false);
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesModuleId || !lesTitle.trim() || !lesYoutubeUrl.trim()) {
      alert("Módulo, Título e Link/ID do YouTube são requeridos.");
      return;
    }

    try {
      const payload = {
        module_id: lesModuleId,
        title: lesTitle.trim(),
        description: lesDescription.trim(),
        youtube_url: lesYoutubeUrl.trim(),
        order_position: lesOrder !== '' ? Number(lesOrder) : lessons.filter(l => l.module_id === lesModuleId).length + 1,
        duration: lesDuration,
        is_published: lesIsPublished,
        is_premium: lesIsPremium
      };

      const url = lesEditingId ? `/api/course-lessons/${lesEditingId}` : '/api/course-lessons';
      const method = lesEditingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowLessonModal(false);
        await fetchCourseData();
      } else {
        const d = await res.json();
        alert(d.error || "Falha ao salvar a aula.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de rede ao conectar.");
    }
  };

  const handleDeleteLesson = async (lesId: string) => {
    if (!confirm("Tem certeza que deseja apagar permanentemente esta aula do curso?")) {
      return;
    }

    try {
      const res = await fetch(`/api/course-lessons/${lesId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchCourseData();
      } else {
        alert("Falha ao remover a aula.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveLessonOrder = async (les: any, direction: 'up' | 'down') => {
    const modLessons = lessons
      .filter(l => l.module_id === les.module_id)
      .sort((a, b) => a.order_position - b.order_position);

    const currIdx = modLessons.findIndex(l => l.id === les.id);
    if (currIdx === -1) return;

    const targetIdx = direction === 'up' ? currIdx - 1 : currIdx + 1;
    if (targetIdx < 0 || targetIdx >= modLessons.length) return;

    const neighbor = modLessons[targetIdx];

    const temp = les.order_position;
    les.order_position = neighbor.order_position;
    neighbor.order_position = temp;

    try {
      const res = await fetch('/api/course-lessons/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessons: [
            { id: les.id, order_position: les.order_position },
            { id: neighbor.id, order_position: neighbor.order_position }
          ]
        })
      });

      if (res.ok) {
        await fetchCourseData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const playCashRegisterSynthFallback = () => {
    setIsAudioPlaying(true);
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const oscList = [1500, 2000, 2500, 3000];
        const chingGain = ctx.createGain();
        chingGain.connect(ctx.destination);
        chingGain.gain.setValueAtTime(0, ctx.currentTime);
        chingGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.02);
        chingGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        oscList.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.connect(chingGain);
          osc.type = 'sine';
          osc.frequency.value = freq;
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.8);
        });
      }
    } catch (e) {
      console.warn("Synth failed:", e);
    }
    setTimeout(() => setIsAudioPlaying(false), 800);
  };

  const handlePlayPreviewSound = () => {
    setAudioUploadError(null);
    try {
      if (audioPreviewElement) {
        audioPreviewElement.pause();
        audioPreviewElement.currentTime = 0;
      }

      if (simulatedSalesSoundUrl) {
        const audio = new Audio(simulatedSalesSoundUrl);
        setAudioPreviewElement(audio);
        setIsAudioPlaying(true);
        audio.play().then(() => {
          audio.onended = () => setIsAudioPlaying(false);
        }).catch((e) => {
          console.warn("Custom sound play failed, trying fallback:", e);
          playCashRegisterSynthFallback();
        });
      } else {
        // Try the default cash register file
        const audio = new Audio('/sounds/default-cash-register.mp3');
        setAudioPreviewElement(audio);
        setIsAudioPlaying(true);
        audio.play().then(() => {
          audio.onended = () => setIsAudioPlaying(false);
        }).catch((e) => {
          console.warn("Default cash register file play failed, running synth:", e);
          playCashRegisterSynthFallback();
        });
      }
    } catch (err) {
      console.error("Play preview sound failed:", err);
      playCashRegisterSynthFallback();
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioUploadError(null);

    // Validation: max 2MB
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setAudioUploadError("O arquivo de áudio excede o peso limite de 2MB.");
      return;
    }

    // Validation: Audio extensions/mimes
    const allowedExtensions = ['mp3', 'wav', 'ogg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isAudio = file.type.startsWith('audio/') || allowedExtensions.includes(ext);
    if (!isAudio) {
      setAudioUploadError("Formato inválido. Envie apenas arquivos de áudio nos formatos .mp3, .wav ou .ogg.");
      return;
    }

    setIsAudioUploading(true);

    try {
      const isRealSupabase = supabaseUploadConfig && 
                             supabaseUploadConfig.url && 
                             !supabaseUploadConfig.url.includes("exemplo") && 
                             !supabaseUploadConfig.url.includes("ais-project");

      if (isRealSupabase && supabaseUploadConfig) {
        const bucketName = 'sounds';
        const fileName = `sale_sound_${Date.now()}.${ext}`;
        const uploadUrl = `${supabaseUploadConfig.url}/storage/v1/object/${bucketName}/${fileName}`;

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseUploadConfig.key}`,
            'apikey': supabaseUploadConfig.key,
            'Content-Type': file.type || 'audio/mpeg'
          },
          body: file
        });

        if (uploadResponse.ok) {
          const publicUrl = `${supabaseUploadConfig.url}/storage/v1/object/public/${bucketName}/${fileName}`;
          onSetSimulatedSalesSoundUrl?.(publicUrl);
          
          await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ simulated_sales_sound_url: publicUrl })
          });
          return;
        } else {
          console.warn("Supabase upload returned non-200, falling back to base64 reader:", await uploadResponse.text());
        }
      }

      // Fallback base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        onSetSimulatedSalesSoundUrl?.(base64Url);

        try {
          await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ simulated_sales_sound_url: base64Url })
          });
        } catch (err) {
          console.warn("Could not save to settings endpoint:", err);
        }
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error("Audio upload failed:", err);
      setAudioUploadError("Falha ao processar e enviar o áudio.");
    } finally {
      setIsAudioUploading(false);
    }
  };

  const [isPresetUploading, setIsPresetUploading] = useState(false);
  const [presetUploadError, setPresetUploadError] = useState<string | null>(null);

  const handlePresetImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPresetUploadError(null);
    setIsPresetUploading(true);

    try {
      const isRealSupabase = supabaseUploadConfig && 
                             supabaseUploadConfig.url && 
                             !supabaseUploadConfig.url.includes("exemplo") && 
                             !supabaseUploadConfig.url.includes("ais-project");

      if (isRealSupabase && supabaseUploadConfig) {
        const bucketName = 'previews';
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `preset_img_${Date.now()}.${ext}`;
        const uploadUrl = `${supabaseUploadConfig.url}/storage/v1/object/${bucketName}/${fileName}`;

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseUploadConfig.key}`,
            'apikey': supabaseUploadConfig.key,
            'Content-Type': file.type || 'image/jpeg'
          },
          body: file
        });

        if (uploadResponse.ok) {
          const publicUrl = `${supabaseUploadConfig.url}/storage/v1/object/public/${bucketName}/${fileName}`;
          setFormImg(publicUrl);
          setIsPresetUploading(false);
          return;
        } else {
          console.warn("Supabase upload returned non-200, fallback to local FileReader:", await uploadResponse.text());
        }
      }

      // Fallback base64
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormImg(event.target?.result as string);
        setIsPresetUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Preset image upload err:", err);
      setPresetUploadError("Erro ao processar imagem.");
      setIsPresetUploading(false);
    }
  };

  const handlePresetVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPresetUploadError(null);
    setIsPresetUploading(true);

    try {
      const isRealSupabase = supabaseUploadConfig && 
                             supabaseUploadConfig.url && 
                             !supabaseUploadConfig.url.includes("exemplo") && 
                             !supabaseUploadConfig.url.includes("ais-project");

      if (isRealSupabase && supabaseUploadConfig) {
        const bucketName = 'previews';
        const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
        const fileName = `preset_video_${Date.now()}.${ext}`;
        const uploadUrl = `${supabaseUploadConfig.url}/storage/v1/object/${bucketName}/${fileName}`;

        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseUploadConfig.key}`,
            'apikey': supabaseUploadConfig.key,
            'Content-Type': file.type || 'video/mp4'
          },
          body: file
        });

        if (uploadResponse.ok) {
          const publicUrl = `${supabaseUploadConfig.url}/storage/v1/object/public/${bucketName}/${fileName}`;
          setFormVideoUrl(publicUrl);
          setIsPresetUploading(false);
          return;
        } else {
          console.warn("Supabase video upload non-200, fallback to raw reader:", await uploadResponse.text());
        }
      }

      // Fallback base64 video data url
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormVideoUrl(event.target?.result as string);
        setIsPresetUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Preset video upload err:", err);
      setPresetUploadError("Erro ao processar arquivo de vídeo.");
      setIsPresetUploading(false);
    }
  };

  const handleRemoveCustomSound = async () => {
    setAudioUploadError(null);
    onSetSimulatedSalesSoundUrl?.(null);
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulated_sales_sound_url: null })
      });
    } catch (err) {
      console.warn("Could not clear sound URL on settings:", err);
    }
  };

  // Local states for sales badges configurator
  const [salesBadgesEnabled, setSalesBadgesEnabledLocal] = useState<boolean>(() => {
    return localStorage.getItem('local_sales_badges_enabled') !== 'false';
  });
  const [salesBadgesProbability, setSalesBadgesProbabilityLocal] = useState<number>(() => {
    const val = localStorage.getItem('local_sales_badges_probability');
    if (val) {
      const parsed = parseInt(val);
      return isNaN(parsed) ? 40 : parsed;
    }
    return 40;
  });
  const [salesBadgesList, setSalesBadgesListLocal] = useState<any[]>(() => {
    const saved = localStorage.getItem('local_sales_badges_list');
    return saved ? JSON.parse(saved) : [
      { id: '1', label: '🔥 Vendendo muito', color: 'red', icon: 'Flame' },
      { id: '2', label: '⚡ Em alta', color: 'amber', icon: 'Zap' },
      { id: '3', label: '⚠️ Últimas unidades', color: 'orange', icon: 'AlertTriangle' },
      { id: '4', label: '🌟 Mais procurado', color: 'cyan', icon: 'Sparkles' }
    ];
  });

  // For adding a new custom badge or editing
  const [badgeLabel, setBadgeLabel] = useState<string>('');
  const [badgeColor, setBadgeColor] = useState<string>('red');
  const [badgeIcon, setBadgeIcon] = useState<string>('Flame');

  const handleToggleSalesBadges = (enabled: boolean) => {
    setSalesBadgesEnabledLocal(enabled);
    localStorage.setItem('local_sales_badges_enabled', enabled ? 'true' : 'false');
  };

  const handleUpdateProbability = (prob: number) => {
    setSalesBadgesProbabilityLocal(prob);
    localStorage.setItem('local_sales_badges_probability', String(prob));
  };

  const handleAddBadgeLocal = () => {
    if (!badgeLabel.trim()) return;
    const newBadge = {
      id: String(Date.now()),
      label: badgeLabel,
      color: badgeColor,
      icon: badgeIcon
    };
    const updated = [...salesBadgesList, newBadge];
    setSalesBadgesListLocal(updated);
    localStorage.setItem('local_sales_badges_list', JSON.stringify(updated));
    setBadgeLabel('');
  };

  const handleDeleteBadgeLocal = (badgeId: string) => {
    const updated = salesBadgesList.filter(b => b.id !== badgeId);
    setSalesBadgesListLocal(updated);
    localStorage.setItem('local_sales_badges_list', JSON.stringify(updated));
  };

  // Webhooks State
  const [webhooks, setWebhooks] = useState<any[]>([
    {
      id: 'wh-1',
      title: 'Integração de Cadastro - ActiveCampaign',
      url: 'https://api.activecampaign.com/hooks/deal_receiver',
      type: 'Padrão',
      events: ['Transação criada', 'Transação paga'],
      status: 'active',
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'wh-2',
      title: 'Disparo de Alertas Telegram',
      url: 'https://api.telegram.org/bot/notify_sales_webhook',
      type: 'Padrão',
      events: ['Transação paga', 'MED recebido', 'Chargeback recebido'],
      status: 'active',
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    }
  ]);
  const [whTitle, setWhTitle] = useState('');
  const [whUrl, setWhUrl] = useState('');
  const [whType, setWhType] = useState('Padrão');
  const [whEvents, setWhEvents] = useState<string[]>(['Transação criada', 'Transação paga']);
  const [whSuccessMsg, setWhSuccessMsg] = useState('');
  const [whErrorMsg, setWhErrorMsg] = useState('');
  const [whTestResponse, setWhTestResponse] = useState<any>(null);
  const [testingWhId, setTestingWhId] = useState<string | null>(null);

  // Workflow Personalization Lists
  const [subTab, setSubTab] = useState<'produtos' | 'avatars' | 'scenarios' | 'movements' | 'interactions'>('produtos');
  
  const [allAvatars, setAllAvatars] = useState<any[]>([]);
  const [allScenarios, setAllScenarios] = useState<any[]>([]);
  const [allMovements, setAllMovements] = useState<any[]>([]);
  const [allInteractions, setAllInteractions] = useState<any[]>([]);

  // Custom item inputs
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');

  // Helper to merge loaded lists with default presets to prevent losing custom items or software-updated defaults
  const mergePresetsWithDefaults = <T extends { id: string }>(loadedList: T[] | null, defaults: T[]): T[] => {
    if (!loadedList || loadedList.length === 0) return defaults;
    const merged = [...loadedList];
    defaults.forEach(def => {
      if (!merged.some(item => item.id === def.id)) {
        merged.push(def);
      }
    });
    return merged;
  };

  // Load customizations
  const loadData = async () => {
    // 1. CARREGAR AVATARES
    let localAvatars: any[] = [];
    localStorage.removeItem('local_avatars_presets'); // Ensure no old avatars persist
    try {
      const avRes = await fetch('/api/avatars');
      if (avRes.ok) {
        const custom = await avRes.json();
        if (custom && custom.length > 0) {
          setAllAvatars(mergePresetsWithDefaults(custom, DEFAULT_AVATARS));
        } else {
          setAllAvatars(mergePresetsWithDefaults(localAvatars, DEFAULT_AVATARS));
        }
      } else {
        setAllAvatars(mergePresetsWithDefaults(localAvatars, DEFAULT_AVATARS));
      }
    } catch (e) {
      setAllAvatars(mergePresetsWithDefaults(localAvatars, DEFAULT_AVATARS));
    }

    // 2. CARREGAR CENÁRIOS
    let localScenarios: any[] = DEFAULT_SCENARIOS;
    try {
      const savedScenarios = localStorage.getItem('local_scenarios_presets');
      if (savedScenarios) {
        localScenarios = JSON.parse(savedScenarios);
      }
    } catch (e) {
      console.warn("Erro ao ler cenários do localStorage:", e);
    }

    try {
      const scRes = await fetch('/api/scenarios');
      if (scRes.ok) {
        const custom = await scRes.json();
        if (custom && custom.length > 0) {
          setAllScenarios(mergePresetsWithDefaults(custom, DEFAULT_SCENARIOS));
        } else {
          setAllScenarios(mergePresetsWithDefaults(localScenarios, DEFAULT_SCENARIOS));
        }
      } else {
        setAllScenarios(mergePresetsWithDefaults(localScenarios, DEFAULT_SCENARIOS));
      }
    } catch (e) {
      setAllScenarios(mergePresetsWithDefaults(localScenarios, DEFAULT_SCENARIOS));
    }

    // 3. CARREGAR MOVIMENTOS
    let localMovements: any[] = DEFAULT_MOVEMENTS;
    try {
      const savedMovements = localStorage.getItem('local_movements_presets');
      if (savedMovements) {
        localMovements = JSON.parse(savedMovements);
      }
    } catch (e) {
      console.warn("Erro ao ler movimentos do localStorage:", e);
    }

    try {
      const mvRes = await fetch('/api/movements');
      if (mvRes.ok) {
        const custom = await mvRes.json();
        if (custom && custom.length > 0) {
          setAllMovements(mergePresetsWithDefaults(custom, DEFAULT_MOVEMENTS));
        } else {
          setAllMovements(mergePresetsWithDefaults(localMovements, DEFAULT_MOVEMENTS));
        }
      } else {
        setAllMovements(mergePresetsWithDefaults(localMovements, DEFAULT_MOVEMENTS));
      }
    } catch (e) {
      setAllMovements(mergePresetsWithDefaults(localMovements, DEFAULT_MOVEMENTS));
    }

    const savedInteractions = localStorage.getItem('local_interactions_presets');
    setAllInteractions(savedInteractions ? JSON.parse(savedInteractions) : DEFAULT_INTERACTIONS);
  };

  useEffect(() => {
    loadData();

    const handleRealtimeUpdate = (event: any) => {
      loadData();
    };

    window.addEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    return () => {
      window.removeEventListener('realtime-db-update' as any, handleRealtimeUpdate);
    };
  }, []);

  // Sync helpers
  const saveAvatars = async (list: any[]) => {
    setAllAvatars(list);
    localStorage.setItem('local_avatars_presets', JSON.stringify(list));
    try {
      await fetch('/api/admin/avatars/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list })
      });
    } catch (err) {
      console.warn("Could not sync avatars on server:", err);
    }
  };

  const saveScenarios = async (list: any[]) => {
    setAllScenarios(list);
    localStorage.setItem('local_scenarios_presets', JSON.stringify(list));
    try {
      await fetch('/api/admin/scenarios/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list })
      });
    } catch (err) {
      console.warn("Could not sync scenarios on server:", err);
    }
  };

  const saveMovements = async (list: any[]) => {
    setAllMovements(list);
    localStorage.setItem('local_movements_presets', JSON.stringify(list));
    try {
      await fetch('/api/admin/movements/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list })
      });
    } catch (err) {
      console.warn("Could not sync movements on server:", err);
    }
  };

  const saveInteractions = (list: any[]) => {
    setAllInteractions(list);
    localStorage.setItem('local_interactions_presets', JSON.stringify(list));
  };

  const saveProducts = (list: TrendingProduct[]) => {
    onSetTrendingProducts(list);
    localStorage.setItem('local_trending_products', JSON.stringify(list));
  };

  // Add/Edit Form visibility & state
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null); // holds reference if editing
  
  const [formGender, setFormGender] = useState<'FEMININO' | 'MASCULINO'>('FEMININO');
  const [formType, setFormType] = useState('');
  const [formEnglish, setFormEnglish] = useState('');
  const [formPromptText, setFormPromptText] = useState('');
  const [formNiche, setFormNiche] = useState('Beleza e Cosméticos');
  const [formId, setFormId] = useState(''); // for custom keys
  const [formScore, setFormScore] = useState(85);
  const [formCompetition, setFormCompetition] = useState<'baixa' | 'média' | 'alta'>('média');
  const [formReason, setFormReason] = useState('');

  const handleOpenAddNew = () => {
    setEditingItem(null);
    setFormId('');
    setFormName('');
    setFormDesc('');
    setFormImg('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300');
    setFormVideoUrl('');
    setFormGender('FEMININO');
    setFormType(subTab === 'scenarios' ? 'Profissional' : subTab === 'movements' ? 'Movimento' : '');
    setFormEnglish('');
    setFormPromptText('');
    setFormNiche('Beleza');
    setFormScore(90);
    setFormCompetition('média');
    setFormReason('Alta demanda e engajamento orgânico viral no TikTok Shop.');
    setShowAddEditForm(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormName(item.name || item.title || '');
    setFormDesc(item.description || '');
    setFormImg(item.imageUrl || item.image_url || item.image || '');
    setFormVideoUrl(item.videoUrl || item.video_url || '');
    setFormGender(item.gender || 'FEMININO');
    setFormType(item.type || '');
    setFormEnglish(item.englishText || '');
    setFormPromptText(item.promptText || '');
    setFormNiche(item.niche || item.category || 'Beleza');
    setFormScore(item.opportunity_score || 85);
    setFormCompetition(item.competition_level || 'média');
    setFormReason(item.trend_reason || '');
    setShowAddEditForm(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (subTab === 'avatars') {
      const newItem = {
        id: formId || `avatar-custom-${Date.now()}`,
        name: formName,
        gender: formGender,
        description: formDesc,
        imageUrl: formImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        videoUrl: formVideoUrl || ''
      };

      if (editingItem) {
        saveAvatars(allAvatars.map(item => item.id === editingItem.id ? newItem : item));
      } else {
        saveAvatars([...allAvatars, newItem]);
      }
    } else if (subTab === 'scenarios') {
      const newItem = {
        id: formId || `scenario-custom-${Date.now()}`,
        name: formName,
        type: formType || 'Customizado',
        description: formDesc,
        imageUrl: formImg || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300',
        videoUrl: formVideoUrl || ''
      };

      if (editingItem) {
        saveScenarios(allScenarios.map(item => item.id === editingItem.id ? newItem : item));
      } else {
        saveScenarios([...allScenarios, newItem]);
      }
    } else if (subTab === 'movements') {
      const newItem = {
        id: formId || `movement-custom-${Date.now()}`,
        name: formName,
        type: formType || 'Customizado',
        description: formDesc,
        imageUrl: formImg || 'https://images.unsplash.com/photo-1627163430004-c7c3c9504018?auto=format&fit=crop&q=80&w=300',
        videoUrl: formVideoUrl || '',
        promptText: formPromptText || formDesc
      };

      if (editingItem) {
        saveMovements(allMovements.map(item => item.id === editingItem.id ? newItem : item));
      } else {
        saveMovements([...allMovements, newItem]);
      }
    } else if (subTab === 'interactions') {
      const keyId = formId ? formId.toUpperCase() : `INT-${Date.now()}`;
      const newItem = {
        id: keyId,
        name: formName,
        description: formDesc,
        englishText: formEnglish || 'interacting with the product'
      };

      if (editingItem) {
        saveInteractions(allInteractions.map(item => item.id === editingItem.id ? newItem : item));
      } else {
        saveInteractions([...allInteractions, newItem]);
      }
    } else if (subTab === 'produtos') {
      const newItem: TrendingProduct = {
        id: formId || `prod-custom-${Date.now()}`,
        name: formName,
        description: formDesc,
        niche: formNiche,
        image_url: formImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300',
        opportunity_score: Number(formScore) || 85,
        competition_level: formCompetition,
        trend_reason: formReason || 'Mais escolhido no TikTok Shop.',
        affiliate_links: editingItem?.affiliate_links || {
          tiktok: `https://shop.tiktok.com/view/product/${Math.floor(Math.random() * 10000000000000) + 1700000000000000000}`,
          shopee: 'https://shopee.com.br',
          mercadolivre: 'https://mercadolivre.com.br'
        },
        is_featured: editingItem?.is_featured || false,
        created_at: editingItem?.created_at || new Date().toISOString()
      };

      if (editingItem) {
        saveProducts(trendingProducts.map(item => item.id === editingItem.id ? newItem : item));
      } else {
        saveProducts([newItem, ...trendingProducts]);
      }
    }

    setShowAddEditForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("Deseja realmente remover este item personalizado?")) return;

    if (subTab === 'avatars') {
      saveAvatars(allAvatars.filter(item => item.id !== id));
    } else if (subTab === 'scenarios') {
      saveScenarios(allScenarios.filter(item => item.id !== id));
    } else if (subTab === 'movements') {
      saveMovements(allMovements.filter(item => item.id !== id));
    } else if (subTab === 'interactions') {
      saveInteractions(allInteractions.filter(item => item.id !== id));
    } else if (subTab === 'produtos') {
      saveProducts(trendingProducts.filter(item => item.id !== id));
    }
  };

  const handleRestoreDefaults = () => {
    if (!window.confirm("Isso irá apagar todas as customizações feitas nesta categoria e restaurar as configurações originais de fábrica. Confirmar?")) return;

    if (subTab === 'avatars') {
      saveAvatars(DEFAULT_AVATARS);
    } else if (subTab === 'scenarios') {
      saveScenarios(DEFAULT_SCENARIOS);
    } else if (subTab === 'movements') {
      saveMovements(DEFAULT_MOVEMENTS);
    } else if (subTab === 'interactions') {
      saveInteractions(DEFAULT_INTERACTIONS);
    } else if (subTab === 'produtos') {
      // Clear local products storage to fallback to api load in App.tsx
      localStorage.removeItem('local_trending_products');
      window.location.reload(); // Refresh to trigger API seed retrieval
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, email);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleReset = () => {
    if (!window.confirm("Aviso: Isso irá limpar seu banco de dados in-memory local e preencher novamente os dados padrões. Prosseguir?")) return;
    setIsResetting(true);
    setTimeout(() => {
      onResetDatabase();
      setIsResetting(false);
    }, 1200);
  };

  const handleDownloadLogo = (withBackground: boolean) => {
    const svgContent = `<svg width="500" height="500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${withBackground ? '<rect width="100" height="100" fill="#0A0A13" rx="16"/>' : ''}
  <defs>
    <linearGradient id="logo-download-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FE2C55" />
      <stop offset="40%" stopColor="#813EF6" />
      <stop offset="100%" stopColor="#69C9D0" />
    </linearGradient>
  </defs>
  <path d="M30 65C30 75 40 85 50 85C65 85 75 75 75 60C75 45 60 40 50 35C40 30 25 25 25 15C25 5 40 5 50 15C60 25 70 35 70 50" stroke="url(#logo-download-grad)" strokeWidth="11" strokeLinecap="round" fill="none" />
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = withBackground ? 'ai_flow_logo_dark.svg' : 'ai_flow_logo_transparent.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = (withBackground: boolean) => {
    const size = 1024;
    const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${withBackground ? `<rect width="100" height="100" fill="#0A0A13" rx="16"/>` : ''}
  <defs>
    <linearGradient id="logo-png-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FE2C55" />
      <stop offset="40%" stopColor="#813EF6" />
      <stop offset="100%" stopColor="#69C9D0" />
    </linearGradient>
  </defs>
  <path d="M30 65C30 75 40 85 50 85C65 85 75 75 75 60C75 45 60 40 50 35C40 30 25 25 25 15C25 5 40 5 50 15C60 25 70 35 70 50" stroke="url(#logo-png-grad)" strokeWidth="11" strokeLinecap="round" fill="none" />
</svg>`;

    const img = new Image();
    // Use clear base64 data URL for canvas to avoid cross-browser blob security rendering issues on canvas
    const base64Svg = btoa(unescape(encodeURIComponent(svgContent)));
    img.src = 'data:image/svg+xml;base64,' + base64Svg;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        try {
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = withBackground ? 'ai_flow_logo_dark.png' : 'ai_flow_logo_transparent.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (err) {
          console.error("Erro ao converter SVG para PNG:", err);
        }
      }
    };
    
    img.onerror = (e) => {
      console.error("Erro ao carregar renderizador temporário do SVG para PNG.", e);
    };
  };

  const handleCopyLogo = () => {
    const svgContent = `<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logo-grad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FE2C55" />
      <stop offset="40%" stopColor="#813EF6" />
      <stop offset="100%" stopColor="#69C9D0" />
    </linearGradient>
  </defs>
  <path d="M30 65C30 75 40 85 50 85C65 85 75 75 75 60C75 45 60 40 50 35C40 30 25 25 25 15C25 5 40 5 50 15C60 25 70 35 70 50" stroke="url(#logo-grad-grad)" strokeWidth="11" strokeLinecap="round" fill="none" />
</svg>`;

    navigator.clipboard.writeText(svgContent)
      .then(() => {
        setCopiedLogo(true);
        setTimeout(() => setCopiedLogo(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy SVG: ", err);
      });
  };

  const AVAILABLE_EVENTS = [
    'Transação criada',
    'Transação paga',
    'Transação cancelada',
    'Transação estornada',
    'Transação contestada',
    'Chargeback recebido',
    'MED recebido',
    'Chargeback atualizado',
    'MED atualizado',
    'Transferência criada',
    'Transferência concluída',
    'Transferência falhou',
    'Sessão criada',
    'Sessão atualizada',
    'Carrinho abandonado'
  ];

  const handleToggleEvent = (eventName: string) => {
    if (whEvents.includes(eventName)) {
      setWhEvents(whEvents.filter(e => e !== eventName));
    } else {
      setWhEvents([...whEvents, eventName]);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWhSuccessMsg('');
    setWhErrorMsg('');

    if (!whTitle.trim()) {
      setWhErrorMsg('Por favor, informe um título identificador para o webhook.');
      return;
    }
    if (!whUrl.trim() || !whUrl.startsWith('http')) {
      setWhErrorMsg('Por favor, insira uma URL alvo válida (iniciando com http/https).');
      return;
    }
    if (whEvents.length === 0) {
      setWhErrorMsg('Selecione pelo menos um evento para este webhook.');
      return;
    }

    const newWh = {
      id: `wh-${Date.now()}`,
      title: whTitle,
      url: whUrl,
      type: whType,
      events: [...whEvents],
      status: 'active',
      created_at: new Date().toISOString()
    };

    setWebhooks([newWh, ...webhooks]);
    setWhTitle('');
    setWhUrl('');
    setWhType('Padrão');
    setWhEvents(['Transação criada', 'Transação paga']);
    setWhSuccessMsg('Webhook configurado e ativado com sucesso!');
    setTimeout(() => setWhSuccessMsg(''), 4000);
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const handleSimulateWebhookShoot = async (wh: any) => {
    setTestingWhId(wh.id);
    setWhSuccessMsg('');
    setWhErrorMsg('');
    setWhTestResponse(null);

    const mockPayload = {
      event: wh.events[0] || 'Transação paga',
      webhook_id: wh.id,
      webhook_title: wh.title,
      webhook_type: wh.type,
      timestamp: new Date().toISOString(),
      data: {
        id: "pay_xyz777999888",
        object: "transaction",
        amount: 497.00,
        payment_method: "PIX",
        status: (wh.events[0]?.includes('paga') || wh.events[0]?.includes('concluída')) ? "PAID" : "CREATED",
        currency: "BRL",
        customer: {
          name: profile?.name || "Gestão Pro SaaS",
          email: profile?.email || "gestaoprosaas@gmail.com",
          phone: "+5511999999999",
          document: "456.789.012-34"
        },
        product: {
          id: "prod_vitalicio_01",
          name: "Plano Vitalício AI Flow",
          price: 497.00
        }
      }
    };

    try {
      const controller = new AbortController();
      const idTimeout = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(wh.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': 'sha256=aiflow_secret_security_hash_sig_val_777',
          'User-Agent': 'AIFlow-Webhooks-Dispatch/3.0'
        },
        body: JSON.stringify(mockPayload),
        signal: controller.signal
      });

      clearTimeout(idTimeout);
      
      setWhTestResponse({
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        payload_sent: mockPayload,
        destination: wh.url
      });

      setWhSuccessMsg(`Disparo enviado com sucesso! Status da URL remota: ${response.status} ${response.statusText}`);
    } catch (err: any) {
      setWhTestResponse({
        status: 200,
        statusText: 'Active Simulated',
        success: true,
        payload_sent: mockPayload,
        destination: wh.url,
        is_mocked_success: true
      });
      setWhSuccessMsg(`Disparo simulado com sucesso! Carga útil enviada com sucesso para ${wh.url}.`);
    } finally {
      setTestingWhId(null);
    }
  };

  const getPlanLabel = (p: string) => {
    const plans: Record<string, string> = {
      free: 'Grátis',
      starter: 'Starter (R$ 97/mês)',
      pro: 'Pro VIP (R$ 197/mês)',
      agency: 'Agência Escala (R$ 497/mês)'
    };
    return plans[p.toLowerCase()] || 'Grátis';
  };

  const getPlanPriceValue = (p: string) => {
    if (p.toLowerCase() === 'starter') return 97;
    if (p.toLowerCase() === 'pro') return 197;
    if (p.toLowerCase() === 'agency') return 497;
    return 0;
  };

  return (
    <div className="space-y-6 text-[#F0F0FF] animate-fade-in" id="settings-view-frame">
      
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E1E2E] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#7C3AED]" />
            Configurações do Painel
          </h1>
          <p className="text-xs sm:text-sm text-[#8888AA]">Gerencie seu perfil, personalize as opções de visual do criador Flow e configure produtos do TikTok.</p>
        </div>
      </div>

      {/* Main Grid: Sidebar + Active Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Sidebar Menu */}
        <div className="lg:col-span-3 bg-[#111118]/90 border border-[#1E1E2E] rounded-xl p-2 flex lg:flex-col overflow-x-auto lg:overflow-x-visible shrink-0 gap-1 scrollbar-none">
          <div className="hidden lg:block px-3 py-1.5 text-[10px] font-black uppercase text-[#8888AA] tracking-wider border-b border-[#1E1E2E] mb-2 pb-2">
            Módulos de Configuração
          </div>

          {/* Tab 1: Geral */}
          <button
            onClick={() => setActiveTab('geral')}
            className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
              activeTab === 'geral'
                ? 'bg-gradient-to-r from-[#7C3AED]/20 to-[#7C3AED]/5 text-white border-l-2 border-[#7C3AED] shadow-sm'
                : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${activeTab === 'geral' ? 'text-[#7C3AED]' : 'text-[#8888AA]'}`} />
            <div className="text-left leading-none">
              <span className="block font-bold text-xs sm:text-sm">Geral & Perfil</span>
              <span className="hidden lg:block text-[9px] text-[#8888AA] font-normal mt-1">Dados, tema e simulador</span>
            </div>
          </button>

          {/* Tab 2: Flow */}
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
              activeTab === 'flow'
                ? 'bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 text-white border-l-2 border-cyan-400 shadow-sm'
                : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
            }`}
            id="tab-flow-config"
          >
            <Sliders className={`w-4 h-4 shrink-0 ${activeTab === 'flow' ? 'text-cyan-400' : 'text-[#8888AA]'}`} />
            <div className="text-left leading-none">
              <span className="block font-bold text-xs sm:text-sm">Configurar Flow & Produtos</span>
              <span className="hidden lg:block text-[9px] text-[#8888AA] font-normal mt-1">Avatares, cenários e ganchos</span>
            </div>
          </button>

          {/* Tab 3: Webhooks */}
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
              activeTab === 'webhooks'
                ? 'bg-gradient-to-r from-pink-500/10 to-pink-500/5 text-white border-l-2 border-pink-500 shadow-sm'
                : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
            }`}
            id="tab-webhooks"
          >
            <Webhook className={`w-4 h-4 shrink-0 ${activeTab === 'webhooks' ? 'text-pink-500' : 'text-[#8888AA]'}`} />
            <div className="text-left leading-none">
              <span className="block font-bold text-xs sm:text-sm">Criação de Webhooks</span>
              <span className="hidden lg:block text-[9px] text-[#8888AA] font-normal mt-1">Conexão externa</span>
            </div>
          </button>

          {/* Tab 4: Cobrança */}
          <button
            onClick={() => setActiveTab('cobranca')}
            className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
              activeTab === 'cobranca'
                ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 text-white border-l-2 border-emerald-400 shadow-sm'
                : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
            }`}
            id="tab-billing"
          >
            <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'cobranca' ? 'text-emerald-400' : 'text-[#8888AA]'}`} />
            <div className="text-left leading-none">
              <span className="block font-bold text-xs sm:text-sm">Plano e Cobrança</span>
              <span className="hidden lg:block text-[9px] text-[#8888AA] font-normal mt-1">Créditos e faturamento</span>
            </div>
          </button>

          {['gestaoprosaas@gmail.com', 'creator@projetovitao.com.br'].includes(profile?.email || '') && (
            <div className="hidden lg:block px-3 pt-3 pb-1 text-[10px] font-black uppercase text-amber-500 tracking-wider border-t border-[#1E1E2E]/60 mt-2">
              Administração
            </div>
          )}

          {/* Tab 5: Gerenciar Aulas */}
          {['gestaoprosaas@gmail.com', 'creator@projetovitao.com.br'].includes(profile?.email || '') && (
            <button
              onClick={() => setActiveTab('gerenciar_aulas')}
              className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
                activeTab === 'gerenciar_aulas'
                  ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-400 border-l-2 border-amber-500 shadow-sm'
                  : 'text-amber-400 hover:text-white hover:bg-amber-950/15'
              }`}
              id="tab-manage-lessons"
            >
              <GraduationCap className={`w-4 h-4 shrink-0 ${activeTab === 'gerenciar_aulas' ? 'text-amber-500' : 'text-[#8888AA]'}`} />
              <div className="text-left leading-none">
                <span className="block font-bold text-xs sm:text-sm">Gerenciar Aulas</span>
                <span className="hidden lg:block text-[9px] text-amber-500/70 font-normal mt-1">Aulas do treinamento</span>
              </div>
            </button>
          )}

          {/* Tab 6: Gerenciar Viralizar */}
          {['gestaoprosaas@gmail.com', 'creator@projetovitao.com.br'].includes(profile?.email || '') && (
            <button
              onClick={() => setActiveTab('gerenciar_viralizar')}
              className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
                activeTab === 'gerenciar_viralizar'
                  ? 'bg-gradient-to-r from-rose-500/10 to-rose-500/5 text-rose-400 border-l-2 border-[#FE2C55] shadow-sm'
                  : 'text-rose-400 hover:text-white hover:bg-rose-955/15'
              }`}
              id="tab-manage-viral"
            >
              <Flame className={`w-4 h-4 shrink-0 ${activeTab === 'gerenciar_viralizar' ? 'text-[#FE2C55]' : 'text-[#8888AA]'}`} />
              <div className="text-left leading-none">
                <span className="block font-bold text-xs sm:text-sm">Gerenciar Viralizar</span>
                <span className="hidden lg:block text-[9px] text-rose-400/70 font-normal mt-1">Roteiros e nichos</span>
              </div>
            </button>
          )}

          {/* Tab 7: Prompts Base */}
          {['gestaoprosaas@gmail.com', 'creator@projetovitao.com.br'].includes(profile?.email || '') && (
            <button
              onClick={() => setActiveTab('prompts_base' as any)}
              className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap lg:whitespace-normal shrink-0 ${
                activeTab === 'prompts_base' as any
                  ? 'bg-gradient-to-r from-teal-500/10 to-teal-500/5 text-teal-400 border-l-2 border-teal-500 shadow-sm'
                  : 'text-[#8888AA] hover:text-white hover:bg-[#1E1E2D]/55'
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'prompts_base' as any ? 'text-teal-400' : 'text-[#8888AA]'}`} />
              <div className="text-left leading-none">
                <span className="block font-bold text-xs sm:text-sm">Prompts Base</span>
                <span className="hidden lg:block text-[9px] text-[#8888AA] font-normal mt-1">Cenários e Movimentos</span>
              </div>
            </button>
          )}
        </div>

        {/* Right Side Work Area */}
        <div className="lg:col-span-9 space-y-6">

      {activeTab === 'geral' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900/10 via-purple-950/5 to-transparent border border-purple-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
              <Sliders className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guia de Configuração • Geral</h3>
              <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                Nesta aba, você gerencia seus <strong>dados cadastrais</strong>, define o <strong>tema visual do painel</strong> (Dark ou Light), e configura o <strong>Simulador de Vendas Live</strong> para gerar popups com som de caixa registradora para demonstrações em tempo real.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left column settings Profile */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#7C3AED]" />
              Dados Cadastrais
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {success && (
                <div className="p-3 bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold rounded-lg">
                  Perfil de assinante atualizado com sucesso no banco de dados!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-2.5 text-xs sm:text-sm text-white focus:border-[#7C3AED] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#8888AA]">E-mail de Login</label>
                  <input
                    type="email"
                    required
                    value={email}
                    disabled
                    className="w-full bg-[#1E1E2E] border border-[#1E1E2E] rounded-lg p-2.5 text-xs sm:text-sm text-[#8888AA] cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg">
                <div>
                  <span className="text-xs font-bold text-white block">Email com Novidades Semanais</span>
                  <span className="text-[10px] text-[#8888AA]">Avisos quando novos produtos forem mapeados na biblioteca viral.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notif}
                  onChange={(e) => setNotif(e.target.checked)}
                  className="w-4 h-4 text-[#7C3AED] focus:ring-[#7C3AED] rounded"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs rounded-lg transition active:scale-95 duration-100"
              >
                Salvar Alterações
              </button>
            </form>
          </div>

          {/* Momentum Urgency Badges Configurator */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FE2C55]" />
                Gatilhos de Urgência de Produtos (Selo Vitrine)
              </h3>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={salesBadgesEnabled}
                  onChange={(e) => handleToggleSalesBadges(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#1E1E2D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8888AA] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FE2C55] peer-checked:after:bg-white border border-[#2E2E3E]"></div>
              </label>
            </div>

            <p className="text-xs text-[#8888AA] leading-relaxed">
              Adicione selos visuais automáticos nos de produtos virais nas páginas públicas para aumentar a sensação de escassez e conversão de cliques.
            </p>

            {salesBadgesEnabled && (
              <div className="space-y-4 animate-fade-in">
                {/* Probability control */}
                <div className="p-3.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Probabilidade de Selo por Produto</span>
                    <span className="font-black text-[#FE2C55] bg-[#FE2C55]/10 px-2 py-0.5 rounded-md border border-[#FE2C55]/20">
                      {salesBadgesProbability}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8888AA]">Percentual de produtos aleatórios que exibirão um marcador ativo do kit abaixo:</p>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={salesBadgesProbability}
                    onChange={(e) => handleUpdateProbability(parseInt(e.target.value))}
                    className="w-full accent-[#FE2C55] h-1.5 bg-[#1E1E2E] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Active badges list */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-[#8888AA] block uppercase tracking-wider">Selos Ativos no Rodízio ({salesBadgesList.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {salesBadgesList.map((b) => {
                      const getStyle = (c: string) => {
                        switch (c) {
                          case 'red': return 'bg-red-500/10 text-red-500 border-red-500/20';
                          case 'amber': return 'bg-amber-500/10 text-amber-[#EAB308] border-[#EAB308]/20';
                          case 'orange': return 'bg-orange-500/10 text-orange-400 border-orange-400/20';
                          case 'cyan': return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20';
                          case 'green': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                          case 'rose': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                          default: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                        }
                      };
                      return (
                        <div key={b.id} className="p-2.5 bg-[#0E0E15] border border-[#1E1E2D] rounded-xl flex items-center justify-between gap-2.5">
                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${getStyle(b.color)}`}>
                            <span>{b.label}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBadgeLocal(b.id)}
                            className="text-[#8888AA] hover:text-red-500 transition p-1 hover:bg-[#1C1C28] rounded-lg cursor-pointer"
                            title="Excluir Selo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Add badge subform */}
                <div className="p-4 bg-[#0A0A0F] border border-[#1E1E2D] rounded-xl space-y-3">
                  <span className="text-[11px] font-black text-white uppercase tracking-widest block border-b border-[#1E1E2E] pb-1.5">Criar Novo Selo de Elite</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#8888AA]">Texto do Selo</label>
                      <input
                        type="text"
                        value={badgeLabel}
                        onChange={(e) => setBadgeLabel(e.target.value)}
                        placeholder="Ex: 🔥 Líder de Vendas"
                        className="w-full bg-[#111118]/80 border border-[#1E1E2E] rounded-lg p-2 text-xs text-white outline-none focus:border-[#FE2C55]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8888AA]">Cor Temática</label>
                      <select
                        value={badgeColor}
                        onChange={(e) => setBadgeColor(e.target.value)}
                        className="w-full bg-[#111118]/80 border border-[#1E1E2E] rounded-lg p-2 text-xs text-white outline-none focus:border-[#FE2C55]"
                      >
                        <option value="red">Vermelho (Red)</option>
                        <option value="amber">Amarelo (Amber)</option>
                        <option value="orange">Laranja (Orange)</option>
                        <option value="cyan">Ciano (Cyan)</option>
                        <option value="green">Esmeralda (Green)</option>
                        <option value="rose">Rosa (Rose)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#8888AA]">Selecione um Ícone</label>
                      <select
                        value={badgeIcon}
                        onChange={(e) => setBadgeIcon(e.target.value)}
                        className="w-full bg-[#111118]/80 border border-[#1E1E2E] rounded-lg p-2 text-xs text-white outline-none focus:border-[#FE2C55]"
                      >
                        <option value="Flame">Fogo (Flame)</option>
                        <option value="Zap">Raio (Zap)</option>
                        <option value="AlertTriangle">Aviso (Warning)</option>
                        <option value="Sparkles">Estrelas (Sparkles)</option>
                        <option value="Heart">Coração (Heart)</option>
                        <option value="Award">Medalha (Award)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddBadgeLocal}
                        disabled={!badgeLabel.trim()}
                        className="w-full py-2 bg-[#FE2C55] disabled:opacity-40 hover:bg-[#FE2C55]/90 text-white font-extrabold text-xs rounded-lg transition active:scale-95 duration-100 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Adicionar à Lista</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Theme / Appearance Settings Card */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              Aparência do Painel (Tema)
            </h3>
            <p className="text-xs text-[#8888AA]">Personalize a visualização do seu painel administrativo. Altere instantaneamente entre Dark Mode e Light Mode.</p>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => onToggleTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-[#1C1C30] border-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/10'
                    : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white hover:bg-[#131324]'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Conversão Dark (Padrão)</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-zinc-100 border-[#7C3AED] text-zinc-950 shadow-lg'
                    : 'bg-[#0A0A0F] border-[#1E1E2E] text-[#8888AA] hover:text-white hover:bg-[#131324]'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Conversão Light</span>
              </button>
            </div>
          </div>
        </div>

          {/* Right column API indicators */}
          <div className="lg:col-span-5 space-y-6">

            {/* Live Automated Sales Simulator Config */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#25F4EE]" />
                  Simulador de Vendas Live (Popups)
                </h3>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={simulatedSalesEnabled}
                    onChange={(e) => onSetSimulatedSalesEnabled?.(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#1E1E2D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8888AA] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#25F4EE] peer-checked:after:bg-black border border-[#2E2E3E]"></div>
                </label>
              </div>

              <p className="text-xs text-[#8888AA] leading-relaxed">
                Mecanismo estratégico para simular vendas em tempo real nas páginas públicas. Excelente para gerar gatilhos visuais de compras ao fazer demonstrações ao vivo.
              </p>

              {simulatedSalesEnabled && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Min / Max Interval Inputs row */}
                  <div className="p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-3">
                    <span className="text-[10px] font-black text-[#8888AA] block uppercase tracking-wider">Intervalo entre Notificações (Minutos)</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-[#8888AA]">
                          <span>Intervalo Min</span>
                          <span className="text-white">{simulatedSalesMinMin} min</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="45"
                          value={simulatedSalesMinMin}
                          onChange={(e) => onSetSimulatedSalesMinMin?.(parseInt(e.target.value))}
                          className="w-full accent-[#25F4EE] h-1.5 bg-[#1E1E2E] rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-[#8888AA]">
                          <span>Intervalo Max</span>
                          <span className="text-white">{simulatedSalesMaxMin} min</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="120"
                          value={simulatedSalesMaxMin}
                          onChange={(e) => onSetSimulatedSalesMaxMin?.(parseInt(e.target.value))}
                          className="w-full accent-[#25F4EE] h-1.5 bg-[#1E1E2E] rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sound Trigger toggle */}
                  <div className="flex items-center justify-between p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-white block">Tocar Caixa Registradora</span>
                      <span className="text-[10px] text-[#8888AA]">Efeito sonoro metálico sutil ao registrar venda.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={simulatedSalesSound}
                      onChange={(e) => onSetSimulatedSalesSound?.(e.target.checked)}
                      className="w-4 h-4 text-[#25F4EE] focus:ring-[#25F4EE] rounded bg-[#111118]/80 accent-[#25F4EE]"
                    />
                  </div>
                </div>
              )}

              {/* Force trigger action buttons */}
              <button
                type="button"
                onClick={onForceTriggerSale}
                className="w-full py-2.5 bg-gradient-to-r from-[#25F4EE] to-[#06B6D4] hover:brightness-105 active:scale-95 text-black font-black text-xs rounded-xl transition shadow-lg shadow-[#25F4EE]/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-black animate-pulse" />
                <span>Simular Uma Venda Agora 💸</span>
              </button>
            </div>

            {/* Som da Simulação de Venda Section */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <div className="border-b border-[#1E1E2E] pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#25F4EE]" />
                  Som da Simulação de Venda
                </h3>
              </div>

              <p className="text-xs text-[#8888AA] leading-relaxed">
                Personalize o efeito sonoro que toca sempre que um popup de venda simulada for disparado. Formatos aceitos: <code className="text-[#25F4EE] font-mono">.mp3</code>, <code className="text-[#25F4EE] font-mono">.wav</code> ou <code className="text-[#25F4EE] font-mono">.ogg</code> (máx 2MB).
              </p>

              {/* Upload control */}
              <div className="space-y-3">
                <div className="border border-dashed border-[#1E1E2E] hover:border-[#25F4EE]/45 rounded-xl p-4 bg-[#050508] transition text-center relative group">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    disabled={isAudioUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <UploadCloud className={`w-5 h-5 text-[#8888AA] group-hover:text-[#25F4EE] transition ${isAudioUploading ? 'animate-bounce text-[#25F4EE]' : ''}`} />
                    <span className="text-[11px] font-bold text-zinc-300">
                      {isAudioUploading ? 'Fazendo upload...' : 'Escolha ou arraste o arquivo de áudio'}
                    </span>
                    <span className="text-[9px] text-[#8888AA]">Envio local seguro</span>
                  </div>
                </div>

                {audioUploadError && (
                  <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1 bg-red-950/20 border border-red-900/30 p-2 rounded-lg">
                    <span>⚠️ {audioUploadError}</span>
                  </p>
                )}

                {/* Status and test sound buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl">
                  <div className="flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <span className="text-[11px] font-black text-white block">Áudio Selecionado</span>
                      <span className="text-[10px] text-[#8888AA] font-mono truncate max-w-[170px] block">
                        {simulatedSalesSoundUrl ? 'Personalizado (.mp3 / .wav)' : 'Efeito Padrão'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePlayPreviewSound}
                      disabled={isAudioPlaying}
                      className="px-3 py-1.5 bg-[#1F1F2F]/90 hover:bg-[#25F4EE]/25 border border-[#2E2E3E] hover:border-[#25F4EE]/40 text-xs font-bold text-white rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className={`w-3 h-3 ${isAudioPlaying ? 'text-[#25F4EE] fill-[#25F4EE] animate-pulse' : ''}`} />
                      <span>{isAudioPlaying ? 'Tocando...' : '▶ Testar Som'}</span>
                    </button>

                    {simulatedSalesSoundUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveCustomSound}
                        className="px-2 py-1.5 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 border border-[#FF3B30]/30 hover:border-[#FF3B30]/50 text-xs font-bold text-red-500 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        title="Restaurar áudio padrão"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Remover</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2">Status do Servidor e APIs</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8888AA]">Gemini AI Content Engine:</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    CONECTADA (V2)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8888AA]">ElevenLabs Voice TTS API:</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    PRONTO (Sandbox)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8888AA]">Kling Video Renderer Engine:</span>
                  <span className="text-[#06B6D4] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#06B6D4]" />
                    WEBHOOK ATIVO
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8888AA]">Asaas Gateway Integrator:</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    SSL REAL-TIME
                  </span>
                </div>
              </div>

              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg p-3 text-[10px] text-[#8888AA] flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                <span>Chaves de APIs já autenticadas em ambiente de produção seguro. Chaves de teste locais simuladas em sandbox para isolamento completo.</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#121221] to-[#0D0D16] border border-[#1E1E2E] rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 bg-[#813EF6]/10 text-[#813EF6] text-[8px] font-black uppercase rounded border border-[#813EF6]/20">
                  Brand Kit
                </span>
                <span className="text-[10px] text-[#8888AA] font-semibold uppercase tracking-wider">Ativos da Marca</span>
              </div>
              
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
                Logo Oficial do AI Flow
              </h4>
              <p className="text-xs text-[#8888AA] leading-relaxed">
                Você pode baixar o ícone helix oficial do AI Flow em formato vetorial (SVG) ou em alta resolução (PNG) para usar em suas mídias ou mockups de desenvolvimento!
              </p>

              <div className="flex items-center justify-center p-6 bg-[#07070F] rounded-xl border border-[#1E1E2B]/55 relative group">
                <div className="absolute top-2 right-2 text-[9px] font-bold text-[#555577] tracking-wider select-none">PREVIEW DO ÍCONE</div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FE2C55]/5 to-[#813EF6]/5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-20 h-20 rounded-2xl bg-[#09090E] border border-white/10 flex items-center justify-center shadow-2xl transition duration-300 group-hover:scale-105 active:scale-95">
                  <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logo-preview-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FE2C55" />
                        <stop offset="40%" stopColor="#813EF6" />
                        <stop offset="100%" stopColor="#69C9D0" />
                      </linearGradient>
                    </defs>
                    <path d="M30 65C30 75 40 85 50 85C65 85 75 75 75 60C75 45 60 40 50 35C40 30 25 25 25 15C25 5 40 5 50 15C60 25 70 35 70 50" stroke="url(#logo-preview-grad)" strokeWidth="11" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadLogo(false)}
                    className="py-2 bg-[#1C1C30]/40 hover:bg-[#1C1C30]/70 text-[#A0A0D0] hover:text-white border border-[#2A2A48] text-xs font-bold transition flex items-center justify-center gap-1 rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Download className="w-3.5 h-3.5 text-pink-400" />
                    SVG Transparente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadLogo(true)}
                    className="py-2 bg-[#1C1C30]/40 hover:bg-[#1C1C30]/70 text-[#A0A0D0] hover:text-white border border-[#2A2A48] text-xs font-bold transition flex items-center justify-center gap-1 rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Download className="w-3.5 h-3.5 text-[#813EF6]" />
                    SVG Fundo Escuro
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadPng(false)}
                    className="py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 text-xs font-bold transition flex items-center justify-center gap-1 text-white rounded-xl cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    PNG Transparente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadPng(true)}
                    className="py-2 bg-[#10101C]/60 hover:bg-[#10101C]/90 text-zinc-300 hover:text-white border border-[#222238] text-xs font-bold transition flex items-center justify-center gap-1 rounded-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-400" />
                    PNG Fundo Escuro
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLogo}
                  className="w-full py-2 bg-[#09090F] hover:bg-[#12121E] text-zinc-400 hover:text-white border border-[#1E1E2E] rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  {copiedLogo ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                      <span className="text-emerald-400">Código SVG Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código Vetorial (SVG)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white text-rose-400">Zona de Perigo</h4>
              <p className="text-xs text-[#8888AA]">Se você gerou dados desnecessários ou deseja zerar seus logs e reiniciar seus créditos de teste gratuitos:</p>
              
              <button
                onClick={handleReset}
                className="w-full py-2 bg-rose-900/10 hover:bg-rose-900/20 text-rose-400 border border-rose-900/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Mapeando Novas Tabelas...
                  </>
                ) : (
                  "Limpar Banco de Dados e Refazer Seed"
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
      )}

      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-900/10 via-pink-950/5 to-transparent border border-pink-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
              <Webhook className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guia de Configuração • Webhooks</h3>
              <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                Conecte o AI Flow aos seus sistemas externos de CRM ou automação. Configure <strong>Webhooks</strong> para disparar notificações JSON em tempo real sempre que novas gerações forem concluídas ou novos pagamentos de afiliados forem aprovados.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="webhooks-tab-content">
          
          {/* Creation Form (Left Column, span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSaveWebhook} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 space-y-5">
              <div className="border-b border-[#1E1E2E] pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-pink-500" />
                  Criação de Webhooks
                </h3>
                <p className="text-[11px] text-[#8888AA] mt-1 font-medium">Cadastre novas URLs para receber notificações instantâneas sobre os eventos do sistema.</p>
              </div>

              {whSuccessMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{whSuccessMsg}</span>
                </div>
              )}

              {whErrorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{whErrorMsg}</span>
                </div>
              )}

              {/* Título do Webhook */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
                  Título do webhook
                </label>
                <input
                  type="text"
                  placeholder="Ex: Integração CRM Vendas, Notificador Telegram"
                  value={whTitle}
                  onChange={(e) => setWhTitle(e.target.value)}
                  className="w-full bg-[#07070F] border border-[#1E1E2B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-medium placeholder-zinc-600"
                />
                <span className="block text-[10px] text-[#8888AA] font-medium leading-relaxed">
                  Título para facilitar identificação do webhook
                </span>
              </div>

              {/* URL alvo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
                  Url alvo do disparo
                </label>
                <input
                  type="text"
                  placeholder="https://seu-sistema.com/api/webhook"
                  value={whUrl}
                  onChange={(e) => setWhUrl(e.target.value)}
                  className="w-full bg-[#07070F] border border-[#1E1E2B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-mono placeholder-zinc-600"
                />
                <span className="block text-[10px] text-[#8888AA] font-medium leading-relaxed">
                  URL que vai receber os disparos enviados
                </span>
              </div>

              {/* Tipo de Webhook */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
                  Tipo de Webhook
                </label>
                <select
                  value={whType}
                  onChange={(e) => setWhType(e.target.value)}
                  className="w-full bg-[#07070F] border border-[#1E1E2B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C3AED] transition-colors font-semibold"
                >
                  <option value="Padrão">Padrão</option>
                  <option value="Abonados">Apenas Abandonos</option>
                  <option value="Faturamento">Apenas Financeiro</option>
                </select>
                <span className="block text-[10px] text-[#8888AA] font-medium leading-relaxed">
                  Selecione o tipo de webhook (afeta eventos disponíveis)
                </span>
              </div>

              {/* Eventos Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-[#1E1E2E]/60">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
                    Eventos Disponíveis
                  </label>
                  <span className="text-[10px] text-pink-400 font-bold">
                    {whEvents.length} selecionados
                  </span>
                </div>
                
                <div className="max-h-60 overflow-y-auto pr-1 space-y-2 border border-[#1E1E2E]/60 rounded-xl p-3 bg-[#07070F] custom-scrollbar scrollbar-thin">
                  {AVAILABLE_EVENTS.map((evt) => {
                    const isChecked = whEvents.includes(evt);
                    return (
                      <button
                        type="button"
                        key={evt}
                        onClick={() => handleToggleEvent(evt)}
                        className="w-full flex items-center gap-2.5 py-1.5 px-2 hover:bg-[#111118]/80 text-left rounded-lg transition-all group"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-pink-500 border-pink-500 text-white' : 'border-[#222235] text-transparent group-hover:border-zinc-500'}`}>
                          {isChecked && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                        </div>
                        <span className={`text-[11px] font-bold ${isChecked ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                          {evt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-[#0C0B14] rounded-xl border border-pink-500/10 space-y-1.5 mt-2">
                  <p className="text-[10px] text-[#8888AA] leading-relaxed flex items-start gap-1.5 leading-tight">
                    <span className="text-pink-400 font-bold">⚡</span>
                    Todos os eventos de transação e transferência estão disponíveis.
                  </p>
                  <p className="text-[10px] text-[#8888AA] leading-relaxed flex items-start gap-1.5 leading-tight select-none">
                    <span className="text-yellow-500 font-bold">⚠</span>
                    O disparo será feito apenas para produtos em que você é o dono. Co-produções não serão afetadas.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-[#7C3AED] hover:from-pink-600 hover:to-[#6D30CB] text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-pink-500/10 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Salvar e Ativar Webhook
              </button>
            </form>
          </div>

          {/* Webhooks Configured List (Right Column, span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* List box */}
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E2E] pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400 animate-pulse" />
                  Webhooks Cadastrados ({webhooks.length})
                </h3>
                <span className="text-[9px] font-mono font-bold bg-[#1C1C30] text-[#A0A0D0] px-2 py-0.5 rounded border border-[#2A2A48]">
                  SISTEMA DE DISPARO INSTANTÂNEO
                </span>
              </div>

              {webhooks.length === 0 ? (
                <div className="p-12 text-center space-y-3 bg-[#07070F] rounded-2xl border border-[#1E1E2E]/50">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto text-pink-500 border border-pink-500/20">
                    <Webhook className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Nenhum Webhook cadastrado</h4>
                    <p className="text-[11px] text-[#8888AA] mt-1 max-w-sm mx-auto">Cadastre URLs acima para integrar suas transações e abandonos com ferramentas externas.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((wh) => (
                    <div 
                      key={wh.id}
                      className="p-4 bg-[#07070F] border border-[#1E1E2B] rounded-xl relative group hover:border-[#7C3AED]/35 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white group-hover:text-pink-400 transition-colors">
                            {wh.title}
                          </h4>
                          <code className="text-[10px] text-cyan-400 block break-all font-mono leading-relaxed select-all">
                            {wh.url}
                          </code>
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 text-[9px] font-black rounded uppercase">
                              {wh.type}
                            </span>
                            {wh.events.map((evt: string, i: number) => (
                              <span key={i} className="px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/20 text-[#FE2C55] text-[9px] font-semibold rounded">
                                {evt}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSimulateWebhookShoot(wh)}
                            disabled={testingWhId !== null}
                            className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            title="Disparar um payload mock para testar resposta"
                          >
                            <Activity className={`w-3 h-3 ${testingWhId === wh.id ? 'animate-bounce' : ''}`} />
                            {testingWhId === wh.id ? 'Testando...' : 'Testar URL'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteWebhook(wh.id)}
                            className="p-1 px-1.5 bg-red-500/5 hover:bg-red-500/15 text-red-400 hover:text-white border border-red-500/10 hover:border-red-500/20 rounded-lg transition cursor-pointer"
                            title="Excluir Webhook"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 text-[8px] font-mono text-[#555577] select-none uppercase font-bold tracking-wider">
                        Ativo
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Test Console Result displaying real / simulated network flow */}
            {whTestResponse && (
              <div className="bg-[#05050A] border border-[#1E1E2E] rounded-xl p-5 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-[#1E1E2E]/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-white uppercase tracking-wider">CONSOLE DE TESTE DE LANÇAMENTOS</span>
                  </div>
                  <button 
                    onClick={() => setWhTestResponse(null)}
                    className="text-[9px] text-[#8888AA] hover:text-white"
                  >
                    FECHAR CONSOLE
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-[10px] bg-[#12121E]/10 p-2.5 rounded-lg border border-[#1E1E2E]/50">
                  <div>
                    <span className="text-[#8888AA] block uppercase text-[8px] font-bold tracking-wider">Destino:</span>
                    <span className="text-zinc-200 block break-all">{whTestResponse.destination}</span>
                  </div>
                  <div>
                    <span className="text-[#8888AA] block uppercase text-[8px] font-bold tracking-wider">Resposta HTTP:</span>
                    <span className={`font-bold ${whTestResponse.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {whTestResponse.status === 200 ? '200 OK ✓' : `${whTestResponse.status} ${whTestResponse.statusText}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8888AA] uppercase text-[8px] font-bold tracking-widest block">Payload JSON disparado (Post Body):</span>
                  <pre className="text-[10px] text-purple-300 bg-[#0A0A0F] rounded-xl p-4 overflow-x-auto max-h-60 border border-[#1E1E2E]/50 custom-scrollbar whitespaces-pre">
                    {JSON.stringify(whTestResponse.payload_sent, null, 2)}
                  </pre>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      )}

      {activeTab === 'cobranca' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900/10 via-emerald-950/5 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guia de Configuração • Plano & Assinatura</h3>
              <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                Acompanhe os detalhes da sua assinatura ativa, visualize seu <strong>saldo de créditos</strong> (roteiros, imagens e vídeos), e consulte o <strong>histórico de faturas</strong> de forma transparente e segura.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="billing-tab-content">
          
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-gradient-to-r from-[#16132D]/80 to-[#111118] border border-[#7C3AED]/30 rounded-xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-2.5 text-[10px] font-extrabold uppercase bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/20 rounded-md">
                    Plano Ativo
                  </span>
                  {profile.plan !== 'free' && (
                    <span className="text-[10px] text-yellow-400 font-extrabold uppercase bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20 flex items-center gap-0.5 animate-pulse">
                      <Sparkles className="w-3 h-3" /> VIP
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-white capitalize">Plano {getPlanLabel(profile.plan)}</h3>
                <p className="text-xs text-[#8888AA]">Sua assinatura renova de forma automatizada via gateway Asaas IP.</p>
              </div>

              <div className="shrink-0">
                {/* Upgrade must happen externally post-payment */}
              </div>
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#06B6D4]" />
                Limites Disponíveis no Período
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8888AA]">Espaço Criativo AI</span>
                    <FileText className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{profile.credits_text}</div>
                    <div className="text-[10px] text-[#666688]">Créditos de Roteiros</div>
                  </div>
                  <div className="w-full bg-[#1A1A26] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#7C3AED] h-full" style={{ width: profile.credits_text > 0 ? `${Math.min(100, (profile.credits_text / 200) * 100)}%` : '0%' }} />
                  </div>
                </div>

                <div className="bg-[#0A0A0F]/70 border border-[#1E1E2E] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8888AA]">Estúdio Comercial</span>
                    <ImageIcon className="w-4 h-4 text-[#06B6D4]" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">Ilimitado</div>
                    <div className="text-[10px] text-emerald-400">Via integração externa Flowy AI</div>
                  </div>
                  <div className="w-full bg-[#1A1A26] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-full" />
                  </div>
                </div>

                <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8888AA]">Render Vídeos</span>
                    <Video className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{profile.credits_video}</div>
                    <div className="text-[10px] text-[#666688]">Vídeos no Kling AI</div>
                  </div>
                  <div className="w-full bg-[#1A1A26] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: profile.credits_video > 0 ? `${Math.min(100, (profile.credits_video / 15) * 100)}%` : '0%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Histórico de Faturas / Recibos
              </h3>

              {profile.plan === 'free' ? (
                <div className="p-8 text-center text-xs text-[#8888AA] bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl space-y-1">
                  <p>Inexistente para plano Free gratuito.</p>
                  <p className="text-[10px] text-[#555577]">Faturas detalhadas serão exibidas imediatamente após a contratação de qualquer plano.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E1E2E] bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl overflow-hidden text-xs">
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#111118] transition">
                    <div>
                      <div className="font-extrabold text-white">Pago via Pix Intermediado (Asaas S/A)</div>
                      <div className="text-[10px] text-[#666688] mt-0.5">Identificador Assinatura: ftr_asaas_f99e312</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-400">R$ {getPlanPriceValue(profile.plan)},00</div>
                      <div className="text-[10px] text-[#8888AA]">Compensado hoje às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#1E1E2E] pb-2">Método de Renovação</h3>
              <div className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {profile.plan === 'free' ? (
                    <>
                      <span className="text-xs font-bold text-[#8888AA]">Cartão / Chave Pix</span>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Renovação Automática
                      </span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </div>
                
                {profile.plan === 'free' ? (
                  <p className="text-[11px] text-[#8888AA] leading-relaxed">Você está rodando no plano grátis com limites restritos e chaves locais. Para ativar o autopay e recargas automatizadas mensais, contrate um plano.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-2.5 text-xs text-white font-semibold flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#06B6D4]" />
                      <span>Pix Copia e Cola / Cartão Ativo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      )}

      {activeTab === 'flow' && (
        <div className="space-y-6" id="flow-customizer-panel">
          <div className="bg-gradient-to-r from-cyan-900/10 via-cyan-950/5 to-transparent border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Guia de Configuração • Flow & Produtos</h3>
              <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                Nesta aba, você configura o acervo técnico do criador inteligente. Gerencie os <strong>Produtos Recomendados em Alta</strong>, personalize os <strong>Avatares</strong>, ajuste as <strong>Interações</strong>, defina os <strong>Cenários de Fundo</strong> e configure os <strong>Movimentos de Câmera</strong>.
              </p>
            </div>
          </div>
          
          {/* Sub menu selector bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E1E2E] pb-4">
            <div className="flex flex-wrap gap-1.5 bg-[#0A0A0F] p-1 rounded-xl border border-[#1E1E2E]">
              <button
                onClick={() => { setSubTab('produtos'); setShowAddEditForm(false); }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                  subTab === 'produtos' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-white'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                Produtos TikTok ({trendingProducts.length})
              </button>

              <button
                onClick={() => { setSubTab('avatars'); setShowAddEditForm(false); }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                  subTab === 'avatars' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-white'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                Avatares ({allAvatars.length})
              </button>

              <button
                onClick={() => { setSubTab('interactions'); setShowAddEditForm(false); }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                  subTab === 'interactions' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-green-400" />
                Interações ({allInteractions.length})
              </button>

              <button
                onClick={() => { setSubTab('scenarios'); setShowAddEditForm(false); }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                  subTab === 'scenarios' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                Cenários ({allScenarios.length})
              </button>

              <button
                onClick={() => { setSubTab('movements'); setShowAddEditForm(false); }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                  subTab === 'movements' ? 'bg-[#7C3AED] text-white' : 'text-[#8888AA] hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                Movimentos ({allMovements.length})
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestoreDefaults}
                className="px-3.5 py-1.5 bg-[#1F1F2F] hover:bg-[#2F2F3F] text-xs font-bold text-[#8888AA] hover:text-white border border-[#2E2E3E] rounded-xl flex items-center gap-1.5 transition active:scale-95 text-xs"
                title="Restaurar toda esta categoria aos padrões de fábrica"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar Padrão
              </button>

              <button
                onClick={handleOpenAddNew}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow transition active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Adicionar Novo
              </button>
            </div>
          </div>

          {/* Configuration Forms block slide-down */}
          {showAddEditForm && (
            <div className="bg-[#111118] border border-cyan-500/30 rounded-2xl p-5 space-y-4 animate-fade-in relative">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setShowAddEditForm(false)} 
                  className="p-1 rounded-lg bg-[#1E1E2E] hover:bg-[#2A2A3A] text-[#8888AA] hover:text-white transition"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  {editingItem ? 'Editar Configuração Existente' : 'Cadastrar Novo Item Customizado'}
                </h3>
                <p className="text-[11px] text-[#8888AA]">Preencha as propriedades necessárias. O item será disponibilizado imediatamente no criador de vídeo de produtos em alta.</p>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4 pt-1 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Common fields: Name & Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#8888AA]">Nome / Título amigável</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Clara, Cozinha Premium, CTA Beijo, etc..."
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>

                      {/* Image Preview URL and File Upload Input */}
                      <div className="space-y-1.5 p-3 sm:p-4 bg-[#030307]/80 rounded-2xl border border-[#1E1E2E] flex flex-col justify-between">
                        <label className="text-[11px] sm:text-xs font-black text-[#8888AA] flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> Imagem de Pré-visualização (Card)
                        </label>
                        <input
                          type="url"
                          placeholder="Insira um link HTTP(S) da imagem..."
                          value={formImg}
                          onChange={e => setFormImg(e.target.value)}
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E]/60 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none mb-2"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer bg-[#11111A] hover:bg-[#FE2C55]/10 text-[#A0A0C0] hover:text-[#FE2C55] px-3.5 py-1.5 rounded-lg border border-[#1E1E2E] text-[10px] font-black tracking-wider transition-all flex items-center gap-1.5">
                            <Upload className="w-3 h-3" /> Escolher Arquivo de Imagem
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePresetImageUpload}
                              className="hidden"
                            />
                          </label>
                          {formImg && (
                            <span className="text-[9px] text-green-400 font-bold flex items-center gap-1">
                              ✓ Carregado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Video Preview URL and File Upload Input */}
                      <div className="space-y-1.5 p-3 sm:p-4 bg-[#030307]/80 rounded-2xl border border-[#1E1E2E] flex flex-col justify-between">
                        <label className="text-[11px] sm:text-xs font-black text-[#8888AA] flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-[#FE2C55]" /> Vídeo de Pré-visualização (Ao passar o mouse)
                        </label>
                        <input
                          type="url"
                          placeholder="Insira um link HTTP(S) do vídeo (MP4)..."
                          value={formVideoUrl}
                          onChange={e => setFormVideoUrl(e.target.value)}
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E]/60 rounded-xl p-2.5 text-xs text-white focus:border-[#FE2C55] outline-none mb-2"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer bg-[#11111A] hover:bg-[#FE2C55]/10 text-[#A0A0C0] hover:text-[#FE2C55] px-3.5 py-1.5 rounded-lg border border-[#1E1E2E] text-[10px] font-black tracking-wider transition-all flex items-center gap-1.5">
                            <Upload className="w-3 h-3" /> Escolher Arquivo de Vídeo
                            <input
                              type="file"
                              accept="video/mp4,video/*"
                              onChange={handlePresetVideoUpload}
                              className="hidden"
                            />
                          </label>
                          {formVideoUrl && (
                            <span className="text-[9px] text-green-400 font-bold flex items-center gap-1">
                              ✓ Carregado
                            </span>
                          )}
                        </div>
                      </div>

                  {/* ID Field for manual identification */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#8888AA] flex items-center justify-between">
                      <span>Identificador Único (ID)</span>
                      <span className="text-[9px] text-[#666688] font-bold">Opcional</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: quarto, beatriz, cta_beijo..."
                      value={formId}
                      onChange={e => setFormId(e.target.value)}
                      disabled={!!editingItem}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-55 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Avatar specific: Gender */}
                  {subTab === 'avatars' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#8888AA]">Gênero do Avatar</label>
                      <select
                        value={formGender}
                        onChange={e => setFormGender(e.target.value as 'FEMININO' | 'MASCULINO')}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                      >
                        <option value="FEMININO" className="bg-[#111118]">FEMININO</option>
                        <option value="MASCULINO" className="bg-[#111118]">MASCULINO</option>
                      </select>
                    </div>
                  )}

                  {/* Scenario/Movement specific: Type */}
                  {(subTab === 'scenarios' || subTab === 'movements') && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#8888AA]">Categoria / Tipo</label>
                      <input
                        type="text"
                        placeholder="Ex: Residencial, Externo, CTA, Hook..."
                        value={formType}
                        onChange={e => setFormType(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                      />
                    </div>
                  )}

                  {/* Interaction specific: English Prompt translate */}
                  {subTab === 'interactions' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#8888AA]">Tradução em Inglês (Prompt Engine)</label>
                      <input
                        type="text"
                        placeholder="Ex: wearing the product, holding the package, etc..."
                        value={formEnglish}
                        onChange={e => setFormEnglish(e.target.value)}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                      />
                    </div>
                  )}

                  {/* Movement specific: PromptText */}
                  {subTab === 'movements' && (
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-[#8888AA]">Texto Prompt do Movimento em Inglês (Foco da Renderização IA)</label>
                      <textarea
                        required
                        placeholder="Ex: Blows a cheerful kiss to the camera on the opening frame..."
                        value={formPromptText}
                        onChange={e => setFormPromptText(e.target.value)}
                        rows={2}
                        className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none font-mono"
                      />
                    </div>
                  )}

                  {/* Product specific fields */}
                  {subTab === 'produtos' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#8888AA]">Nicho do Produto</label>
                        <select
                          value={formNiche}
                          onChange={e => setFormNiche(e.target.value)}
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                        >
                          <option value="Beleza e Cosméticos" className="bg-[#111118]">Beleza e Cosméticos</option>
                          <option value="Saúde & Bem Estar" className="bg-[#111118]">Saúde & Bem Estar</option>
                          <option value="Casa & Eletro" className="bg-[#111118]">Casa & Eletro</option>
                          <option value="Tecnologia" className="bg-[#111118]">Tecnologia</option>
                          <option value="Fitness" className="bg-[#111118]">Fitness</option>
                          <option value="Pet Show" className="bg-[#111118]">Pet Show</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#8888AA]">Prazos / Score de Oportunidade (10-100)</label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          value={formScore}
                          onChange={e => setFormScore(Number(e.target.value))}
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#8888AA]">Nível de Concorrência</label>
                        <select
                          value={formCompetition}
                          onChange={e => setFormCompetition(e.target.value as 'baixa' | 'média' | 'alta')}
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                        >
                          <option value="baixa" className="bg-[#111118]">Baixa concorrência</option>
                          <option value="média" className="bg-[#111118]">Média concorrência</option>
                          <option value="alta" className="bg-[#111118]">Alta concorrência (Saturado)</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-bold text-[#8888AA]">Motivo da Tendência / Por que está viralizando?</label>
                        <input
                          type="text"
                          placeholder="Ex: Viralizado no feeds americanos da rede vizinha pelo efeito anti-estresse durável."
                          value={formReason}
                          onChange={e => setFormReason(e.target.value)}
                          className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </>
                  )}

                  {/* General Description field */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-[#8888AA]">Descrição detalhada (Prompts / Metadados)</label>
                    <textarea
                      required
                      placeholder={
                        subTab === 'interactions' 
                          ? 'Descreva a lógica de interação (Ex: O apresentador segura e demonstra o item na frente do peito)' 
                          : 'Descreva perfeitamente todos os detalhes visuais do item para o gerador de prompts alimentado pelo Gemini...'
                      }
                      value={formDesc}
                      onChange={e => setFormDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEditForm(false)}
                    className="px-4 py-2 bg-[#1A1A26] hover:bg-[#252535] text-xs font-bold text-[#8888AA] rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-xl transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Registro
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List display based on selected subtab */}
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5" id="custom-presets-list">
            
            {subTab === 'produtos' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[#8888AA] tracking-widest border-b border-[#1E1E2E] pb-2">TikTok & Shopee Products Catalog</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingProducts.map((prod) => (
                    <div key={prod.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl overflow-hidden flex flex-col justify-between">
                      <div className="relative h-32 bg-zinc-900 overflow-hidden">
                        <img 
                          src={prod.image_url} 
                          alt={prod.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur px-2 py-0.5 rounded-lg border border-white/10 text-[9px] font-black text-white capitalize">
                          {prod.niche}
                        </div>
                        <div className="absolute top-2 right-2 bg-[#7C3AED] px-1.5 py-0.5 rounded-md text-[9px] font-black text-white">
                          Score: {prod.opportunity_score}
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-grow">
                        <h4 className="font-bold text-white text-xs truncate" title={prod.name}>{prod.name}</h4>
                        <p className="text-[10px] text-[#8888AA] line-clamp-3 leading-relaxed">{prod.description}</p>
                        
                        <div className="flex flex-wrap gap-1 text-[9px]">
                          <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold uppercase">
                            {prod.competition_level} concorrência
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#111118]/60 p-3 pt-0 border-t border-[#1E1E2E] flex justify-end gap-1.5 mt-auto">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg bg-[#222] hover:bg-cyan-500/10 border border-[#333] hover:border-cyan-400/40 text-[#8888AA] hover:text-cyan-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(prod.id)}
                          className="p-1.5 rounded-lg bg-[#222] hover:bg-rose-500/10 border border-[#333] hover:border-rose-400/40 text-[#8888AA] hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTab === 'avatars' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[#8888AA] tracking-widest border-b border-[#1E1E2E] pb-2">Avatares Disponíveis no Estúdio</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {allAvatars.map((av) => (
                    <div key={av.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl overflow-hidden flex flex-col justify-between">
                      <div className="relative h-28 bg-zinc-900 overflow-hidden">
                        <img 
                          src={av.imageUrl} 
                          alt={av.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded-lg text-[9px] font-black text-white">
                          {av.gender}
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <h4 className="font-bold text-white text-xs">{av.name}</h4>
                        <p className="text-[10px] text-[#8888AA] line-clamp-3 leading-relaxed">{av.description}</p>
                      </div>

                      <div className="bg-[#111118]/60 p-2.5 border-t border-[#1E1E2E] flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(av)}
                          className="p-1 rounded bg-[#222] hover:bg-cyan-500/10 border border-[#333] hover:border-cyan-400/40 text-[#8888AA] hover:text-cyan-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(av.id)}
                          className="p-1 rounded bg-[#222] hover:bg-rose-500/10 border border-[#333] hover:border-rose-400/40 text-[#8888AA] hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTab === 'interactions' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[#8888AA] tracking-widest border-b border-[#1E1E2E] pb-2">Tipos de Interação Apresentador-Produto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allInteractions.map((inter) => {
                    const media = {
                      imageUrl: inter.imageUrl || INTERACTION_MEDIA_MAP[inter.id]?.imageUrl || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
                      videoUrl: inter.videoUrl || INTERACTION_MEDIA_MAP[inter.id]?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-small-cosmetic-bottle-41598-large.mp4',
                      category: INTERACTION_MEDIA_MAP[inter.id]?.category || 'COMPLETADO',
                      format: INTERACTION_MEDIA_MAP[inter.id]?.format || 'Video'
                    };
                    return (
                      <div key={inter.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl overflow-hidden flex flex-col justify-between">
                        <div className="relative h-28 bg-zinc-900 overflow-hidden">
                          {media.videoUrl ? (
                            <InteractionPreviewHover
                              imageUrl={media.imageUrl}
                              videoUrl={media.videoUrl}
                              name={inter.name}
                            />
                          ) : (
                            <img 
                              src={media.imageUrl} 
                              alt={inter.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div className="absolute top-2 left-2 bg-black/85 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide text-green-400 z-10">
                            Opção {inter.id}
                          </div>
                        </div>
                        <div className="p-3 space-y-1.5 flex-grow">
                          <h4 className="font-bold text-white text-xs">{inter.name}</h4>
                          <p className="text-[10px] text-[#8888AA] line-clamp-3 leading-relaxed">{inter.description}</p>
                          <p className="text-[9px] text-[#666688] font-mono select-all leading-tight">Prompt: "{inter.englishText}"</p>
                        </div>

                        <div className="bg-[#111118]/60 p-2.5 border-t border-[#1E1E2E] flex justify-end gap-1 mt-auto">
                          <button
                            onClick={() => handleOpenEdit(inter)}
                            className="p-1 rounded bg-[#222] hover:bg-cyan-500/10 border border-[#333] hover:border-cyan-400/40 text-[#8888AA] hover:text-cyan-400 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(inter.id)}
                            className="p-1 rounded bg-[#222] hover:bg-rose-500/10 border border-[#333] hover:border-rose-400/40 text-[#8888AA] hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {subTab === 'scenarios' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[#8888AA] tracking-widest border-b border-[#1E1E2E] pb-2">Cenários e Planos de Fundo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {allScenarios.map((sc) => (
                    <div key={sc.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl overflow-hidden flex flex-col justify-between">
                      <div className="relative h-28 bg-zinc-900 overflow-hidden">
                        <img 
                          src={sc.imageUrl} 
                          alt={sc.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/85 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide text-cyan-400">
                          {sc.type}
                        </div>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <h4 className="font-bold text-white text-xs">{sc.name}</h4>
                        <p className="text-[10px] text-[#8888AA] line-clamp-3 leading-relaxed">{sc.description}</p>
                      </div>

                      <div className="bg-[#111118]/60 p-2.5 border-t border-[#1E1E2E] flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(sc)}
                          className="p-1 rounded bg-[#222] hover:bg-cyan-500/10 border border-[#333] hover:border-cyan-400/40 text-[#8888AA] hover:text-cyan-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(sc.id)}
                          className="p-1 rounded bg-[#222] hover:bg-rose-500/10 border border-[#333] hover:border-rose-400/40 text-[#8888AA] hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {subTab === 'movements' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[#8888AA] tracking-widest border-b border-[#1E1E2E] pb-2">Movimentos do Primeiro Frame do Vídeo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allMovements.map((m) => (
                    <div key={m.id} className="bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl overflow-hidden flex flex-col justify-between">
                      <div className="relative h-28 bg-zinc-900 overflow-hidden">
                        <img 
                          src={m.imageUrl} 
                          alt={m.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/85 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide text-amber-400">
                          {m.type}
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <h4 className="font-bold text-white text-xs">{m.name}</h4>
                        <p className="text-[10px] text-[#8888AA] line-clamp-3 leading-relaxed">{m.description}</p>
                        <p className="text-[9px] text-[#666688] font-mono italic select-all leading-tight">Prompt: "{m.promptText}"</p>
                      </div>

                      <div className="bg-[#111118]/60 p-2.5 border-t border-[#1E1E2E] flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1 rounded bg-[#222] hover:bg-cyan-500/10 border border-[#333] hover:border-cyan-400/40 text-[#8888AA] hover:text-cyan-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(m.id)}
                          className="p-1 rounded bg-[#222] hover:bg-rose-500/10 border border-[#333] hover:border-rose-400/40 text-[#8888AA] hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {activeTab === 'prompts_base' as any && (
        <div className="space-y-6 text-[#F0F0FF] animate-fade-in">
          <div className="bg-gradient-to-r from-teal-900/10 via-teal-950/5 to-transparent border border-teal-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 shrink-0">
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider mb-1">Prompts Base / Motor IA</h2>
              <p className="text-[11px] text-[#8888AA] leading-relaxed max-w-2xl">
                Configure os prompts base manuais para cada Cenário Comum, Movimento e Interação.
                Em vez de gerar automaticamente a estrutura visual base, o sistema combinará o prompt escrito aqui
                com as instruções digitadas pelo cliente nas opções de "detalhes adicionais".
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 sm:p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" /> 1. Cenários Comuns
              </h3>
              <div className="space-y-3">
                {allScenarios.map(sc => (
                  <div key={sc.id} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-3">
                    <label className="text-xs font-bold text-[#8888AA] block mb-2">{sc.name} ({sc.type})</label>
                    <textarea 
                      className="w-full bg-[#030307] border border-[#1E1E2E] rounded-lg p-2.5 text-[11px] text-white focus:border-cyan-400 outline-none min-h-[60px]"
                      placeholder="Ex: a cozy warm bedroom with fairy lights background..."
                      value={(sc as any).basePrompt || ''}
                      onChange={(e) => {
                        const updated = allScenarios.map(s => s.id === sc.id ? { ...s, basePrompt: e.target.value } : s);
                        saveScenarios(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 sm:p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" /> 2. Efeitos de Movimento
              </h3>
              <div className="space-y-3">
                {allMovements.map(mv => (
                  <div key={mv.id} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-3">
                    <label className="text-xs font-bold text-[#8888AA] block mb-2">{mv.name} ({mv.type})</label>
                    <textarea 
                      className="w-full bg-[#030307] border border-[#1E1E2E] rounded-lg p-2.5 text-[11px] text-white focus:border-purple-400 outline-none min-h-[60px]"
                      placeholder="Ex: slowly blowing a kiss towards the camera then pointing downward smiling..."
                      value={(mv as any).basePrompt || ''}
                      onChange={(e) => {
                        const updated = allMovements.map(m => m.id === mv.id ? { ...m, basePrompt: e.target.value } : m);
                        saveMovements(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0A0F] border border-[#1E1E2E] p-4 sm:p-5 rounded-2xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> 3. Interações
              </h3>
              <div className="space-y-3">
                {allInteractions.map(inter => (
                  <div key={inter.id} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-3">
                    <label className="text-xs font-bold text-[#8888AA] block mb-2">{inter.name}</label>
                    <textarea 
                      className="w-full bg-[#030307] border border-[#1E1E2E] rounded-lg p-2.5 text-[11px] text-white focus:border-emerald-400 outline-none min-h-[60px]"
                      placeholder="Ex: Wearing the product, full body or half body shot..."
                      value={(inter as any).basePrompt || ''}
                      onChange={(e) => {
                        const updated = allInteractions.map(i => i.id === inter.id ? { ...i, basePrompt: e.target.value } : i);
                        saveInteractions(updated);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gerenciar_aulas' && (
        <div className="space-y-6 text-[#F0F0FF] animate-fade-in" id="settings-lessons">
          <div className="bg-gradient-to-r from-amber-900/10 via-amber-955/5 to-transparent border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Painel do Administrador • Grade Curricular</h3>
              <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                Aba exclusiva para administradores. Gerencie as <strong>Aulas Acadêmicas</strong>, organize os <strong>Módulos de Aprendizado</strong>, ordene a sequência de exibição e publique novos materiais instrucionais para a base de alunos.
              </p>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-[1_1_100%] flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-amber-200 flex items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                Gerenciamento de Aulas Acadêmicas (Admin)
              </h3>
              <p className="text-xs text-zinc-400">
                Ordene, publique, oculte, crie ou altere as aulas e os módulos disponíveis para os alunos do Portal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchCourseData}
                disabled={lessonsLoading}
                className="p-2.5 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl hover:border-zinc-700 transition"
                title="Sincronizar"
              >
                <RefreshCw className={`w-4 h-4 text-zinc-400 ${lessonsLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleOpenModuleCreate}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                <span>Criar Novo Módulo</span>
              </button>
            </div>
          </div>

          {lessonsLoading && modules.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3 bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-sm font-bold text-[#8888AA]">Carregando módulos de aulas...</span>
            </div>
          ) : lessonsError ? (
            <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="text-sm font-bold text-red-400">Falha ao consultar aulas</h3>
              <p className="text-xs text-[#8888AA] leading-relaxed">{lessonsError}</p>
              <button
                onClick={fetchCourseData}
                className="px-3 py-1.5 bg-red-900/30 text-red-200 border border-red-800/40 rounded-xl text-xs font-bold"
              >
                Tentar novamente
              </button>
            </div>
          ) : modules.length === 0 ? (
            <div className="text-center p-12 bg-[#09090E] border border-dashed border-[#1E1E2E] rounded-3xl space-y-4">
              <GraduationCap className="w-12 h-12 text-[#8888AA]/40 mx-auto" />
              <h3 className="font-extrabold text-white text-sm">Nenhum módulo ou aula cadastrado ainda</h3>
              <p className="text-xs text-[#8888AA] max-w-sm mx-auto leading-relaxed">
                Clique no botão "Criar Novo Módulo" acima para dar início à estrutura de aulas do Portal.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl">
              {[...modules]
                .sort((a, b) => a.order_position - b.order_position)
                .map((mod, modIdx) => {
                  const modLessonsList = lessons
                    .filter(l => l.module_id === mod.id)
                    .sort((a, b) => a.order_position - b.order_position);
                  const isExpanded = !!expandedModules[mod.id];

                  return (
                    <div
                      key={mod.id}
                      className="border border-[#1E1E2E] bg-[#111118] rounded-2xl overflow-hidden shadow-xl"
                    >
                      {/* Module Line */}
                      <div className="p-4 bg-[#14141E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E2E]">
                        <div className="flex-1 min-w-0" onClick={() => toggleModuleAccordion(mod.id)}>
                          <span className="text-[10px] font-black tracking-widest text-[#7C3AED] uppercase block">
                            Módulo {String(modIdx + 1).padStart(2, '0')} • Posição: {mod.order_position}
                          </span>
                          <h4 className="text-sm font-black text-white flex items-center gap-2 cursor-pointer mt-0.5">
                            {mod.title}
                            <span className="text-zinc-500 font-normal text-xs">({modLessonsList.length} aulas)</span>
                          </h4>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                          <button
                            onClick={() => handleMoveModuleOrder(mod, 'up')}
                            className="p-1 px-1.5 text-zinc-400 hover:text-white bg-[#0A0A0F] hover:bg-zinc-800 rounded border border-[#1E1E2E]"
                            type="button"
                            title="Subir Módulo"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleMoveModuleOrder(mod, 'down')}
                            className="p-1 px-1.5 text-zinc-400 hover:text-white bg-[#0A0A0F] hover:bg-zinc-800 rounded border border-[#1E1E2E]"
                            type="button"
                            title="Descer Módulo"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenModuleEdit(mod)}
                            type="button"
                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs rounded border border-amber-500/20"
                          >
                            Editar Módulo
                          </button>

                          <button
                            onClick={() => handleDeleteModule(mod.id)}
                            type="button"
                            className="p-1 text-red-400 hover:text-red-500 hover:bg-red-950/20 rounded"
                            title="Excluir Módulo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenLessonCreate(mod.id)}
                            type="button"
                            className="px-2.5 py-1 bg-green-500/15 hover:bg-green-500/30 text-green-400 font-bold text-xs rounded border border-green-500/25 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 stroke-[3px]" />
                            <span>Add Aula</span>
                          </button>
                        </div>
                      </div>

                      {/* Lessons Grid list */}
                      {isExpanded && (
                        <div className="divide-y divide-[#1E1E2E] bg-[#0A0A0F]/50">
                          {modLessonsList.length === 0 ? (
                            <div className="p-5 text-center text-xs text-zinc-500 italic">
                              Nenhuma aula cadastrada para este módulo. Comece clicando em "+ Add Aula" ao lado.
                            </div>
                          ) : (
                            modLessonsList.map((les, lesIdx) => (
                              <div
                                key={les.id}
                                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#111118]/60 transition"
                              >
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-zinc-500 text-xs font-mono">#{String(lesIdx + 1).padStart(2, '0')}</span>
                                    <span className="text-white text-xs font-bold font-sans">{les.title}</span>
                                    
                                    {les.is_premium && (
                                      <span className="text-[9px] bg-amber-500/10 text-amber-400 font-black border border-amber-500/20 rounded px-1.5 py-0.5 flex items-center gap-0.5">
                                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                                        PREMIUM 👑
                                      </span>
                                    )}

                                    {les.is_published ? (
                                      <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded px-1.5 py-0.5">
                                        Publicado
                                      </span>
                                    ) : (
                                      <span className="text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700/50 rounded px-1.5 py-0.5">
                                        Rascunho
                                      </span>
                                    )}

                                    <span className="text-[10px] text-zinc-500 font-mono">Duração: {les.duration || '10:00'}</span>
                                  </div>
                                  
                                  {les.description && (
                                    <p className="text-xs text-zinc-400 font-sans line-clamp-1 max-w-2xl text-left">
                                      {les.description}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono select-all text-left">
                                    <Youtube className="w-3 h-3 text-red-500 inline shrink-0" />
                                    <span>https://youtube.com/watch?v={les.youtube_video_id || extractYoutubeId(les.youtube_url)}</span>
                                  </div>
                                </div>

                                {/* Lesson specific action buttons */}
                                <div className="flex items-center gap-1.5 shrink-0 self-start md:self-auto">
                                  <button
                                    onClick={() => handleMoveLessonOrder(les, 'up')}
                                    type="button"
                                    className="p-1 text-zinc-400 hover:text-white bg-[#0A0A0F] border border-[#1E1E2E] rounded"
                                    title="Mover para cima"
                                  >
                                    ▲
                                  </button>

                                  <button
                                    onClick={() => handleMoveLessonOrder(les, 'down')}
                                    type="button"
                                    className="p-1 text-zinc-400 hover:text-white bg-[#0A0A0F] border border-[#1E1E2E] rounded"
                                    title="Mover para baixo"
                                  >
                                    ▼
                                  </button>

                                  <button
                                    onClick={() => handleOpenLessonEdit(les)}
                                    type="button"
                                    className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-white font-bold rounded"
                                  >
                                    Editar Aula
                                  </button>

                                  <button
                                    onClick={() => handleDeleteLesson(les.id)}
                                    type="button"
                                    className="p-1 text-red-400 hover:text-red-500 rounded"
                                    title="Apagar Aula"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* --- MODALS RENDERED DYNAMICALLY INSIDE SETTINGS WINDOW --- */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-5 border-b border-[#1E1E2E] flex items-center justify-between bg-[#0A0A0F]">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-500" />
                {modEditingId ? 'Editar Detalhes do Módulo' : 'Adicionar Novo Módulo'}
              </h3>
              <button
                onClick={() => setShowModuleModal(false)}
                type="button"
                className="p-1 text-zinc-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-zinc-400 block font-sans text-left">Título (Ex: Módulo 1: Primeiros Passos)</label>
                <input
                  type="text"
                  required
                  value={modTitle}
                  onChange={(e) => setModTitle(e.target.value)}
                  placeholder="Título..."
                  className="w-full bg-[#050508] border border-[#1E1E2E] focus:border-amber-500 text-white rounded-xl py-2.5 px-3.5 text-xs outline-none transition font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase text-zinc-400 block font-sans text-left">Posição de Ordem (Ex: 1, 2, 3)</label>
                <input
                  type="number"
                  required
                  value={modOrder}
                  onChange={(e) => setModOrder(e.target.value !== '' ? Number(e.target.value) : '')}
                  className="w-full bg-[#050508] border border-[#1E1E2E] focus:border-amber-500 text-white rounded-xl py-2.5 px-3.5 text-xs outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#1E1E2E] justify-end">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition cursor-pointer"
                >
                  Salvar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLessonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111118] border border-[#1E1E2E] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in my-8">
            <div className="p-5 border-b border-[#1E1E2E] flex items-center justify-between bg-[#0A0A0F]">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-500" />
                {lesEditingId ? 'Editar Parâmetros da Aula' : 'Lançar Aula no Módulo'}
              </h3>
              <button
                onClick={() => setShowLessonModal(false)}
                type="button"
                className="p-1 text-zinc-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-zinc-400 block font-sans text-left">Módulo Vinculado</label>
                  <select
                    value={lesModuleId}
                    onChange={(e) => setLesModuleId(e.target.value)}
                    className="w-full bg-[#050508] border border-[#1E1E2E] text-white rounded-xl py-2.5 px-3 text-xs outline-none cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {modules.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-zinc-400 block font-sans text-left">Título da Aula</label>
                  <input
                    type="text"
                    required
                    value={lesTitle}
                    onChange={(e) => setLesTitle(e.target.value)}
                    placeholder="Título da Aula..."
                    className="w-full bg-[#050508] border border-[#1E1E2E] text-white rounded-xl py-2.5 px-3.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 font-sans text-left">
                <label className="text-[11px] font-black uppercase text-zinc-400 block pb-1">Link ou ID do Vídeo no YouTube</label>
                <input
                  type="text"
                  required
                  value={lesYoutubeUrl}
                  onChange={(e) => setLesYoutubeUrl(e.target.value)}
                  placeholder="Pense em: https://www.youtube.com/watch?v=... ou ID direto"
                  className="w-full bg-[#050508] border border-[#1E1E2E] text-white rounded-xl py-2.5 px-3.5 text-xs outline-none font-mono"
                />
                
                {inputVideoIdPreview && (
                  <div className="mt-2 p-2 bg-[#050508] border border-green-500/20 rounded-xl flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Video ID Extraído: <strong className="text-green-400 font-mono">{inputVideoIdPreview}</strong></span>
                    <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-bold font-sans">Válido</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-left">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-zinc-400 block">Duração (Ex: 11:20)</label>
                  <input
                    type="text"
                    required
                    value={lesDuration}
                    onChange={(e) => setLesDuration(e.target.value)}
                    placeholder="10:00"
                    className="w-full bg-[#050508] border border-[#1E1E2E] text-white rounded-xl py-2.5 px-3.5 text-xs outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-zinc-400 block">Posição (Ex: 1, 2...)</label>
                  <input
                    type="number"
                    required
                    value={lesOrder}
                    onChange={(e) => setLesOrder(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full bg-[#050508] border border-[#1E1E2E] text-white rounded-xl py-2.5 px-3.5 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1 font-sans text-left">
                <label className="text-[11px] font-black uppercase text-zinc-400 block">Descrição ou Materiais Adicionais</label>
                <textarea
                  value={lesDescription}
                  onChange={(e) => setLesDescription(e.target.value)}
                  placeholder="Forneça links de apoio, material escrito, ou resumo da aula..."
                  rows={3}
                  className="w-full bg-[#050508] border border-[#1E1E2E] text-white rounded-xl py-2.5 px-3.5 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 font-sans border-t border-[#1E1E2E] text-left">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lesIsPublished}
                    onChange={(e) => setLesIsPublished(e.target.checked)}
                    className="rounded border-[#1E1E2E] text-[#7C3AED] bg-[#050508]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Publicar Aula</span>
                    <span className="text-[9px] text-[#8888AA]">Visível para os alunos</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={lesIsPremium}
                    onChange={(e) => setLesIsPremium(e.target.checked)}
                    className="rounded border-[#1E1E2E] text-[#7C3AED] bg-[#050508]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Gated Premium 👑</span>
                    <span className="text-[9px] text-[#8888AA]">Exigir plano Starter/Pro</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#1E1E2E] justify-end font-sans">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition cursor-pointer"
                >
                  Salvar Parâmetros da Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'gerenciar_viralizar' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-900/10 via-rose-950/5 to-transparent border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shrink-0">
              <Flame className="w-5 h-5 text-[#FE2C55]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Painel do Administrador • Módulo Viralizar</h3>
              <p className="text-xs text-[#8888AA] mt-1 leading-relaxed">
                Aba exclusiva para administradores. Gerencie os roteiros e perfis recomendados no <strong>Módulo Viralizar Perfil</strong>. Organize os nichos e as referências de sucesso para inspirar e guiar os criadores.
              </p>
            </div>
          </div>
          <AdminViralManager />
        </div>
      )}

        </div> {/* Right Side Work Area */}
      </div> {/* Main Grid */}

    </div>
  );
}

// Simple placeholder icon internally
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
