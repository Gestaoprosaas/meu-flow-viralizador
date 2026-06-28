import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  ImageIcon,
  Video,
  FolderLock,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Settings,
  Menu,
  X,
  Clock,
  LogOut,
  Zap,
  ShieldAlert,
  Lock,
  Gift,
  FolderOpen,
  Coins,
  GraduationCap,
  Flame
} from 'lucide-react';

// Import subcomponents
import CreditsBadge from './components/CreditsBadge';
import UpgradeModal from './components/UpgradeModal';
import ScreenLanding from './components/ScreenLanding';
import ScreenDashboard from './components/ScreenDashboard';
import ScreenRoteiros from './components/ScreenRoteiros';
import ScreenImagens from './components/ScreenImagens';
import ScreenMovimentos from './components/ScreenMovimentos';
import ScreenVideos from './components/ScreenVideos';
import ScreenProjetos from './components/ScreenProjetos';
import ScreenBiblioteca from './components/ScreenBiblioteca';
import ScreenProdutos from './components/ScreenProdutos';
import ScreenTreinamentos from './components/ScreenTreinamentos';
import ScreenViralizarPerfil from './components/ScreenViralizarPerfil';
import ScreenUpgrade from './components/ScreenUpgrade';
import ScreenAdmin from './components/ScreenAdmin';
import TemplateGallery from './components/TemplateGallery';
import { getSupabase } from './lib/supabaseClient';

const playCashRegisterSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const kaOsc = ctx.createOscillator();
    const kaGain = ctx.createGain();
    kaOsc.connect(kaGain);
    kaGain.connect(ctx.destination);
    kaOsc.type = 'square';
    kaOsc.frequency.setValueAtTime(300, ctx.currentTime);
    kaOsc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
    kaGain.gain.setValueAtTime(0, ctx.currentTime);
    kaGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    kaGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    kaOsc.start(ctx.currentTime);
    kaOsc.stop(ctx.currentTime + 0.1);

    const t = ctx.currentTime + 0.08;
    const chingGain = ctx.createGain();
    chingGain.connect(ctx.destination);
    chingGain.gain.setValueAtTime(0, t);
    chingGain.gain.linearRampToValueAtTime(0.6, t + 0.02);
    chingGain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

    [1500, 2000, 2500, 3000].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.connect(chingGain);
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.start(t);
      osc.stop(t + 0.8);
    });

    const noiseDuration = 0.4;
    const bufferSize = ctx.sampleRate * noiseDuration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 4000;
    const noiseGain = ctx.createGain();
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.4, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + noiseDuration);
    noise.start(t);
  } catch (e) {
    console.warn("Blocked sound playback:", e);
  }
};

import {
  Profile,
  Project,
  TrendingProduct,
  ScriptGeneration,
  ImageGeneration,
  VideoGeneration,
  AffiliateReferral
} from './types';

export function CelebrationConfetti({ active }: { active: boolean }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#FE2C55', '#25F4EE', '#813EF6', '#FFD700', '#10B981', '#FF1493'];
    const particles: any[] = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -300 - 50,
        r: Math.random() * 4 + 2,
        d: Math.random() * height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.05 + 0.01,
        tiltAngle: 0,
        speed: Math.random() * 3.5 + 1.5,
        isMoney: Math.random() > 0.65
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speed;
        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 10;

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        if (p.isMoney) {
          ctx.font = '14px Arial';
          ctx.fillStyle = '#10B981';
          ctx.fillText('💸', p.x + p.tilt, p.y);
        } else {
          ctx.lineWidth = p.r * 2;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 animate-fade-in"
    />
  );
}

export default function App() {
  // Navigation states
  const [isLanding, setIsLanding] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  // Payload redirects
  const [roteirosPreFill, setRoteirosPreFill] = useState<any>(null);
  const [videosPreFill, setVideosPreFill] = useState<any>(null);
  const [initialMovementId, setInitialMovementId] = useState<string | null>(null);

  // Real data state
  const [profile, setProfile] = useState<Profile>({
    id: 'user_01',
    name: 'Admin Global',
    email: 'gestaoprosaas@gmail.com',
    plan: 'pro',
    role: 'admin',
    affiliate_code: 'viral777',
    credits_text_limit: 999,
    credits_text_used: 1,
    credits_image_limit: 500,
    credits_image_used: 1,
    credits_video_limit: 60,
    credits_video_used: 0,
    created_at: new Date().toISOString()
  });

  // Simulated sales states
  const [simulatedSalesEnabled, setSimulatedSalesEnabled] = useState<boolean>(() => {
    return localStorage.getItem('local_simulated_sales_enabled') === 'true';
  });
  const [simulatedSalesMinMin, setSimulatedSalesMinMin] = useState<number>(() => {
    const val = localStorage.getItem('local_simulated_sales_min_min');
    if (val) {
      const parsed = parseInt(val);
      return isNaN(parsed) ? 5 : parsed;
    }
    return 5;
  });
  const [simulatedSalesMaxMin, setSimulatedSalesMaxMin] = useState<number>(() => {
    const val = localStorage.getItem('local_simulated_sales_max_min');
    if (val) {
      const parsed = parseInt(val);
      return isNaN(parsed) ? 15 : parsed;
    }
    return 15;
  });
  const [simulatedSalesSound, setSimulatedSalesSound] = useState<boolean>(() => {
    return localStorage.getItem('local_simulated_sales_sound') !== 'false';
  });
  const [simulatedSalesSoundUrl, setSimulatedSalesSoundUrl] = useState<string | null>(() => {
    return localStorage.getItem('local_simulated_sales_sound_url') || null;
  });

  const [activeSale, setActiveSale] = useState<{ buyer: string; city: string; productName: string } | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('local_projects');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>(() => {
    try {
      const saved = localStorage.getItem('local_trending_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [scripts, setScripts] = useState<ScriptGeneration[]>(() => {
    try {
      const saved = localStorage.getItem('local_scripts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [images, setImages] = useState<ImageGeneration[]>(() => {
    try {
      const saved = localStorage.getItem('local_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [videos, setVideos] = useState<VideoGeneration[]>(() => {
    try {
      const saved = localStorage.getItem('local_videos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('app-theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'light') {
        document.body.classList.add('light');
        document.documentElement.classList.add('light');
      } else {
        document.body.classList.remove('light');
        document.documentElement.classList.remove('light');
      }
      localStorage.setItem('app-theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Clock state
  const [timeStr, setTimeStr] = useState<string>('');

  // Sincronizar com localStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('local_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('local_trending_products', JSON.stringify(trendingProducts));
  }, [trendingProducts]);

  useEffect(() => {
    localStorage.setItem('local_scripts', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem('local_images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('local_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('local_simulated_sales_enabled', String(simulatedSalesEnabled));
  }, [simulatedSalesEnabled]);

  useEffect(() => {
    localStorage.setItem('local_simulated_sales_min_min', String(simulatedSalesMinMin));
  }, [simulatedSalesMinMin]);

  useEffect(() => {
    localStorage.setItem('local_simulated_sales_max_min', String(simulatedSalesMaxMin));
  }, [simulatedSalesMaxMin]);

  useEffect(() => {
    localStorage.setItem('local_simulated_sales_sound', String(simulatedSalesSound));
  }, [simulatedSalesSound]);

  useEffect(() => {
    if (simulatedSalesSoundUrl) {
      localStorage.setItem('local_simulated_sales_sound_url', simulatedSalesSoundUrl);
    } else {
      localStorage.removeItem('local_simulated_sales_sound_url');
    }
  }, [simulatedSalesSoundUrl]);

  // Unified trigger-sound-play helper which plays custom URL or default MP3/WebAudio
  const triggerSoundPlay = () => {
    if (!simulatedSalesSound) return;
    try {
      if (simulatedSalesSoundUrl) {
        const audio = new Audio(simulatedSalesSoundUrl);
        audio.play().catch((e) => {
          console.warn("Custom sound path autoplay blocked or invalid, using fallback synth:", e);
          playCashRegisterSound();
        });
      } else {
        const audio = new Audio('/sounds/default-cash-register.mp3');
        audio.play().catch(() => {
          // Fallback to the extremely reliable synthesized beep
          playCashRegisterSound();
        });
      }
    } catch (e) {
      playCashRegisterSound();
    }
  };

  // Simulated sales background loop effect
  useEffect(() => {
    if (!simulatedSalesEnabled || trendingProducts.length === 0) {
      setActiveSale(null);
      setShowCelebration(false);
      return;
    }

    let timeoutId: any;
    const buyerNames = [
      'Felipe Alencar', 'Juliana Mendes', 'Rodrigo Silva', 
      'Gabriel Oliveira', 'Amanda Rocha', 'Carla Souza', 
      'Lucas Pereira', 'Sofia Martins', 'Rafael Almeida', 'Bruna Dias', 
      'Gustavo Lima', 'Beatriz Ferreira', 'Matheus Ribeiro', 'Letícia Castro',
      'Pedro Albuquerque', 'Larissa Rezende', 'Fábio Guimarães', 'Camila Neves'
    ];
    const citiesList = [
      'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Curitiba - PR', 
      'Porto Alegre - RS', 'Salvador - BA', 'Fortaleza - CE', 'Recife - PE', 
      'Manaus - AM', 'Brasília - DF', 'Campinas - SP', 'Goiânia - GO', 
      'Joinville - SC', 'Vitória - ES', 'Niterói - RJ', 'Florianópolis - SC'
    ];

    let lastProductIds: string[] = [];
    let lastBuyers: string[] = [];

    const triggerSimulatedSale = () => {
      // Find a random product not recently used
      const filterProducts = trendingProducts.filter(p => !lastProductIds.includes(p.id));
      const pool = filterProducts.length > 0 ? filterProducts : trendingProducts;
      const product = pool[Math.floor(Math.random() * pool.length)];

      if (!product) return;

      // Maintain product history to avoid repeats
      lastProductIds.push(product.id);
      if (lastProductIds.length > 3) lastProductIds.shift();

      // Find a buyer name not recently used
      const filterBuyers = buyerNames.filter(b => !lastBuyers.includes(b));
      const buyerPool = filterBuyers.length > 0 ? filterBuyers : buyerNames;
      const buyerName = buyerPool[Math.floor(Math.random() * buyerPool.length)];

      lastBuyers.push(buyerName);
      if (lastBuyers.length > 3) lastBuyers.shift();

      // Get random city
      const rndCity = citiesList[Math.floor(Math.random() * citiesList.length)];

      // Trigger cash register sound safely
      triggerSoundPlay();

      // Show toast and full celebration animations
      setActiveSale({
        buyer: buyerName,
        city: rndCity,
        productName: product.name
      });
      setShowCelebration(true);

      // Dismiss popup and animation details after 5 seconds
      setTimeout(() => {
        setActiveSale(null);
        setShowCelebration(false);
      }, 5000);

      // Re-schedule next sale
      scheduleNext();
    };

    const scheduleNext = () => {
      const min = Math.max(0.1, simulatedSalesMinMin);
      const max = Math.max(min, simulatedSalesMaxMin);
      const delayMs = (Math.random() * (max - min) + min) * 60 * 1000;
      timeoutId = setTimeout(triggerSimulatedSale, delayMs);
    };

    // First trigger after random delay
    scheduleNext();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [simulatedSalesEnabled, simulatedSalesMinMin, simulatedSalesMaxMin, simulatedSalesSound, simulatedSalesSoundUrl, trendingProducts]);

  const forceTriggerSimulatedSale = () => {
    if (trendingProducts.length === 0) return;
    const buyerNames = [
      'Felipe Alencar', 'Juliana Mendes', 'Rodrigo Silva', 
      'Gabriel Oliveira', 'Amanda Rocha', 'Carla Souza', 
      'Lucas Pereira', 'Sofia Martins', 'Rafael Almeida', 'Bruna Dias', 
      'Gustavo Lima', 'Beatriz Ferreira', 'Matheus Ribeiro', 'Letícia Castro',
      'Pedro Albuquerque', 'Larissa Rezende', 'Fábio Guimarães', 'Camila Neves'
    ];
    const citiesList = [
      'São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG', 'Curitiba - PR', 
      'Porto Alegre - RS', 'Salvador - BA', 'Fortaleza - CE', 'Recife - PE', 
      'Manaus - AM', 'Brasília - DF', 'Campinas - SP', 'Goiânia - GO', 
      'Joinville - SC', 'Vitória - ES', 'Niterói - RJ', 'Florianópolis - SC'
    ];
    const product = trendingProducts[Math.floor(Math.random() * trendingProducts.length)];
    const buyerName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
    const rndCity = citiesList[Math.floor(Math.random() * citiesList.length)];

    // Trigger sound
    triggerSoundPlay();

    setActiveSale({
      buyer: buyerName,
      city: rndCity,
      productName: product.name
    });
    setShowCelebration(true);

    setTimeout(() => {
      setActiveSale(null);
      setShowCelebration(false);
    }, 5000);
  };

  // Fetch full backend states
  const refreshFullState = async () => {
    try {
      // Profile
      const pRes = await fetch('/api/profile');
      if (pRes.ok) {
        const pData = await pRes.json();
        setProfile(pData);
      }

      // Projects
      const prRes = await fetch('/api/projects');
      if (prRes.ok) {
        const prData = await prRes.json();
        if (projects.length === 0) {
          setProjects(prData);
        }
      }

      // Trending Products
      const tRes = await fetch('/api/trending-products');
      if (tRes.ok) {
        let tData = await tRes.json();

        setTrendingProducts(tData);
      }

      // Scripts
      const sRes = await fetch('/api/roteiros');
      if (sRes.ok) {
        const sData = await sRes.json();
        if (scripts.length === 0) {
          setScripts(sData);
        }
      }

      // Images
      const iRes = await fetch('/api/imagens');
      if (iRes.ok) {
        const iData = await iRes.json();
        if (images.length === 0) {
          setImages(iData);
        }
      }

      // Videos
      const vRes = await fetch('/api/videos');
      if (vRes.ok) {
        const vData = await vRes.json();
        if (videos.length === 0) {
          setVideos(vData);
        }
      }

      // Referrals
      const rRes = await fetch('/api/afiliados');
      if (rRes.ok) {
        const rData = await rRes.json();
        setReferrals(rData);
      }

    } catch (err) {
      console.error("Error fetching state from Express Backend API:", err);
    }
  };

  useEffect(() => {
    refreshFullState();

    // EventSource configuration for Real-time database updates
    const eventSource = new EventSource('/api/realtime');

    eventSource.onopen = () => {
      console.log("Realtime event connection streaming opened.");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Realtime state update event received:", data);
        
        // Dispatch real-time db change global event so specific sub-screens can reload their items
        window.dispatchEvent(new CustomEvent('realtime-db-update', { detail: data }));
        
        // Refresh the app's global state
        refreshFullState();
      } catch (err) {
        console.error("Error parsing realtime sse payload:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("Realtime stream connection closed or failed (will auto-reconnect).", err);
    };

    // Tracking logic: capture ?ref=CODIGO, save cookie for 30 days and register hit in backend
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      document.cookie = `ref=${refParam}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
      
      fetch('/api/afiliados/clique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: refParam })
      })
      .then(res => {
        if (res.ok) refreshFullState();
      })
      .catch(err => console.error("Error logging affiliate click:", err));
    }

    // Setup real-time Clock ticking (formatted beautifully)
    const tick = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const clockInterval = setInterval(tick, 1000);
    return () => {
      eventSource.close();
      clearInterval(clockInterval);
    };
  }, []);

  // Handlers
  const handleNavigate = (path: string, payload?: any) => {
    if (path === '/roteiros') {
      setRoteirosPreFill(payload);
    } else if (path === '/videos') {
      setVideosPreFill(payload);
    } else if (path === '/produtos') {
      if (payload?.initialMovementId) {
        setInitialMovementId(payload.initialMovementId);
      } else {
        setInitialMovementId(null);
      }
    }
    setCurrentPath(path);
    setSidebarOpen(false);
  };

  const handleAddProject = async (proj: any) => {
    const newProj = {
      id: proj.id || `proj-${Date.now()}`,
      name: proj.name || 'Nova Campanha',
      productName: proj.productName || '',
      url: proj.url || '',
      audience: proj.audience || '',
      pain: proj.pain || '',
      desire: proj.desire || '',
      created_at: new Date().toISOString()
    };
    setProjects(prev => [newProj, ...prev]);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });
      if (response.ok) {
        refreshFullState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTrendingProduct = async (prod: any) => {
    const newProd = {
      id: prod.id || `prod-${Date.now()}`,
      name: prod.name || 'Novo Produto',
      price: prod.price || 'R$ 0.00',
      sales_growth: prod.sales_growth || '+0%',
      image: prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300',
      category: prod.category || 'Geral',
      orderCount: prod.orderCount || 100,
      monthlyRevenue: prod.monthlyRevenue || 'R$ 10.000',
      growthRate: prod.growthRate || '10%',
      rating: prod.rating || 4.8,
      sourceUrl: prod.sourceUrl || '',
      created_at: new Date().toISOString()
    };
    setTrendingProducts(prev => [newProd, ...prev]);

    try {
      const response = await fetch('/api/trending-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd)
      });
      if (response.ok) {
        refreshFullState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMockReferral = async () => {
    try {
      const response = await fetch('/api/afiliados/mock', {
        method: 'POST'
      });
      if (response.ok) {
        refreshFullState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (name: string, email: string) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (response.ok) {
        refreshFullState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDatabase = async () => {
    try {
      const response = await fetch('/api/profile/reset', { method: 'POST' });
      if (response.ok) {
        refreshFullState();
        setCurrentPath('/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgradeComplete = (newPlan: 'free' | 'starter' | 'pro' | 'agency') => {
    setShowUpgradeModal(false);
    refreshFullState();
  };

  // Remaining credits subtraction calculations safely falling back to profile.credits_* if limits are undefined
  const remainingText = typeof profile.credits_text === 'number' && !isNaN(profile.credits_text)
    ? profile.credits_text
    : Math.max(0, (Number((profile as any).credits_text_limit) || 0) - (Number((profile as any).credits_text_used) || 0)) || 0;

  const remainingImage = typeof profile.credits_image === 'number' && !isNaN(profile.credits_image)
    ? profile.credits_image
    : Math.max(0, (Number((profile as any).credits_image_limit) || 0) - (Number((profile as any).credits_image_used) || 0)) || 0;

  const remainingVideo = typeof profile.credits_video === 'number' && !isNaN(profile.credits_video)
    ? profile.credits_video
    : Math.max(0, (Number((profile as any).credits_video_limit) || 0) - (Number((profile as any).credits_video_used) || 0)) || 0;

  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Produtos em Alta', icon: FolderOpen, path: '/produtos' },
    { name: 'Avatar Studio', icon: Users, path: '/influenciadores' },
    { name: 'Viralizar Perfil', icon: Flame, path: '/afiliados' },
    { name: 'Movimentos', icon: Sparkles, path: '/movimentos' },
    { name: 'Hooks/Ganchos', icon: BookOpen, path: '/biblioteca' },
    { name: 'Aulas', icon: GraduationCap, path: '/treinamentos' }
  ];

  // Helper to determine if a menu path is gated for the user's active plan
  const checkPathAccess = (path: string): { locked: boolean; minPlan?: string; reason?: string } => {
    const userPlan = (profile.plan || 'free').toLowerCase();
    
    // Admin route is always accessible for admin profile or manually toggled, we won't lock it
    if (path === '/admin') return { locked: false };
    
    if (path === '/videos') {
      if (userPlan === 'free') {
        return {
          locked: true,
          minPlan: 'Starter',
          reason: 'Geração inteligente de Vídeos Comerciais com roteiro integrado, dubladores realistas de IA e renders fluidos.'
        };
      }
    }
    
    if (path === '/projects') {
      if (userPlan === 'free') {
        return {
          locked: true,
          minPlan: 'Starter',
          reason: 'Estruturação profissional de Pastas de Campanhas para separar seus ganchos de anúncios e múltiplos produtos sem limite.'
        };
      }
    }
    
    return { locked: false };
  };

  if (isLanding) {
    return (
      <ScreenLanding
        onEnter={async (userData) => {
          const userRole = userData.role || ((userData.email === 'admin@gestaoprosaas.com' || userData.email === 'gestaoprosaas@gmail.com') ? 'admin' : 'client');
          const isAtivo = userData.ativo !== undefined ? userData.ativo : true;
          
          // Set local user profile with purchased plan specs
          setProfile((prev) => ({
            ...prev,
            name: userData.name,
            email: userData.email,
            plan: userData.plan,
            role: userRole,
            ativo: isAtivo,
            plano: userData.plan,
            creditos: userData.creditos !== undefined ? userData.creditos : (userData.credits_text || 0) + (userData.credits_image || 0) + (userData.credits_video || 0),
            credits_text: userData.credits_text !== undefined ? userData.credits_text : (userData.plan === 'starter' ? 50 : userData.plan === 'pro' ? 200 : 999),
            credits_text_limit: userData.plan === 'starter' ? 50 : userData.plan === 'pro' ? 200 : 999,
            credits_text_used: 0,
            credits_image: userData.credits_image !== undefined ? userData.credits_image : (userData.plan === 'starter' ? 30 : userData.plan === 'pro' ? 100 : 500),
            credits_image_limit: userData.plan === 'starter' ? 30 : userData.plan === 'pro' ? 100 : 500,
            credits_image_used: 0,
            credits_video: userData.credits_video !== undefined ? userData.credits_video : (userData.plan === 'starter' ? 3 : userData.plan === 'pro' ? 15 : 60),
            credits_video_limit: userData.plan === 'starter' ? 3 : userData.plan === 'pro' ? 15 : 60,
            credits_video_used: 0,
          }));

          try {
            // Update name, email and role on express server
            await fetch('/api/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: userData.name, 
                email: userData.email,
                role: userRole,
                ativo: isAtivo,
                plano: userData.plan
              })
            });

            // Set the correct plan with corresponding server-side credits
            await fetch('/api/profile/upgrade', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ plan: userData.plan })
            });

            // Persist Supabase integration keys globally
            await fetch('/api/admin/settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                supabase_url: userData.supabaseUrl,
                supabase_anon_key: userData.supabaseKey
              })
            });

            // Sync Express state to React UI
            await refreshFullState();
          } catch (err) {
            console.error("Error setting custom dashboard state on enter:", err);
          }

          setIsLanding(false);
        }}
      />
    );
  }

  // Se o plano estiver suspenso ou inativo, redireciona para a tela de plano expirado
  if (profile.ativo === false) {
    return (
      <div className="min-h-screen bg-[#06060B] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Cyber background decorations */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
          backgroundImage: `linear-gradient(to right, rgba(129, 62, 246, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(129, 62, 246, 0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-[20%] w-[30rem] h-[30rem] rounded-full bg-[#FE2C55]/5 blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-md w-full bg-[#0A0A14]/90 border border-[#FE2C55]/20 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#FE2C55]/10 border border-[#FE2C55]/30 flex items-center justify-center mx-auto mb-6 text-[#FE2C55] animate-pulse">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">
            Acesso Suspenso
          </h2>
          <p className="text-[#8888AA] text-sm leading-relaxed mb-6">
            O seu plano ou período de testes na plataforma <strong className="text-white">AI Flow</strong> expirou, foi cancelado ou não teve o pagamento confirmado pelo gateway.
          </p>

          <div className="bg-[#0E0E1B] border border-white/5 rounded-2xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-[#8888AA]">E-mail da Conta:</span>
              <span className="text-white font-mono font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-[#8888AA]">Último Plano:</span>
              <span className="text-[#813EF6] font-bold uppercase">{profile.plan || "Free"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8888AA]">Status:</span>
              <span className="text-[#FE2C55] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55] animate-ping" />
                Inativo
              </span>
            </div>
          </div>

          <a
            href="https://applyfy.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center h-12 rounded-2xl bg-gradient-to-r from-[#FE2C55] to-[#813EF6] text-white font-bold text-sm tracking-wide shadow-lg hover:brightness-110 transition mb-3"
          >
            Reativar Assinatura no Applyfy
          </a>

          <button
            onClick={() => {
              // Sign out from Supabase
              const client = getSupabase();
              if (client) {
                client.auth.signOut();
              }
              setIsLanding(true);
            }}
            className="w-full h-11 rounded-2xl bg-white/5 border border-white/10 text-[#8888AA] hover:text-white hover:bg-white/10 font-medium text-sm transition"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060B] text-[#F0F0FF] font-sans flex overflow-hidden relative">
      
      {/* Cyber Grid background + Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-45" style={{
        backgroundImage: `linear-gradient(to right, rgba(129, 62, 246, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(129, 62, 246, 0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-[10%] left-[20%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-tr from-[#813EF6]/6 via-[#FE2C55]/3 to-transparent blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] right-[10%] w-[45rem] h-[45rem] rounded-full bg-gradient-to-bl from-[#FE2C55]/4 via-[#813EF6]/5 to-transparent blur-[160px] pointer-events-none z-0" />

      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity cursor-pointer animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[240px] bg-[#0A0A13]/95 border-r border-[#18182D] flex flex-col justify-between transition-all duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          
          {/* Sidebar Header Brand with elegant Helix Logo */}
          <div className="h-16 px-6 border-b border-[#18182D]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FE2C55] to-[#813EF6] rounded-xl blur opacity-35 group-hover:opacity-75 transition duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-[#09090E] border border-white/10 flex items-center justify-center shadow-lg">
                  <svg className="w-5.5 h-5.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="logo-grad-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FE2C55" />
                        <stop offset="40%" stopColor="#813EF6" />
                        <stop offset="100%" stopColor="#69C9D0" />
                      </linearGradient>
                    </defs>
                    <path d="M30 65C30 75 40 85 50 85C65 85 75 75 75 60C75 45 60 40 50 35C40 30 25 25 25 15C25 5 40 5 50 15C60 25 70 35 70 50" stroke="url(#logo-grad-grad)" strokeWidth="11" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <span className="font-black text-white text-sm tracking-widest uppercase font-display bg-gradient-to-r from-white via-zinc-100 to-[#813EF6]/80 bg-clip-text text-transparent">
                AI FLOW
              </span>
            </div>
            
            {/* Mobile close menu trigger */}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#8888AA] hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menus List (Scrollable) */}
          <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
            {sidebarItems.map((item) => {
              const isActive = currentPath === item.path;
              const access = checkPathAccess(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] font-semibold transition duration-200 relative group cursor-pointer ${
                    isActive
                      ? 'bg-[#1C1C30] text-white border border-[#2B2B47] shadow-lg shadow-[#813EF6]/5'
                      : 'text-[#8888AA] hover:text-zinc-100 hover:bg-[#151525]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-[#813EF6]' : 'text-[#5C5C7A]'}`} />
                    <span>{item.name}</span>
                  </div>
                  
                  {/* Active glowing indicator light */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55] shadow-lg shadow-[#FE2C55]/60 absolute right-4" />
                  )}

                  {!isActive && access.locked && (
                    <Lock className="w-3 h-3 text-amber-500/80 shrink-0 absolute right-4" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Indique Amigos card module matching the screenshot layout */}
        <div className="px-4 py-1.5 shrink-0">
          <div className="bg-[#121223] border border-[#20203D] rounded-3xl p-3.5 flex items-center justify-between gap-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#903EF6]/4 to-[#FE2C55]/4 opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="space-y-0.5 relative z-10 select-none">
              <h4 className="text-xs font-bold text-white tracking-tight">Indique amigos</h4>
              <p className="text-[10px] text-[#78789A] font-medium leading-tight">Lucre ou presenteie amigos</p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`https://aiflow.com/?ref=${profile.affiliate_code || 'viral777'}`);
                alert("Link de indicação copiado para sua área de transferência! Compartilhe com amigos para acumular créditos adicionais.");
              }}
              className="w-8.5 h-8.5 rounded-xl bg-gradient-to-r from-[#813EF6]/15 to-[#FE2C55]/15 hover:from-[#813EF6]/30 hover:to-[#FE2C55]/30 border border-[#3A3266]/50 flex items-center justify-center transition shrink-0 relative z-10 hover:scale-105 active:scale-95"
              title="Copiar Link de Indicação"
            >
              <Gift className="w-4 h-4 text-[#FE2C55]" />
            </button>
          </div>
        </div>

        {/* Sidebar Footer Adjustment Buttons & Quota display */}
        <div className="p-4 border-t border-[#18182D]/80 flex flex-col gap-2.5 shrink-0 bg-[#07070F]/60">
          
          {/* Hidden/Discreet Developer Panel Access */}
          {profile.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleNavigate('/admin')}
              className="w-full text-left px-3 py-1 rounded-lg text-[10px] font-bold text-[#64648C] hover:text-amber-400 transition flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Módulo do Desenvolvedor</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsLanding(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-400 hover:text-red-300 hover:bg-[#1A0B11] transition font-semibold text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Dashboard</span>
            </button>
          </div>

          {/* Quick quotas metrics */}
          <div className="pt-2 flex items-center justify-between text-[9px] text-[#555577] font-sans font-semibold px-1 border-t border-zinc-900/40">
            <span>Roteiros Criados:</span>
            <strong className="text-zinc-400">
              {typeof profile.credits_text_used === 'number' ? profile.credits_text_used : Math.max(0, (profile.credits_text_limit ?? 10) - (profile.credits_text ?? 10))}/{profile.credits_text_limit ?? 10}
            </strong>
          </div>

        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header toolbar */}
        <header className="h-16 border-b border-[#18182D]/40 bg-[#06060B]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between relative z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile menu burger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1 bg-[#121223] text-white border border-[#20203D] rounded-lg hover:bg-[#1E1E2E] transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic Clock Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#8888AA] bg-[#0A0A13]/90 border border-[#18182D] rounded-full px-3.5 py-1">
              <Clock className="w-3.5 h-3.5 text-[#813EF6]" />
              <span>Hora Local: <strong className="text-zinc-200">{timeStr}</strong></span>
            </div>

            {currentPath === '/produtos' && (
              <div className="hidden md:flex items-center gap-3">
                <div className="h-4 w-px bg-[#1D1D3A]" />
                <span className="text-xs font-extrabold uppercase tracking-tight text-white">
                  Seu <span className="bg-gradient-to-r from-[#813EF6] via-[#FE2C55] to-[#25F4EE] bg-clip-text text-transparent">Produtos em Alta</span>
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25F4EE]/10 border border-[#25F4EE]/20 rounded-full text-[10px] font-black text-[#25F4EE] whitespace-nowrap animate-pulse">
                  <span>●</span> SINC. ATIVA DO TIKTOK SHOP
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Credit badge pill */}
            <CreditsBadge
              textCredits={remainingText}
              imageCredits={remainingImage}
              videoCredits={remainingVideo}
              onUpgradeClick={() => handleNavigate('/upgrade')}
            />

            {/* Navigation back and landing exit */}
            <button
              onClick={() => setIsLanding(true)}
              className="p-1.5 bg-[#111118] border border-[#1E1E2E] text-[#8888AA] hover:text-[#FF4D4D] rounded-lg transition"
              title="Voltar à Página de Vendas"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>

        </header>

        {/* Dynamic Content Panel area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative z-20">
          <div className="w-full max-w-[1800px] mx-auto">
            {checkPathAccess(currentPath).locked ? (
              <ScreenLockedFeature
                featureName={sidebarItems.find(item => item.path === currentPath)?.name || 'Recurso'}
                minPlan={checkPathAccess(currentPath).minPlan || 'Starter'}
                reason={checkPathAccess(currentPath).reason || ''}
                onUpgradeClick={() => handleNavigate('/upgrade')}
              />
            ) : (
              <>
                {currentPath === '/dashboard' && (
                  <ScreenDashboard
                    profile={profile}
                    projects={projects}
                    trendingProducts={trendingProducts}
                    scripts={scripts}
                    images={images}
                    videos={videos}
                    onNavigate={handleNavigate}
                    onUpgradeClick={() => handleNavigate('/upgrade')}
                    onNewCampaignClick={() => handleNavigate('/roteiros')}
                  />
                )}

                {currentPath === '/roteiros' && (
                  <ScreenRoteiros
                    scripts={scripts}
                    onScriptGenerated={(newS) => {
                      setScripts([newS, ...scripts]);
                      refreshFullState();
                    }}
                    onNavigate={handleNavigate}
                    initialPreFill={roteirosPreFill}
                  />
                )}

                {currentPath === '/imagens' && (
                  <ScreenImagens
                    images={images}
                    onImageGenerated={(newI) => {
                      setImages([newI, ...images]);
                      refreshFullState();
                    }}
                  />
                )}

                {currentPath === '/movimentos' && (
                  <ScreenMovimentos
                    onNavigate={handleNavigate}
                  />
                )}

                {currentPath === '/videos' && (
                  <ScreenVideos
                    videos={videos}
                    scripts={scripts}
                    onVideoGenerated={(newV) => {
                      setVideos([newV, ...videos]);
                      refreshFullState();
                    }}
                    initialPreFillState={videosPreFill}
                  />
                )}

                {currentPath === '/projects' && (
                  <ScreenProjetos
                    projects={projects}
                    onAddProject={handleAddProject}
                    onNavigate={handleNavigate}
                  />
                )}

                {currentPath === '/biblioteca' && (
                  <ScreenBiblioteca onNavigate={handleNavigate} />
                )}

                {currentPath === '/produtos' && (
                  <ScreenProdutos
                    onNavigate={handleNavigate}
                    trendingProducts={trendingProducts}
                    onAddProduct={handleAddTrendingProduct}
                    onRefresh={refreshFullState}
                    initialMovementId={initialMovementId}
                  />
                )}

                {currentPath === '/treinamentos' && (
                  <ScreenTreinamentos
                    profile={profile}
                    onNavigate={handleNavigate}
                  />
                )}

                {currentPath === '/influenciadores' && (
                  <TemplateGallery onNavigate={handleNavigate} />
                )}

                {currentPath === '/afiliados' && (
                  <ScreenViralizarPerfil
                    profile={profile}
                    onRefresh={refreshFullState}
                  />
                )}

                {currentPath === '/upgrade' && (
                  <ScreenUpgrade
                    profile={profile}
                    onRefreshProfile={refreshFullState}
                    onNavigate={handleNavigate}
                  />
                )}

                {currentPath === '/admin' && (
                  <ScreenAdmin
                    onNavigate={handleNavigate}
                    onRefreshProjectState={refreshFullState}
                    profile={profile}
                  />
                )}
              </>
            )}
          </div>
        </main>

      </div>

      {/* 3. SUBSCRIPTION MODAL PANEL Overlay */}
      {showUpgradeModal && (
        <UpgradeModal
          currentPlan={profile.plan}
          onUpgradeComplete={handleUpgradeComplete}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}

      {/* 4. VISUAL CELEBRATION FLOATING OVERLAYS */}
      <CelebrationConfetti active={showCelebration} />

      {activeSale && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-[#0B0B14]/95 border border-[#25F4EE]/40 rounded-3xl p-5 flex items-center gap-4 shadow-2xl shadow-[#25F4EE]/10 max-w-sm select-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#10B981]/25 to-[#25F4EE]/25 flex items-center justify-center border border-[#25F4EE]/30 text-[#25F4EE] shrink-0 animate-pulse">
            <Coins className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#25F4EE]">Notificação de Venda Live! 🔥</p>
            </div>
            <p className="text-xs font-black text-white truncate mt-1">{activeSale.buyer}</p>
            <p className="text-[10px] text-[#A0A0C0] truncate mt-0.5">{activeSale.city}</p>
            <p className="text-[11px] text-[#E0E0FF] truncate mt-1">
              Adquiriu: <span className="text-[#FE2C55] font-extrabold">{activeSale.productName}</span>
            </p>
          </div>

          <button 
            onClick={() => setActiveSale(null)} 
            className="text-[#8888AA] hover:text-white transition p-1.5 bg-[#1F1F2F]/80 hover:bg-[#2F2F3F]/80 rounded-xl border border-[#2E2E3E]/50 shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}

// Custom Premium Screen Block component for Strategy B (Option 2)
function ScreenLockedFeature({ 
  featureName, 
  minPlan, 
  reason, 
  onUpgradeClick 
}: { 
  featureName: string; 
  minPlan: string; 
  reason: string; 
  onUpgradeClick: () => void; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-xl mx-auto text-center space-y-6 animate-fade-in font-sans">
      <div className="relative">
        <div className="absolute inset-0 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none w-28 h-28 mx-auto" />
        <div className="w-20 h-20 rounded-2xl bg-[#111118] border border-[#7C3AED]/40 flex items-center justify-center mx-auto shadow-2xl relative z-10">
          <Lock className="w-9 h-9 text-amber-400 stroke-[2.5]" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] text-[#FE2C55] font-black uppercase tracking-widest block bg-[#FE2C55]/10 px-3.5 py-1.5 rounded-full border border-[#FE2C55]/20 w-fit mx-auto">
          Recurso Exclusivo
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight">Módulo {featureName} Bloqueado</h2>
        <p className="text-xs sm:text-sm text-[#8888AA] max-w-sm leading-relaxed mx-auto">
          Ah! Seu plano atual não possui acesso a esta funcionalidade. Faça upgrade para o plano <strong className="text-emerald-400 uppercase">{minPlan}</strong> ou superior para liberar instantaneamente!
        </p>
      </div>

      <div className="bg-[#111118]/85 border border-[#1E1E2E] rounded-2.5xl p-5 text-left w-full space-y-4 shadow-xl">
        <h4 className="text-xs font-black text-white uppercase tracking-wider">O que você desbloqueia nesse módulo:</h4>
        <ul className="space-y-3 text-[11px] text-[#A0A0C0]">
          <li className="flex items-start gap-2.5 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5 animate-pulse" />
            <span>{reason}</span>
          </li>
          <li className="flex items-start gap-2.5 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0 mt-1.5" />
            <span>Processamento premium de alta velocidade acoplado à inteligência proprietária.</span>
          </li>
          <li className="flex items-start gap-2.5 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shrink-0 mt-1.5" />
            <span>Aumento garantido de velocidade de mineração de criativos e retenção de público.</span>
          </li>
        </ul>
      </div>

      <button
        onClick={onUpgradeClick}
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-95 font-extrabold text-white rounded-xl text-xs sm:text-sm tracking-wide shadow-lg shadow-[#7C3AED]/25 flex items-center justify-center gap-2 group cursor-pointer transition active:scale-95 duration-100"
      >
        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 group-hover:scale-110 transition shrink-0" />
        Fazer Upgrade p/ {minPlan}
      </button>
    </div>
  );
}
