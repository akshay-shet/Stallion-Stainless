"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SOFA_SUBSECTIONS } from "@/components/Sidebar";
import { getProductById, PRODUCTS, getProductImageForSeater, Product } from "@/data/products";
import { Trash2, ShoppingCart, MessageSquare, ArrowLeft, Plus, Minus, Check } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  color: string;
  colorHex: string;
  configuration: string;
  steelFinish?: string;
  quantity: number;
  tagline: string;
  image: string;
}

// Resilient product resolver for cart items (handles legacy items without explicit productId)
const getProductForCartItem = (item: CartItem): Product | undefined => {
  if (item.productId) {
    const p = getProductById(item.productId);
    if (p) return p;
  }
  const idPrefix = item.id ? item.id.split("-")[0] : "";
  if (idPrefix) {
    const p = getProductById(idPrefix);
    if (p) return p;
  }
  if (item.name) {
    const p = PRODUCTS.find((prod) => prod.name.toLowerCase() === item.name.toLowerCase());
    if (p) return p;
  }
  if (item.name?.toLowerCase().includes("aris") || item.id?.toLowerCase().includes("aris")) {
    return getProductById("aris");
  }
  return undefined;
};

// Determines if an item is a sofa product eligible for multi-seater configuration
const isCartItemSofa = (item: CartItem, product?: Product): boolean => {
  if (product?.category === "sofa" || product?.category === "sectional") return true;
  if (product?.seaterModels) return true;
  if (item.name?.toLowerCase().includes("sofa") || item.name?.toLowerCase() === "aris") return true;
  return SOFA_SUBSECTIONS.some(
    (s) =>
      s.name.toLowerCase() === item.configuration?.toLowerCase() ||
      s.id.toLowerCase() === item.configuration?.toLowerCase()
  );
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Checkout details form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customization, setCustomization] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load cart items
  useEffect(() => {
    const savedCart = localStorage.getItem("stallion_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems([]);
      }
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("stallion_cart", JSON.stringify(newCart));
  };

  const handleRemove = (itemId: string) => {
    const updated = cartItems.filter((item) => item.id !== itemId);
    updateCart(updated);
  };

  const handleQtyChange = (itemId: string, increment: boolean) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        const newQty = increment ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(updated);
  };

  // Update quantity of any seater within a sofa set directly from the cart
  const handleUpdateSeaterQty = (
    baseItem: CartItem,
    seaterName: string,
    delta: number
  ) => {
    const product = getProductForCartItem(baseItem);
    const prodId = baseItem.productId || product?.id || "aris";
    const steelFinish = baseItem.steelFinish || "";

    const existingIdx = cartItems.findIndex((ci) => {
      const ciProd = getProductForCartItem(ci);
      const ciProdId = ci.productId || ciProd?.id || "aris";
      return (
        ciProdId === prodId &&
        ci.color.toLowerCase() === baseItem.color.toLowerCase() &&
        (ci.steelFinish || "").toLowerCase() === steelFinish.toLowerCase() &&
        (ci.configuration.toLowerCase() === seaterName.toLowerCase() ||
          ci.configuration.toLowerCase().replace(/\s+/g, "-") === seaterName.toLowerCase().replace(/\s+/g, "-"))
      );
    });

    let updated = [...cartItems];
    if (existingIdx > -1) {
      const newQty = updated[existingIdx].quantity + delta;
      if (newQty <= 0) {
        updated.splice(existingIdx, 1);
      } else {
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
      }
    } else if (delta > 0) {
      const seaterImg = product ? getProductImageForSeater(product, seaterName) : baseItem.image;
      const targetId = `${prodId}-${baseItem.color.replace(/\s+/g, "-")}-${steelFinish.replace(/\s+/g, "-")}-${seaterName.replace(/\s+/g, "-")}`;
      const newItem: CartItem = {
        id: targetId,
        productId: prodId,
        name: baseItem.name,
        color: baseItem.color,
        colorHex: baseItem.colorHex,
        configuration: seaterName,
        steelFinish: baseItem.steelFinish,
        quantity: delta,
        tagline: baseItem.tagline,
        image: seaterImg,
      };
      updated.push(newItem);
    }
    updateCart(updated);
  };

  // Remove all seaters belonging to an entire sofa set
  const handleRemoveSofaSet = (baseItem: CartItem) => {
    const product = getProductForCartItem(baseItem);
    const prodId = baseItem.productId || product?.id || "aris";
    const steelFinish = baseItem.steelFinish || "";

    const updated = cartItems.filter((ci) => {
      const ciProd = getProductForCartItem(ci);
      const ciProdId = ci.productId || ciProd?.id || "aris";
      const isSameSet =
        ciProdId === prodId &&
        ci.color.toLowerCase() === baseItem.color.toLowerCase() &&
        (ci.steelFinish || "").toLowerCase() === steelFinish.toLowerCase();
      return !isSameSet;
    });
    updateCart(updated);
  };

  // Group cart items into Sofa Sets vs Non-Sofa individual products
  const renderedSetKeys = new Set<string>();

  // Order Submission via WhatsApp (Without any prices)
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg("Please enter your name for delivery.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter your complete physical address.");
      return;
    }

    setErrorMsg("");

    // Build the structured WhatsApp message without mentioning prices
    let itemsDescription = "";
    const processedSets = new Set<string>();
    let entryNum = 1;

    cartItems.forEach((item) => {
      const product = getProductForCartItem(item);
      const isSofa = isCartItemSofa(item, product);

      if (isSofa) {
        const prodId = item.productId || product?.id || "aris";
        const setKey = `${prodId}-${item.color}-${item.steelFinish || ""}`;

        if (!processedSets.has(setKey)) {
          processedSets.add(setKey);
          const seatersInSet = cartItems.filter((ci) => {
            const ciProd = getProductForCartItem(ci);
            const ciProdId = ci.productId || ciProd?.id || "aris";
            return (
              ciProdId === prodId &&
              ci.color.toLowerCase() === item.color.toLowerCase() &&
              (ci.steelFinish || "").toLowerCase() === (item.steelFinish || "").toLowerCase()
            );
          });

          const totalPcs = seatersInSet.reduce((acc, s) => acc + s.quantity, 0);

          itemsDescription += `${entryNum}. *${item.name} Living Room Set* (${totalPcs} Pieces)\n`;
          itemsDescription += `   • Fabric: ${item.color}\n`;
          itemsDescription += `   • Base Finish: ${item.steelFinish || "Standard"}\n`;
          itemsDescription += `   • Seater Configuration & Quantities:\n`;
          seatersInSet.forEach((s) => {
            itemsDescription += `     - ${s.quantity} x ${s.configuration}\n`;
          });
          itemsDescription += `\n`;
          entryNum++;
        }
      } else {
        itemsDescription += `${entryNum}. *${item.name}* (Qty: ${item.quantity})\n`;
        itemsDescription += `   • Color: ${item.color}\n`;
        if (item.configuration) itemsDescription += `   • Configuration: ${item.configuration}\n`;
        if (item.steelFinish) itemsDescription += `   • Base Finish: ${item.steelFinish}\n`;
        itemsDescription += `\n`;
        entryNum++;
      }
    });

    const rawMessage = `*STALLION STAINLESS - CONFIGURATION INQUIRY*
-------------------------------------------
*Customer Details:*
• *Name:* ${name.trim()}
• *Phone Number:* ${phone.trim()}
• *Delivery Address:* ${address.trim()}

*Inquiry Details:*
${itemsDescription}*Customization Requirements:*
${customization.trim() ? customization.trim() : "None specified"}
-------------------------------------------
Please review this living room configuration inquiry and revert with custom quotation and fabrication timeline.`;

    const waNumber = "919019516846";
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

    window.open(waLink, "_blank");
    updateCart([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory text-on-surface">
      <Header />

      <main className="flex-grow w-full max-w-container-max mx-auto px-6 sm:px-12 md:px-20 py-10 md:py-14 pt-[72px] sm:pt-[88px]">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-[11px] font-sans uppercase tracking-widest text-stone-500 font-bold">
            Review Your Living Space
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider text-charcoal-ink mt-1">
            Shopping Cart
          </h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Cart Items list */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-6">
                {cartItems.map((item) => {
                  const product = getProductForCartItem(item);
                  const isSofa = isCartItemSofa(item, product);

                  if (isSofa) {
                    const prodId = item.productId || product?.id || "aris";
                    const setGroupKey = `${prodId}-${item.color.toLowerCase()}-${(item.steelFinish || "").toLowerCase()}`;

                    // If this set was already rendered by an earlier item of the set, skip duplicate container
                    if (renderedSetKeys.has(setGroupKey)) return null;
                    renderedSetKeys.add(setGroupKey);

                    // Collect all seaters belonging to this set currently in cart
                    const seatersInThisSet = cartItems.filter((ci) => {
                      const ciProd = getProductForCartItem(ci);
                      const ciProdId = ci.productId || ciProd?.id || "aris";
                      return (
                        ciProdId === prodId &&
                        ci.color.toLowerCase() === item.color.toLowerCase() &&
                        (ci.steelFinish || "").toLowerCase() === (item.steelFinish || "").toLowerCase()
                      );
                    });

                    const totalPiecesInSet = seatersInThisSet.reduce((acc, ci) => acc + ci.quantity, 0);

                    // First item used for fallback images & properties
                    const heroImage = product?.images?.[0] || item.image || "/products/aris/H.jpg";

                    return (
                      <div
                        key={setGroupKey}
                        className="border border-stainless-silver bg-white rounded-sm shadow-sm overflow-hidden"
                      >
                        {/* Sofa Set Card Header */}
                        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between bg-white">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative w-20 h-16 sm:w-24 sm:h-20 aspect-[4/3] bg-warm-ivory/50 border border-stainless-silver rounded-sm overflow-hidden shrink-0 flex items-center justify-center p-1">
                              <Image
                                src={heroImage}
                                alt={item.name}
                                fill
                                className="object-cover"
                                unoptimized={Boolean(heroImage?.startsWith("data:"))}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg">🛋️</span>
                                <h2 className="font-display text-lg sm:text-xl font-bold text-charcoal-ink uppercase tracking-wider truncate">
                                  {product?.name || item.name} Luxury Set
                                </h2>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-sans">
                                <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-0.5 rounded-xs border border-stone-200">
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                                    style={{ backgroundColor: item.colorHex }}
                                  />
                                  <span className="font-semibold text-charcoal-ink">{item.color}</span>
                                </div>
                                {item.steelFinish && (
                                  <span className="bg-stone-100 text-stone-700 font-semibold px-2.5 py-0.5 rounded-xs border border-stone-200">
                                    {item.steelFinish} Base
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-charcoal-ink font-sans text-xs font-bold uppercase tracking-wider rounded-xs border border-stone-200">
                              {totalPiecesInSet} {totalPiecesInSet === 1 ? "Piece" : "Pieces"} Selected
                            </span>

                            <button
                              type="button"
                              onClick={() => handleRemoveSofaSet(item)}
                              className="p-2 hover:text-red-500 hover:bg-red-50 text-stone-400 rounded-sm transition-colors cursor-pointer"
                              title="Remove entire sofa set"
                              aria-label="Remove entire sofa set"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Seater Configuration & Quantities Section */}
                        <div className="p-5 sm:p-6 bg-stone-50/60">
                          {/* Section Question & Description */}
                          <div className="mb-4 pb-3 border-b border-stone-200/80">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal-ink flex items-center gap-2">
                                <span>Select Seaters & Quantities</span>
                                <span className="bg-charcoal-ink text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  {totalPiecesInSet} {totalPiecesInSet === 1 ? "Piece" : "Pieces"} in Set
                                </span>
                              </h3>
                              <span className="text-[11px] font-sans text-stone-500 italic">
                                * All seaters inherit {item.color} & {item.steelFinish || "Standard"} base
                              </span>
                            </div>
                            <p className="text-xs font-sans text-stone-600 mt-1">
                              Customize your living room set by specifying the required quantity for each seater option below:
                            </p>
                          </div>

                          {/* Seaters List with Direct Quantity Controls */}
                          <div className="space-y-3">
                            {SOFA_SUBSECTIONS.map((sub) => {
                              const matchingSeater = seatersInThisSet.find(
                                (ci) =>
                                  ci.configuration.toLowerCase() === sub.name.toLowerCase() ||
                                  ci.configuration.toLowerCase().replace(/\s+/g, "-") === sub.id.toLowerCase()
                              );
                              const qty = matchingSeater?.quantity || 0;
                              const seaterImg = product
                                ? getProductImageForSeater(product, sub.name)
                                : matchingSeater?.image || heroImage;

                              const isSelected = qty > 0;

                              return (
                                <div
                                  key={sub.id}
                                  className={`p-3.5 sm:p-4 rounded-sm border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                    isSelected
                                      ? "bg-white border-charcoal-ink shadow-xs ring-1 ring-charcoal-ink/10"
                                      : "bg-white/70 border-stone-200 hover:border-stone-300"
                                  }`}
                                >
                                  {/* Left: Thumbnail & Seater Info */}
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="relative w-16 h-12 sm:w-20 sm:h-14 aspect-[4/3] bg-surface-container-low border border-stone-200 rounded-sm overflow-hidden shrink-0 flex items-center justify-center p-1">
                                      <Image
                                        src={seaterImg}
                                        alt={sub.name}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-sans text-xs sm:text-sm font-bold text-charcoal-ink truncate">
                                          {sub.name}
                                        </span>
                                        {isSelected && (
                                          <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                            <Check className="h-3 w-3" />
                                            {qty} in Set
                                          </span>
                                        )}
                                      </div>

                                      <div className="mt-0.5">
                                        <span className="text-[11px] font-sans text-stone-500">
                                          {sub.description}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right: Quantity Selector */}
                                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                                    {/* Direct Interactive [-] [Qty] [+] Counter */}
                                    <div className="flex items-center border border-stainless-silver rounded-sm bg-white shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateSeaterQty(item, sub.name, -1)}
                                        disabled={qty === 0}
                                        className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
                                          qty === 0
                                            ? "opacity-25 cursor-not-allowed text-stone-300"
                                            : "hover:bg-stone-100 text-charcoal-ink"
                                        }`}
                                        title={`Decrease ${sub.name}`}
                                        aria-label={`Decrease ${sub.name}`}
                                      >
                                        <Minus className="h-3.5 w-3.5" />
                                      </button>

                                      <span
                                        className={`w-9 text-center text-xs font-sans font-bold ${
                                          qty > 0 ? "text-charcoal-ink font-extrabold" : "text-stone-400"
                                        }`}
                                      >
                                        {qty}
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => handleUpdateSeaterQty(item, sub.name, 1)}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 text-charcoal-ink transition-colors cursor-pointer active:scale-95"
                                        title={`Increase ${sub.name}`}
                                        aria-label={`Increase ${sub.name}`}
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Set Summary Footer */}
                          {totalPiecesInSet > 0 && (
                            <div className="mt-4 pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-sans text-stone-600">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-charcoal-ink">Set Breakdown:</span>
                                <span className="text-stone-700">
                                  {seatersInThisSet.map((s) => `${s.quantity}x ${s.configuration}`).join(" + ")}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold text-charcoal-ink">Total:</span>{" "}
                                <strong className="text-charcoal-ink text-sm">
                                  {totalPiecesInSet} {totalPiecesInSet === 1 ? "Piece" : "Pieces"}
                                </strong>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Non-Sofa Individual Products (Tables, Chairs, Consoles, etc.)
                  return (
                    <div
                      key={item.id}
                      className="border border-stainless-silver bg-white rounded-sm p-6 shadow-sm flex flex-col sm:flex-row gap-6"
                    >
                      <div className="relative w-full sm:w-36 aspect-[4/3] bg-surface-container-low border border-stainless-silver rounded-sm overflow-hidden shrink-0 flex items-center justify-center p-2">
                        <Image
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=200"
                          }
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          unoptimized={Boolean(item.image?.startsWith("data:"))}
                        />
                      </div>

                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h2 className="font-display text-lg font-bold text-charcoal-ink uppercase tracking-wider">
                                {item.name}
                              </h2>
                              {item.tagline && (
                                <p className="font-sans text-xs text-stone-500 italic mt-0.5">{item.tagline}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-1 hover:text-red-500 text-stone-400 transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {item.configuration && (
                              <span className="px-2.5 py-0.5 bg-charcoal-ink text-white font-sans text-[11px] font-bold uppercase tracking-wider rounded-xs shadow-2xs">
                                {item.configuration}
                              </span>
                            )}
                            {item.steelFinish && (
                              <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 text-stone-700 font-sans text-[11px] font-semibold uppercase tracking-wider rounded-xs">
                                {item.steelFinish} Base
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-sans text-xs text-on-surface-variant">Finish / Fabric:</span>
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-outline-variant shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                              title={item.color}
                            />
                            <span className="font-sans text-xs text-charcoal-ink font-semibold">{item.color}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-5 pt-3 border-t border-stone-100">
                          <span className="font-sans text-xs text-stone-500 uppercase tracking-wider font-semibold">
                            Quantity:
                          </span>
                          <div className="flex items-center border border-stainless-silver rounded-sm bg-surface">
                            <button
                              onClick={() => handleQtyChange(item.id, false)}
                              className="p-2 hover:bg-surface-container-low transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-xs font-sans font-bold text-charcoal-ink">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item.id, true)}
                              className="p-2 hover:bg-surface-container-low transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-xs font-display text-label-caps uppercase tracking-widest text-stone-500 hover:text-charcoal-ink font-semibold transition-colors mt-4"
              >
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Link>
            </div>

            {/* Right: Checkout details & WhatsApp Submission */}
            <div className="lg:col-span-5 space-y-6">
              {/* Inquiry Summary (Without Prices) */}
              <div className="border border-stainless-silver bg-white p-6 rounded-sm shadow-sm">
                <h3 className="font-display text-xs tracking-widest uppercase text-charcoal-ink font-bold border-b border-stainless-silver pb-3 mb-4">
                  Inquiry Summary
                </h3>
                <div className="space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between text-stone-600">
                    <span>Total Pieces / Seaters:</span>
                    <strong className="text-charcoal-ink">
                      {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                    </strong>
                  </div>
                  <div className="flex justify-between text-stone-600 pt-2 border-t border-stone-100">
                    <span>Quotation:</span>
                    <strong className="text-xs text-charcoal-ink font-semibold">
                      Custom Quote on Request
                    </strong>
                  </div>
                  <p className="text-[10px] text-stone-400 italic pt-1">
                    * Direct manufacturer quotation, bespoke sizing details, and fabrication timeline will be sent via WhatsApp.
                  </p>
                </div>
              </div>

              {/* Form details */}
              <div className="border border-stainless-silver bg-white p-6 sm:p-8 rounded-sm shadow-sm">
                <h3 className="font-display text-xs tracking-widest uppercase text-charcoal-ink font-bold border-b border-stainless-silver pb-3 mb-6">
                  Delivery Details
                </h3>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-on-surface-variant font-sans font-bold mb-2">
                      Patron Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-stainless-silver py-2.5 px-4 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans text-charcoal-ink"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-on-surface-variant font-sans font-bold mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-surface border border-stainless-silver py-2.5 px-4 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans text-charcoal-ink"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-on-surface-variant font-sans font-bold mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      placeholder="Flat No, Building, Area, Pincode, City, State"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-surface border border-stainless-silver py-2.5 px-4 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans resize-none text-charcoal-ink"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-on-surface-variant font-sans font-bold mb-2">
                      Customization Requirements (Optional)
                    </label>
                    <textarea
                      placeholder="e.g., Specific living room room dimensions, custom metal leg height, firm foam preference..."
                      value={customization}
                      onChange={(e) => setCustomization(e.target.value)}
                      rows={2}
                      className="w-full bg-surface border border-stainless-silver py-2.5 px-4 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans resize-none text-charcoal-ink"
                    />
                  </div>

                  {errorMsg && <p className="text-red-500 text-xs font-sans mt-2">{errorMsg}</p>}

                  <button
                    type="submit"
                    className="w-full py-4 mt-6 bg-charcoal-ink hover:bg-stone-850 text-white font-sans text-xs tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" /> Submit Inquiry via WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-outline-variant bg-white rounded-sm max-w-xl mx-auto p-12">
            <ShoppingCart className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <h2 className="font-display text-lg font-bold text-charcoal-ink uppercase tracking-wider">
              Your Cart is Empty
            </h2>
            <p className="font-sans text-xs text-on-surface-variant mt-2 mb-6">
              Browse our luxury architectural sofa collections and customize your ideal configuration to place an inquiry.
            </p>
            <Link
              href="/collections"
              className="bg-charcoal-ink text-white font-sans text-xs tracking-widest uppercase py-4 px-8 rounded-sm hover:bg-stone-800 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
