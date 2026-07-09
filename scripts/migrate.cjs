const fs = require('fs');
const path = require('path');

// Target directories under /public
const dirs = [
  'public/videos/movimentos',
  'public/videos/avatares',
  'public/videos/templates',
  'public/images/avatares',
  'public/images/cenarios',
  'public/images/produtos'
];

// Create the directories
dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Files to process
const filesToProcess = [
  'src/data/cenarios.ts',
  'src/data/avatares.ts',
  'src/data/prompts.ts',
  'src/data/influencerTemplates.ts',
  'src/data/modosGeracao.ts'
];

const downloadList = [];

// Helper to determine folder and local path
function getLocalPathInfo(supabaseUrl, sourceFile) {
  // Pattern: https://bjwxsbcohqcpfftylovq.supabase.co/storage/v1/object/public/Midias/Segment1/Segment2/.../Filename
  // Decode the URL first
  const decodedUrl = decodeURIComponent(supabaseUrl);
  
  // Extract filename
  const parts = decodedUrl.split('/');
  const rawFileName = parts[parts.length - 1];
  
  // Clean file name: keep it clean
  const fileName = rawFileName;
  
  // Extract extension
  const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : '';
  
  // Determine if video or image
  const isVideo = ['mp4', 'webm', 'mov'].includes(ext);
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
  
  let typeDir = isVideo ? 'videos' : 'images';
  let pasta = 'geral';
  
  // Guess the sub-pasta based on segments or source file
  const fullPathUpper = decodedUrl.toUpperCase();
  
  if (sourceFile.includes('cenarios.ts') || fullPathUpper.includes('CENARIO') || fullPathUpper.includes('CENÁRIO')) {
    pasta = 'cenarios';
  } else if (sourceFile.includes('avatares.ts') || sourceFile.includes('influencerTemplates.ts') || fullPathUpper.includes('AVATAR')) {
    pasta = 'avatares';
  } else if (sourceFile.includes('prompts.ts') || fullPathUpper.includes('MOVIMENTO')) {
    pasta = 'movimentos';
  } else if (sourceFile.includes('modosGeracao.ts') || fullPathUpper.includes('TEMPLATE')) {
    pasta = 'templates';
  }
  
  const localUrlPath = `/${typeDir}/${pasta}/${fileName}`;
  const publicDiskPath = `/public/${typeDir}/${pasta}/${fileName}`;
  
  return {
    localUrlPath,
    publicDiskPath,
    category: `${pasta.toUpperCase()} - ${isVideo ? 'VÍDEOS' : 'FOTOS'}`
  };
}

// Map to store download pairs to ensure uniqueness
const uniqueDownloads = new Map();

filesToProcess.forEach(filePath => {
  const absolutePath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Regex to match Supabase URLs
  const regex = /https:\/\/bjwxsbcohqcpfftylovq\.supabase\.co\/storage\/v1\/object\/public\/Midias\/([^\s"']+)/g;
  
  let match;
  let newContent = content;
  
  // We'll replace them all
  newContent = content.replace(regex, (matchedUrl) => {
    const { localUrlPath, publicDiskPath, category } = getLocalPathInfo(matchedUrl, filePath);
    
    // Add to unique downloads map
    if (!uniqueDownloads.has(matchedUrl)) {
      uniqueDownloads.set(matchedUrl, {
        publicDiskPath,
        category
      });
    }
    
    return localUrlPath;
  });
  
  fs.writeFileSync(absolutePath, newContent, 'utf8');
  console.log(`Processed and updated: ${filePath}`);
});

// Generate download list content
const categories = {};
uniqueDownloads.forEach((info, originalUrl) => {
  if (!categories[info.category]) {
    categories[info.category] = [];
  }
  categories[info.category].push(`${originalUrl}  →  ${info.publicDiskPath}`);
});

let downloadListContent = '';
Object.keys(categories).sort().forEach(cat => {
  downloadListContent += `# ===== ${cat} =====\n`;
  categories[cat].forEach(line => {
    downloadListContent += `${line}\n`;
  });
  downloadListContent += '\n';
});

const scriptsDir = path.join(process.cwd(), 'scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

fs.writeFileSync(path.join(scriptsDir, 'lista-downloads.txt'), downloadListContent, 'utf8');
console.log('Successfully generated scripts/lista-downloads.txt!');
