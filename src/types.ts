/**
 * ViralSeller - TypeScript Core Platform Types
 */

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  role?: 'superadmin' | 'admin' | 'client' | 'loading';
  credits_text: number;
  credits_image: number;
  credits_video: number;
  affiliate_code: string;
  referred_by: string | null;
  applyfy_starter_url?: string;
  applyfy_pro_url?: string;
  created_at: string;
  
  // Applyfy fields
  plano?: string;
  creditos?: number;
  ativo?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'starter' | 'pro' | 'agency';
  status: 'active' | 'cancelled' | 'past_due' | 'pending';
  asaas_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  product_name: string;
  product_description: string;
  target_audience: string;
  niche: string;
  status: 'active' | 'archived';
  created_at: string;
}

export interface ScriptGeneration {
  id: string;
  user_id: string;
  project_id?: string;
  product_name: string;
  target_audience: string;
  main_pain: string;
  main_desire: string;
  tone: 'empolgante' | 'urgente' | 'emocional' | 'informativo' | 'engraçado';
  platform: 'tiktok' | 'reels' | 'youtube_shorts';
  hook: string;
  script_body: string;
  cta: string;
  variations: {
    hook: string;
    script_completo: string;
    cta: string;
    legenda_sugerida: string;
  }[];
  tips?: string[];
  legenda_sugerida?: string;
  created_at: string;
}

export interface ImageGeneration {
  id: string;
  user_id: string;
  project_id?: string;
  prompt_used: string;
  image_url: string;
  image_type: 'lifestyle' | 'banner' | 'thumbnail' | 'studio' | 'social';
  platform: 'tiktok' | 'instagram' | 'shopee' | 'mercadolivre' | 'pinterest';
  product_name?: string;
  created_at: string;
}

export interface VideoGeneration {
  id: string;
  user_id: string;
  project_id?: string;
  script_id?: string;
  status: 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  provider: 'kling' | 'runway' | 'elevenlabs_tts';
  config?: {
    voice: string;
    visual_style: string;
    bg_music: string;
    subtitles: boolean;
  };
  created_at: string;
}

export interface ViralTemplate {
  id: string;
  title: string;
  content: string;
  type: 'hook' | 'script' | 'cta' | 'caption';
  niche: string;
  emotion: string;
  platform: string;
  performance_score: number;
  is_featured: boolean;
  created_at: string;
}

export interface TrendingProduct {
  id: string;
  name: string;
  description: string;
  niche: string;
  image_url: string;
  opportunity_score: number;
  competition_level: 'baixa' | 'média' | 'alta';
  trend_reason: string;
  affiliate_links: {
    tiktok?: string;
    shopee: string;
    mercadolivre: string;
  };
  is_featured: boolean;
  created_at: string;
  sales_30d?: number;
  revenue_30d?: number;
  average_price?: number;
  commission_percentage?: number;
  viral_videos_count?: number;
  total_views?: string;
  trend_score_fastmoss?: number;
}

export interface AffiliateReferral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referred_email_masked: string;
  subscription_id?: string;
  plan_subscribed?: string;
  commission_amount: number;
  status: 'pending' | 'paid';
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  metadata: any;
  created_at: string;
}
