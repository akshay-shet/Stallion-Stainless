"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star, MessageSquare, User, Clock, Check } from "lucide-react";
import { getMergedProducts, Product } from "@/data/products";

interface Review {
  id: string;
  itemType: string;
  productId: string;
  itemName: string;
  rating: number;
  opinion: string;
  reviewerName: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Form State
  const [itemType, setItemType] = useState("Sofa");
  const [productId, setProductId] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [opinion, setOpinion] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const itemCategories = [
    { name: "Sofa", dbCategory: "sofa" },
    { name: "Accent & Recliner", dbCategory: "accent-recliner" },
    { name: "Coffee & Corner Table", dbCategory: "coffee-corner-table" },
    { name: "Dining Table", dbCategory: "dining-table" },
    { name: "Partition & Console", dbCategory: "partition-console" },
    { name: "Chairs", dbCategory: "chairs" },
    { name: "Themed", dbCategory: "themed" },
    { name: "Merchandising", dbCategory: "merchandising" }
  ];

  useEffect(() => {
    // Load products
    const items = getMergedProducts();
    setProductList(items);

    // Load existing reviews, cleaning up the legacy mock reviews if present in user's localStorage
    const saved = localStorage.getItem("stallion_reviews");
    let reviewsList: Review[] = [];
    if (saved) {
      try {
        reviewsList = JSON.parse(saved);
      } catch (e) {
        reviewsList = [];
      }
    }
    // Filter out the legacy mock reviews completely
    const cleanList = reviewsList.filter(r => r.id !== "mock-1" && r.id !== "mock-2");
    if (reviewsList.length !== cleanList.length) {
      localStorage.setItem("stallion_reviews", JSON.stringify(cleanList));
    }
    setReviews(cleanList);
  }, []);

  // Update default selected product whenever itemType category changes
  useEffect(() => {
    const matchedCategory = itemCategories.find(c => c.name === itemType)?.dbCategory || "sofa";
    const filtered = productList.filter(p => {
      if (matchedCategory === "coffee-corner-table") return p.category === "coffee-corner-table" || p.category === "coffee-table" || p.category === "corner-table" || (p.category as string) === "table";
      if (matchedCategory === "accent-recliner") return p.category === "accent-recliner" || p.category === "accent" || p.category === "recliner";
      if (matchedCategory === "partition-console") return p.category === "partition-console" || p.category === "partition" || p.category === "console";
      return p.category === matchedCategory;
    });
    if (filtered.length > 0) {
      setProductId(filtered[0].id);
    } else {
      setProductId("");
    }
  }, [itemType, productList]);

  // Calculations for average rating
  const averageRating = reviews.length > 0 
    ? parseFloat((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewerName.trim()) {
      setErrorMsg("Please provide your name.");
      return;
    }
    if (!productId) {
      setErrorMsg("Please select a catalog item.");
      return;
    }
    if (!opinion.trim() || opinion.trim().length < 10) {
      setErrorMsg("Please write an honest opinion (minimum 10 characters).");
      return;
    }

    const matchedProduct = productList.find(p => p.id === productId);
    if (!matchedProduct) {
      setErrorMsg("Selected product is invalid.");
      return;
    }

    setErrorMsg("");
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      itemType,
      productId,
      itemName: matchedProduct.name,
      rating,
      reviewerName: reviewerName.trim(),
      opinion: opinion.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("stallion_reviews", JSON.stringify(updated));

    // Reset inputs
    setReviewerName("");
    setOpinion("");
    setRating(5);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  // Helper to check category match including merged category fallbacks
  const isCategoryMatch = (pCategory: string, targetCategory: string) => {
    if (targetCategory === "coffee-corner-table") {
      return pCategory === "coffee-corner-table" || pCategory === "coffee-table" || pCategory === "corner-table" || (pCategory as string) === "table";
    }
    if (targetCategory === "accent-recliner") {
      return pCategory === "accent-recliner" || pCategory === "accent" || pCategory === "recliner";
    }
    if (targetCategory === "partition-console") {
      return pCategory === "partition-console" || pCategory === "partition" || pCategory === "console";
    }
    return pCategory === targetCategory;
  };

  // Get active products for the selected item type dropdown
  const currentCategoryDbName = itemCategories.find(c => c.name === itemType)?.dbCategory || "sofa";
  const filteredProductOptions = productList.filter(p => isCategoryMatch(p.category, currentCategoryDbName));

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-12 md:px-20 py-16 w-full pt-[72px] sm:pt-[88px]">
        {/* Header Summary */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-display tracking-widest text-stone-500 uppercase font-semibold">
            Patron Testimonials
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-charcoal-ink leading-tight mt-4 uppercase">
            Product Reviews
          </h1>
          <div className="h-[2px] w-12 bg-charcoal-ink mx-auto mt-4 mb-6" />
          
          {/* Average Stars Summary at the Top */}
          <div className="bg-white border border-stainless-silver py-6 px-8 inline-flex flex-col items-center justify-center rounded-sm shadow-sm">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500 mb-1">Overall Satisfaction</span>
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-display font-bold text-charcoal-ink">{averageRating.toFixed(1)}</span>
              <span className="text-stone-300 text-lg font-sans">/ 5.0</span>
            </div>
            
            {/* Visual Stars */}
            <div className="flex items-center gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const isGold = i < Math.round(averageRating);
                return (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${isGold ? "fill-primary text-primary" : "text-stone-200 fill-stone-100"}`}
                  />
                );
              })}
            </div>
            <span className="text-[9px] font-sans text-stone-400 mt-2 uppercase tracking-wide">Based on {reviews.length} submitted reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Review Submission Form */}
          <div className="lg:col-span-5 bg-white border border-stainless-silver p-8 rounded-sm shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold border-b border-stainless-silver pb-2.5 mb-5 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Share Your Experience
                </h3>
                <p className="text-[10px] text-stone-500 font-sans leading-relaxed mb-4">
                  Honest feedback helps us refine our bespoke fabrication models. Once submitted, review scores cannot be changed or deleted.
                </p>
              </div>

              {/* Patron Name */}
              <div>
                <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sen"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                  required
                />
              </div>

              {/* Item Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Item Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                  >
                    {itemCategories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Item Name dropdown dynamically filtered */}
                <div>
                  <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Catalog Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                    required
                  >
                    {filteredProductOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                    ))}
                    {filteredProductOptions.length === 0 && (
                      <option value="">No items available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Clickable star selection */}
              <div>
                <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Your Rating</label>
                <div className="flex items-center gap-1.5 mt-1 bg-stone-50 border border-stainless-silver p-3 rounded-sm">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1;
                    const isGold = hoverRating !== null ? starVal <= hoverRating : starVal <= rating;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="focus:outline-none transition-transform hover:scale-110"
                        title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer ${isGold ? "fill-primary text-primary" : "text-stone-300"}`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 ml-auto">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Text opinion */}
              <div>
                <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Honest Opinion</label>
                <textarea
                  placeholder="Share your detailed feedback regarding quality, stainless welding, design alignment, and aesthetics..."
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans resize-none"
                  required
                />
              </div>

              {errorMsg && <p className="text-red-500 text-xs font-sans mt-2 font-semibold">{errorMsg}</p>}
              {success && (
                <p className="text-emerald-600 text-xs font-sans mt-2 font-semibold bg-emerald-50 p-3 border border-emerald-100 rounded-sm flex items-center gap-2">
                  <Check className="h-4 w-4" /> Review successfully submitted! Thank you for your feedback.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-charcoal-ink hover:bg-stone-850 text-white font-sans text-xs tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md font-bold cursor-pointer"
              >
                Submit Locked Review
              </button>
            </form>
          </div>

          {/* Right: Reviews List Grid */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold border-b border-stainless-silver pb-2.5 mb-5 flex items-center gap-2">
              <Star className="h-4 w-4" /> Verified Patron Feedback ({reviews.length})
            </h3>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {reviews.map((r) => (
                <div key={r.id} className="border border-stainless-silver p-5 rounded-sm bg-white hover:shadow-sm transition-shadow space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans font-bold text-charcoal-ink">{r.reviewerName}</span>
                        <span className="text-[9px] font-sans text-stone-400 flex items-center gap-1">
                          <User className="h-3 w-3" /> {r.itemType}
                        </span>
                      </div>
                      <div className="text-[9px] font-sans text-stone-500 uppercase font-semibold tracking-wider mt-1 text-primary">
                        {r.itemName}
                      </div>
                    </div>

                    {/* rating stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const isGold = idx < r.rating;
                        return (
                          <Star
                            key={idx}
                            className={`h-3 w-3 ${isGold ? "fill-primary text-primary" : "text-stone-200 fill-stone-100"}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                    "{r.opinion}"
                  </p>

                  <div className="flex items-center gap-1 text-[8px] font-sans text-stone-400 mt-2">
                    <Clock className="h-3 w-3" /> {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-sm bg-white">
                  <p className="text-xs text-stone-400 font-sans tracking-wide uppercase">No reviews posted yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
