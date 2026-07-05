import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceFile = './public/logo.svg';

if (!fs.existsSync(sourceFile)) {
  console.error(`[PWA] Imagem de origem não encontrada: ${sourceFile}`);
  process.exit(1);
}

const destDir = './public/icons';
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const screenshotDir = './public/screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

console.log(`[PWA] Renderizando ícones PNG e screenshot a partir de ${sourceFile}...`);

const tasks = [];

// Generate standard sizes in public/icons/
sizes.forEach(size => {
  const destPath = path.join(destDir, `icon-${size}x${size}.png`);
  tasks.push(
    sharp(sourceFile)
      .resize(size, size)
      .png()
      .toFile(destPath)
      .then(() => {
        console.log(`[PWA] Gerado: ${destPath}`);
      })
  );
});

// Also overwrite root level files with clean, uncorrupted rendered PNGs
tasks.push(
  sharp(sourceFile)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png')
    .then(() => console.log('[PWA] Gerado: ./public/pwa-192x192.png'))
);

tasks.push(
  sharp(sourceFile)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png')
    .then(() => console.log('[PWA] Gerado: ./public/pwa-512x512.png'))
);

tasks.push(
  sharp(sourceFile)
    .resize(180, 180)
    .png()
    .toFile('./public/apple-touch-icon.png')
    .then(() => console.log('[PWA] Gerado: ./public/apple-touch-icon.png'))
);

// Generate a beautiful mobile screenshot with centered logo
tasks.push(
  sharp(sourceFile)
    .resize(160, 160)
    .toBuffer()
    .then(logoBuffer => {
      return sharp({
        create: {
          width: 390,
          height: 844,
          channels: 4,
          background: { r: 6, g: 6, b: 11, alpha: 1 } // #06060B background
        }
      })
        .composite([{ input: logoBuffer, gravity: 'center' }])
        .png()
        .toFile(path.join(screenshotDir, 'mobile.png'));
    })
    .then(() => console.log('[PWA] Gerado screenshot: ./public/screenshots/mobile.png'))
);

Promise.all(tasks)
  .then(() => {
    console.log('[PWA] Todos os ícones e screenshots foram gerados e corrigidos com sucesso!');
  })
  .catch(err => {
    console.error('[PWA] Erro ao gerar os ícones:', err);
    process.exit(1);
  });
