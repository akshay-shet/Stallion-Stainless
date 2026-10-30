const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetBase = path.join(__dirname, '../public');
const sourceBase = 'D:/Stallion Project/Items';

const allText = [
  fs.readFileSync(path.join(__dirname, '../src/data/sofas.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/diningTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/cornerTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/teapoys.ts'), 'utf8')
].join(' ');

// Match all image URLs: "/categories/..."
const matches = allText.match(/"\/categories\/[^"]+\.(png|jpg|jpeg|webp)"/gi) || [];
const uniqueImgs = Array.from(new Set(matches.map(m => m.replace(/^"|"$/g, ''))));

console.log(`Starting complete sync of all ${uniqueImgs.length} images...`);

async function optimizeOne(relUrl) {
  const destPath = path.join(targetBase, relUrl);
  if (fs.existsSync(destPath)) {
    return; // Already present
  }

  const srcSub = relUrl.replace(/^\/categories\//, 'Categories/');
  const srcPath = path.join(sourceBase, srcSub);

  if (!fs.existsSync(srcPath)) {
    return; // Source does not exist
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const stat = fs.statSync(srcPath);
  const ext = path.extname(srcPath).toLowerCase();

  // If already tiny (< 25KB), copy directly
  if (stat.size < 25 * 1024) {
    fs.copyFileSync(srcPath, destPath);
    return;
  }

  try {
    const img = sharp(srcPath).resize(500, 500, { fit: 'inside', withoutEnlargement: true });
    if (ext === '.png') {
      await img.png({ compressionLevel: 9, palette: true, colors: 112 }).toFile(destPath);
    } else {
      await img.jpeg({ quality: 72, mozjpeg: true }).toFile(destPath);
    }
  } catch (err) {
    fs.copyFileSync(srcPath, destPath);
  }
}

async function run() {
  let done = 0;
  const total = uniqueImgs.length;
  const batchSize = 15;

  for (let i = 0; i < total; i += batchSize) {
    const batch = uniqueImgs.slice(i, i + batchSize);
    await Promise.all(batch.map(optimizeOne));
    done += batch.length;
    if (done % 150 === 0 || done >= total) {
      console.log(`Progress: ${done} / ${total} images processed...`);
    }
  }

  // Calculate final size
  let totalBytes = 0;
  let fileCount = 0;
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const s = fs.statSync(p);
      if (s.isDirectory()) walk(p);
      else {
        totalBytes += s.size;
        fileCount++;
      }
    }
  }
  walk(path.join(targetBase, 'categories'));

  console.log('=== COMPLETE SYNC FINISHED ===');
  console.log(`Total files in public/categories: ${fileCount}`);
  console.log(`Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

run().catch(console.error);
