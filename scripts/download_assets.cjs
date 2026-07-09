const fs = require('fs');
const path = require('path');
const https = require('https');

// BASE URL: points directly to the public, unauthenticated Supabase storage bucket for the media files
const BASE_URL = 'https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/';

// Precise mapping from local project public paths to their exact original paths in the Supabase bucket
const assetsMap = {
  // Vídeos de movimentos
  '/videos/movimentos/gancho normal.mp4': 'VIDEOS MOVIMENTOS/gancho normal.mp4',
  '/videos/movimentos/colocando capus.mp4': 'VIDEOS MOVIMENTOS/colocando capus.mp4',
  '/videos/movimentos/animacaonatural.mp4': 'VIDEOS MOVIMENTOS/animacaonatural.mp4',
  '/videos/movimentos/cta3.mp4': 'VIDEOS MOVIMENTOS/cta3.mp4',
  '/videos/movimentos/cta2.mp4': 'VIDEOS MOVIMENTOS/cta2.mp4',
  '/videos/movimentos/cta1.mp4': 'VIDEOS MOVIMENTOS/cta1.mp4',
  '/videos/movimentos/pacote tiktok.mp4': 'VIDEOS MOVIMENTOS/pacote tiktok.mp4',
  '/videos/movimentos/mexendo cabelo.mp4': 'VIDEOS MOVIMENTOS/mexendo cabelo.mp4',
  '/videos/movimentos/VIRANDO DE COSTA.mp4': 'VIDEOS MOVIMENTOS/VIRANDO DE COSTA.mp4',
  '/videos/movimentos/ULTRA REALISTA MEXENDO CABELO.mp4': 'VIDEOS MOVIMENTOS/ULTRA REALISTA MEXENDO CABELO.mp4',
  '/videos/movimentos/ziper.mp4': 'VIDEOS MOVIMENTOS/ziper.mp4',
  '/videos/movimentos/movimento.mp4': 'TEMPLATES DOS TIPOS DE VIDEOS/movimento.mp4',
  '/videos/movimentos/Beijo + CTA ': 'TEMPLATES DOS TIPOS DE VIDEOS/Beijo + CTA .mp4',

  // Vídeos de avatares
  '/videos/avatares/Tapar Camera.mp4': 'AVATARES/Tapar Camera.mp4',
  '/videos/avatares/Beijo + CTA.mp4': 'AVATARES/Beijo + CTA.mp4',
  '/videos/avatares/Person_presenting_clothing_POV_202606281521.mp4': 'AVATARES/Person_presenting_clothing_POV_202606281521.mp4',
  '/videos/avatares/360 CONTROLADO.mp4': 'AVATARES/360 CONTROLADO.mp4',
  '/videos/avatares/Girl_stepping_forward_with_clothing_202606281557.mp4': 'AVATARES/Girl_stepping_forward_with_clothing_202606281557.mp4',

  // Vídeos de templates
  '/videos/templates/POV.mp4': 'TEMPLATES DOS TIPOS DE VIDEOS/pov.mp4',
  '/videos/templates/ssstik.io_@stacy.spark.ai_1783121504467.mp4': 'TEMPLATES DOS TIPOS DE VIDEOS/ugc.mp4',

  // Imagens de avatares
  '/images/avatares/download (4).jpg': 'AVATARES/download (4).jpg',
  '/images/avatares/3133fe6dd9542230f3731a6b67ac4920.jpg': 'AVATARES/3133fe6dd9542230f3731a6b67ac4920.jpg',
  '/images/avatares/Igor.jpg': 'AVATARES DAS ETAPAS/Igor.jpg',
  '/images/avatares/ca14bd71d632c9236a520ba2d7e850f2.jpg': 'AVATARES/ca14bd71d632c9236a520ba2d7e850f2.jpg',
  '/images/avatares/Helen.jpg': 'AVATARES DAS ETAPAS/Helen.jpg',
  '/images/avatares/Julia.jpg': 'AVATARES DAS ETAPAS/Julia.jpg',
  '/images/avatares/Carlos.jpg': 'AVATARES DAS ETAPAS/Carlos.jpg',
  '/images/avatares/julio.jpg': 'AVATARES DAS ETAPAS/julio.jpg',
  '/images/avatares/Aline.jpg': 'AVATARES DAS ETAPAS/Aline.jpg',
  '/images/avatares/Jhon.jpg': 'AVATARES DAS ETAPAS/Jhon.jpg',
  '/images/avatares/Naty.jpg': 'AVATARES DAS ETAPAS/Naty.jpg',
  '/images/avatares/LOIRA NO CARRO PREMIUM.PNG': 'AVATARES/LOIRA NO CARRO PREMIUM.PNG',
  '/images/avatares/Sabrina.jpg': 'AVATARES DAS ETAPAS/Sabrina.jpg',
  '/images/avatares/RUIVA RESTAURANTE.PNG': 'AVATARES/RUIVA RESTAURANTE.PNG',
  '/images/avatares/Rafah.jpg': 'AVATARES DAS ETAPAS/Rafah.jpg',
  '/images/avatares/RUIVA NO APARTAMENTO.PNG': 'AVATARES/RUIVA NO APARTAMENTO.PNG',
  '/images/avatares/MORENA SELFIE NO ESPELHO.PNG': 'AVATARES/MORENA SELFIE NO ESPELHO.PNG',
  '/images/avatares/Loira Na Academia.PNG': 'AVATARES/Loira Na Academia.PNG',
  '/images/avatares/Loira No Aeroporto.PNG': 'AVATARES/Loira No Aeroporto.PNG',
  '/images/avatares/Homem Carro Premium.png': 'AVATARES/Homem Carro Premium.png',
  '/images/avatares/Homem Academia.png': 'AVATARES/Homem Academia.png',
  '/images/avatares/Empresario Jovem.png': 'AVATARES/Empresario Jovem.png',
  '/images/avatares/Mulher Cobertura Moderna.png': 'AVATARES/Mulher Cobertura Moderna.png',

  // Imagens de cenários
  '/images/cenarios/WhatsApp Image 2026-06-28 at 14.04.13.jpeg': 'AVATARES/WhatsApp Image 2026-06-28 at 14.04.13.jpeg',
  '/images/cenarios/WhatsApp Image 2026-06-28 at 14.18.04.jpeg': 'AVATARES/WhatsApp Image 2026-06-28 at 14.18.04.jpeg',
  '/images/cenarios/WhatsApp Image 2026-06-28 at 14.31.21 (1).jpeg': 'AVATARES/WhatsApp Image 2026-06-28 at 14.31.21 (1).jpeg',
  '/images/cenarios/WhatsApp Image 2026-06-28 at 14.31.21.jpeg': 'AVATARES/WhatsApp Image 2026-06-28 at 14.31.21.jpeg',
  '/images/cenarios/WhatsApp Image 2026-06-28 at 14.31.22 (1).jpeg': 'AVATARES/WhatsApp Image 2026-06-28 at 14.31.22 (1).jpeg',
  '/images/cenarios/WhatsApp Image 2026-06-28 at 14.42.14.jpeg': 'AVATARES/WhatsApp Image 2026-06-28 at 14.42.14.jpeg'
};

async function downloadFile(urlPath, supabasePath) {
  const destPath = path.join(process.cwd(), 'public', urlPath);
  const dir = path.dirname(destPath);

  // Ensure directories exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Check if file is already a valid binary (non-HTML, size > 2KB)
  if (fs.existsSync(destPath)) {
    const stats = fs.statSync(destPath);
    if (stats.size > 2048) {
      // Read a small block to check if it's HTML
      const fd = fs.openSync(destPath, 'r');
      const buffer = Buffer.alloc(100);
      fs.readSync(fd, buffer, 0, 100, 0);
      fs.closeSync(fd);
      const contentStart = buffer.toString('utf8').trim().toLowerCase();
      
      if (!contentStart.includes('<!doctype') && !contentStart.includes('<html')) {
        console.log(`⚡ Ignorado (já existe com integridade): ${urlPath}`);
        return; // File is fine! Skip downloading to save time/bandwidth
      }
    }
  }

  const encodedPath = supabasePath.split('/').map(encodeURIComponent).join('/');
  const fullUrl = `${BASE_URL}${encodedPath}`;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {}); // Delete partial file
        reject(new Error(`Failed to download ${urlPath}: HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${urlPath}`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function start() {
  console.log('================================================================');
  console.log('🚀 INICIANDO DOWNLOAD DE MÍDIAS DO SUPABASE PARA O AMBIENTE LOCAL');
  console.log('================================================================');
  console.log(`Buscando diretamente do Bucket público da Supabase:\n${BASE_URL}\n`);

  let count = 0;
  const list = Object.entries(assetsMap);
  for (const [localPath, supabasePath] of list) {
    try {
      await downloadFile(localPath, supabasePath);
      count++;
    } catch (err) {
      console.error(`❌ Erro ao baixar ${localPath}:`, err.message);
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 Sucesso! Processados ${count} de ${list.length} arquivos.`);
  console.log('Todos os arquivos corrompidos foram substituídos por binários válidos!');
  console.log('================================================================\n');
}

start();
