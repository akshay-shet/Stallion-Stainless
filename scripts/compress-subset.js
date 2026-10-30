const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_BASE = 'D:/Stallion Project/Items/Categories';
const TARGET_BASE = path.join(__dirname, '..', 'public', 'categories');

// Top flagship products to include full gallery and 3D GLB model
const FLAGSHIP_SOFAS = ['ARIS', 'ATLAS', 'AURA', 'BARON', 'BENTLY', 'CHESTER', 'COMO', 'MONACO'];
const FLAGSHIP_DINING = ['DT-01', 'DT-03', 'DT-05', 'DT-08', 'DT-12', 'DT-16', 'DT-21', 'DT-28'];
const FLAGSHIP_CORNERS = ['CT-01', 'CT-03', 'CT-04', 'CT-06', 'CT-11', 'CT-18', 'CT-25', 'CT-32'];
const FLAGSHIP_TEAPOYS = ['SST-01', 'SST-04', 'SST-07', 'SST-10', 'SST-16', 'SST-23', 'SST-30', 'SST-39'];

const FLAGSHIPS = new Set([
  ...FLAGSHIP_SOFAS.map(s => s.toUpperCase()),
  ...FLAGSHIP_DINING.map(s => s.toUpperCase()),
  ...FLAGSHIP_CORNERS.map(s => s.toUpperCase()),
  ...FLAGSHIP_TEAPOYS.map(s => s.toUpperCase()),
]);

function isFlagship(prodName) {
  return FLAGSHIPS.has(prodName.toUpperCase());
}

async function optimizeImage(srcPath, destPath) {
  try {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const stat = fs.statSync(srcPath);
    
    // If already tiny (< 80KB), copy directly
    if (stat.size < 80 * 1024) {
      fs.copyFileSync(srcPath, destPath);
      return;
    }

    const ext = path.extname(srcPath).toLowerCase();
    const image = sharp(srcPath).resize(500, 500, { fit: 'inside', withoutEnlargement: true });

    if (ext === '.png') {
      // 8-bit palette PNG: dramatic 95%+ compression (50KB) while keeping .png filename
      await image.png({ compressionLevel: 9, palette: true, colors: 128 }).toFile(destPath);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await image.jpeg({ quality: 75, mozjpeg: true }).toFile(destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  } catch (err) {
    // If sharp fails on any file, fallback to direct copy
    fs.copyFileSync(srcPath, destPath);
  }
}

async function run() {
  console.log('--- Starting Selective Subset Optimization ---');
  if (fs.existsSync(TARGET_BASE)) {
    fs.rmSync(TARGET_BASE, { recursive: true, force: true });
  }
  fs.mkdirSync(TARGET_BASE, { recursive: true });

  const { PRODUCTS } = require('../src/data/products');
  console.log(`Processing assets for ${PRODUCTS.length} catalog products...`);

  let copiedImages = 0;
  let copiedGlbs = 0;

  for (const prod of PRODUCTS) {
    const prodName = prod.name || prod.id;
    const isTop = isFlagship(prodName) || isFlagship(prod.id);

    // 1. Process Images
    const imgs = prod.images || [];
    // For flagships, copy all gallery images; for other products, copy primary hero image
    const imgsToProcess = isTop ? imgs : imgs.slice(0, 1);

    for (const relUrl of imgsToProcess) {
      if (!relUrl.startsWith('/categories/')) continue;
      const subPath = relUrl.replace(/^\/categories\//, '');
      const srcPath = path.join(SOURCE_BASE, subPath);
      const destPath = path.join(TARGET_BASE, subPath);

      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        await optimizeImage(srcPath, destPath);
        copiedImages++;
      }
    }

    // 2. Process GLB 3D Model (Flagships only)
    if (isTop && prod.modelUrl && prod.modelUrl.startsWith('/categories/')) {
      const subPath = prod.modelUrl.replace(/^\/categories\//, '');
      const srcPath = path.join(SOURCE_BASE, subPath);
      const destPath = path.join(TARGET_BASE, subPath);

      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        copiedGlbs++;
        console.log(`[GLB] Copied 3D model for ${prodName} (${(fs.statSync(destPath).size / 1024).toFixed(0)} KB)`);
      }
    }
  }

  // Measure total size
  let totalBytes = 0;
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const s = fs.statSync(p);
      if (s.isDirectory()) walk(p);
      else totalBytes += s.size;
    }
  }
  walk(TARGET_BASE);

  console.log('--- Optimization Complete ---');
  console.log(`Copied & compressed images: ${copiedImages}`);
  console.log(`Copied 3D GLB models: ${copiedGlbs}`);
  console.log(`Total public/categories folder size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

run().catch(console.error);
