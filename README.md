# ViralForge AI 🚀

Plataforma SaaS premium de Inteligência Artificial para infoprodutores, afiliados de elite, e sellers especializados do TikTok Shop Brasil, Instagram Reels e YouTube Shorts. O ViralForge AI transforma qualquer link ou descrição de produto de e-commerces (Shopee, AliExpress, Mercado Livre, etc.) em campanhas de marketing de alta retenção contendo roteiros persuasivos adaptados, criativos de imagem comerciais estéticos e locuções profissionais sintetizadas em menos de 3 minutos.

---

## 🛠️ Stack Tecnológica

O projeto foi estruturado com ferramentas modernas de alta fidelidade e modularidade:

*   **Frontend Framework:** React (Next.js 14/15 App Router)
*   **Styling:** Tailwind CSS com design minimalista, alta densidade, temas com tons escuros e cinza profundo ("Cosmic Slate")
*   **Animações:** Framer Motion (importado através do pacote performático de transições `motion/react`)
*   **Banco de Dados & Autenticação:** Supabase (PostgreSQL) com suporte a Row Level Security (RLS)
*   **APIs de IA Generativas:**
    *   **Textos & Copywriting:** OpenAI API (GPT-4o) + Google Gemini API (modelo `gemini-2.5-flash` para fallback de alta performance)
    *   **Imágenes:** OpenAI DALL-E 3 + Gemini Imagen-3 para síntese hiper-realista em proporções dinâmicas (9:16 vertical, 16:9 horizontal, 1:1 quadrado)
    *   **Áudio (TTS):** ElevenLabs API (Voices brasileiras humanizadas com apelo comercial)
*   **Processamento de Vídeo:** Geração estruturada em banco com Jobs integrados ao **Kling AI** e webhook automatizado de callbacks
*   **Gateways de Pagamento:** Integração de assinaturas recorrentes via **Asaas API**

---

## 📋 Pré-requisitos

Para instalar, configurar e colocar em produção o ViralForge AI localmente ou em servidores na nuvem, você precisará de:

1.  **Node.js** (v18.x ou v20.x recomendados) e gerenciador de pacotes `npm`.
2.  Uma conta ativa no **Supabase** para banco de dados relacional e autenticação.
3.  Contas e chaves de API configuradas para:
    *   **Google AI Studio** (Gemini Key)
    *   **OpenAI Developer** (OpenAI Key para GPT-4o e DALL-E 3)
    *   **ElevenLabs** (para as locuções realistas)
    *   **Asaas** (Ambiente Homologação/Sandbox ou Produção)

---

## ⚙️ Instalação Passo a Passo

### 1. Clonar e Instalar Dependências
No seu terminal de comando, execute:

```bash
# Navegue até a pasta do projeto
cd viralforge-ai

# Instale os módulos npm requisitados pelo Next.js
npm install
```

### 2. Configurar Variáveis de Ambiente
Duplique o arquivo `.env.example` e renomeie-o para `.env.local` na raiz do seu projeto:

```bash
cp .env.example .env.local
```

Abra o arquivo `.env.local` e preencha as variáveis correspondentes com suas credenciais:

```env
# 1. Supabase BaaS Setup
NEXT_PUBLIC_SUPABASE_URL="https://sua-url-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anonima"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"

# 2. APIs de Inteligência Artificial
GEMINI_API_KEY="AIzaSy..." # Chave obtida no Google AI Studio
OPENAI_API_KEY="sk-proj-..." # Chave OpenAI Platform
ELEVENLABS_API_KEY="el-api-..." # Chave ElevenLabs Console
KLING_API_KEY="kl-..." # Opcional: Provedor adicional de geração de vídeo

# 3. Gateway de Pagamentos Asaas
ASAAS_API_KEY="asaas_api_key_aqui"
ASAAS_WEBHOOK_SECRET="assinatura_sha_token_webhook"

# 4. Envio de E-mail (Resend)
RESEND_API_KEY="re-..."

# 5. URLs do Contexto da Aplicação
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Executando Localmente

Para instanciar o servidor de desenvolvimento Next.js:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo em execução.

---

## 🗄️ Configuração do Supabase (Database & Auth)

Para inicializar todo o ecossistema relacional do Supabase, siga estes passos:

1.  Aceda ao painel administrativo do **Supabase Console** e selecione o seu projeto.
2.  Vá até a aba **SQL Editor** na barra de navegação esquerda.
3.  Crie um novo query copiando e executando integralmente o arquivo disponível em `/supabase/schema.sql`.

Este script realiza de forma automatizada:
*   Ativação da extensão `uuid-ossp` para geração de ids seguros.
*   Criação das tabelas centrais:
    *   `public.profiles` (estendendo a tabela auth nativa com créditos, indicações d0 programa de afiliados, email e plano atual).
    *   `public.subscriptions` (armazenando faturas integradas do Asaas).
    *   `public.projects` (campanhas de produtos agregados).
    *   `public.script_generations` (dados do copy gerador de roteiros).
    *   `public.image_generations` (registros de criativos e buckets correspondentes).
    *   `public.video_generations` (jobs assíncronos e status de renderização).
    *   `public.viral_library` / `public.trending_products` (bibliotecas nativas e produtos quentes minerados).
*   Configuração do trigger `on_auth_user_created` que detecta novos cadastros na plataforma e insere automaticamente uma linha em `public.profiles` com créditos de boas-vindas: texto (10), imagem (5), vídeo (0).
*   Configuração de segurança **Row Level Security (RLS)** em todas as tabelas para proteger dados privados de usuários diferentes.
*   Criação da função PostgreSQL `decrement_credit(...)` acionada por RPC nos servidores para gerenciar consumo e dedução segura de limites de créditos na conta.

### Configurar Bucket de Storage (Imagens)
Para armazenar as fotos comerciais geradas pelas APIs sem expirar URLs temporárias de terceiros:
1.  Vá em **Storage** no seu painel do Supabase.
2.  Crie um novo Bucket chamado `images`.
3.  Configure o Bucket como **Public** para permitir visualização de links diretos na tela.

---

## 🤖 Importação Automática de Produtos Kalodata (Opcional - Windows/Homologação)

Para automatizar a busca de produtos em alta no **Kalodata** utilizando sua própria sessão ativa no **Opera Browser** (conectando ao navegador já aberto para evitar detecção de robôs ou telas de login extras):

1. **Abra o Opera Browser com a Flag de Depuração**:
   Feche todas as janelas do Opera e abra-o a partir do prompt de comando do Windows (cmd) ou execute com as opções de depuração habilitadas:
   ```cmd
   "C:\Users\TOTIS\AppData\Local\Programs\Opera\opera.exe" --remote-debugging-port=9222
   ```
   *(Nota: Certifique-se de que o caminho do executável do Opera corresponda ao do seu sistema).*

2. **Instalar Dependências localmente**:
   ```bash
   npx playwright install chromium
   ```

3. **Rodar Script de Teste**:
   Com o Opera já aberto e logado na sua conta Kalodata na porta `9222`, execute:
   ```bash
   npx ts-node scripts/importar-kalodata.ts
   ```
   O script usará a mesma aba logada para fazer a extração de forma invisível e humana!

4. **Agendar Atualização Diária Automática (No Windows)**:
   Abra a pasta `scripts/` e execute o arquivo `agendar-importacao.bat`. 
   Isso registrará a tarefa diária às **08:00 AM** para atualizar a base de produtos do ViralForge.

---

### Passo 1: Preparar o Repositório
Certifique-se de realizar o commit de todos os arquivos relevantes para um repositório privado ou público no GitHub.

### Passo 2: Importar para a Vercel
1.  Acesse o painel da **Vercel** ([vercel.com](https://vercel.com)).
2.  Clique em **"Add New"** > **"Project"** e importe seu repositório.
3.  Em **Build and Output Settings**, garanta que o preset esteja definido como **Next.js**.
4.  No campo **Environment Variables**, adicione exatamente os mesmos pares de chave e valor configurados no seu `.env.local` de produção (use HTTPS reais do seu domínio no `APP_URL` e `NEXT_PUBLIC_APP_URL`).
5.  Clique em **Deploy**.

---

## 🌐 Documentação das APIs (Endpoints internos)

Abaixo estão detalhados os contratos de APIs que gerenciam a Inteligência Artificial e integrações no backend do ViralForge AI:

### 1. Gerador de Roteiro Viral (`POST /api/gerar-roteiro`)
Analisa as configurações de público e as propostas comerciais do produto para estruturar roteiros dinâmicos.

*   **Método:** `POST`
*   **Garante Proteção:** Sim (Requer sessão autenticada com cookies do Supabase e deduz **1 crédito de texto** do perfil).
*   **Parâmetros de Request Body (JSON):**
    ```json
    {
      "productName": "Garrafa Térmica Inteligente com Display Led",
      "description": "Garrafa com display que mostra a temperatura ideal do café na hora e conserva por até 24 horas fria ou quente.",
      "targetAudience": "Profissionais de escritório e estudantes universitários",
      "mainPain": "Café esfria rápido e falta de caneca moderna de trabalho",
      "mainDesire": "Bebida na temperatura ideal o dia todo com acabamento estético sofisticado",
      "tone": "empolgante",
      "platform": "tiktok",
      "duration": "30s",
      "projectId": "uuid-do-projeto-opcional"
    }
    ```

*   **Exemplo de Resposta de Sucesso (`200 OK`):**
    ```json
    {
      "success": true,
      "script": {
        "id": "7fbd2608-8e69",
        "productName": "Garrafa Térmica Inteligente com Display Led",
        "hook": "Você não vai acreditar no segredo que essa garrafa esconde! Display inteligente que resolve sua rotina... 😱",
        "scriptBody": "[NARRADOR APONTA PARA A TELA DISPLAY LED DA GARRAFA] Olha a temperatura desse café aparecendo em tempo real com um toque! [CENA RAPIDA DE TRANSICAO COM ZOOM] Chega de beber café com gosto de geladeira e garrafa plástica feia na sua mesa de trabalho de escritório. Veja isso de pertinho...",
        "cta": "Clique agora no carrinho de compras fixado no final do vídeo antes que o estoque com frete grátis termine!",
        "variations": {
          "alternate_hook_1": "Não use essa garrafa com display se você odeia chocar todo mundo no trabalho! ⚠️",
          "alternate_cta_1": "Comente QUERO que envio o cupom exclusivo!",
          "alternate_hook_2": "Eu joguei todas as minhas garrafas térmicas clássicas no lixo depois de testar isso..."
        },
        "platform": "tiktok"
      },
      "creditsLeft": 9
    }
    ```

---

### 2. Gerador de Imagens Comerciais (`POST /api/gerar-imagem`)
Gera composições de produtos estéticos ambientados de acordo com o público-alvo.

*   **Método:** `POST`
*   **Garante Proteção:** Sim (Deduz **quantidade requisitada** de créditos de imagem do perfil do usuário).
*   **Parâmetros de Request Body (JSON):**
    ```json
    {
      "productName": "Fone de Ouvido Noise Cancelling Pro",
      "style": "Studio", // "Lifestyle" | "Studio" | "Influenciador" | "Banner" | "Thumbnail"
      "platform": "tiktok", // Redimensiona proporção ("tiktok"/"instagram" = 9:16 | "youtube" = 16:9 | outro = 1:1)
      "dominantColor": "Midnight Blue",
      "notes": "Premium cushions, reflections of neon pink and ice blue workspace setup in background.",
      "quantity": 1, // Range aceitável: 1 a 4 por requisição
      "projectId": "uuid-do-projeto-opcional"
    }
    ```

*   **Exemplo de Resposta de Sucesso (`200 OK`):**
    ```json
    {
      "success": true,
      "images": [
        {
          "id": "e2cd3aae-1144",
          "url": "https://sua-url-projeto.supabase.co/storage/v1/object/public/images/user123/17154212-0.jpg",
          "productName": "Fone de Ouvido Noise Cancelling Pro",
          "style": "Studio",
          "platform": "tiktok",
          "createdAt": "2026-06-11T12:00:00Z"
        }
      ],
      "creditsLeft": 4
    }
    ```

---

### 3. Gerador & Renderizador de Vídeos Comerciais (`POST /api/gerar-video`)
Enfileira criação de dublagem profissional e sincroniza com canais visuais cinematic stock.

*   **Método:** `POST`
*   **Garante Proteção:** Sim (Deduz **1 crédito de vídeo** do perfil).
*   **Parâmetros de Request Body (JSON):**
    ```json
    {
      "scriptText": "Se você sofre de insônia ou vive cansado, esse fone inteligente vai mudar suas noites. Coloque agora e veja por si mesmo.",
      "scriptId": "uuid-do-roteiro-gerado",
      "voiceId": "Rachel", // ID ou nome da voz brasileira selecionada na ElevenLabs
      "visualStyle": "Cinematográfico", // "Realista" | "Anime" | "3D Render" | "Cinematográfico"
      "musicBackground": "None",
      "subtitlesEnabled": true,
      "projectId": "uuid-do-projeto-opcional"
    }
    ```

*   **Exemplo de Resposta de Sucesso (`200 OK` - Retorno Síncrono de Fila de Processamento):**
    ```json
    {
      "success": true,
      "jobId": "f9ad3108-c892",
      "status": "processing",
      "creditsLeft": 2,
      "message": "Vídeo enfileirado com sucesso para renderização."
    }
    ```

---

### 4. Webhooks Ativos

#### A. Webhook de Retorno do Kling Video AI (`POST /api/webhook/video`)
Acionado assincronamente em segundo plano quando o motor neural de renderização de imagem/vídeo Kling AI e ElevenLabs finalizam a exportação do arquivo físico.

*   **Método:** `POST`
*   **Cabeçalho Requerido:** `Content-Type: application/json`
*   **Parâmetros do Payload (JSON):**
    ```json
    {
      "jobId": "f9ad3108-c892",
      "status": "completed", // "completed" | "failed"
      "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smart-phone-with-a-blue-screen-40150-large.mp4",
      "error": null
    }
    ```
*   **Resposta:** `{"success": true}` com atualização correspondente da coluna `status` de `video_generations` para `completed` e liberação de visualização no Dashboard.

#### B. Webhook de Faturamento Asaas (`POST /api/webhook/asaas`)
Recebe notificações do Asaas atualizando planos de assinaturas de membros para liberar cargas mensais de créditos.

*   **Método:** `POST`
*   **Proteção de Integração:** Token de verificação assinado enviado no cabeçalho `Asaas-Signature`.
*   **Exemplo de Payload Resumido:**
    ```json
    {
      "event": "PAYMENT_RECEIVED",
      "payment": {
        "subscription": "sub_asaas_unique_code",
        "value": 197.00
      }
    }
    ```
*   **Processamento interno:** Localiza o usuário associado, atualiza o status de assinatura para `active` e adiciona os créditos correspondentes ao plano pago (Starter = 50 créditos texto / Pro = 200 créditos texto, etc.).

---

## 🎯 Checklist Completo de Deploy para Produção

Evite imprevistos configurando todas as pontes externas corretas antes de abrir as vendas oficiais.

### 1. No Supabase (Produção)
* [ ] Executou integralmente o arquivo `/supabase/schema.sql`.
* [ ] Ativou o provedor de autenticação por E-mail (Supabase Auth > Providers), e desabilitou "Confirm Email" caso deseje uma experiência instantânea sem bloqueio, ou personalizou os e-mails com seu domínio corporativo.
* [ ] Configurou o Bucket **images** como **Public** na aba de Storage.
* [ ] Ajustou o limite máximo aceitável de upload de arquivos no bucket para acomodar imagens geradas em alta definição.

### 2. Na Vercel (Produção)
* [ ] Vinculou o repositório oficial no painel e importou as variáveis de ambiente sem erros ortográficos.
* [ ] Certificou-se de que `APP_URL` e `NEXT_PUBLIC_APP_URL` apontam exatamente para `https://seudominio.com` (sem barra no final).
* [ ] Verificou se a variável `NODE_ENV` está definida como `production` para fins de compilação otimizada do Next.js.

### 3. No Gateway Asaas (Produção)
* [ ] Concluiu o cadastro e homologação da conta jurídica no Asaas para faturamento via PIX e Cartão de Crédito.
* [ ] Gerou a chave `ASAAS_API_KEY` dentro das configurações de integração no painel da conta oficial do Asaas (fora do Sandbox).
* [ ] Configurou a URL de Webhook no painel da Asaas apontando para: `https://seudominio.com/api/webhook/asaas`.
* [ ] Copiou o token de chave de segurança do webhook gerado no painel da Asaas e inseriu na variável `ASAAS_WEBHOOK_SECRET` do seu deploy.

### 4. Nas Ferramentas de Inteligência Artificial (AI Consoles)
* [ ] **Google AI Studio:** Garantiu que sua chave possui cota ativa (faturamento vinculado) para o modelo `gemini-2.5-flash-001` no Brasil.
* [ ] **OpenAI Developer:** Carregou créditos (pagamento antecipado) na plataforma do OpenAI para evitar quedas por "Quota exceeded" (erros 429) no modelo `gpt-4o` e `dall-e-3`.
* [ ] **ElevenLabs Console:** Selecionou e testou as vozes comerciais desejadas e adicionou créditos na plataforma para garantir que as dublagens de alta fidelidade não sofram pausas no meio de campanhas.

---

Este projeto foi construído focando na máxima agilidade, mantendo designs estéticos, elegantes e com interações de alto nível visual para maximizar suas conversões e lucros nas redes! 💸🔥
