"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

export interface SofaSubsection {
  id: string;
  name: string;
  label: string;
  title: string;
  description: string;
}

export const SOFA_SUBSECTIONS: SofaSubsection[] = [
  { 
    id: "single-seater", 
    name: "Single Seater", 
    label: "Single Seater",
    title: "Single Seater Sofas",
    description: "Compact architectural single-seater silhouettes crafted with premium stainless steel framing."
  },
  { 
    id: "double-seater", 
    name: "Double Seater", 
    label: "Double Seater",
    title: "Double Seater Sofas",
    description: "Two-seater proportioned sofas engineered for modern living rooms and executive lounges."
  },
  { 
    id: "three-seater", 
    name: "Three Seater", 
    label: "Three Seater",
    title: "Three Seater Sofas",
    description: "Generous three-seater sofas offering expansive comfort, deep seating, and precision metallic accents."
  },
  { 
    id: "l-shaped", 
    name: "L-Shaped", 
    label: "L-Shaped",
    title: "L-Shaped Sectionals",
    description: "Contemporary corner sectionals and chaise lounge setups designed to define luxury spaces."
  },
  { 
    id: "u-shaped", 
    name: "U-Shaped", 
    label: "U-Shaped",
    title: "U-Shaped Sectionals",
    description: "Grand architectural multi-sided sectionals for expansive living salons and luxury estates."
  },
];

interface SidebarProps {
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  selectedConfig?: string;
  onSelectConfig?: (config: string) => void;
  currentProductId?: string;
}

export default function Sidebar({
  selectedCategory = "all",
  setSelectedCategory,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const categories = [
    { id: "all", name: "All Products" },
    { id: "sofa", name: "Sofa" },
    { id: "accent-recliner", name: "Accent & Recliner" },
    { id: "coffee-corner-table", name: "Coffee & Corner Table" },
    { id: "dining-table", name: "Dining Table" },
    { id: "partition-console", name: "Partition & Console" },
    { id: "chairs", name: "Chairs" },
    { id: "themed", name: "Themed" },
    { id: "merchandising", name: "Merchandising" }
  ];

  const handleCategoryClick = (catId: string) => {
    if (setSelectedCategory && pathname === "/collections") {
      setSelectedCategory(catId);
    } else {
      router.push(`/collections?category=${catId}`);
    }
  };

  return (
    <aside data-lenis-prevent className="sticky top-[73px] p-4 py-5 flex flex-col gap-4 h-[calc(100vh-73px)] select-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white">
      {/* Title */}
      <div>
        <h2 className="font-display text-lg font-extrabold text-stone-900 tracking-tight">Collections</h2>
        <p className="font-sans text-[11px] tracking-wider uppercase text-stone-600 font-bold mt-0.5">
          Refine by Category
        </p>
      </div>

      {/* Categories List */}
      <nav className="flex flex-col gap-1 w-full">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`text-left py-2 px-3 text-xs sm:text-sm font-sans tracking-wide cursor-pointer rounded-lg transition-all duration-150 ${
                isActive
                  ? "text-white font-bold bg-stone-900 shadow-xs"
                  : "text-stone-900 hover:text-black font-semibold hover:bg-stone-100 active:bg-stone-200"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </nav>

    </aside>
  );
}
