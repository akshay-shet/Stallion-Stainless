export * from "./productTypes";
import { Product } from "./productTypes";
import { SOFA_PRODUCTS } from "./sofas";
import { DINING_TABLE_PRODUCTS } from "./diningTables";
import { CORNER_TABLE_PRODUCTS } from "./cornerTables";
import { TEAPOY_PRODUCTS } from "./teapoys";

export { SOFA_PRODUCTS } from "./sofas";
export { DINING_TABLE_PRODUCTS } from "./diningTables";
export { CORNER_TABLE_PRODUCTS } from "./cornerTables";
export { TEAPOY_PRODUCTS } from "./teapoys";

// Interleave all 4 categories so the "All Products" catalogue is an engaging, random-style mix
// (Sofa, Dining Table, Corner Table, Teapoy, Sofa, Dining Table, Corner Table, Teapoy...)
function createInterleavedCatalog(
  sofas: Product[],
  dining: Product[],
  corners: Product[],
  teapoys: Product[]
): Product[] {
  const result: Product[] = [];
  const maxLen = Math.max(sofas.length, dining.length, corners.length, teapoys.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < sofas.length) result.push(sofas[i]);
    if (i < dining.length) result.push(dining[i]);
    if (i < corners.length) result.push(corners[i]);
    if (i < teapoys.length) result.push(teapoys[i]);
  }

  return result;
}

export const PRODUCTS: Product[] = createInterleavedCatalog(
  SOFA_PRODUCTS,
  DINING_TABLE_PRODUCTS,
  CORNER_TABLE_PRODUCTS,
  TEAPOY_PRODUCTS
);

export function getMergedProducts(): Product[] {
  return PRODUCTS;
}

// Normalize ID lookup for both zero-padded and non-zero-padded formats (e.g., dt-001 vs dt-01 vs dt-1)
export const getProductById = (id: string): Product | undefined => {
  if (!id) return undefined;
  const cleanId = id.toLowerCase().replace(/\s+/g, "").trim();

  // 1. Direct match
  const directMatch = PRODUCTS.find((p) => p.id.toLowerCase() === cleanId);
  if (directMatch) return directMatch;

  // 2. Normalized code matching (dt-1 -> dt-001, ct-01 -> ct-001, sst-01 -> sst-001)
  const codeMatch = cleanId.match(/^(dt|ct|sst)-?(\d+)$/);
  if (codeMatch) {
    const prefix = codeMatch[1];
    const num = parseInt(codeMatch[2], 10);
    const paddedId = `${prefix}-${String(num).padStart(3, "0")}`;
    return PRODUCTS.find((p) => p.id.toLowerCase() === paddedId);
  }

  // 3. Fallback: match by product name
  return PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "") === cleanId
  );
};
