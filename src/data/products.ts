export function formatINR(num: number): string {
  const str = num.toString();
  const len = str.length;
  if (len <= 3) return str;
  const lastThree = str.substring(len - 3);
  const rest = str.substring(0, len - 3);
  const parts = [];
  let i = rest.length;
  while (i > 0) {
    if (i - 2 > 0) {
      parts.unshift(rest.substring(i - 2, i));
      i -= 2;
    } else {
      parts.unshift(rest.substring(0, i));
      break;
    }
  }
  return parts.join(",") + "," + lastThree;
}

export interface ProductColor {
  name: string;
  hex: string;
  modelColor: number; // Hex code for Three.js rendering
}

export interface FabricSwatch {
  id: string;
  name: string;
  hex: string;
  image: string;
}

export const SOFA_FABRICS: FabricSwatch[] = [
  { id: "aris-champagne-velvet", name: "Aris Champagne Velvet", hex: "#B39982", image: "/fabrics/aris-champagne-velvet.jpg" },
  { id: "ocean-teal", name: "Ocean Teal", hex: "#2794A8", image: "/fabrics/ocean-teal.jpg" },
  { id: "slate-blue", name: "Slate Blue", hex: "#597A8D", image: "/fabrics/slate-blue.jpg" },
  { id: "warm-sand", name: "Warm Sand", hex: "#C5AB80", image: "/fabrics/warm-sand.jpg" },
  { id: "pearl-grey", name: "Pearl Grey", hex: "#BCBCB6", image: "/fabrics/pearl-grey.jpg" },
  { id: "stone-grey", name: "Stone Grey", hex: "#ACA8A1", image: "/fabrics/stone-grey.jpg" },
  { id: "taupe-beige", name: "Taupe Beige", hex: "#ACA091", image: "/fabrics/taupe-beige.jpg" },
  { id: "mushroom-beige", name: "Mushroom Beige", hex: "#9E9182", image: "/fabrics/mushroom-beige.jpg" },
  { id: "blush-beige", name: "Blush Beige", hex: "#B8A9A2", image: "/fabrics/blush-beige.jpg" },
  { id: "sage-green", name: "Sage Green", hex: "#8F9B8C", image: "/fabrics/sage-green.jpg" },
  { id: "dusty-teal", name: "Dusty Teal", hex: "#6F8A86", image: "/fabrics/dusty-teal.jpg" },
  { id: "eucalyptus-green", name: "Eucalyptus Green", hex: "#829488", image: "/fabrics/eucalyptus-green.jpg" },
  { id: "mist-grey", name: "Mist Grey", hex: "#7E858D", image: "/fabrics/mist-grey.jpg" }
];

export const SOFA_COLORS: ProductColor[] = SOFA_FABRICS.map((fab) => ({
  name: fab.name,
  hex: fab.hex,
  modelColor: parseInt(fab.hex.replace("#", "0x"), 16)
}));

export interface ConfigDetails {
  id: string;
  name: string;
  schematicImage: string;
  schematicTitle: string;
  dimensions: {
    overall: string;
    seatWidth?: string;
    seatDepth: string;
    seatHeight: string;
    clearance: string;
    chaiseSize?: string;
  };
  has3D: boolean;
  modelUrl?: string;
}

export const SOFA_CONFIG_SPECS: Record<string, ConfigDetails> = {
  "3-Seater Sofa": {
    id: "3-seater",
    name: "3-Seater Sofa",
    schematicImage: "/schematics/three_seater.png",
    schematicTitle: "Three Seater Sofa Schematic",
    dimensions: {
      overall: "84\"W x 38\"D x 36\"H",
      seatWidth: "23\" (per seat)",
      seatDepth: "23\"",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: true,
    modelUrl: "/models/sofa7.glb"
  },
  "2-Seater Sofa": {
    id: "2-seater",
    name: "2-Seater Sofa",
    schematicImage: "/schematics/two_seater.png",
    schematicTitle: "Two Seater Sofa Schematic",
    dimensions: {
      overall: "60\"W x 38\"D x 36\"H",
      seatWidth: "23\" (per seat)",
      seatDepth: "23\"",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: false,
    modelUrl: undefined
  },
  "1-Seater Armchair": {
    id: "1-seater",
    name: "1-Seater Armchair",
    schematicImage: "/schematics/one_seater.png",
    schematicTitle: "One Seater Sofa Schematic",
    dimensions: {
      overall: "36\"W x 38\"D x 36\"H",
      seatWidth: "23\"",
      seatDepth: "23\"",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: false,
    modelUrl: undefined
  },
  "L-Shaped Sectional": {
    id: "l-sectional",
    name: "L-Shaped Sectional",
    schematicImage: "/schematics/l_shaped_sectional.png",
    schematicTitle: "L-Shaped Sectional Sofa Schematic",
    dimensions: {
      overall: "118\"W x 68\"D x 36\"H",
      chaiseSize: "42\"W x 68\"D",
      seatDepth: "23\" (Main) / 34\" (Chaise)",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: false,
    modelUrl: undefined
  },
  "U-Shaped Sectional": {
    id: "u-sectional",
    name: "U-Shaped Sectional",
    schematicImage: "/schematics/u_shaped_sectional.png",
    schematicTitle: "U-Shaped Sectional Sofa Schematic",
    dimensions: {
      overall: "142\"W x 68\"D x 36\"H",
      chaiseSize: "Dual 42\"W x 68\"D Chaises",
      seatDepth: "23\" (Main) / 34\" (Chaise)",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: false,
    modelUrl: undefined
  }
};

// Aliases for modern subsection naming
SOFA_CONFIG_SPECS["Single Seater"] = SOFA_CONFIG_SPECS["1-Seater Armchair"];
SOFA_CONFIG_SPECS["Double Seater"] = SOFA_CONFIG_SPECS["2-Seater Sofa"];
SOFA_CONFIG_SPECS["Three Seater"] = SOFA_CONFIG_SPECS["3-Seater Sofa"];
SOFA_CONFIG_SPECS["L-Shaped"] = SOFA_CONFIG_SPECS["L-Shaped Sectional"];
SOFA_CONFIG_SPECS["U-Shaped"] = SOFA_CONFIG_SPECS["U-Shaped Sectional"];

export function getSofaConfigSpec(configName: string): ConfigDetails {
  if (SOFA_CONFIG_SPECS[configName]) return SOFA_CONFIG_SPECS[configName];
  const lower = configName.toLowerCase();
  if (lower.includes("1") || lower.includes("single") || lower.includes("one")) {
    return SOFA_CONFIG_SPECS["1-Seater Armchair"];
  }
  if (lower.includes("2") || lower.includes("two") || lower.includes("double")) {
    return SOFA_CONFIG_SPECS["2-Seater Sofa"];
  }
  if (lower.includes("u-shaped") || lower.includes("u-shape") || lower.includes("ushape")) {
    return SOFA_CONFIG_SPECS["U-Shaped Sectional"];
  }
  if (lower.includes("l-shaped") || lower.includes("l-sectional") || lower.includes("lshape") || lower.includes("chaise")) {
    return SOFA_CONFIG_SPECS["L-Shaped Sectional"];
  }
  return SOFA_CONFIG_SPECS["3-Seater Sofa"];
}

export function getPriceForConfig(basePrice: number, config: string): number {
  if (!config) return basePrice;
  const lower = config.toLowerCase();
  if (lower.includes("single") || lower.includes("1")) {
    return Math.round((basePrice * 0.45) / 1000) * 1000;
  }
  if (lower.includes("double") || lower.includes("2")) {
    return Math.round((basePrice * 0.75) / 1000) * 1000;
  }
  if (lower.includes("l-shaped") || lower.includes("l-sectional") || lower.includes("lshape")) {
    return Math.round((basePrice * 1.35) / 1000) * 1000;
  }
  if (lower.includes("u-shaped") || lower.includes("u-sectional") || lower.includes("ushape")) {
    return Math.round((basePrice * 1.65) / 1000) * 1000;
  }
  return basePrice;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: "sofa" | "sectional" | "chair" | "dining" | "table" | "coffee-corner-table" | "accent-recliner" | "partition-console" | "dining-table" | "chairs" | "themed" | "merchandising" | string;
  colors: ProductColor[];
  dimensions: {
    overall: string;
    seatHeight: string;
    seatDepth: string;
    clearance: string;
  };
  details: string[];
  images: string[];
  fabricImage?: string;
  fabricName?: string;
  modelUrl?: string;
  isPro?: boolean;
  isBestSelling?: boolean;
  isCollections?: boolean;
  configurations?: string[];
  configSketches?: Record<string, string>;
  seaterImages?: Record<string, string>;
  seaterModels?: Record<string, string>;
}

export function getProductImageForSeater(product: Product, seater?: string): string {
  if (seater && product.seaterImages) {
    const s = seater.toLowerCase().trim();
    if (s.includes("single") || s.includes("1") || s.includes("one")) {
      return product.seaterImages["single-seater"] || product.seaterImages["1-seater"] || product.images[0];
    }
    if (s.includes("double") || s.includes("2") || s.includes("two")) {
      return product.seaterImages["double-seater"] || product.seaterImages["2-seater"] || product.images[0];
    }
    if (s.includes("three") || s.includes("3")) {
      return product.seaterImages["three-seater"] || product.seaterImages["3-seater"] || product.images[0];
    }
    if (s.includes("l-shaped") || s.includes("l-sec") || s.includes("lshape") || s.includes("chaise")) {
      return product.seaterImages["l-shaped"] || product.seaterImages["l-sectional"] || product.images[0];
    }
    if (s.includes("u-shaped") || s.includes("u-sec") || s.includes("ushape")) {
      return product.seaterImages["u-shaped"] || product.seaterImages["u-sectional"] || product.images[0];
    }
    if (product.seaterImages[seater]) return product.seaterImages[seater];
  }
  return product.images[0];
}

export function getProductModelForSeater(product: Product, seater?: string): string | undefined {
  if (seater && product.seaterModels) {
    const s = seater.toLowerCase().trim();
    if (s.includes("single") || s.includes("1") || s.includes("one")) {
      return product.seaterModels["single-seater"] || product.seaterModels["1-seater"];
    }
    if (s.includes("double") || s.includes("2") || s.includes("two")) {
      return product.seaterModels["double-seater"] || product.seaterModels["2-seater"];
    }
    if (s.includes("three") || s.includes("3")) {
      return product.seaterModels["three-seater"] || product.seaterModels["3-seater"];
    }
    if (s.includes("l-shaped") || s.includes("l-sec") || s.includes("lshape") || s.includes("chaise")) {
      return product.seaterModels["l-shaped"] || product.seaterModels["l-sectional"];
    }
    if (s.includes("u-shaped") || s.includes("u-sec") || s.includes("ushape")) {
      return product.seaterModels["u-shaped"] || product.seaterModels["u-sectional"];
    }
    if (product.seaterModels[seater]) return product.seaterModels[seater];
  }
  return product.modelUrl;
}

export function getProductSketchForSeater(product: Product, seater?: string): string {
  if (seater && product.configSketches) {
    const s = seater.toLowerCase().trim();
    if (s.includes("single") || s.includes("1") || s.includes("one")) {
      return product.configSketches["single-seater"] || product.configSketches["1-seater"] || product.configSketches["Single Seater"] || "/schematics/one_seater.png";
    }
    if (s.includes("double") || s.includes("2") || s.includes("two")) {
      return product.configSketches["double-seater"] || product.configSketches["2-seater"] || product.configSketches["Double Seater"] || "/schematics/two_seater.png";
    }
    if (s.includes("three") || s.includes("3")) {
      return product.configSketches["three-seater"] || product.configSketches["3-seater"] || product.configSketches["Three Seater"] || "/schematics/three_seater.png";
    }
    if (s.includes("l-shaped") || s.includes("l-sec") || s.includes("lshape") || s.includes("chaise")) {
      return product.configSketches["l-shaped"] || product.configSketches["l-sectional"] || product.configSketches["L-Shaped"] || "/schematics/l_shaped_sectional.png";
    }
    if (s.includes("u-shaped") || s.includes("u-sec") || s.includes("ushape")) {
      return product.configSketches["u-shaped"] || product.configSketches["u-sectional"] || product.configSketches["U-Shaped"] || "/schematics/u_shaped_sectional.png";
    }
    if (product.configSketches[seater]) return product.configSketches[seater];
  }
  const spec = getSofaConfigSpec(seater || "Three Seater");
  return spec.schematicImage;
}

export const PRODUCTS: Product[] = [
  {
    id: "aris",
    name: "ARIS",
    modelUrl: "/models/aris/3.glb",
    tagline: "Architectural fan-pleated grandeur with mirror-finish stainless base blocks.",
    description: "The ARIS Sofa defines modern opulence with its radiant sunburst fluted backrest, tailored angular track arms, and ground-hugging Grade 304 Stainless Steel base blocks. Offered in rich champagne velvet, ARIS merges architectural restraint with deep lounging luxury across armchairs, sofas, and palatial sectionals.",
    price: 268000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "94\"W x 38\"D x 34\"H",
      seatHeight: "18\"",
      seatDepth: "24\"",
      clearance: "3.5\" (PVD Metal Block Feet)"
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
    isBestSelling: true,
    isPro: true,
    isCollections: true
  },
  {
    id: "aura",
    name: "AURA",
    modelUrl: "/models/sofa7.glb",
    tagline: "An invitation to unwind, shaped through softness and simplicity.",
    description: "AURA features soft, continuous lines and rounded forms that create a calm, unified silhouette. Its deep seating and refined fabric upholstery offer a relaxed, enveloping comfort. Designed for contemporary spaces, it brings quiet elegance to both compact and open interiors.",
    price: 245000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "96\"W x 40\"D x 32\"H",
      seatHeight: "17\"",
      seatDepth: "25\"",
      clearance: "2\" (Base Frame)"
    },
    details: [
      "Premium performance linen slipcover (stain & water resistant)",
      "Internal structure engineered with seasoned premium Neem wood",
      "Core HR (High Resilience) foam with dense polyfill wrap for shape retention",
      "Brushed Grade 304 Stainless Steel base frame"
    ],
    images: [
      "/aura-front.jpg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "chester",
    name: "CHESTER",
    tagline: "Classic heritage with a modern presence.",
    description: "Defined by its iconic tufted form and sculpted arms, CHESTER delivers plush comfort with a refined, statement aesthetic—perfect for sophisticated interiors.",
    price: 289900,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "92\"W x 38\"D x 30\"H",
      seatHeight: "18\"",
      seatDepth: "23\"",
      clearance: "5\" (Turned Wooden Legs)"
    },
    details: [
      "Deep diamond tufted upholstery on back and arms",
      "Solid Neem wood frame with anti-termite treatment",
      "High density 40kg/m³ comfort foam cushioning",
      "Custom metal-tipped legs for a contemporary touch"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2eh6T_ytX8jABHn5rxWAg-tvagWQ91cnPuYQRd9dlcg_R2OeErOYk4SpdMjHEGvfwiudEOUhNI5I9aDY89n8RqJTflEusPpcgh94BA_9sYwZa2GHX5j1QC6hCAZ3R4EMoyeTUYCTYTf61GK-UiRzeqSCKF0FjyA17OB8OkG-KXCJARr1-ejuGbKO-WfvHykmalSKZEdVbhzSIUTvgXw6bl4mz6qThauklfrM0M7MIGvBRYRWg0Ze_NQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "aston",
    name: "ASTON",
    tagline: "Defined by detail, elevated by design.",
    description: "With its structured silhouette and signature metal accents, ASTON brings a sophisticated edge to contemporary interiors while maintaining a warm, comfortable feel.",
    price: 310000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "90\"W x 38\"D x 31\"H",
      seatHeight: "17.5\"",
      seatDepth: "24\"",
      clearance: "6\" (Architectural Metal Frame)"
    },
    details: [
      "Exposed outer frame in Grade 304 Stainless Steel with Rose Gold PVD coating",
      "Neem wood structural frame inside for ultimate stability",
      "Layered foam wrap with hypoallergenic micro-fill wrap",
      "Detachable plush comfort back cushions"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHVRzsEWALiCUie-gwFul7CDr-NlGO4QyxaFVaqUxfU8r7DtYESAsJVKkyKiJ09YF-CRxiiLLWHkZN7rd9hhzDq59-y0tiLPLvaZOJYHYkjfQR3gHst6UDjc8eX567g28dxdCrDJv_Xfckk-VgkpCog3q7RdvXmijDYRuSkRB_9aFhZXXGCjaXC-I_-NtZE-FtJRuOhTaeXRfzhIZy0LoA72mR5ldCW9samgVNN7r0yYUUS2yPxkd5LQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "atlas",
    name: "ATLAS",
    tagline: "A bold composition of structure and comfort.",
    description: "ATLAS features a clean, linear silhouette with refined tufted detailing, offering a modern yet inviting presence. Elevated on a sleek metal base, it balances visual lightness with everyday comfort.",
    price: 265000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "94\"W x 39\"D x 32\"H",
      seatHeight: "18\"",
      seatDepth: "24\"",
      clearance: "5.5\" (Stainless Steel Crossed Leg Frame)"
    },
    details: [
      "Modern tufted seat cushions and inner back rest",
      "Polished Gold or Chrome Grade 304 Stainless Steel support stand",
      "Premium Neem Wood internal framing with moisture-resistant seasoning",
      "High resilience 38kg/m³ orthopedic comfort foam layer"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1FwRIMXLDjXnzsXurYPEt7FyMZXe7B14SLHIrJ7KWzqstWk3pqYXCSWV0w0o7CNHefIcFhl7geKQzYBu8kZmqNmgFs_e0JAzdHdl88JTp4O7JR-y8V0Y7I9X3QXn0FyUWGCZk8y7CUhxOdNABsvwKZh2rjj5pYTr_ODVjsLTYQWZpsd8VTBsxLZuF2WvJY8RBa7uXOtNPR_WgIE5KZz7fBSBGhuY5D8b94NQKp3XFjhFai5-0K1O4pQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "brio",
    name: "BRIO",
    tagline: "Where softness meets statement.",
    description: "With its plush silhouette and sculpted detailing, BRIO brings a refined charm to contemporary interiors, elevated by its distinctive metal accents.",
    price: 275000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "90\"W x 38\"D x 33\"H",
      seatHeight: "18\"",
      seatDepth: "23.5\"",
      clearance: "6\" (Bold Geometric Metal Side Legs)"
    },
    details: [
      "Elegant vertical quilting on the backrest and inner arm cushions",
      "Distinctive geometric steel frame cladding on the armrests (Gold PVD)",
      "High Resilience (HR) core with Dacron fibers wrap",
      "Eco-friendly seasoned internal wood frame (pest-resistant Neem)"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNlRJrfsLJ8181XUixKnbvAu0LQwukqsIiVg2Deww9KinL5LRZtke-bOZ2jIPOiDzp38XgQLo90jv9VZZff1FArXyp8kDQSrgcqFMeUtJxX_1kbPxi8T2xC8dRbU9Asd54jAfsAX5zHywM2IW4MWVLWm3kLyvAEZg5nFirREgyJr1a4OO5PH04NIqULcOwardScdBT85cOvmbmZKLgcNvEG8d8pJRR5shmZSNI0aBVxPaHmkZ68n0qWw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "baron",
    name: "BARON",
    tagline: "Defined by contrast, elevated by simplicity.",
    description: "With its layered upholstery and strong silhouette, BARON brings a contemporary edge to modern interiors while maintaining a warm, inviting feel.",
    price: 230000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "86\"W x 37\"D x 34\"H",
      seatHeight: "18.5\"",
      seatDepth: "22.5\"",
      clearance: "6.5\" (Straight Metal Legs)"
    },
    details: [
      "Layered high-contrast upholstery (textured back cushions vs micro-leather frame)",
      "High density foam base topper designed for optimal lumbar support",
      "Neem wood moisture-controlled frame preventing wrap or splits",
      "Signature brushed metal hardware leg options"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2eh6T_ytX8jABHn5rxWAg-tvagWQ91cnPuYQRd9dlcg_R2OeErOYk4SpdMjHEGvfwiudEOUhNI5I9aDY89n8RqJTflEusPpcgh94BA_9sYwZa2GHX5j1QC6hCAZ3R4EMoyeTUYCTYTf61GK-UiRzeqSCKF0FjyA17OB8OkG-KXCJARr1-ejuGbKO-WfvHykmalSKZEdVbhzSIUTvgXw6bl4mz6qThauklfrM0M7MIGvBRYRWg0Ze_NQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "belair",
    name: "BELAIR",
    tagline: "Designed as a landscape of modern comfort.",
    description: "With its distinctive low profile and geometric form, BELAIR redefines contemporary seating—bold in presence, yet effortlessly inviting.",
    price: 320000,
    category: "sectional",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "120\"W x 70\"D x 28\"H (L-Shape)",
      seatHeight: "15\"",
      seatDepth: "26\"",
      clearance: "1.5\" (Recessed Plinth)"
    },
    details: [
      "Ultra-modern low profile landscape modular blocks",
      "Angled architectural armrests with integrated tray functionality",
      "Double-layered High Resilience foam system with extra super soft topper",
      "Architectural steel bracket connectors for customization"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLWPJvH2C6tZhkbarq3ySED3oPQOjqNB9-hKhX5yEXn3ZcrmFnarOctyMmdrjTDj8GPXKnuOYWJ1IDqnHBwxO-OxvHofMV_EmJbnpCB-mmqHcUu1yc1-x7v6HsMQVMAL0sHFXf_44OxbBOyESO2SpIjiScXE8JnX79e9RTwCdDDLFXzlqwPXAN56HO6rMM6HkdzwLP6OzUodXsPeWxtGM-Zs7mYOXLAKnp0tXVWorHf1U1swhRbtYQbA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "bliss",
    name: "BLISS",
    tagline: "A seamless blend of softness and structure.",
    description: "With its curved form and contrasting materials, BLISS delivers a refined seating experience that feels both inviting and elevated.",
    price: 295000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "90\"W x 38\"D x 32\"H",
      seatHeight: "18\"",
      seatDepth: "23\"",
      clearance: "6\" (Brushed Gold Steel Tapered Legs)"
    },
    details: [
      "Unique two-tone contrast wrap structure (Supple leather shell vs soft fabric interior)",
      "Ergonomically contoured armrests matching back contours",
      "Solid moisture-seasoned Neem wood frame construction",
      "Tapered Grade 304 Stainless Steel legs in polished gold finish"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHVRzsEWALiCUie-gwFul7CDr-NlGO4QyxaFVaqUxfU8r7DtYESAsJVKkyKiJ09YF-CRxiiLLWHkZN7rd9hhzDq59-y0tiLPLvaZOJYHYkjfQR3gHst6UDjc8eX567g28dxdCrDJv_Xfckk-VgkpCog3q7RdvXmijDYRuSkRB_9aFhZXXGCjaXC-I_-NtZE-FtJRuOhTaeXRfzhIZy0LoA72mR5ldCW9samgVNN7r0yYUUS2yPxkd5LQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "bond",
    name: "BOND",
    tagline: "Where vibrant expression meets refined design.",
    description: "With its deep upholstery and sharp, architectural lines, BOND brings a confident, contemporary edge to sophisticated interiors.",
    price: 285000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "92\"W x 38\"D x 30\"H",
      seatHeight: "17.5\"",
      seatDepth: "24\"",
      clearance: "5\" (Stainless Steel Sleek Gold Frame)"
    },
    details: [
      "Sophisticated tufted padding styling on seat and inner sides",
      "Exposed slab style legs in Grade 304 Stainless Steel (Gold PVD)",
      "High density 35-40kg/m³ HR foaming system with Polyfill wrapping",
      "Solid core Neem frame supporting structural longevity"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1FwRIMXLDjXnzsXurYPEt7FyMZXe7B14SLHIrJ7KWzqstWk3pqYXCSWV0w0o7CNHefIcFhl7geKQzYBu8kZmqNmgFs_e0JAzdHdl88JTp4O7JR-y8V0Y7I9X3QXn0FyUWGCZk8y7CUhxOdNABsvwKZh2rjj5pYTr_ODVjsLTYQWZpsd8VTBsxLZuF2WvJY8RBa7uXOtNPR_WgIE5KZz7fBSBGhuY5D8b94NQKp3XFjhFai5-0K1O4pQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "bruno",
    name: "BRUNO",
    tagline: "A statement in simplicity.",
    description: "With its sleek silhouette and rich finish, BRUNO brings warmth and character to contemporary interiors while maintaining a minimalist elegance.",
    price: 250000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "86\"W x 36\"D x 32\"H",
      seatHeight: "18\"",
      seatDepth: "22\"",
      clearance: "6\" (Solid Oak Plinth / Gold Steel Base Options)"
    },
    details: [
      "Upholstered in top-grain aniline leather wrapping",
      "Stretched clean seams with low profile armrests",
      "Neem wood base frame structure seasoned with moisture control",
      "Option of solid hardwood oak legs or structural steel frame"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOKnDRIQ2MW41rCygcpHBpaCt0gQzXdENt36QThDOvEO0Ho3ZYciGIUV0P1B6GxZTgRkHlOC9oZh_bYnbwuJB4CEVGEZ-tHn3LN6z74_LmUVO-PSjO-Fmg_4HURcBehYQ0FGhcBmyTg-PiZmCVGeXXNt7JpMiYqfbS7TdJ24tQMs0CPuMwA-lyWrd7XV9CasLHaU60t5QfQxMM_imBrw90TlJQwoyXSWiIOKM0YFBhR6sasARBLRC7aQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "cairo",
    name: "CAIRO",
    tagline: "Timeless craftsmanship with a modern edge.",
    description: "With its deep tufted upholstery and tailored silhouette, CAIRO brings depth, texture, and refined character to contemporary interiors.",
    price: 295000,
    category: "sofa",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "90\"W x 38\"D x 31\"H",
      seatHeight: "17.5\"",
      seatDepth: "23.5\"",
      clearance: "5\" (V-Shaped Polished Gold Legs)"
    },
    details: [
      "Premium button-tufted backrest and inner arm contours",
      "Grade 304 Stainless Steel legs in V-shape with Gold PVD coating",
      "Moisture control seasoned Neem wood frame structure",
      "High Density 40kg/m³ resilience foaming wrapping"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2eh6T_ytX8jABHn5rxWAg-tvagWQ91cnPuYQRd9dlcg_R2OeErOYk4SpdMjHEGvfwiudEOUhNI5I9aDY89n8RqJTflEusPpcgh94BA_9sYwZa2GHX5j1QC6hCAZ3R4EMoyeTUYCTYTf61GK-UiRzeqSCKF0FjyA17OB8OkG-KXCJARr1-ejuGbKO-WfvHykmalSKZEdVbhzSIUTvgXw6bl4mz6qThauklfrM0M7MIGvBRYRWg0Ze_NQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "capri",
    name: "CAPRI",
    tagline: "A seamless blend of structure and softness.",
    description: "With its tailored lines and extended lounging form, CAPRI creates a sophisticated yet inviting seating experience for contemporary interiors.",
    price: 335000,
    category: "sectional",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "115\"W x 68\"D x 32\"H (L-Shape)",
      seatHeight: "18\"",
      seatDepth: "24\"",
      clearance: "5\" (Premium Gold PVD Sled Base)"
    },
    details: [
      "Tailored vertical line quilting on seat backrest and side armrests",
      "Grade 304 Stainless Steel base wrap in Gold PVD",
      "Orthopedic support with dual density HR foam system",
      "Reinforced Neem wood framework for maximum durability"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLWPJvH2C6tZhkbarq3ySED3oPQOjqNB9-hKhX5yEXn3ZcrmFnarOctyMmdrjTDj8GPXKnuOYWJ1IDqnHBwxO-OxvHofMV_EmJbnpCB-mmqHcUu1yc1-x7v6HsMQVMAL0sHFXf_44OxbBOyESO2SpIjiScXE8JnX79e9RTwCdDDLFXzlqwPXAN56HO6rMM6HkdzwLP6OzUodXsPeWxtGM-Zs7mYOXLAKnp0tXVWorHf1U1swhRbtYQbA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  },
  {
    id: "mesa",
    name: "MESA",
    tagline: "Contemporary form, elevated expression.",
    description: "MESA redefines modern comfort with its bold, sculpted presence and distinctive dual-tone design. The structured tufting adds rhythm and depth, while the contrasting hues create a refined visual statement. Resting on sleek metallic legs, MESA balances warmth and precision—perfect for interiors that celebrate both style and individuality.",
    price: 339000,
    category: "sectional",
    colors: SOFA_COLORS,
    dimensions: {
      overall: "120\"W x 68\"D x 34\"H (L-Shape)",
      seatHeight: "18.5\"",
      seatDepth: "23\"",
      clearance: "5.5\" (Gold PVD Cylindrical Legs)"
    },
    details: [
      "Distinctive dual-tone tufted cushioning layers on backrest and seats",
      "Grade 304 Stainless Steel slim cylindrical legs in gold PVD",
      "Seasoned structural grade Neem Wood framing seasoned between 12%-14%",
      "Orthopedic support with High Resilience foam wrap system (38kg/m³)"
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2eh6T_ytX8jABHn5rxWAg-tvagWQ91cnPuYQRd9dlcg_R2OeErOYk4SpdMjHEGvfwiudEOUhNI5I9aDY89n8RqJTflEusPpcgh94BA_9sYwZa2GHX5j1QC6hCAZ3R4EMoyeTUYCTYTf61GK-UiRzeqSCKF0FjyA17OB8OkG-KXCJARr1-ejuGbKO-WfvHykmalSKZEdVbhzSIUTvgXw6bl4mz6qThauklfrM0M7MIGvBRYRWg0Ze_NQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklF1ofNfuL3NCytFzDcpAJIwiM6Xf5nE35JJqG7J7rv5H09mxgX7ZTATNNJ33KIdKEr1sKzdgNCkmwM4vc9S25fUTF6eU1nm-gsy3EeBFemgRvmEac_3KO1vDJ4h8HrHCrsw_sbtPeg0QhX8UGZ8hRWxqaf6LhGGojq94Rw981XG4shyQx4ALa7NHvi4r3LidqKTfJVOHHL3EFNW7UeUKElYePY_bYddbHFuZn4mvJ1GpL8_pKYfzxg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDABIrRlOmTUnPL6lRpRUPHs7AnATrneMweeVTMJg7GLNwYywEhVKAGDvovO-sQ3r8P2D4c-jWqZcpDEks8MIPipQQqLKWmXtEPhFGSN19-vMhxoEHtnIVGubBl8nU0vu2RLWamUMDafWBOB8wlXo155fUFIdRp2mtLbtqvPsnaUXHj2rkr7lwJ4CWwk1LqDDbIuO6kfIe9gfsVtf1OCy_yjYq3Dk35JIpKB5kEbRanTxYMpsTUYZSQ"
    ]
  }
];

export function getMergedProducts(): Product[] {
  return PRODUCTS;
}

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(p => p.id.toLowerCase() === id.toLowerCase());
};

export const SOFA_PRODUCTS: Product[] = PRODUCTS.filter(
  p => p.category === "sofa" || p.category === "sectional"
);
