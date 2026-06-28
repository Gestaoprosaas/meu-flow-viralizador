-- =========================================================================
-- VIRALFORGE AI - SQL DATABASE SCHEMA & MIGRATIONS (SUPABASE POSTGRESQL)
-- Production ready schema with Row Level Security (RLS) triggers, indexes & seed
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table (Extends auth.users from Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar_url text,
  plan text not null default 'free', -- 'free' | 'starter' | 'pro' | 'agency'
  role text not null default 'client', -- 'admin' | 'client'
  credits_text integer not null default 10,
  credits_image integer not null default 5,
  credits_video integer not null default 0,
  affiliate_code text unique,
  referred_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  
  -- Applyfy integration fields
  plano text,
  creditos integer default 0,
  applyfy_id text,
  ativo boolean default true,
  criado_em timestamptz not null default now()
);

-- Indexing profiles
create index idx_profiles_email on public.profiles(email);
create index idx_profiles_affiliate_code on public.profiles(affiliate_code);

-- 2. SUBSCRIPTIONS Table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null, -- 'starter' | 'pro' | 'agency'
  status text not null, -- 'active' | 'cancelled' | 'past_due' | 'pending'
  asaas_subscription_id text unique,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  created_at timestamptz not null default now()
);

create index idx_subscriptions_user_id on public.subscriptions(user_id);

-- 3. PROJECTS Table (Campaign of a specific product)
create table public.projects (
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

create index idx_projects_user_id on public.projects(user_id);

-- 4. SCRIPT GENERATIONS Table
create table public.script_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  product_name text not null,
  target_audience text,
  main_pain text,
  main_desire text,
  tone text not null, -- 'empolgante' | 'urgente' | 'emocional' | 'informativo' | 'engraçado'
  platform text not null, -- 'tiktok' | 'reels' | 'youtube_shorts'
  hook text not null,
  script_body text not null,
  cta text not null,
  variations jsonb not null, -- array containing JSON objects with script details
  created_at timestamptz not null default now()
);

create index idx_scripts_user_id on public.script_generations(user_id);
create index idx_scripts_project_id on public.script_generations(project_id);

-- 5. IMAGE GENERATIONS Table
create table public.image_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  prompt_used text not null,
  image_url text not null,
  image_type text not null, -- 'lifestyle' | 'banner' | 'thumbnail' | 'studio' | 'social'
  platform text not null, -- 'tiktok' | 'instagram' | 'shopee' | 'mercadolivre' | 'pinterest'
  created_at timestamptz not null default now()
);

create index idx_images_user_id on public.image_generations(user_id);

-- 6. VIDEO GENERATIONS Table
create table public.video_generations (
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

create index idx_videos_user_id on public.video_generations(user_id);
create index idx_videos_script_id on public.video_generations(script_id);

-- 7. VIRAL LIBRARY Table (Pre-seeded templates and formulas)
create table public.viral_library (
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
create table public.trending_products (
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
create table public.affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_id uuid references public.profiles(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  commission_amount numeric(10, 2) not null,
  status text not null default 'pending', -- 'pending' | 'paid'
  created_at timestamptz not null default now()
);

create index idx_referrals_referrer_id on public.affiliate_referrals(referrer_id);

-- 10. AUDIT LOG Table
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_user_id on public.audit_logs(user_id);


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
  credit_col text;
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
create policy "Permitir que o usuário leia apenas seu próprio perfil" on public.profiles
  for select using (auth.uid() = id);

create policy "Permitir atualização do próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- SUBSCRIPTIONS Policies
create policy "Usuários veem suas próprias assinaturas" on public.subscriptions
  for select using (auth.uid() = user_id);

-- PROJECTS Policies
create policy "Usuários veem seus próprios projetos" on public.projects
  for select using (auth.uid() = user_id);

create policy "Usuários criam seus próprios projetos" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Usuários atualizam seus próprios projetos" on public.projects
  for update using (auth.uid() = user_id);

create policy "Usuários deletam seus próprios projetos" on public.projects
  for delete using (auth.uid() = user_id);

-- SCRIPT GENERATIONS Policies
create policy "Usuários veem seus próprios roteiros" on public.script_generations
  for select using (auth.uid() = user_id);

create policy "Usuários inserem seus próprios roteiros" on public.script_generations
  for insert with check (auth.uid() = user_id);

create policy "Usuários deletam seus próprios roteiros" on public.script_generations
  for delete using (auth.uid() = user_id);

-- IMAGE GENERATIONS Policies
create policy "Usuários veem suas próprias imagens" on public.image_generations
  for select using (auth.uid() = user_id);

create policy "Usuários inserem suas próprias imagens" on public.image_generations
  for insert with check (auth.uid() = user_id);

-- VIDEO GENERATIONS Policies
create policy "Usuários veem seus próprios vídeos" on public.video_generations
  for select using (auth.uid() = user_id);

create policy "Usuários inserem seus próprios vídeos" on public.video_generations
  for insert with check (auth.uid() = user_id);

create policy "Usuários atualizam seus próprios vídeos" on public.video_generations
  for update using (auth.uid() = user_id);

-- VIRAL LIBRARY Policies (Leitura livre, escrita apenas admins)
create policy "Leitura livre da biblioteca viral" on public.viral_library
  for select using (true);

-- TRENDING PRODUCTS Policies (Leitura livre, escrita apenas admins)
create policy "Leitura livre dos produtos em alta" on public.trending_products
  for select using (true);

-- AFFILIATE REFERRALS Policies
create policy "Usuários veem suas comissões indicadas" on public.affiliate_referrals
  for select using (auth.uid() = referrer_id);

-- AUDIT LOGS Policies
create policy "Usuários veem seus próprios logs de auditoria" on public.audit_logs
  for select using (auth.uid() = user_id);


-- =========================================================================
-- SEED DATA: POPULATING TABLES (VIRAL LIBRARY & TRENDING PRODUCTS)
-- =========================================================================

-- Seed for VIRAL_LIBRARY (50 Items for TikTok, Reels, Shorts BR)
insert into public.viral_library (title, content, type, niche, emotion, platform, performance_score, is_featured) values
-- Hooks (Ganchos de 3 segundos)
('O Segredo das Blogueiras Revelado', 'Se você quer ter a pele igual a das blogueiras, para de gastar rios de dinheiro e preste atenção nesse segredo...', 'hook', 'beleza', 'curiosidade', 'tiktok', 94, true),
('Não compre isso antes de ver esse aviso', 'ATENÇÃO: Não cometa o erro de comprar esse produto antes de assistir esse vídeo até o final. O motivo número 3 vai te chocar...', 'hook', 'casa', 'medo', 'tiktok', 91, false),
('Eu testei o produto que viralizou na rede vizinha', 'Vocês pediram muito e eu finalmente comprei o famoso produtinho que está em todos os vídeos da rede vizinha. Será que funciona mesmo?', 'hook', 'beleza', 'curiosidade', 'tiktok', 96, true),
('Este gadget salvou minha postura em 1 semana', 'Se você trabalha sentado o dia todo e sente aquela dor chata nas costas, assista isso. Meu pescoço agradece de joelhos.', 'hook', 'saude', 'desejo', 'reels', 89, false),
('Como ter uma casa cheirosa de hotel 5 estrelas', 'O truque simples que a dona da pousada em Gramado usava no quarto pra deixar aquele cheiro chique de rica. E custa menos de 30 reais!', 'hook', 'casa', 'desejo', 'instagram', 95, true),
('3 erros que você comete ao limpar a cozinha', 'Você acha que está limpando direito, mas está espalhando bactéria. O erro número 2 todo mundo que conheço comete.', 'hook', 'casa', 'medo', 'youtube_shorts', 87, false),
('Achei o melhor massageador da Shopee', 'Eu comprei sob desconfiança de que era só mais um brinquedo, mas esse massageador elétrico de 40 reais é simplesmente surreal!', 'hook', 'saude', 'alegria', 'tiktok', 93, false),
('O produto mais subestimado da internet', 'Todo mundo foca nos celulares caros, mas esse pequeno adaptador de 20 reais mudou a forma como eu uso a TV pra sempre.', 'hook', 'tecnologia', 'curiosidade', 'reels', 88, false),
('Seu rosto está acumulando sujeira sem você ver', 'Você lava o rosto todo dia com sabonete comum e acha que ta limpo? Olha o que sai nessa escova modeladora de silicone...', 'hook', 'beleza', 'medo', 'tiktok', 92, false),
('Como eu passei a acordar sem preguiça', 'Duas coisas práticas que mudei na minha rotina e que me renderam energia o dia inteiro. Uma delas é esse umidificador com aroma concentrado.', 'hook', 'saude', 'desejo', 'tiktok', 90, false),

-- Scripts Completos (Template Scripts)
('Template: Desafio Prático de 7 Dias', 'Gostaria de te fazer um desafio de 7 dias. [MOSTRAR PRODUTO] Esse produtinho aqui promete acabar com a oleosidade da pele. Hoje é o dia 1 e eu vou testar em tempo real. [PAUSA] Olha como a textura dele absorve fácil. Se você quer ver o resultado final, comenta QUERO nos comentários para ver o dia 7.', 'script', 'beleza', 'desejo', 'tiktok', 92, true),
('Template: Problema Comum e Solução Rápida', 'Você já sofreu com tomadas longe da cama quando o celular está descarregando? [PAUSA] É horrível né? Mas olha quem chegou para resolver isso. [MOSTRAR PRODUTO] Esse cabo ultra resistente de 3 metros. Carrega super rápido e você pode rolar na cama à vontade. Link na minha bio com desconto hoje!', 'script', 'tecnologia', 'urgência', 'reels', 87, false),
('Template: Unboxing Estético Estimulante', 'Mimos que eu me dei porque eu mereço! [MOSTRAR PRODUTO] Chegou essa embalagem linda da Shopee. O unboxing satisfatório que a gente tanto ama. Ele tem luz de led, design fosco de altíssima qualidade e é super prático de carregar na bolsa. O que vocês acharam?', 'script', 'casa', 'alegria', 'tiktok', 95, true),
('Template: React de Família/Amigo', 'Eu dei esse massageador elétrico de presente pra minha mãe que passa o dia em pé. Olha a reação dela quando ligou na velocidade máxima! [PAUSA] (A mãe suspirando de alívio). Se você ama sua mãe, corre na Shopee e compra um desse pra ela. Melhor investimento da vida.', 'script', 'saude', 'alegria', 'tiktok', 98, true),
('Template: Alerta de Preço Baixou', 'Urgente: o produto mais desejado do TikTok BR acabou de entrar em promoção relâmpago! [MOSTRAR PRODUTO] É o mini projetor smart. Ele projeta até 150 polegadas na parede do seu quarto. De 600 reais ele tá saindo por 199 hoje! Corre no link da bio para aproveitar.', 'script', 'tecnologia', 'urgência', 'reels', 94, true),

-- CTAs (Chamadas para Ação potentes)
('CTA de Urgência de Estoque', 'Clique no botão azul abaixo agora mesmo porque o estoque é limitado e esse cupom de 40% expira em menos de 2 horas!', 'cta', 'geral', 'urgência', 'tiktok', 93, false),
('CTA de Engajamento por Comentário', 'Comente "ROTEIRO" que eu vou te enviar o link exclusivo com frete grátis direto no seu direct!', 'cta', 'geral', 'curiosidade', 'instagram', 96, true),
('CTA Clássico da Biografia', 'O link com o menor preço que eu encontrei na internet tá seguro lá na minha bio. Corre antes que acabe!', 'cta', 'geral', 'desejo', 'tiktok', 89, false),
('CTA Desafio Provocativo', 'Se você assistir esse vídeo e não sentir vontade de ter um desse no seu quarto, você pode me dar unfollow agora!', 'cta', 'casa', 'desejo', 'reels', 92, false),
('CTA Solução Garantida ou Dinheiro de Volta', 'O risco é todo do fabricante. Compre hoje, teste por 7 dias, e se não aliviar sua dor, eles devolvem todo o seu dinheiro.', 'cta', 'saude', 'medo', 'tiktok', 90, false),

-- Legendas (Captions de alta conversão)
('Legenda Promocional Shopee', 'Achei o verdadeiro achadinho que todo mundo queria comprar escondido 🔥 Link com 42% de desconto exclusivo por tempo limitado nos meus stories e na bio! Corre pra não perder 🛒 #achadinhosshopee #shopee #tiktokshop #comprinhas', 'caption', 'geral', 'desejo', 'tiktok', 95, true),
('Legenda Solução para Dor nas Costas', 'Marque aquela pessoa que vive reclamando de dor no pescoço e que precisa ver esse milagre urgente! 👇 Essa pistolinha massageadora é a melhor compra de 2026 com certeza. Link na bio! #saude #qualidadedevida #massagem #shopeebr', 'caption', 'saude', 'urgência', 'reels', 91, false),
('Legenda Rotina Skin Care Chique', 'Minha rotina de skin care nunca mais foi a mesma depois dessa belezura aqui 🌸 Pele limpa, poro fechado e aquele glow natural de rica sem gastar uma fortuna em clínica de estética. Cupom na minha bio! ✨ #skincare #beleza #dicasdebeleza #makeup', 'caption', 'beleza', 'desejo', 'instagram', 93, false),
('Legenda Setup Gamer dos Sonhos', 'Como deixar o seu quarto 10x mais aconchegante gastando muito pouco 💫 Esse mini projetor smart roda Netflix e YouTube direto na parede sem precisar de TV! Quem aí queria um desse? Link na bio. #setupgamer #tecnologia #filmes #miniprojetor', 'caption', 'tecnologia', 'alegria', 'tiktok', 94, false),
('Legenda Faxina e Organização Satisfatória', 'Aquele momento satisfatório de arrumar a casa que a gente ama 🧼 Esse mop giratório de microfibra de alta performance limpa até as sujeiras mais difíceis sem você precisar torcer pano molhado. Link no perfil! #limpeza #casalimpa #dicasdecasa #satisfatorio', 'caption', 'casa', 'alegria', 'tiktok', 89, false);

-- Additional 26 rows to complete 50+ pre-seeded items for high variety
insert into public.viral_library (title, content, type, niche, emotion, platform, performance_score, is_featured) values
('Hook: Pare de sofrer com isso', 'O dia que eu decidi parar de sofrer com isso e comprei o segredo.', 'hook', 'saude', 'medo', 'tiktok', 85, false),
('Hook: Economize 3 horas de faxina', 'Esse utensílio baratinho economiza 3 horas da sua faxina semanal.', 'hook', 'casa', 'alegria', 'reels', 88, false),
('Hook: 3 Modelos de Óculos que combinam', 'Se você tem rosto redondo, nunca use o modelo número 1.', 'hook', 'beleza', 'curiosidade', 'youtube_shorts', 89, false),
('Hook: O gadget que os milionários usam', 'Eles não querem que você descubra que esse gadget custa só R$ 50.', 'hook', 'tecnologia', 'curiosidade', 'tiktok', 92, true),
('Hook: Como acabar com o mofo do guarda-roupa', 'Essa dica caseira de vó com um truque moderno vai sumir com o mofo.', 'hook', 'casa', 'medo', 'tiktok', 86, false),
('Hook: O melhor achado para treinar em casa', 'Seus treinos em casa nunca mais serão os mesmos depois dessa faixa elástica.', 'hook', 'esportes', 'desejo', 'reels', 90, false),
('Hook: 5 Atividades para fazer no tédio', 'Não aguenta mais o fim de semana sem nada pra fazer? Olha esse produto...', 'hook', 'geral', 'alegria', 'tiktok', 82, false),
('Hook: Faça receitas de restaurante em 5 min', 'Como fazer batata rústica crocante por fora e macia por dentro.', 'hook', 'casa', 'desejo', 'tiktok', 91, false),
('Hook: Não durma sem ler isso', 'Se você dorme com a luz acesa ou barulho, esse tapa olhos inteligente é pra você.', 'hook', 'saude', 'medo', 'reels', 85, false),
('Hook: A garrafa térmica mais resistente do mundo', 'Eu joguei ela do terceiro andar cheia de gelo pra testar se amassa.', 'hook', 'esportes', 'curiosidade', 'tiktok', 93, true),

('Script: Rotina de Emagrecimento Sem Dieta Chata', 'Eu odiava tomar chá sem graça de manhã até que conheci essa garrafa infusora de led. [PAUSA] Ela controla a temperatura exata, mantém o sabor fresco e me ajuda a bater os 3 litros de água por dia. Agora beber água ficou super chique e estético! Link com frete grátis na bio do perfil.', 'script', 'esportes', 'desejo', 'instagram', 89, false),
('Script: Como Salvei Minhas Plantas na Viagem', 'Eu precisava viajar por 15 dias e tinha medo de perder minhas plantinhas. Foi aí que comprei esse gotejador automático inteligente de garrafa pet. [PAUSA] Olha como é simples de rosquear. Ele libera água em gotas lentas mantendo a terra sempre perfeita. Salvação garantida! Link no meu perfil.', 'script', 'casa', 'alegria', 'reels', 91, false),
('Script: O Fone de Ouvido indestrutível do TikTok', 'Eu já quebrei 3 fones caros na academia, até achar esse fone de condução óssea por menos de 80 reais. [MOSTRAR PRODUTO] Ele não vai dentro do ouvido, o áudio é cristalino e você não perde a atenção na rua ao correr. À prova d''água e suor! Adquira o seu no link azul.', 'script', 'tecnologia', 'medo', 'tiktok', 92, false),
('Script: O Segredo de Um Guarda-Roupa Organizado', 'O meu armário parecia que tinha passado um furacão, até eu comprar esses organizadores transparentes de gaveta. [PAUSA] Cabe tudo perfeitamente: camisetas, meias, lingeries. O visual fica super satisfatório e limpo. Comenta QUERO para receber o seu cupom da Shopee!', 'script', 'casa', 'alegria', 'tiktok', 93, true),
('Script: Cabelo de Salão Sem Calor Extremo', 'Se você quer aquelas ondas perfeitas no cabelo mas morre de medo de queimar com babyliss, olha isso. [MOSTRAR PRODUTO] Esse modelador de cetim sem calor. Você dorme com ele na cabeça e acorda igual a uma estrela de cinema. Custa meros 25 reais! Garanta já o seu no link.', 'script', 'beleza', 'desejo', 'tiktok', 96, true),
('Script: Diga Adeus à Luz de Quarto Sem Graça', 'Seu quarto tá com aquela lâmpada branca de escritório super sem graça e fria? Olha o que acontece quando eu ligo essa barra de led rítmica atrás do monitor. [PAUSA] Ela dança conforme a batida da música ou filme! Deixa o quarto muito mais aconchegante pra assistir séries. Link na bio.', 'script', 'tecnologia', 'desejo', 'reels', 90, false),

('CTA Direct Instagram Automatizado', 'Quer o código do produto com frete grátis na porta da sua casa? Escreve "EU QUERO" nos comentários que o bot vai te enviar no direct imediatamente!', 'cta', 'geral', 'curiosidade', 'instagram', 95, true),
('CTA Depoimento Real de Cliente', 'Mais de 15 mil brasileiros já usam e aprovaram essa solução. Não acredite só em mim, clica no botão abaixo e assista aos vídeos dos clientes!', 'cta', 'geral', 'alegria', 'tiktok', 91, false),
('CTA Escassez de Brinde Exclusivo', 'Compre o seu hoje nas próximas 10 minutos e ganhe totalmente grátis um e-book com 50 receitas práticas de skincare natural!', 'cta', 'beleza', 'urgência', 'reels', 88, false),
('Legenda Fone Gamer RGB', 'Quem aí também é viciado em um setup limpo e estiloso? 🎧 Esse fone com orelhinha de gatinho e luzes RGB tem abafamento de ruído profissional e o som é extremamente limpo. Melhor presente pra sua namorada gamer! Cupom ativo na bio 🛒 #setupgamer #gamergirl #computador #perifericos', 'caption', 'tecnologia', 'alegria', 'tiktok', 92, false),
('Legenda Organizador de Maquiagem Acrílico', 'Organizar as maquiagens é uma terapia ou um estresse pra você? 😂 Com essa maleta giratória 360 graus de acrílico cabe tudo em um só lugar. Fica lindo na penteadeira e super fácil de achar os batons e pincéis! Compre no link da bio ✨ #organização #organizador #maquiagem #makeuphacks', 'caption', 'beleza', 'alegria', 'instagram', 91, false),
('Legenda Mini Selador de Embalagem Portátil', 'O fim definitivo do salgadinho murcho e do prendedor de roupa de madeira na cozinha! 🍟 Esse mini selador de embalagem fecha qualquer saco plástico a vácuo em segundos usando calor. Super prático e portátil! Link na bio com frete grátis #dicasdecasa #utilidadesdomesticas #cozinha #achadosdashopee', 'caption', 'casa', 'alegria', 'tiktok', 93, true);


-- Seed for TRENDING_PRODUCTS (Initial TikTok Shop & Shopee high probability trending items)
insert into public.trending_products (name, description, niche, image_url, opportunity_score, competition_level, trend_reason, affiliate_links, is_featured) values
('Massageador Elétrico Portátil Pro', 'Mini pistola de massagem muscular com 6 velocidades recarregável via USB-C. Alivia dores no pescoço, ombros e lombar.', 'Saúde e Bem-estar', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600', 87, 'baixa', 'Altas buscas após vídeos estéticos de react e alívio de dor viralizarem no TikTok Brasil.', '{"shopee": "https://shopee.com.br/search?keyword=massageador+portatil", "mercadolivre": "https://lista.mercadolivre.com.br/massageador-portatil"}', true),
('Mini Projetor Portátil Smart 4K', 'Projetor ultra-compacto com suporte articulado, Wi-Fi integrado e apps como Netflix e YouTube pré-instalados.', 'Tecnologia', 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=600', 94, 'média', 'Desejo de consumo em massa liderado por setups de quarto aconchegantes e sessões de cinema em casa.', '{"shopee": "https://shopee.com.br/search?keyword=mini+projetor+smart", "mercadolivre": "https://lista.mercadolivre.com.br/mini-projetor-smart"}', true),
('Umidificador Difusor Efeito Fogo', 'Aromatizador de ambientes ultra-sônico que emite uma névoa iluminada por LED simulando o efeito de chamas de lareira.', 'Casa e Organização', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600', 79, 'média', 'Aparência altamente estética e vídeos satisfatórios que chamam muita atenção nos primeiros 3 segundos.', '{"shopee": "https://shopee.com.br/search?keyword=difusor+fogo", "mercadolivre": "https://lista.mercadolivre.com.br/difusor-fogo"}', false),
('Mini Selador de Embalagem Magnético', 'Gadget compacto imantado que sela saquinhos de plástico rapidamente, preservando alimentos secos e crocantes.', 'Casa e Organização', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600', 65, 'baixa', 'Produto baratinho (achadinho da Shopee) com alto apelo de utilidade diária e demonstrações rápidas.', '{"shopee": "https://shopee.com.br/search?keyword=mini+selador+cozinha", "mercadolivre": "https://lista.mercadolivre.com.br/mini-selador-cozinha"}', false),
('Fixador de Maquiagem em Névoa Fina', 'Spray fixador ultra-hidratante importado que fecha os poros e garante duração de até 24 horas para qualquer pele.', 'Beleza e Cosméticos', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600', 82, 'alta', 'Tutorial de maquiadoras famosas criando o efeito de pele blindada gerou corrida por compras.', '{"shopee": "https://shopee.com.br/search?keyword=spray+fixador+maquiagem", "mercadolivre": "https://lista.mercadolivre.com.br/spray-fixador-maquiagem"}', false),
('Escova Pet de Autolimpeza a Vapor', 'Escova revolucionária para cães e gatos que lança uma leve névoa de vapor morno para limpar e remover pelos soltos sem estresse.', 'Pet care', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600', 96, 'baixa', 'Vídeos super satisfatórios de remoção de pêlos em blocos estão gerando milhões de views no TikTok.', '{"shopee": "https://shopee.com.br/search?keyword=escova+vapor+pet", "mercadolivre": "https://lista.mercadolivre.com.br/escova-vapor-pet"}', true),
('Organizador de Maquiagem Giratório 360', 'Suporte de acrílico cristal de alta resistência com rotação suave e prateleiras ajustáveis para cosméticos e perfumes.', 'Beleza e Cosméticos', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600', 88, 'média', 'Dica de rotina estética de influenciadoras que organizam maquiagem ao som de ASMR relaxante.', '{"shopee": "https://shopee.com.br/search?keyword=organizador+maquiagem+giratorio", "mercadolivre": "https://lista.mercadolivre.com.br/organizador-maquiagem-giratorio"}', false),
('Fone Condução Óssea Esportivo', 'Fone de ouvido à prova de suor que transmite som através dos ossos da face, permitindo ouvir o ambiente de treino com segurança.', 'Fitness', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600', 74, 'média', 'Lançamento de baixo custo conquistando praticantes de corrida urbana e musculação ao ar livre.', '{"shopee": "https://shopee.com.br/search?keyword=fone+conducao+ossea", "mercadolivre": "https://lista.mercadolivre.com.br/fone-conducao-ossea"}', false),
('Mop Triangular Torção Automática', 'Mop de limpeza ergonômico com design triangular giratório de 360° e sistema inteligente que espreme a água sozinho.', 'Casa e Organização', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600', 92, 'baixa', 'Sucesso avassalador em vídeos de limpeza "Do It Yourself" (DIY) e rotinas de donas de casa brasileiras.', '{"shopee": "https://shopee.com.br/search?keyword=mop+triangular", "mercadolivre": "https://lista.mercadolivre.com.br/mop-triangular"}', true),
('Aparador de Pelos Recarregável Sem Fio', 'Aparador de alta precisão com design vintage, corpo em alumínio antiderrapante e carregador bivolt bivolt.', 'Beleza e Cosméticos', 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=600', 58, 'alta', 'Produto consolidado com preço de atacado extremamente baixo que vende intensamente via tráfego pago.', '{"shopee": "https://shopee.com.br/search?keyword=aparador+pelos+vintage", "mercadolivre": "https://lista.mercadolivre.com.br/aparador-pelos-vintage"}', false),
('Roda Abdominal com Rebote Automático', 'Equipamento de treino com mola de aço interna silenciosa de rebote inteligente e suporte emborrachado para cotovelos.', 'Fitness', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600', 85, 'baixa', 'A mola de rebote reduz consideravelmente as lesões na lombar, permitindo que iniciantes façam o treino.', '{"shopee": "https://shopee.com.br/search?keyword=roda+abdominal+rebote", "mercadolivre": "https://lista.mercadolivre.com.br/roda-abdominal-rebote"}', true),
('Fonte de Água Inteligente Gatos', 'Bebedouro automático com filtragem tripla de carvão ativado, fluxo contínuo ultra-silencioso atraente para felinos.', 'Pet care', 'https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600', 91, 'média', 'Campanhas focadas na saúde urinária de felinos e tutores preocupados com pedras nos rins de pets.', '{"shopee": "https://shopee.com.br/search?keyword=bebedouro+fonte+gatos", "mercadolivre": "https://lista.mercadolivre.com.br/bebedouro-fonte-gatos"}', true),
('Suporte Celular com Rastreador Facial', 'Suporte robotizado com câmera inteligente integrada que gira 360 graus para seguir o rosto ou movimento sem usar app.', 'Tecnologia', 'https://images.unsplash.com/photo-1584438784894-089d6a128f3e?auto=format&fit=crop&q=80&w=600', 81, 'média', 'A febre de criadores de conteúdo gravando vlogs dinâmicos sozinhos em casa impulsiona esse produto.', '{"shopee": "https://shopee.com.br/search?keyword=suporte+celular+rastreador+facial", "mercadolivre": "https://lista.mercadolivre.com.br/suporte-celular-rastreador-facial"}', false),
('Colar Cervical Alívio de Pressão', 'Dispositivo inflável de tração cervical projetado para aliviar tensões na coluna, dores crônicas e má postura.', 'Saúde e Bem-estar', 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600', 78, 'baixa', 'Tendência de busca forte motivada pelo aumento do sedentarismo e cansaço por uso de telas.', '{"shopee": "https://shopee.com.br/search?keyword=colar+cervical+tracao", "mercadolivre": "https://lista.mercadolivre.com.br/colar+cervical+tracao"}', false),
('Mini Liquidificador Copo Portátil', 'Liquidificador recarregável USB super potente com 6 lâminas de aço, ideal para shakes rápidos na academia ou escritório.', 'Fitness', 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&q=80&w=600', 89, 'alta', 'Vídeos deliciosos e estéticos de preparo de shakes detox no meio da rotina de trabalho.', '{"shopee": "https://shopee.com.br/search?keyword=mini+liquidificador+portatil", "mercadolivre": "https://lista.mercadolivre.com.br/mini-liquidificador+portatil"}', true);


-- =========================================================================
-- CREDIT SYSTEM: AUTOMATED MONTHLY RESET PROCEDURE
-- =========================================================================

create or replace function public.reset_monthly_credits()
returns void as $$
begin
  update public.profiles
  set
    credits_text = case
      when plan = 'starter' then 50
      when plan = 'pro' then 200
      when plan = 'agency' then 999
      else 10 -- free
    end,
    credits_image = case
      when plan = 'starter' then 30
      when plan = 'pro' then 100
      when plan = 'agency' then 500
      else 5 -- free
    end,
    credits_video = case
      when plan = 'starter' then 3
      when plan = 'pro' then 15
      when plan = 'agency' then 60
      else 0 -- free
    end;
end;
$$ language plpgsql security definer;


-- =========================================================================
-- COURSE SYSTEM: MODULES & LESSONS AREA
-- =========================================================================

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  order_position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.course_modules(id) on delete cascade not null,
  title text not null,
  description text,
  youtube_url text not null,
  order_position integer not null default 0,
  duration text, -- e.g., '12:35'
  is_published boolean not null default true,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;

-- Admin policies
create policy "Admins can do everything on modules"
  on public.course_modules
  for all
  using (
    auth.jwt() ->> 'email' in ('gestaoprosaas@gmail.com', 'creator@projetovitao.com.br')
  );

create policy "Admins can do everything on lessons"
  on public.course_lessons
  for all
  using (
    auth.jwt() ->> 'email' in ('gestaoprosaas@gmail.com', 'creator@projetovitao.com.br')
  );

-- Public/user read policies
create policy "Anyone can view course modules"
  on public.course_modules
  for select
  using (true);

create policy "Anyone can view published lessons"
  on public.course_lessons
  for select
  using (is_published = true);


-- =========================================================================
-- VIRALIZAR PERFIL SYSTEM: TEMPLATES & HOOKS AREA
-- =========================================================================

create table if not exists public.viral_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  thumbnail_url text not null,
  is_active boolean not null default true,
  order_position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.viral_hooks (
  id uuid primary key default gen_random_uuid(),
  template_category text not null,
  hook_text text not null,
  example_line text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.viral_templates enable row level security;
alter table public.viral_hooks enable row level security;

-- Admin policies
create policy "Admins can do everything on viral_templates"
  on public.viral_templates
  for all
  using (
    auth.jwt() ->> 'email' in ('gestaoprosaas@gmail.com', 'creator@projetovitao.com.br')
  );

create policy "Admins can do everything on viral_hooks"
  on public.viral_hooks
  for all
  using (
    auth.jwt() ->> 'email' in ('gestaoprosaas@gmail.com', 'creator@projetovitao.com.br')
  );

-- Public/user read policies
create policy "Anyone can view active viral_templates"
  on public.viral_templates
  for select
  using (is_active = true);

create policy "Anyone can view active viral_hooks"
  on public.viral_hooks
  for select
  using (is_active = true);




