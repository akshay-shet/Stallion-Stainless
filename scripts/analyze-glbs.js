const fs = require('fs');
const path = require('path');

const allText = [
  fs.readFileSync(path.join(__dirname, '../src/data/sofas.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/diningTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/cornerTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/teapoys.ts'), 'utf8')
].join(' ');

const matches = allText.match(/"\/categories\/[^"]+\.glb"/gi) || [];
const uniqueGlbs = Array.from(new Set(matches.map(m => m.replace(/^"|"$/g, ''))));
console.log('Total unique GLBs referenced in data:', uniqueGlbs.length);

let totalBytes = 0;
let found = 0;
let missing = 0;
const sizes = [];

for (const g of uniqueGlbs) {
  const p = path.join('D:/Stallion Project/Items', g.replace(/^\/categories\//, 'Categories/'));
  if (fs.existsSync(p)) {
    const s = fs.statSync(p).size;
    totalBytes += s;
    found++;
    sizes.push({ path: g, size: s });
  } else {
    missing++;
  }
}

console.log('Found on D: drive:', found);
console.log('Missing on D: drive:', missing);
console.log('Total size on D: drive:', (totalBytes / 1024 / 1024).toFixed(2), 'MB');
sizes.sort((a,b) => b.size - a.size);
console.log('\nLargest 5 GLBs:');
for (const x of sizes.slice(0, 5)) {
  console.log(`  ${(x.size/1024/1024).toFixed(2)} MB: ${x.path}`);
}
console.log('\nSmallest 5 GLBs:');
for (const x of sizes.slice(-5)) {
  console.log(`  ${(x.size/1024).toFixed(0)} KB: ${x.path}`);
}

// Group by category
const catMap = { sofas: 0, dining: 0, corners: 0, teapoys: 0 };
const catBytes = { sofas: 0, dining: 0, corners: 0, teapoys: 0 };

for (const x of sizes) {
  const lower = x.path.toLowerCase();
  let k = 'other';
  if (lower.includes('sofa')) k = 'sofas';
  else if (lower.includes('dining')) k = 'dining';
  else if (lower.includes('corner')) k = 'corners';
  else if (lower.includes('teapoy')) k = 'teapoys';

  catMap[k] = (catMap[k] || 0) + 1;
  catBytes[k] = (catBytes[k] || 0) + x.size;
}

console.log('\nBreakdown by category:');
for (const k of Object.keys(catMap)) {
  console.log(`  ${k}: ${catMap[k]} files, ${(catBytes[k]/1024/1024).toFixed(2)} MB`);
}
