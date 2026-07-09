@'
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");

function getAllFiles(dir) {
  const files = [];
  readdirSync(dir).forEach(file => {
    const full = join(dir, file);
    if (statSync(full).isDirectory()) {
      files.push(...getAllFiles(full));
    } else {
      files.push(full);
    }
  });
  return files;
}

const exts = [".jpg", ".jpeg", ".png"];
const files = getAllFiles(PUBLIC_DIR).filter(f => exts.includes(extname(f).toLowerCase()));

console.log(`Encontradas ${files.length} imagens...`);

for (const file of files) {
  const out = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  await sharp(file)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(out);
  console.log(`OK: ${file}`);
}

console.log("Pronto!");
'@ | Out-File -FilePath otimizar.mjs -Encoding utf8