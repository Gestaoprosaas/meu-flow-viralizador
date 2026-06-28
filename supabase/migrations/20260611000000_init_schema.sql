-- Migration: Initialize schema for ViralForge AI
-- Date: 2026-06-11
-- Target: Supabase / PostgreSQL

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table (Extends auth.users from Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar_url text,
  plan text not null default 'free', -- 'free' | 'starter' | 'pro' | 'agency'
  credits_text integer not null default 10,
  credits_image integer not null default 5,
  credits_video integer not null default 0,
  affiliate_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_affiliate_code on public.profiles(affiliate_code);

-- 2. SUBSCRIPTIONS Table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null, -- 'starter' | 'pro' | 'agency'
  status text not null, -- 'active' | 'cancelled' | 'past_due' | 'pending'
  asaas_subscription_id text unique,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- 3. PROJECTS Table (Campaign of a specific product)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  product_name text not null,
  product_description text,
  target_audience text,
  niche text,
  status text not null default 'active', -- 'active' | 'archived'
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_user_id on public.projects(user_id);

-- 4. SCRIPT GENERATIONS Table
create table if not exists public.script_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  product_name text not null,
  target_audience text,
  main_pain text,
  main_desire text,
  tone text not null, -- 'empolgante' | 'urgente' | 'emocional' | 'docente' | 'engraçado'
  platform text not null, -- 'tiktok' | 'reels' | 'youtube_shorts'
  hook text not null,
  script_body text not null,
  cta text not null,
  variations jsonb not null, -- array of variations
  created_at timestamptz not null default now()
);

create index if not exists idx_scripts_user_id on public.script_generations(user_id);
create index if not exists idx_scripts_project_id on public.script_generations(project_id);

-- 5. IMAGE GENERATIONS Table
create table if not exists public.image_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  prompt_used text not null,
  image_url text not null,
  image_type text not null, -- 'lifestyle' | 'banner' | 'thumbnail' | 'studio' | 'social'
  platform text not null, -- 'tiktok' | 'instagram' | 'shopee' | 'mercadolivre' | 'pinterest'
  created_at timestamptz not null default now()
);

create index if not exists idx_images_user_id on public.image_generations(user_id);

-- 6. VIDEO GENERATIONS Table
create table if not exists public.video_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  script_id uuid references public.script_generations(id) on delete set null,
  status text not null default 'processing', -- 'processing' | 'completed' | 'failed'
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  provider text not null, -- 'kling' | 'runway' | 'elevenlabs_tts'
  created_at timestamptz not null default now()
);

create index if not exists idx_videos_user_id on public.video_generations(user_id);
create index if not exists idx_videos_script_id on public.video_generations(script_id);

-- 7. VIRAL LIBRARY Table (Pre-seeded templates and formulas)
create table if not exists public.viral_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  type text not null, -- 'hook' | 'script' | 'cta' | 'caption'
  niche text, -- 'geral' | 'beleza' | 'tecnologia' | 'esportes' | 'casa' | 'saude'
  emotion text, -- 'urgência' | 'curiosidade' | 'medo' | 'desejo' | 'alegria'
  platform text not null default 'tiktok',
  performance_score integer not null default 0, -- 0 to 100
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- 8. TRENDING PRODUCTS Table
create table if not exists public.trending_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  niche text not null,
  image_url text not null,
  opportunity_score integer not null, -- 0 - 100
  competition_level text not null, -- 'baixa' | 'média' | 'alta'
  trend_reason text not null,
  affiliate_links jsonb not null, -- { "shopee": "...", "mercadolivre": "..." }
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- 9. AFFILIATE REFERRALS Table
create table if not exists public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_id uuid references public.profiles(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  commission_amount numeric(10, 2) not null,
  status text not null default 'pending', -- 'pending' | 'paid'
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_referrer_id on public.affiliate_referrals(referrer_id);

-- 10. AUDIT LOG Table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_user_id on public.audit_logs(user_id);


-- =========================================================================
-- DATABASE TRIGGERS, AUTOMATIONS & FUNCTIONS
-- =========================================================================

-- Function to handle profile creation when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  ref_code text;
  referrer_user_id uuid;
  metadata_ref text;
begin
  -- Generate a random unique affiliate code (6 upper characters/numbers)
  ref_code := upper(substring(md5(random()::text) from 1 for 6));
  
  -- Exclude duplicates
  while exists(select 1 from public.profiles where affiliate_code = ref_code) loop
    ref_code := upper(substring(md5(random()::text) from 1 for 6));
  end loop;

  -- Check if there's a referrer (stored in raw_user_meta_data by Supabase Auth client)
  metadata_ref := new.raw_user_meta_data->>'referred_by_code';
  if metadata_ref is not null then
    select id into referrer_user_id from public.profiles where affiliate_code = metadata_ref;
  end if;

  insert into public.profiles (
    id,
    name,
    email,
    avatar_url,
    plan,
    credits_text,
    credits_image,
    credits_video,
    affiliate_code,
    referred_by,
    created_at
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', substring(new.email from '^[^@]+')),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'),
    'free',
    10, -- 10 text credits free
    5,  -- 5 image credits free
    0,  -- 0 video credits free
    ref_code,
    referrer_user_id,
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users sign up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Function to decrement credits safely via RPC
create or replace function public.decrement_credit(
  user_id uuid,
  credit_type text
)
returns boolean as $$
declare
  updated_rows integer;
begin
  if credit_type = 'text' then
    update public.profiles
    set credits_text = credits_text - 1
    where id = user_id and credits_text > 0;
  elsif credit_type = 'image' then
    update public.profiles
    set credits_image = credits_image - 1
    where id = user_id and credits_image > 0;
  elsif credit_type = 'video' then
    update public.profiles
    set credits_video = credits_video - 1
    where id = user_id and credits_video > 0;
  else
    raise exception 'Tipo de crédito inválido: %', credit_type;
  end if;

  get diagnostics updated_rows = row_count;
  return updated_rows > 0;
end;
$$ language plpgsql security definer;


-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.script_generations enable row level security;
alter table public.image_generations enable row level security;
alter table public.video_generations enable row level security;
alter table public.viral_library enable row level security;
alter table public.trending_products enable row level security;
alter table public.affiliate_referrals enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES Policies
create policy "Profiles select broad" on public.profiles for select using (true);
create policy "Profiles update personal" on public.profiles for update using (auth.uid() = id);

-- SUBSCRIPTIONS Policies
create policy "Subscriptions select personal" on public.subscriptions for select using (auth.uid() = user_id);

-- PROJECTS Policies
create policy "Projects select personal" on public.projects for select using (auth.uid() = user_id);
create policy "Projects insert personal" on public.projects for insert with check (auth.uid() = user_id);
create policy "Projects update personal" on public.projects for update using (auth.uid() = user_id);
create policy "Projects delete personal" on public.projects for delete using (auth.uid() = user_id);

-- SCRIPT GENERATIONS Policies
create policy "Scripts select personal" on public.script_generations for select using (auth.uid() = user_id);
create policy "Scripts insert personal" on public.script_generations for insert with check (auth.uid() = user_id);
create policy "Scripts delete personal" on public.script_generations for delete using (auth.uid() = user_id);

-- IMAGE GENERATIONS Policies
create policy "Images select personal" on public.image_generations for select using (auth.uid() = user_id);
create policy "Images insert personal" on public.image_generations for insert with check (auth.uid() = user_id);

-- VIDEO GENERATIONS Policies
create policy "Videos select personal" on public.video_generations for select using (auth.uid() = user_id);
create policy "Videos insert personal" on public.video_generations for insert with check (auth.uid() = user_id);
create policy "Videos update personal" on public.video_generations for update using (auth.uid() = user_id);

-- VIRAL LIBRARY Policies
create policy "Library select broad" on public.viral_library for select using (true);

-- TRENDING PRODUCTS Policies
create policy "Trending select broad" on public.trending_products for select using (true);

-- AFFILIATE REFERRALS Policies
create policy "Referrals select personal" on public.affiliate_referrals for select using (auth.uid() = referrer_id);

-- AUDIT LOGS Policies
create policy "Audit select personal" on public.audit_logs for select using (auth.uid() = user_id);
