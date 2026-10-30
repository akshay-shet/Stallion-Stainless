const fs = require('fs');
const path = require('path');

const srcBase = 'D:/Stallion Project/Items/Categories';
const destBase = path.join(__dirname, '../public/categories');

// 1. Sofas with all 5 configuration shapes (1, 2, 3, L, U)
const sofas = ['ATLAS', 'AURA', 'BARON', 'COMO', 'BENTLY', 'CHESTER'];
for (const s of sofas) {
  const sDir = path.join(srcBase, 'Sofa Sets', s, s);
  const dDir = path.join(destBase, 'Sofa Sets', s, s);
  if (!fs.existsSync(sDir)) continue;
  fs.mkdirSync(dDir, { recursive: true });
  for (const f of ['1.glb', '2.glb', '3.glb', 'L.glb', 'U.glb']) {
    const sp = path.join(sDir, f);
    const dp = path.join(dDir, f);
    if (fs.existsSync(sp) && !fs.existsSync(dp)) {
      fs.copyFileSync(sp, dp);
      console.log(`[SOFA SHAPE] Copied ${s} ${f} (${(fs.statSync(dp).size/1024).toFixed(0)} KB)`);
    }
  }
}

// 2. Dining Tables with distinct 3D models (DT-01 through DT-10)
for (let i = 1; i <= 10; i++) {
  const code = `DT-${String(i).padStart(2, '0')}`;
  const sp = path.join(srcBase, 'Dining Tables', code, `${code}.glb`);
  const dp = path.join(destBase, 'Dining Tables', code, `${code}.glb`);
  if (fs.existsSync(sp) && !fs.existsSync(dp)) {
    fs.mkdirSync(path.dirname(dp), { recursive: true });
    fs.copyFileSync(sp, dp);
    console.log(`[DINING 3D] Copied ${code}.glb (${(fs.statSync(dp).size/1024).toFixed(0)} KB)`);
  }
}

// 3. Corner Tables with distinct 3D models (CT-01 through CT-10)
for (let i = 1; i <= 10; i++) {
  const code = `CT-${String(i).padStart(2, '0')}`;
  const sp = path.join(srcBase, 'Corner tables', code, `${code}.glb`);
  const dp = path.join(destBase, 'Corner tables', code, `${code}.glb`);
  if (fs.existsSync(sp) && !fs.existsSync(dp)) {
    fs.mkdirSync(path.dirname(dp), { recursive: true });
    fs.copyFileSync(sp, dp);
    console.log(`[CORNER 3D] Copied ${code}.glb (${(fs.statSync(dp).size/1024).toFixed(0)} KB)`);
  }
}

// 4. Teapoys with distinct 3D models (SST-01 through SST-10)
for (let i = 1; i <= 10; i++) {
  const code = `SST-${String(i).padStart(2, '0')}`;
  const sp = path.join(srcBase, 'teapoy', code, `${code}.glb`);
  const dp = path.join(destBase, 'teapoy', code, `${code}.glb`);
  if (fs.existsSync(sp) && !fs.existsSync(dp)) {
    fs.mkdirSync(path.dirname(dp), { recursive: true });
    fs.copyFileSync(sp, dp);
    console.log(`[TEAPOY 3D] Copied ${code}.glb (${(fs.statSync(dp).size/1024).toFixed(0)} KB)`);
  }
}

console.log('Done copying distinct 3D models & multi-seater shapes!');
