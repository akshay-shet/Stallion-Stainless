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
    schematicImage: "/schematics-2d/Three-Seater Sofa Schematic.png",
    schematicTitle: "Three Seater Sofa Schematic",
    dimensions: {
      overall: "84\"W x 38\"D x 36\"H",
      seatWidth: "23\" (per seat)",
      seatDepth: "23\"",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: true,
    modelUrl: "/models/aris/3.glb"
  },
  "2-Seater Sofa": {
    id: "2-seater",
    name: "2-Seater Sofa",
    schematicImage: "/schematics-2d/Two-Seater Sofa Schematic.png",
    schematicTitle: "Two Seater Sofa Schematic",
    dimensions: {
      overall: "60\"W x 38\"D x 36\"H",
      seatWidth: "23\" (per seat)",
      seatDepth: "23\"",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: true,
    modelUrl: "/models/aris/2.glb"
  },
  "1-Seater Armchair": {
    id: "1-seater",
    name: "1-Seater Armchair",
    schematicImage: "/schematics-2d/Single Seater Sofa Schematic.png",
    schematicTitle: "One Seater Sofa Schematic",
    dimensions: {
      overall: "36\"W x 38\"D x 36\"H",
      seatWidth: "23\"",
      seatDepth: "23\"",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: true,
    modelUrl: "/models/aris/1.glb"
  },
  "L-Shaped Sectional": {
    id: "l-sectional",
    name: "L-Shaped Sectional",
    schematicImage: "/schematics-2d/L-Shaped Sofa Schematic Dimensions.png",
    schematicTitle: "L-Shaped Sectional Sofa Schematic",
    dimensions: {
      overall: "118\"W x 68\"D x 36\"H",
      chaiseSize: "42\"W x 68\"D",
      seatDepth: "23\" (Main) / 34\" (Chaise)",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: true,
    modelUrl: "/models/aris/L.glb"
  },
  "U-Shaped Sectional": {
    id: "u-sectional",
    name: "U-Shaped Sectional",
    schematicImage: "/schematics-2d/U-Shaped Sofa Schematic Dimensions.png",
    schematicTitle: "U-Shaped Sectional Sofa Schematic",
    dimensions: {
      overall: "142\"W x 68\"D x 36\"H",
      chaiseSize: "Dual 42\"W x 68\"D Chaises",
      seatDepth: "23\" (Main) / 34\" (Chaise)",
      seatHeight: "25\"",
      clearance: "4\" (Metal Legs)"
    },
    has3D: true,
    modelUrl: "/models/aris/U.glb"
  }
};

// Aliases
SOFA_CONFIG_SPECS["Single Seater"] = SOFA_CONFIG_SPECS["1-Seater Armchair"];
SOFA_CONFIG_SPECS["Double Seater"] = SOFA_CONFIG_SPECS["2-Seater Sofa"];
SOFA_CONFIG_SPECS["Three Seater"] = SOFA_CONFIG_SPECS["3-Seater Sofa"];
SOFA_CONFIG_SPECS["L-Shaped"] = SOFA_CONFIG_SPECS["L-Shaped Sectional"];
SOFA_CONFIG_SPECS["U-Shaped"] = SOFA_CONFIG_SPECS["U-Shaped Sectional"];

export function getSofaConfigSpec(configName: string): ConfigDetails {
  if (SOFA_CONFIG_SPECS[configName]) return SOFA_CONFIG_SPECS[configName];
  const lower = (configName || "").toLowerCase();
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
  category: "sofa" | "sectional" | "chair" | "dining" | "table" | "corner-table" | "teapoy" | "coffee-corner-table" | "partition-console" | "dining-table" | "chairs" | "themed" | "merchandising" | string;
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
  colorMode?: "mono" | "dual" | "triple";
  primaryColor?: string;
  accentColor?: string;
  tertiaryColor?: string;
  colorPalette?: string[];
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
      return product.configSketches["single-seater"] || product.configSketches["1-seater"] || product.configSketches["Single Seater"] || "/schematics-2d/Single Seater Sofa Schematic.png";
    }
    if (s.includes("double") || s.includes("2") || s.includes("two")) {
      return product.configSketches["double-seater"] || product.configSketches["2-seater"] || product.configSketches["Double Seater"] || "/schematics-2d/Two-Seater Sofa Schematic.png";
    }
    if (s.includes("three") || s.includes("3")) {
      return product.configSketches["three-seater"] || product.configSketches["3-seater"] || product.configSketches["Three Seater"] || "/schematics-2d/Three-Seater Sofa Schematic.png";
    }
    if (s.includes("l-shaped") || s.includes("l-sec") || s.includes("lshape") || s.includes("chaise")) {
      return product.configSketches["l-shaped"] || product.configSketches["l-sectional"] || product.configSketches["L-Shaped"] || "/schematics-2d/L-Shaped Sofa Schematic Dimensions.png";
    }
    if (s.includes("u-shaped") || s.includes("u-sec") || s.includes("ushape")) {
      return product.configSketches["u-shaped"] || product.configSketches["u-sectional"] || product.configSketches["U-Shaped"] || "/schematics-2d/U-Shaped Sofa Schematic Dimensions.png";
    }
    if (product.configSketches[seater]) return product.configSketches[seater];
  }
  const spec = getSofaConfigSpec(seater || "Three Seater");
  return spec.schematicImage;
}
