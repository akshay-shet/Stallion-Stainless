async function test() {
  const pages = [
    'https://stallion-stainless-three.vercel.app/',
    'https://stallion-stainless-three.vercel.app/collections',
    'https://stallion-stainless-three.vercel.app/pro-collection',
    'https://stallion-stainless-three.vercel.app/best-selling',
    'https://stallion-stainless-three.vercel.app/products/dt-001',
    'https://stallion-stainless-three.vercel.app/products/atlas'
  ];

  for (const pageUrl of pages) {
    console.log('\n--- Checking page:', pageUrl);
    const res = await fetch(pageUrl);
    const html = await res.text();
    const urls = new Set();
    const re = /[\"'](\/categories\/[^\"']+|\/products\/[^\"']+|\/lineups\/[^\"']+|\/schematics[^\"]+)[\"']/g;
    let match;
    while ((match = re.exec(html)) !== null) {
      urls.add(match[1]);
    }
    console.log(`Found ${urls.size} asset paths referenced in HTML`);

    let ok = 0;
    let fail = 0;
    for (const u of Array.from(urls).slice(0, 10)) {
      const full = 'https://stallion-stainless-three.vercel.app' + encodeURI(u);
      try {
        const imgRes = await fetch(full, { method: 'HEAD' });
        if (imgRes.status === 200) ok++;
        else {
          fail++;
          console.log(`FAIL [${imgRes.status}]: ${u}`);
        }
      } catch (e) {
        fail++;
        console.log(`ERR: ${u}`);
      }
    }
    console.log(`Tested 10 sample assets -> OK: ${ok}, Failed: ${fail}`);
  }
}

test().catch(console.error);
