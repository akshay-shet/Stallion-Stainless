const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CAT_DIR = 'D:/Stallion Project/Items/Categories';

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

/* ───────────────────────────────────────────────────────────────────
   5-YEAR LUXURY SALES MARGIN & BESTSELLER CURATION (MUTUALLY EXCLUSIVE)
─────────────────────────────────────────────────────────────────── */
const PREMIER_SOFAS = new Set(["ARIS", "CHESTER", "BENTLY", "MONACO", "ROMA", "RITZ", "OPAL", "HAVEN", "LEGO", "TITAN", "DANTE"]);
const BESTSELLING_SOFAS = new Set(["ATLAS", "AURA", "BARON", "COMO", "COSMO", "DUKE", "ENZO", "GALA", "NOBLE", "VITO", "LUXE", "CAPRI", "BRIO", "CEDAR", "EDEN", "MAX", "SOLO"]);

const PREMIER_DINING = new Set([5, 8, 18, 24, 33, 42, 52, 68, 77, 88, 101, 110]);
const BESTSELLING_DINING = new Set([1, 3, 7, 12, 16, 21, 28, 35, 45, 54, 63, 72, 80, 99, 108, 114]);

const PREMIER_CORNERS = new Set([4, 9, 15, 22, 29, 38, 49, 57, 75, 84, 89, 102, 118, 125]);
const BESTSELLING_CORNERS = new Set([1, 3, 6, 11, 18, 25, 32, 40, 50, 60, 70, 79, 88, 95, 105, 112, 121, 128]);

const PREMIER_TEAPOYS = new Set([7, 14, 21, 28, 35, 44, 51, 69, 76, 82, 90, 104, 108, 116, 120]);
const BESTSELLING_TEAPOYS = new Set([1, 4, 10, 16, 23, 30, 39, 47, 55, 64, 72, 80, 87, 94, 101, 110, 118, 126]);

/* ───────────────────────────────────────────────────────────────────
   SOFA DATA VOCABULARY
─────────────────────────────────────────────────────────────────── */
const SOFA_SILHOUETTES = [
  "sunburst fluted backrest with ground-hugging base blocks",
  "sculpted tuxedo silhouette with wraparound stainless steel ribbons",
  "architectural track arms resting on floating mirror-finish plinths",
  "curvilinear organic contouring with integrated PVD metal reveals",
  "minimalist low-slung proportions framed by brushed titanium sled legs",
  "deep channel-tufted channeling with monolithic corner plinths",
  "angular tapered armrests anchored by geometric box-profile steel feet",
  "pillowy pillow-top cushioning suspended above cantilevered metal blades",
  "sculptural shell upholstery with exposed architectural steel back bracing",
  "asymmetric lounge profile with continuous stainless steel perimeter trim",
  "geometric monolithic framing with recessed shadow-line brushed gold base",
  "sculpted European salon contours with solid-billet stainless steel feet"
];

const SOFA_FABRICS = [
  { name: "Italian Champagne Velvet", img: "/fabrics/aris-champagne-velvet.jpg" },
  { name: "Oatmeal Bouclé", img: "/fabrics/warm-sand.jpg" },
  { name: "Belgian Linen Chenille", img: "/fabrics/taupe-beige.jpg" },
  { name: "Charcoal Textured Weave", img: "/fabrics/stone-grey.jpg" },
  { name: "Saddle Tan Aniline Leather", img: "/fabrics/mushroom-beige.jpg" },
  { name: "Emerald Mohair Velvet", img: "/fabrics/ocean-teal.jpg" },
  { name: "Cognac Full-Grain Leather", img: "/fabrics/blush-beige.jpg" },
  { name: "Pebble Grey Ribbed Corduroy", img: "/fabrics/pearl-grey.jpg" },
  { name: "Ivory Cashmere Wool Blend", img: "/fabrics/mist-grey.jpg" },
  { name: "Dusty Eucalyptus Linen", img: "/fabrics/eucalyptus-green.jpg" }
];

const WOOD_TYPES = [
  "Kiln-dried seasoned Neem wood (10-12% moisture control)",
  "Heavy-duty kiln-seasoned Burma Teak structural chassis",
  "Pest-resistant seasoned Neem and multi-ply hardwood framework",
  "Solid structural hardwood core reinforced with corner gussets",
  "Engineered marine-grade hardwood unibody frame"
];

const FOAMS = [
  "Multi-density 40kg/m³ high-resilience foam core with plush hypoallergenic polyfill wrap",
  "Orthopedic dual-layer 38kg/m³ HR foam capped with a channeled duck-feather duvet layer",
  "High-resilience foam with pocketed micro-coil springs for zero-sag durability",
  "42kg/m³ high-density memory foam core wrapped in siliconized microfibers",
  "Layered ergonomic comfort foam with anti-microbial fiber wrap"
];

const SOFA_DETAILS_POOL = [
  "Mirror-polished Grade 304 Stainless Steel base blocks with PVD protective coat",
  "Laser-cut Grade 304 Stainless Steel geometric legs in Brushed Champagne Gold",
  "TIG-welded seamless steel joinery hand-buffed to an unblemished jewel luster",
  "Concealed heavy-duty steel connector brackets for rock-solid sectional joining",
  "Double-stitched French seams and hand-tailored piped welt details",
  "High-performance stain-resistant and liquid-repellent fabric protection",
  "High structural load rating tested beyond 500 kg across all seating bays",
  "Available across Single Seater, Double Seater, Three Seater, L-Shaped, and U-Shaped configurations"
];

/* ───────────────────────────────────────────────────────────────────
   IMAGE COLOR ANALYSIS FOR DUAL & TRIPLE COLOR SOFAS
─────────────────────────────────────────────────────────────────── */
async function analyzeSofaImage(imgPath) {
  try {
    const { data } = await sharp(imgPath)
      .resize(80, 80, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = [];
    for (let i = 0; i < data.length; i += 3) {
      const r = data[i], g = data[i+1], b = data[i+2];
      const br = (r + g + b) / 3;
      if (br > 235 || br < 18) continue;
      pixels.push([r, g, b]);
    }
    if (pixels.length < 300) return null;

    let c1 = pixels[Math.floor(pixels.length * 0.15)];
    let c2 = pixels[Math.floor(pixels.length * 0.50)];
    let c3 = pixels[Math.floor(pixels.length * 0.85)];

    for (let it = 0; it < 5; it++) {
      let g1 = [], g2 = [], g3 = [];
      for (const px of pixels) {
        const d1 = Math.hypot(px[0]-c1[0], px[1]-c1[1], px[2]-c1[2]);
        const d2 = Math.hypot(px[0]-c2[0], px[1]-c2[1], px[2]-c2[2]);
        const d3 = Math.hypot(px[0]-c3[0], px[1]-c3[1], px[2]-c3[2]);
        if (d1 <= d2 && d1 <= d3) g1.push(px);
        else if (d2 <= d1 && d2 <= d3) g2.push(px);
        else g3.push(px);
      }
      const avg = (g, c) => g.length === 0 ? c : [
        Math.round(g.reduce((s, p) => s + p[0], 0) / g.length),
        Math.round(g.reduce((s, p) => s + p[1], 0) / g.length),
        Math.round(g.reduce((s, p) => s + p[2], 0) / g.length)
      ];
      c1 = avg(g1, c1);
      c2 = avg(g2, c2);
      c3 = avg(g3, c3);
    }

    const toHex = c => '#' + c.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
    const d12 = Math.hypot(c1[0]-c2[0], c1[1]-c2[1], c1[2]-c2[2]);
    const d13 = Math.hypot(c1[0]-c3[0], c1[1]-c3[1], c1[2]-c3[2]);
    const d23 = Math.hypot(c2[0]-c3[0], c2[1]-c3[1], c2[2]-c3[2]);

    const isTriple = (d12 > 50 && d13 > 50 && d23 > 50);
    const isDual = isTriple || (d12 > 40 || d13 > 40 || d23 > 40);

    return {
      colorMode: isTriple ? 'triple' : (isDual ? 'dual' : 'mono'),
      primaryColor: toHex(c1),
      accentColor: toHex(c2),
      tertiaryColor: isTriple ? toHex(c3) : undefined,
      colorPalette: [toHex(c1), toHex(c2), toHex(c3)]
    };
  } catch (err) {
    return null;
  }
}

async function generateSofas() {
  const sofaDir = path.join(CAT_DIR, 'Sofa Sets');
  const folders = fs.readdirSync(sofaDir).filter(f => fs.statSync(path.join(sofaDir, f)).isDirectory());

  const sofaProducts = [];

  for (const name of folders) {
    if (name.toUpperCase() === 'ARIS') continue; // ARIS handled as flagship reference

    const p = path.join(sofaDir, name);
    const sub = fs.readdirSync(p).find(f => fs.statSync(path.join(p, f)).isDirectory()) || name;
    const targetDir = path.join(p, sub);
    const files = fs.readdirSync(targetDir);

    const relPath = `/categories/Sofa Sets/${encodeURIComponent(name)}/${encodeURIComponent(sub)}`;

    const findFile = (prefix, exts = ['jpg', 'png', 'jpeg']) => {
      const match = files.find(f => {
        const parts = f.split('.');
        const ext = parts.pop().toLowerCase();
        const base = parts.join('.').toLowerCase();
        return base === prefix.toLowerCase() && exts.includes(ext);
      });
      return match ? `${relPath}/${match}` : null;
    };

    const findGlb = (prefix) => {
      const match = files.find(f => {
        const parts = f.split('.');
        const ext = parts.pop().toLowerCase();
        const base = parts.join('.').toLowerCase();
        return base === prefix.toLowerCase() && ext === 'glb';
      });
      return match ? `${relPath}/${match}` : null;
    };

    const img1 = findFile('1');
    const img2 = findFile('2');
    const img3 = findFile('3');
    const imgL = findFile('L');
    const imgU = findFile('U');
    let imgH = findFile('H');
    let heroDiskPath = null;

    if (imgH) {
      const heroFile = files.find(f => f.toLowerCase() === 'h.jpg' || f.toLowerCase() === 'h.png');
      if (heroFile) heroDiskPath = path.join(targetDir, heroFile);
    }
    if (!imgH) {
      const gemini = files.find(f => f.toLowerCase().startsWith('gemini') && (f.endsWith('.png') || f.endsWith('.jpg')));
      if (gemini) {
        imgH = `${relPath}/${gemini}`;
        heroDiskPath = path.join(targetDir, gemini);
      } else {
        imgH = img3 || img1;
        const fallback = files.find(f => /^(3|1)\.(png|jpg|jpeg)$/i.test(f));
        if (fallback) heroDiskPath = path.join(targetDir, fallback);
      }
    }

    const glb1 = findGlb('1');
    const glb2 = findGlb('2');
    const glb3 = findGlb('3');
    const glbL = findGlb('L');
    const glbU = findGlb('U');
    const mainModel = glb3 || glb1 || glb2 || (files.find(f => f.endsWith('.glb')) ? `${relPath}/${files.find(f => f.endsWith('.glb'))}` : undefined);

    // Color analysis for dual and triple color sofa styling
    let colorAnalysis = null;
    if (heroDiskPath && fs.existsSync(heroDiskPath)) {
      colorAnalysis = await analyzeSofaImage(heroDiskPath);
    }

    const seed = hash(name);
    const silhouette = pick(SOFA_SILHOUETTES, seed);
    const fabric = pick(SOFA_FABRICS, seed);
    const wood = pick(WOOD_TYPES, seed);
    const foam = pick(FOAMS, seed);
    const legStyle = pick(SOFA_DETAILS_POOL, seed + 1);

    const price = 210000 + (seed % 140) * 1000;
    const width = 88 + (seed % 10);
    const depth = 37 + (seed % 5);
    const height = 31 + (seed % 4);

    const isDualOrTriple = colorAnalysis && colorAnalysis.colorMode !== 'mono';
    const fabricDescriptor = isDualOrTriple
      ? `Two-Tone Duo Palette (${fabric.name} with Architectural Contrasting Cushions)`
      : fabric.name;

    const details = [
      `Signature ${silhouette} engineered with Grade 304 Stainless Steel`,
      legStyle,
      `Chassis fabricated from ${wood}`,
      foam,
      `Upholstered in durable luxury ${fabricDescriptor} with stain-guard treatment`,
      "Available across Single Seater, Double Seater, Three Seater, L-Shaped, and U-Shaped configurations"
    ];

    const allImages = [imgH, img1, img2, img3, imgL, imgU].filter(Boolean);
    const uName = name.toUpperCase();
    const isPro = PREMIER_SOFAS.has(uName);
    const isBestSelling = BESTSELLING_SOFAS.has(uName);

    sofaProducts.push({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: uName,
      modelUrl: mainModel,
      tagline: `Architectural ${silhouette} in Grade 304 Stainless Steel.`,
      description: `The ${uName} Sofa embodies contemporary poise with its ${silhouette}. Supported by precision-crafted Grade 304 Stainless Steel and upholstered in ${fabricDescriptor}, it balances striking architectural restraint with deep, enveloping comfort across all modular seating configurations.`,
      price,
      category: "sofa",
      colors: "SOFA_COLORS",
      colorMode: colorAnalysis ? colorAnalysis.colorMode : "dual",
      primaryColor: colorAnalysis ? colorAnalysis.primaryColor : "#aa9078",
      accentColor: colorAnalysis ? colorAnalysis.accentColor : "#c5b49f",
      tertiaryColor: colorAnalysis ? colorAnalysis.tertiaryColor : undefined,
      colorPalette: colorAnalysis ? colorAnalysis.colorPalette : ["#aa9078", "#c5b49f"],
      dimensions: {
        overall: `${width}"W x ${depth}"D x ${height}"H`,
        seatHeight: "18\"",
        seatDepth: "24\"",
        clearance: "3.5\" - 5\" (PVD Metal Architecture)"
      },
      details,
      fabricImage: fabric.img,
      fabricName: fabric.name,
      images: allImages,
      seaterImages: {
        "single-seater": img1 || imgH,
        "1-seater": img1 || imgH,
        "1-Seater Armchair": img1 || imgH,
        "Single Seater": img1 || imgH,
        "double-seater": img2 || img1 || imgH,
        "2-seater": img2 || img1 || imgH,
        "2-Seater Sofa": img2 || img1 || imgH,
        "Double Seater": img2 || img1 || imgH,
        "three-seater": img3 || imgH,
        "3-seater": img3 || imgH,
        "3-Seater Sofa": img3 || imgH,
        "Three Seater": img3 || imgH,
        "l-shaped": imgL || img3 || imgH,
        "l-sectional": imgL || img3 || imgH,
        "L-Shaped Sectional": imgL || img3 || imgH,
        "L-Shaped": imgL || img3 || imgH,
        "u-shaped": imgU || imgL || imgH,
        "u-sectional": imgU || imgL || imgH,
        "U-Shaped Sectional": imgU || imgL || imgH,
        "U-Shaped": imgU || imgL || imgH,
      },
      seaterModels: {
        "single-seater": glb1 || mainModel,
        "1-seater": glb1 || mainModel,
        "1-Seater Armchair": glb1 || mainModel,
        "Single Seater": glb1 || mainModel,
        "double-seater": glb2 || glb1 || mainModel,
        "2-seater": glb2 || glb1 || mainModel,
        "2-Seater Sofa": glb2 || glb1 || mainModel,
        "Double Seater": glb2 || glb1 || mainModel,
        "three-seater": glb3 || mainModel,
        "3-seater": glb3 || mainModel,
        "3-Seater Sofa": glb3 || mainModel,
        "Three Seater": glb3 || mainModel,
        "l-shaped": glbL || glb3 || mainModel,
        "l-sectional": glbL || glb3 || mainModel,
        "L-Shaped Sectional": glbL || glb3 || mainModel,
        "L-Shaped": glbL || glb3 || mainModel,
        "u-shaped": glbU || glbL || mainModel,
        "u-sectional": glbU || glbL || mainModel,
        "U-Shaped Sectional": glbU || glbL || mainModel,
        "U-Shaped": glbU || glbL || mainModel,
      },
      configSketches: {
        "single-seater": "/schematics-2d/Single Seater Sofa Schematic.png",
        "1-seater": "/schematics-2d/Single Seater Sofa Schematic.png",
        "1-Seater Armchair": "/schematics-2d/Single Seater Sofa Schematic.png",
        "Single Seater": "/schematics-2d/Single Seater Sofa Schematic.png",
        "double-seater": "/schematics-2d/Two-Seater Sofa Schematic.png",
        "2-seater": "/schematics-2d/Two-Seater Sofa Schematic.png",
        "2-Seater Sofa": "/schematics-2d/Two-Seater Sofa Schematic.png",
        "Double Seater": "/schematics-2d/Two-Seater Sofa Schematic.png",
        "three-seater": "/schematics-2d/Three-Seater Sofa Schematic.png",
        "3-seater": "/schematics-2d/Three-Seater Sofa Schematic.png",
        "3-Seater Sofa": "/schematics-2d/Three-Seater Sofa Schematic.png",
        "Three Seater": "/schematics-2d/Three-Seater Sofa Schematic.png",
        "l-shaped": "/schematics-2d/L-Shaped Sofa Schematic Dimensions.png",
        "l-sectional": "/schematics-2d/L-Shaped Sofa Schematic Dimensions.png",
        "L-Shaped Sectional": "/schematics-2d/L-Shaped Sofa Schematic Dimensions.png",
        "L-Shaped": "/schematics-2d/L-Shaped Sofa Schematic Dimensions.png",
        "u-shaped": "/schematics-2d/U-Shaped Sofa Schematic Dimensions.png",
        "u-sectional": "/schematics-2d/U-Shaped Sofa Schematic Dimensions.png",
        "U-Shaped Sectional": "/schematics-2d/U-Shaped Sofa Schematic Dimensions.png",
        "U-Shaped": "/schematics-2d/U-Shaped Sofa Schematic Dimensions.png"
      },
      isBestSelling,
      isPro,
      isCollections: true
    });
  }

  return sofaProducts;
}

/* ───────────────────────────────────────────────────────────────────
   DINING TABLES (Code: DT-001, Category: dining-table)
─────────────────────────────────────────────────────────────────── */
const DINING_BASES = [
  "sculptural hourglass pedestal base fabricated from Grade 304 Stainless Steel",
  "interlocking geometric cantilevered trestle frame in mirror-polished stainless steel",
  "monolithic fluted column pedestal with integrated floor-weight stabilization",
  "aerodynamic tapered V-truss steel understructure in Champagne Gold PVD",
  "intertwined helical stainless steel ribbon legs with zero-weld visible seams",
  "architectural box-section trestle with laser-cut chamfered bottom plinth",
  "sculpted asymmetrical cantilever base offering 360-degree legroom freedom",
  "dual elliptical cylindrical pedestals finished in high-vacuum Rose Pink PVD"
];

const MARBLE_TOPS = [
  "Hand-selected 20mm Italian Statuario White Marble with grey-gold dramatic veining",
  "Imported 20mm Calacatta Gold Marble slab featuring subtle warm honey undertones",
  "20mm Nero Marquina Spanish Black Marble with vivid white calcite lightning strikes",
  "Zero-porosity polished Italian Sintered Stone (impervious to heat, scratches, and wine)",
  "Imported Carrara White Marble with delicate feathered feathering and pencil-polished edge",
  "Smoked Grey 12mm Toughened Crystal Glass with beveled bullnose perimeter",
  "Exotic Brazilian Amazonite Green quartzite top with natural crystalline depth"
];

const DINING_DETAILS_POOL = [
  "Heavy-gauge AISI Grade 304 Stainless Steel undercarriage engineered for monumental stability",
  "Zero-deflection concealed internal steel sub-chassis engineered for 8-to-10 banquet seating",
  "High-vacuum PVD titanium coating offering lifetime corrosion and tarnishing resistance",
  "Acoustic rubber isolation dampers fitted between stone slab and steel framework",
  "Concealed micro-leveling glides compensating for uneven marble or hardwood floors",
  "Beveled reverse-knife edge profile creating an ultra-slim floating tabletop aesthetic",
  "Thermal expansion decoupling pads preventing temperature-induced stone stress",
  "Handcrafted in India by Stallion Master Fabricators with 40 years of architectural excellence"
];

function generateDining() {
  const dir = path.join(CAT_DIR, 'Dining Tables');
  const folders = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  folders.sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, '')) || 0;
    const nb = parseInt(b.replace(/\D/g, '')) || 0;
    return na - nb;
  });

  const products = [];

  for (const folderName of folders) {
    const p = path.join(dir, folderName);
    const files = fs.readdirSync(p);
    const relPath = `/categories/Dining Tables/${encodeURIComponent(folderName)}`;

    const num = parseInt(folderName.replace(/\D/g, '')) || 1;
    const code = `DT-${String(num).padStart(3, '0')}`;
    const id = code.toLowerCase();

    const findImg = (prefix) => {
      const match = files.find(f => {
        const parts = f.split('.');
        const ext = parts.pop().toLowerCase();
        const base = parts.join('.').toLowerCase();
        return base === prefix.toLowerCase() && ['png', 'jpg', 'jpeg'].includes(ext);
      });
      return match ? `${relPath}/${match}` : null;
    };

    const img1 = findImg('1');
    const img2 = findImg('2');
    const img3 = findImg('3');
    let imgH = findImg('H');
    if (!imgH) {
      const gemini = files.find(f => f.toLowerCase().startsWith('gemini') && (f.endsWith('.png') || f.endsWith('.jpg')));
      imgH = gemini ? `${relPath}/${gemini}` : (img1 || `${relPath}/${files.find(f => f.endsWith('.png'))}`);
    }

    const glb = files.find(f => f.endsWith('.glb'));
    const modelUrl = glb ? `${relPath}/${glb}` : undefined;

    const seed = hash(folderName);
    const baseStyle = pick(DINING_BASES, seed);
    const marbleTop = pick(MARBLE_TOPS, seed);
    const detail1 = pick(DINING_DETAILS_POOL, seed);
    const detail2 = pick(DINING_DETAILS_POOL, seed + 2);
    const detail3 = pick(DINING_DETAILS_POOL, seed + 4);

    const price = 240000 + (seed % 180) * 1000;
    const width = 94 + (seed % 3) * 6;
    const depth = 44 + (seed % 2) * 4;

    const details = [
      `Monolithic ${baseStyle}`,
      marbleTop,
      detail1,
      detail2,
      detail3,
      "Available across Champagne Gold, Rose Pink, and Mirror Chrome PVD stainless steel finishes"
    ];

    const allImages = [imgH, img1, img2, img3].filter(Boolean);
    const isPro = PREMIER_DINING.has(num);
    const isBestSelling = BESTSELLING_DINING.has(num);

    products.push({
      id,
      name: code,
      modelUrl,
      tagline: `Sculptural dining table with ${baseStyle}.`,
      description: `The ${code} commands the modern dining salon with its ${baseStyle} and ${marbleTop}. Engineered with concealed zero-deflection steel ribbing and high-vacuum PVD titanium coating, it offers an enduring platform for grand banquet entertaining.`,
      price,
      category: "dining-table",
      colors: "SOFA_COLORS",
      dimensions: {
        overall: `${width}"W x ${depth}"D x 30"H`,
        seatHeight: "N/A (Standard Dining Clearance 28.5\")",
        seatDepth: `${depth}"`,
        clearance: "28.5\" (Ergonomic Chair Ingress)"
      },
      details,
      images: allImages,
      configSketches: {
        "Standard": "/schematics-2d/Dining Table Technical Schematic.png",
        "dining": "/schematics-2d/Dining Table Technical Schematic.png"
      },
      isBestSelling,
      isPro,
      isCollections: true
    });
  }

  return products;
}

/* ───────────────────────────────────────────────────────────────────
   CORNER TABLES (Code: CT-001, Category: corner-table)
─────────────────────────────────────────────────────────────────── */
const CORNER_BASES = [
  "precision laser-cut geometric cube column in Grade 304 Stainless Steel",
  "architectural asymmetric C-profile frame allowing over-sofa slide-in utility",
  "fluted cylindrical pedestal stand with high-vacuum PVD mirror sheen",
  "minimalist tripod blade legs anchored by a circular bottom stabilization ring",
  "sculpted twist-column silhouette with diamond-polished metallic facets",
  "open architectural wireframe cage in Champagne Gold PVD stainless steel",
  "cantilevered dual-tier stepped plinth in Rose Pink & Mirror Chrome finish"
];

const CORNER_TOPS = [
  "15mm Polished Sintered Stone with zero-porosity surface protection",
  "Hand-finished Italian Carrara White Marble with delicate satin sealer",
  "Nero Marquina Black Marble disc with reverse-beveled chamfer edge",
  "10mm Ultra-Clear Starphire Toughened Glass with mirror-polished perimeter",
  "Calacatta Gold sintered porcelain plateau resistant to heat and water rings"
];

const CORNER_DETAILS_POOL = [
  "Fabricated from solid-gauge Grade 304 Stainless Steel with PVD titanium coat",
  "TIG-welded seamless corner joints ground and buffed to a seamless mirror luster",
  "Non-marking high-density felt floor glides protecting hardwood and marble floors",
  "Engineered with low center-of-gravity counterweight preventing accidental tipping",
  "High chemical and scratch resistance against beverages, moisture, and daily wear",
  "Versatile placement as a sofa-side accent, bedside luxury table, or reading nook companion"
];

function generateCorners() {
  const dir = path.join(CAT_DIR, 'Corner tables');
  const folders = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  folders.sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, '')) || 0;
    const nb = parseInt(b.replace(/\D/g, '')) || 0;
    return na - nb;
  });

  const products = [];

  for (const folderName of folders) {
    const p = path.join(dir, folderName);
    const files = fs.readdirSync(p);
    const relPath = `/categories/Corner tables/${encodeURIComponent(folderName)}`;

    const num = parseInt(folderName.replace(/\D/g, '')) || 1;
    const code = `CT-${String(num).padStart(3, '0')}`;
    const id = code.toLowerCase();

    const findImg = (prefix) => {
      const match = files.find(f => {
        const parts = f.split('.');
        const ext = parts.pop().toLowerCase();
        const base = parts.join('.').toLowerCase();
        return base === prefix.toLowerCase() && ['png', 'jpg', 'jpeg'].includes(ext);
      });
      return match ? `${relPath}/${match}` : null;
    };

    const img1 = findImg('1');
    const img2 = findImg('2');
    const img3 = findImg('3');
    let imgH = findImg('H') || findImg('Original') || img1;

    const glb = files.find(f => f.endsWith('.glb'));
    const modelUrl = glb ? `${relPath}/${glb}` : undefined;

    const seed = hash(folderName);
    const baseStyle = pick(CORNER_BASES, seed);
    const topMat = pick(CORNER_TOPS, seed);
    const detail1 = pick(CORNER_DETAILS_POOL, seed);
    const detail2 = pick(CORNER_DETAILS_POOL, seed + 2);

    const price = 65000 + (seed % 65) * 1000;
    const size = 22 + (seed % 4) * 2;
    const height = 22 + (seed % 3);

    const details = [
      `Architectural ${baseStyle}`,
      topMat,
      detail1,
      detail2,
      "TIG-welded seamless corner joints hand-buffed to a flawless mirror luster",
      "Available across Champagne Gold, Rose Pink, and Mirror Chrome PVD stainless steel finishes"
    ];

    const allImages = [imgH, img1, img2, img3].filter(Boolean);
    const isPro = PREMIER_CORNERS.has(num);
    const isBestSelling = BESTSELLING_CORNERS.has(num);

    products.push({
      id,
      name: code,
      modelUrl,
      tagline: `Geometric architectural accent table with ${baseStyle}.`,
      description: `The ${code} brings geometric poise to executive lounges and luxury living salons. Crafted with solid-gauge Grade 304 Stainless Steel and crowned with ${topMat}, its sculpted profile reflects light and metallic brilliance from every angle.`,
      price,
      category: "corner-table",
      colors: "SOFA_COLORS",
      dimensions: {
        overall: `${size}"W x ${size}"D x ${height}"H`,
        seatHeight: "N/A",
        seatDepth: `${size}"`,
        clearance: `${height - 2}" (Open Architectural Frame)`
      },
      details,
      images: allImages,
      configSketches: {
        "Standard": "/schematics-2d/Console Table Schematic Blueprint.png",
        "corner": "/schematics-2d/Console Table Schematic Blueprint.png"
      },
      isBestSelling,
      isPro,
      isCollections: true
    });
  }

  return products;
}

/* ───────────────────────────────────────────────────────────────────
   TEAPOYS (Code: SST-001, Category: teapoy)
─────────────────────────────────────────────────────────────────── */
const TEAPOY_BASES = [
  "low-slung architectural perimeter plinth in Grade 304 Stainless Steel",
  "floating geometric pedestal with recessed shadow-gap base in Champagne Gold PVD",
  "interlocking dual-disc architectural steel framework with mirror finish",
  "sculptural cantilevered trestle base offering expansive open floor clearance",
  "laser-cut organic filigree steel base with radial weight-bearing ribs",
  "curvilinear capsule-profile stainless steel apron with high-vacuum titanium coat"
];

const TEAPOY_TOPS = [
  "Bookmatched 20mm Italian Statuario Natural Marble with bookmatched symmetry",
  "Seamless polished Carrara White Marble plateau with double-bullnose edge",
  "15mm Diamond-Grade Sintered Stone slab (stain-proof, heat-proof, UV-stable)",
  "Ultra-Clear 12mm Tempered Float Glass with hand-ground beveled facets",
  "Nero Marquina Spanish Marble with high-gloss liquid seal polish"
];

const TEAPOY_DETAILS_POOL = [
  "Grade 304 Stainless Steel architectural foundation with lifetime anti-rust warranty",
  "Multi-angle Physical Vapor Deposition (PVD) titanium finish with high surface hardness",
  "Acoustic vibration dampeners seated between stone plateau and metal framework",
  "Generous surface footprint designed to stage art monographs, floral arrangements, and hospitality",
  "Resistant to hot coffee cups, condensation, staining, and surface oxidation",
  "Handcrafted in India by Stallion Master Craftsmen with 4 decades of metal mastery"
];

function generateTeapoy() {
  const dir = path.join(CAT_DIR, 'teapoy');
  const folders = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  folders.sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, '')) || 0;
    const nb = parseInt(b.replace(/\D/g, '')) || 0;
    return na - nb;
  });

  const products = [];

  for (const folderName of folders) {
    const p = path.join(dir, folderName);
    const files = fs.readdirSync(p);
    const relPath = `/categories/teapoy/${encodeURIComponent(folderName)}`;

    const num = parseInt(folderName.replace(/\D/g, '')) || 1;
    const code = `SST-${String(num).padStart(3, '0')}`;
    const id = code.toLowerCase();

    const findImg = (prefix) => {
      const match = files.find(f => {
        const parts = f.split('.');
        const ext = parts.pop().toLowerCase();
        const base = parts.join('.').toLowerCase();
        return base === prefix.toLowerCase() && ['png', 'jpg', 'jpeg'].includes(ext);
      });
      return match ? `${relPath}/${match}` : null;
    };

    const img1 = findImg('1');
    const img2 = findImg('2');
    const img3 = findImg('3');
    let imgH = findImg('H') || img1;

    const glb = files.find(f => f.endsWith('.glb'));
    const modelUrl = glb ? `${relPath}/${glb}` : undefined;

    const seed = hash(folderName);
    const baseStyle = pick(TEAPOY_BASES, seed);
    const topMat = pick(TEAPOY_TOPS, seed);
    const detail1 = pick(TEAPOY_DETAILS_POOL, seed);
    const detail2 = pick(TEAPOY_DETAILS_POOL, seed + 2);

    const price = 95000 + (seed % 90) * 1000;
    const width = 48 + (seed % 4) * 3;
    const depth = 28 + (seed % 3) * 2;

    const details = [
      `Sculpted ${baseStyle}`,
      topMat,
      detail1,
      detail2,
      "Multi-angle Physical Vapor Deposition (PVD) titanium finish with high surface hardness",
      "Available across Champagne Gold, Rose Pink, and Mirror Chrome PVD stainless steel finishes"
    ];

    const allImages = [imgH, img1, img2, img3].filter(Boolean);
    const isPro = PREMIER_TEAPOYS.has(num);
    const isBestSelling = BESTSELLING_TEAPOYS.has(num);

    products.push({
      id,
      name: code,
      modelUrl,
      tagline: `Low-profile centerpiece coffee table with ${baseStyle}.`,
      description: `The ${code} anchors the seating suite with its low-slung ${baseStyle} and floating ${topMat}. Engineered for refined hospitality, it offers an expansive architectural surface resistant to wear, heat, and daily life.`,
      price,
      category: "teapoy",
      colors: "SOFA_COLORS",
      dimensions: {
        overall: `${width}"W x ${depth}"D x 17"H`,
        seatHeight: "N/A",
        seatDepth: `${depth}"`,
        clearance: "15\" (Cantilevered Plinth)"
      },
      details,
      images: allImages,
      configSketches: {
        "Standard": "/schematics-2d/Marble Coffee Table Schematic.png",
        "coffee": "/schematics-2d/Marble Coffee Table Schematic.png"
      },
      isBestSelling,
      isPro,
      isCollections: true
    });
  }

  return products;
}

function serializeProduct(p) {
  let json = JSON.stringify(p, null, 2);
  json = json.replace('"colors": "SOFA_COLORS"', 'colors: SOFA_COLORS');
  return json;
}

// ARIS Card Definition
const ARIS_CARD = `{
    id: "aris",
    name: "ARIS",
    modelUrl: "/models/aris/3.glb",
    tagline: "Architectural fan-pleated grandeur with mirror-finish stainless base blocks.",
    description: "The ARIS Sofa defines modern opulence with its radiant sunburst fluted backrest, tailored angular track arms, and ground-hugging Grade 304 Stainless Steel base blocks. Offered in rich champagne velvet, ARIS merges architectural restraint with deep lounging luxury across armchairs, sofas, and palatial sectionals.",
    price: 268000,
    category: "sofa",
    colors: SOFA_COLORS,
    colorMode: "triple",
    primaryColor: "#aa9078",
    accentColor: "#c5b49f",
    tertiaryColor: "#866a52",
    colorPalette: ["#aa9078", "#c5b49f", "#866a52"],
    dimensions: {
      overall: "94\\"W x 38\\"D x 34\\"H",
      seatHeight: "18\\"",
      seatDepth: "24\\"",
      clearance: "3.5\\" (PVD Metal Block Feet)"
    },
    details: [
      "Radiant sunburst fan-fluted inner backrest with double-stitched channel profiling",
      "Mirror-polished Grade 304 Stainless Steel block base feet with PVD protective coat",
      "Heavy-duty internal chassis fabricated with kiln-dried seasoned Neem wood",
      "Multi-density high-resilience foam core with plush hypoallergenic polyfill wrap",
      "Available across Single Seater, Double Seater, Three Seater, L-Shaped, and U-Shaped configurations"
    ],
    fabricImage: "/fabrics/aris-champagne-velvet.jpg",
    fabricName: "Aris Champagne Velvet",
    images: [
      "/products/aris/H.jpg",
      "/products/aris/1.jpg",
      "/products/aris/2.jpg",
      "/products/aris/3.jpg",
      "/products/aris/L.jpg",
      "/products/aris/U.jpg",
      "/products/aris/front.png",
      "/products/aris/angle.png",
      "/products/aris/side.png",
      "/products/aris/back.png"
    ],
    seaterImages: {
      "single-seater": "/products/aris/1.jpg",
      "1-seater": "/products/aris/1.jpg",
      "1-Seater Armchair": "/products/aris/1.jpg",
      "Single Seater": "/products/aris/1.jpg",

      "double-seater": "/products/aris/2.jpg",
      "2-seater": "/products/aris/2.jpg",
      "2-Seater Sofa": "/products/aris/2.jpg",
      "Double Seater": "/products/aris/2.jpg",

      "three-seater": "/products/aris/3.jpg",
      "3-seater": "/products/aris/3.jpg",
      "3-Seater Sofa": "/products/aris/3.jpg",
      "Three Seater": "/products/aris/3.jpg",

      "l-shaped": "/products/aris/L.jpg",
      "l-sectional": "/products/aris/L.jpg",
      "L-Shaped Sectional": "/products/aris/L.jpg",
      "L-Shaped": "/products/aris/L.jpg",

      "u-shaped": "/products/aris/U.jpg",
      "u-sectional": "/products/aris/U.jpg",
      "U-Shaped Sectional": "/products/aris/U.jpg",
      "U-Shaped": "/products/aris/U.jpg"
    },
    seaterModels: {
      "single-seater": "/models/aris/1.glb",
      "1-seater": "/models/aris/1.glb",
      "1-Seater Armchair": "/models/aris/1.glb",
      "Single Seater": "/models/aris/1.glb",

      "double-seater": "/models/aris/2.glb",
      "2-seater": "/models/aris/2.glb",
      "2-Seater Sofa": "/models/aris/2.glb",
      "Double Seater": "/models/aris/2.glb",

      "three-seater": "/models/aris/3.glb",
      "3-seater": "/models/aris/3.glb",
      "3-Seater Sofa": "/models/aris/3.glb",
      "Three Seater": "/models/aris/3.glb",

      "l-shaped": "/models/aris/L.glb",
      "l-sectional": "/models/aris/L.glb",
      "L-Shaped Sectional": "/models/aris/L.glb",
      "L-Shaped": "/models/aris/L.glb",

      "u-shaped": "/models/aris/U.glb",
      "u-sectional": "/models/aris/U.glb",
      "U-Shaped Sectional": "/models/aris/U.glb",
      "U-Shaped": "/models/aris/U.glb"
    },
    configSketches: {
      "single-seater": "/schematics/one_seater.png",
      "1-seater": "/schematics/one_seater.png",
      "1-Seater Armchair": "/schematics/one_seater.png",
      "Single Seater": "/schematics/one_seater.png",

      "double-seater": "/schematics/two_seater.png",
      "2-seater": "/schematics/two_seater.png",
      "2-Seater Sofa": "/schematics/two_seater.png",
      "Double Seater": "/schematics/two_seater.png",

      "three-seater": "/schematics/three_seater.png",
      "3-seater": "/schematics/three_seater.png",
      "3-Seater Sofa": "/schematics/three_seater.png",
      "Three Seater": "/schematics/three_seater.png",

      "l-shaped": "/schematics/l_shaped_sectional.png",
      "l-sectional": "/schematics/l_shaped_sectional.png",
      "L-Shaped Sectional": "/schematics/l_shaped_sectional.png",
      "L-Shaped": "/schematics/l_shaped_sectional.png",

      "u-shaped": "/schematics/u_shaped_sectional.png",
      "u-sectional": "/schematics/u_shaped_sectional.png",
      "U-Shaped Sectional": "/schematics/u_shaped_sectional.png",
      "U-Shaped": "/schematics/u_shaped_sectional.png"
    },
    isBestSelling: false,
    isPro: true,
    isCollections: true
  }`;

async function main() {
  console.log('Generating sofas with image color analysis...');
  const sofas = await generateSofas();
  console.log(`Generated ${sofas.length} sofas.`);

  console.log('Generating dining tables...');
  const dining = generateDining();
  console.log(`Generated ${dining.length} dining tables.`);

  console.log('Generating corner tables...');
  const corners = generateCorners();
  console.log(`Generated ${corners.length} corner tables.`);

  console.log('Generating teapoys...');
  const teapoy = generateTeapoy();
  console.log(`Generated ${teapoy.length} teapoys.`);

  // 1. Write src/data/sofas.ts
  const sofasCode = `import { Product, SOFA_COLORS } from "./productTypes";

export const SOFA_PRODUCTS: Product[] = [
  ${ARIS_CARD},
  ${sofas.map(serializeProduct).join(',\n  ')}
];
`;
  fs.writeFileSync('src/data/sofas.ts', sofasCode, 'utf8');
  console.log('Wrote src/data/sofas.ts');

  // 2. Write src/data/diningTables.ts
  const diningCode = `import { Product, SOFA_COLORS } from "./productTypes";

export const DINING_TABLE_PRODUCTS: Product[] = [
  ${dining.map(serializeProduct).join(',\n  ')}
];
`;
  fs.writeFileSync('src/data/diningTables.ts', diningCode, 'utf8');
  console.log('Wrote src/data/diningTables.ts');

  // 3. Write src/data/cornerTables.ts
  const cornerCode = `import { Product, SOFA_COLORS } from "./productTypes";

export const CORNER_TABLE_PRODUCTS: Product[] = [
  ${corners.map(serializeProduct).join(',\n  ')}
];
`;
  fs.writeFileSync('src/data/cornerTables.ts', cornerCode, 'utf8');
  console.log('Wrote src/data/cornerTables.ts');

  // 4. Write src/data/teapoys.ts
  const teapoyCode = `import { Product, SOFA_COLORS } from "./productTypes";

export const TEAPOY_PRODUCTS: Product[] = [
  ${teapoy.map(serializeProduct).join(',\n  ')}
];
`;
  fs.writeFileSync('src/data/teapoys.ts', teapoyCode, 'utf8');
  console.log('Wrote src/data/teapoys.ts');

  console.log('Catalog generation finished successfully!');
}

main().catch(err => {
  console.error('Error generating catalog:', err);
  process.exit(1);
});
