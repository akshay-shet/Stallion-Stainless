const fs = require('fs');
const path = require('path');

// Dynamically read the 4 data files to see every image referenced
const sofaFile = fs.readFileSync(path.join(__dirname, '../src/data/sofas.ts'), 'utf8');
const diningFile = fs.readFileSync(path.join(__dirname, '../src/data/diningTables.ts'), 'utf8');
const cornerFile = fs.readFileSync(path.join(__dirname, '../src/data/cornerTables.ts'), 'utf8');
const teapoyFile = fs.readFileSync(path.join(__dirname, '../src/data/teapoys.ts'), 'utf8');

const allFiles = [
  { name: 'Sofas', content: sofaFile },
  { name: 'Dining Tables', content: diningFile },
  { name: 'Corner Tables', content: cornerFile },
  { name: 'Teapoys', content: teapoyFile }
];

const publicDir = path.join(__dirname, '../public');
const sourceBase = 'D:/Stallion Project/Items/Categories';

console.log('=== END-TO-END IMAGE AUDIT ===');

for (const cat of allFiles) {
  // Extract all quoted image URLs: "/categories/..." or "/products/..."
  const matches = cat.content.match(/"\/categories\/[^"]+"/g) || [];
  const uniqueUrls = Array.from(new Set(matches.map(m => m.replace(/^"|"$/g, ''))));

  let present = 0;
  let missing = 0;
  let missingSourceExists = 0;
  const sampleMissing = [];

  for (const url of uniqueUrls) {
    const pubPath = path.join(publicDir, url);
    if (fs.existsSync(pubPath)) {
      present++;
    } else {
      missing++;
      const srcPath = path.join('D:/Stallion Project/Items', url.replace(/^\/categories\//, 'Categories/'));
      const srcExists = fs.existsSync(srcPath);
      if (srcExists) missingSourceExists++;
      if (sampleMissing.length < 5) {
        sampleMissing.push({ url, srcExists });
      }
    }
  }

  console.log(`\nCategory: ${cat.name}`);
  console.log(`Total unique image URLs referenced: ${uniqueUrls.length}`);
  console.log(`Present in public/: ${present}`);
  console.log(`Missing in public/: ${missing} (of which source exists on D: drive: ${missingSourceExists})`);
  if (sampleMissing.length > 0) {
    console.log('Sample missing:', sampleMissing);
  }
}
