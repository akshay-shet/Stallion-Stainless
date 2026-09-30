"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar, { SOFA_SUBSECTIONS } from "@/components/Sidebar";
import { PRODUCTS, Product, getMergedProducts, getProductImageForSeater } from "@/data/products";
import { ChevronRight, Menu, SlidersHorizontal, Search, X } from "lucide-react";

export default function SeaterCollectionPage() {
  const router = useRouter();
  const params = useParams();
  const seaterSlug = (params?.seater as string) || "single-seater";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Featured");
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    setProductList(getMergedProducts());
  }, []);

  const currentSubsection = useMemo(() => {
    const matched = SOFA_SUBSECTIONS.find((s) => s.id === seaterSlug);
    if (matched) return matched;
    // Fallback: format slug into readable title
    const formatted = seaterSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      id: seaterSlug,
      name: formatted,
      label: formatted,
      title: `${formatted} Sofas`,
      description: `Architectural ${formatted.toLowerCase()} designs crafted with precision stainless steel frames and premium tailoring.`
    };
  }, [seaterSlug]);

  // Filter sofas and apply search + sorting
  const filteredProducts = useMemo(() => {
    let result = productList.filter(
      (p) => p.category === "sofa" || p.category === "sectional"
    );

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "Alphabetical: A to Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Alphabetical: Z to A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "Newest") {
      result.reverse();
    }

    return result;
  }, [productList, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory text-on-surface">
      <Header />

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop Container (Fixed, no animation) */}
        <div className="hidden lg:block w-64 shrink-0 border-r border-stainless-silver bg-warm-ivory z-40">
          <Sidebar
            selectedCategory="sofa"
            selectedConfig={currentSubsection.name}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto z-50 p-4 border-r border-stone-200 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
                <span className="font-display text-sm font-bold text-stone-900 uppercase tracking-wider">Categories</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-700 hover:text-black transition-colors cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                selectedCategory="sofa"
                selectedConfig={currentSubsection.name}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-grow px-2 sm:px-6 md:pl-12 md:pr-20 py-3 sm:py-12 min-w-0 w-full max-w-container-max mx-auto">
          {/* Breadcrumbs, Menu Toggle & Search Bar in One Line on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-4 mb-3 sm:mb-8 w-full">
            {/* Menu Toggle for Mobile Filter Drawer */}
            <button
              className="lg:hidden flex items-center justify-center p-1.5 sm:p-2 rounded-md hover:bg-stone-200 transition-colors text-charcoal-ink shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Breadcrumb Path (Desktop Only) */}
            <nav aria-label="Breadcrumb" className="hidden lg:flex items-center text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-on-surface-variant shrink-0">
              <ol className="inline-flex items-center space-x-1 sm:space-x-2">
                <li>
                  <Link href="/" className="hover:text-charcoal-ink transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1 sm:gap-2">
                  <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-stone-400" />
                  <Link href="/collections" className="hover:text-charcoal-ink transition-colors">
                    Collections
                  </Link>
                </li>
                <li className="flex items-center gap-1 sm:gap-2">
                  <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-stone-400" />
                  <span className="text-charcoal-ink font-semibold truncate max-w-[70px] sm:max-w-none">{currentSubsection.name}</span>
                </li>
              </ol>
            </nav>

            {/* Mobile Section Title + Count: e.g. Three Seater (6) */}
            <h1 className="lg:hidden font-display text-sm xs:text-base font-bold tracking-wide text-charcoal-ink capitalize shrink-0 truncate max-w-[140px] xs:max-w-none">
              {currentSubsection.name}{" "}
              <span className="font-sans text-xs xs:text-sm font-normal text-on-surface-variant">
                ({filteredProducts.length})
              </span>
            </h1>

            {/* Search Bar - Flex-1 so it takes remaining space in the exact same line */}
            <div className="relative flex-1 min-w-0 sm:w-64 sm:flex-initial ml-auto">
              <input
                type="text"
                placeholder="Search sofas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-stainless-silver rounded-md sm:rounded-sm py-1 sm:py-2 pl-7 sm:pl-9 pr-2 sm:pr-4 text-xs sm:text-sm focus:outline-none focus:border-charcoal-ink focus:ring-1 focus:ring-charcoal-ink text-charcoal-ink placeholder:text-stone-400"
              />
              <Search className="absolute left-2 sm:left-3 top-1.5 sm:top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-on-surface-variant pointer-events-none" />
            </div>
          </div>

          {/* Header: Title & Sort By on Desktop; Sort By Only on Mobile */}
          <div className="flex flex-row justify-end lg:justify-between items-center mb-3 sm:mb-10 border-b border-stainless-silver pb-2 sm:pb-6 gap-2 w-full">
            <div className="hidden lg:flex items-baseline gap-1.5 min-w-0">
              <h1 className="font-display sm:text-3xl font-bold tracking-tight text-charcoal-ink capitalize truncate">
                {currentSubsection.title}
              </h1>
              <span className="font-sans text-sm text-on-surface-variant shrink-0 font-medium">
                ({filteredProducts.length})
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm shrink-0">
              <span className="font-sans text-[9px] sm:text-xs tracking-wider uppercase text-on-surface-variant font-medium whitespace-nowrap">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-outline-variant py-0.5 sm:py-1 pr-3 sm:pr-6 focus:outline-none focus:border-charcoal-ink font-sans text-xs sm:text-sm text-charcoal-ink cursor-pointer"
              >
                <option>Featured</option>
                <option>Alphabetical: A to Z</option>
                <option>Alphabetical: Z to A</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Product Grid: 2 in a row on mobile */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-6 md:gap-x-8 md:gap-y-16 mb-12 sm:mb-24">
              {filteredProducts.map((product) => {
                const productHref = `/products/${product.id}?seater=${encodeURIComponent(
                  currentSubsection.name
                )}`;

                return (
                  <article
                    key={product.id}
                    className="group cursor-pointer flex flex-col justify-between h-full bg-surface border border-stainless-silver p-2 sm:p-4 rounded-lg sm:rounded-sm hover:border-charcoal-ink transition-colors shadow-2xs sm:shadow-none"
                  >
                    <Link
                      href={productHref}
                      className="flex flex-col h-full justify-between"
                    >
                      <div>
                        <div className="relative aspect-[4/3] mb-2 sm:mb-6 overflow-hidden border border-stainless-silver/60 rounded-sm bg-warm-ivory">
                          <Image
                            alt={product.name}
                            src={
                              getProductImageForSeater(product, currentSubsection.name) ||
                              product.images?.[0] ||
                              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"
                            }
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="mb-0.5 sm:mb-1">
                          <h3 className="font-display text-xs sm:text-lg font-bold text-charcoal-ink uppercase tracking-wider truncate sm:whitespace-normal">
                            {product.name}
                          </h3>
                        </div>
                        {/* Tagline: Hidden on mobile (Android), visible on desktop */}
                        <p className="hidden sm:block font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-2 min-h-[36px]">
                          {product.tagline}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-4">
                        {/* Fabric Color dots preview */}
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 items-center max-h-4 sm:max-h-none overflow-hidden">
                          {product.colors.slice(0, 5).map((color) => (
                            <div
                              key={color.name}
                              className="w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full border border-stone-300 shadow-2xs cursor-pointer transition-transform hover:scale-125"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-[8px] sm:text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-outline-variant bg-surface rounded-sm">
              <p className="font-display text-lg text-on-surface-variant">
                No sofa models match your search criteria.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-sm font-sans underline text-charcoal-ink font-semibold hover:text-stone-600"
              >
                Clear search query
              </button>
            </div>
          )}
        </main>
      </div>
    </div>

    <Footer />
  </div>
);
}
