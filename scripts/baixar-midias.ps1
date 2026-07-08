# Script PowerShell para baixar todas as mídias do Supabase Storage
# Execute no PowerShell dentro da pasta do projeto: .\scripts\baixar-midias.ps1

Write-Host "Criando estrutura de pastas..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "public\images\avatares" | Out-Null
New-Item -ItemType Directory -Force -Path "public\images\cenarios" | Out-Null
New-Item -ItemType Directory -Force -Path "public\images\produtos" | Out-Null
New-Item -ItemType Directory -Force -Path "public\videos\avatares" | Out-Null
New-Item -ItemType Directory -Force -Path "public\videos\movimentos" | Out-Null
New-Item -ItemType Directory -Force -Path "public\videos\templates" | Out-Null

Write-Host "Pastas criadas!" -ForegroundColor Green
Write-Host "Iniciando downloads..." -ForegroundColor Cyan

$downloads = @(
  # AVATARES - FOTOS
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/download%20(4).jpg"; dest = "public\images\avatares\download (4).jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/3133fe6dd9542230f3731a6b67ac4920.jpg"; dest = "public\images\avatares\3133fe6dd9542230f3731a6b67ac4920.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/ca14bd71d632c9236a520ba2d7e850f2.jpg"; dest = "public\images\avatares\ca14bd71d632c9236a520ba2d7e850f2.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Aline.jpg"; dest = "public\images\avatares\Aline.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Carlos.jpg"; dest = "public\images\avatares\Carlos.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Helen.jpg"; dest = "public\images\avatares\Helen.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Igor.jpg"; dest = "public\images\avatares\Igor.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Jhon.jpg"; dest = "public\images\avatares\Jhon.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Julia.jpg"; dest = "public\images\avatares\Julia.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/julio.jpg"; dest = "public\images\avatares\julio.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Naty.jpg"; dest = "public\images\avatares\Naty.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Rafah.jpg"; dest = "public\images\avatares\Rafah.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES%20DAS%20ETAPAS/Sabrina.jpg"; dest = "public\images\avatares\Sabrina.jpg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/LOIRA%20NO%20CARRO%20PREMIUM.PNG"; dest = "public\images\avatares\LOIRA NO CARRO PREMIUM.PNG" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/MORENA%20SELFIE%20NO%20ESPELHO.PNG"; dest = "public\images\avatares\MORENA SELFIE NO ESPELHO.PNG" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/RUIVA%20NO%20APARTAMENTO.PNG"; dest = "public\images\avatares\RUIVA NO APARTAMENTO.PNG" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/RUIVA%20RESTAURANTE.PNG"; dest = "public\images\avatares\RUIVA RESTAURANTE.PNG" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Loira%20No%20Aeroporto.PNG"; dest = "public\images\avatares\Loira No Aeroporto.PNG" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Loira%20Na%20Academia.PNG"; dest = "public\images\avatares\Loira Na Academia.PNG" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Homem%20Carro%20Premium.png"; dest = "public\images\avatares\Homem Carro Premium.png" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Homem%20Academia.png"; dest = "public\images\avatares\Homem Academia.png" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Empresario%20Jovem.png"; dest = "public\images\avatares\Empresario Jovem.png" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Mulher%20Cobertura%20Moderna.png"; dest = "public\images\avatares\Mulher Cobertura Moderna.png" },

  # AVATARES - VIDEOS
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Beijo%20+%20CTA.mp4"; dest = "public\videos\avatares\Beijo + CTA.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Tapar%20Camera.mp4"; dest = "public\videos\avatares\Tapar Camera.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Person_presenting_clothing_POV_202606281521.mp4"; dest = "public\videos\avatares\Person_presenting_clothing_POV_202606281521.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/360%20CONTROLADO.mp4"; dest = "public\videos\avatares\360 CONTROLADO.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/Girl_stepping_forward_with_clothing_202606281557.mp4"; dest = "public\videos\avatares\Girl_stepping_forward_with_clothing_202606281557.mp4" },

  # CENARIOS - FOTOS
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.04.13.jpeg"; dest = "public\images\cenarios\WhatsApp Image 2026-06-28 at 14.04.13.jpeg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.18.04.jpeg"; dest = "public\images\cenarios\WhatsApp Image 2026-06-28 at 14.18.04.jpeg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.21.jpeg"; dest = "public\images\cenarios\WhatsApp Image 2026-06-28 at 14.31.21.jpeg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.21%20(1).jpeg"; dest = "public\images\cenarios\WhatsApp Image 2026-06-28 at 14.31.21 (1).jpeg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.31.22%20(1).jpeg"; dest = "public\images\cenarios\WhatsApp Image 2026-06-28 at 14.31.22 (1).jpeg" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/AVATARES/WhatsApp%20Image%202026-06-28%20at%2014.42.14.jpeg"; dest = "public\images\cenarios\WhatsApp Image 2026-06-28 at 14.42.14.jpeg" },

  # MOVIMENTOS - VIDEOS
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/animacaonatural.mp4"; dest = "public\videos\movimentos\animacaonatural.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/colocando%20capus.mp4"; dest = "public\videos\movimentos\colocando capus.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta1.mp4"; dest = "public\videos\movimentos\cta1.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta2.mp4"; dest = "public\videos\movimentos\cta2.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/cta3.mp4"; dest = "public\videos\movimentos\cta3.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/gancho%20normal.mp4"; dest = "public\videos\movimentos\gancho normal.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/mexendo%20cabelo.mp4"; dest = "public\videos\movimentos\mexendo cabelo.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/pacote%20tiktok.mp4"; dest = "public\videos\movimentos\pacote tiktok.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/ULTRA%20REALISTA%20MEXENDO%20CABELO.mp4"; dest = "public\videos\movimentos\ULTRA REALISTA MEXENDO CABELO.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/VIRANDO%20DE%20COSTA.mp4"; dest = "public\videos\movimentos\VIRANDO DE COSTA.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/VIDEOS%20MOVIMENTOS/ziper.mp4"; dest = "public\videos\movimentos\ziper.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/TEMPLATES%20DOS%20TIPOS%20DE%20VIDEOS/movimento.mp4"; dest = "public\videos\movimentos\movimento.mp4" },

  # TEMPLATES - VIDEOS
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/TEMPLATES%20DOS%20TIPOS%20DE%20VIDEOS/POV.mp4"; dest = "public\videos\templates\POV.mp4" },
  @{ url = "https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/TEMPLATES%20DOS%20TIPOS%20DE%20VIDEOS/ssstik.io_%40stacy.spark.ai_1783121504467.mp4"; dest = "public\videos\templates\ssstik.io_@stacy.spark.ai_1783121504467.mp4" }
)

$total = $downloads.Count
$atual = 0
$erros = @()

foreach ($item in $downloads) {
  $atual++
  $fileName = Split-Path $item.dest -Leaf
  Write-Host "[$atual/$total] Baixando: $fileName" -ForegroundColor Yellow
  
  try {
    $destDir = Split-Path $item.dest -Parent
    if (!(Test-Path $destDir)) {
      New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    }
    
    if (Test-Path $item.dest) {
      Write-Host "  → Já existe, pulando." -ForegroundColor DarkGray
    } else {
      Invoke-WebRequest -Uri $item.url -OutFile $item.dest -UseBasicParsing
      Write-Host "  → OK!" -ForegroundColor Green
    }
  } catch {
    Write-Host "  → ERRO: $($_.Exception.Message)" -ForegroundColor Red
    $erros += $item.dest
  }
}

Write-Host ""
Write-Host "============================" -ForegroundColor Cyan
Write-Host "Download concluído!" -ForegroundColor Green
Write-Host "Total: $total arquivos" -ForegroundColor White
Write-Host "Erros: $($erros.Count)" -ForegroundColor $(if ($erros.Count -eq 0) { "Green" } else { "Red" })

if ($erros.Count -gt 0) {
  Write-Host ""
  Write-Host "Arquivos com erro:" -ForegroundColor Red
  $erros | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Write-Host ""
Write-Host "Agora rode: git add public/ && git commit -m 'Adicionar midias locais' && git push" -ForegroundColor Cyan
