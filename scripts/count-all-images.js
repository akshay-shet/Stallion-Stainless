const fs = require('fs');
const path = require('path');

const allText = [
  fs.readFileSync(path.join(__dirname, '../src/data/sofas.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/diningTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/cornerTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/teapoys.ts'), 'utf8')
].join(' ');

const matches = allText.match(/"\/categories\/[^"]+\.(png|jpg|jpeg|webp)"/gi) || [];
const uniqueImgs = Array.from(new Set(matches.map(m => m.replace(/^"|"$/g, ''))));
console.log('Total unique image files across all products in data:', uniqueImgs.length);

let totalSrcBytes = 0;
let existingSrcCount = 0;
let missingFromSrc = 0;

for (const img of uniqueImgs) {
  const p = path.join('D:/Stallion Project/Items', img.replace(/^\/categories\//, 'Categories/'));
  if (fs.existsSync(p)) {
    totalSrcBytes += fs.statSync(p).size;
    existingSrcCount++;
  } else {
    missingFromSrc++;
  }
}

console.log('Found on D: drive:', existingSrcCount);
console.log('Missing from D: drive:', missingFromSrc);
console.log('Total uncompressed size on D: drive:', (totalSrcBytes / 1024 / 1024).toFixed(2), 'MB');
