const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testGlbs = [
  'D:/Stallion Project/Items/Categories/Sofa Sets/ATLAS/ATLAS/1.glb',
  'D:/Stallion Project/Items/Categories/Sofa Sets/ATLAS/ATLAS/2.glb',
  'D:/Stallion Project/Items/Categories/Sofa Sets/ATLAS/ATLAS/3.glb',
  'D:/Stallion Project/Items/Categories/Sofa Sets/ATLAS/ATLAS/L.glb',
  'D:/Stallion Project/Items/Categories/Sofa Sets/ATLAS/ATLAS/U.glb',
  'D:/Stallion Project/Items/Categories/Dining Tables/DT-01/DT-01.glb',
  'D:/Stallion Project/Items/Categories/Dining Tables/DT-02/DT-02.glb',
  'D:/Stallion Project/Items/Categories/Corner tables/CT-01/CT-01.glb',
  'D:/Stallion Project/Items/Categories/Corner tables/CT-02/CT-02.glb',
  'D:/Stallion Project/Items/Categories/teapoy/SST-01/SST-01.glb'
];

let origTotal = 0;
let compTotal = 0;
const t0 = Date.now();

for (let i = 0; i < testGlbs.length; i++) {
  const src = testGlbs[i];
  const out = path.join(__dirname, `test_comp_${i}.glb`);
  origTotal += fs.statSync(src).size;
  execSync(`npx gltfpack -i "${src}" -o "${out}" -cc`, { stdio: 'pipe' });
  compTotal += fs.statSync(out).size;
  fs.unlinkSync(out);
}

const dt = Date.now() - t0;
console.log('10 GLBs compressed in:', (dt / 1000).toFixed(2), 'seconds');
console.log('Original total:', (origTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('Compressed total:', (compTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('Ratio:', ((1 - compTotal/origTotal) * 100).toFixed(1) + '% reduction');
console.log('Average compressed file size:', (compTotal / 10 / 1024).toFixed(0), 'KB');
console.log('Estimated total for all 863 GLBs:', (compTotal / 10 * 863 / 1024 / 1024).toFixed(2), 'MB');
