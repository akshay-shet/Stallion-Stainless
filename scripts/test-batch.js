const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const allText = [
  fs.readFileSync(path.join(__dirname, '../src/data/sofas.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/diningTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/cornerTables.ts'), 'utf8'),
  fs.readFileSync(path.join(__dirname, '../src/data/teapoys.ts'), 'utf8')
].join(' ');

const matches = allText.match(/"\/categories\/[^"]+\.(png|jpg|jpeg|webp)"/gi) || [];
const uniqueImgs = Array.from(new Set(matches.map(m => m.replace(/^"|"$/g, ''))));

async function testBatch() {
  let totalBytes = 0;
  let count = 0;
  const sample = uniqueImgs.slice(0, 50);

  for (const img of sample) {
    const p = path.join('D:/Stallion Project/Items', img.replace(/^\/categories\//, 'Categories/'));
    if (fs.existsSync(p)) {
      const ext = path.extname(p).toLowerCase();
      let buf;
      if (ext === '.png') {
        buf = await sharp(p).resize(450, 450, { fit: 'inside' }).png({ compressionLevel: 9, palette: true, colors: 96 }).toBuffer();
      } else {
        buf = await sharp(p).resize(450, 450, { fit: 'inside' }).jpeg({ quality: 70, mozjpeg: true }).toBuffer();
      }
      totalBytes += buf.length;
      count++;
    }
  }

  const avg = totalBytes / count;
  console.log('Tested count:', count);
  console.log('Sample images avg size:', (avg / 1024).toFixed(1), 'KB');
  console.log('Projected total size for all 2055 images:', (avg * 2055 / 1024 / 1024).toFixed(2), 'MB');
}

testBatch().catch(console.error);
