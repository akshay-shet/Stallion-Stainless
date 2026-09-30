"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MessageSquare, 
  Maximize2, 
  Palette, 
  User, 
  Settings, 
  Sparkles, 
  Clock, 
  ShoppingBag,
  UploadCloud,
  ImageIcon,
  X,
  Link as LinkIcon
} from "lucide-react";
import { getMergedProducts, Product, SOFA_FABRICS } from "@/data/products";

interface ReferenceImage {
  id: string;
  name: string;
  url: string;
  isUrl: boolean;
  size?: string;
}

export default function CustomizationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reference catalog products list state
  const [productList, setProductList] = useState<Product[]>([]);
  const [referenceItem, setReferenceItem] = useState("None");

  useEffect(() => {
    setProductList(getMergedProducts());
  }, []);

  // Form State - Specifications (All Optional)
  const [itemType, setItemType] = useState("Sofa");
  const [customItemType, setCustomItemType] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  
  const [metalFinish, setMetalFinish] = useState("Golden");
  const [fabricType, setFabricType] = useState("Custom Fabric (I will provide swatch details)");
  const [seatingCapacity, setSeatingCapacity] = useState("3 Seater");
  const [fabricColor, setFabricColor] = useState("");

  // Reference Images State (Optional)
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [webUrl, setWebUrl] = useState("");
  
  // Patron Details State (The ONLY required section)
  const [patronName, setPatronName] = useState("");
  const [patronPhone, setPatronPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Handle image files upload
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setErrorMsg("");
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setErrorMsg(`"${file.name}" is not an image. Please upload image files (JPG, PNG, WEBP).`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg(`"${file.name}" exceeds the 10MB size limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const formattedSize = file.size < 1024 * 1024
          ? `${Math.round(file.size / 1024)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        setReferenceImages((prev) => [
          ...prev,
          {
            id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            url: result,
            isUrl: false,
            size: formattedSize
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeReferenceImage = (id: string) => {
    setReferenceImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleAddWebUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webUrl.trim()) return;

    setReferenceImages((prev) => [
      ...prev,
      {
        id: `ref-url-${Date.now()}`,
        name: webUrl.trim().length > 32 ? webUrl.trim().substring(0, 30) + "..." : webUrl.trim(),
        url: webUrl.trim(),
        isUrl: true,
        size: "Web Link"
      }
    ]);
    setWebUrl("");
    setShowUrlInput(false);
  };

  // Add configuration to shopping cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const isSofaCategory = ["Sofa", "U Shaped Sectional"].includes(itemType);
    const selectedItem = itemType === "Other" 
      ? (customItemType.trim() || "Bespoke Furniture") 
      : (isSofaCategory ? `${itemType} (${seatingCapacity})` : itemType);

    const dims = [
      length.trim() ? `${length.trim()}"L` : null,
      width.trim() ? `${width.trim()}"W` : null,
      height.trim() ? `${height.trim()}"H` : null
    ].filter(Boolean);

    const dimsConfig = dims.length > 0 ? dims.join(" x ") : "Standard / Custom specs";
    const customConfig = `${dimsConfig} • Finish: ${metalFinish}`;
    
    // Use first reference image if available, else fallback luxury photo
    const previewImage = referenceImages.length > 0
      ? referenceImages[0].url 
      : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400";

    const cartItem = {
      id: `bespoke-${Date.now()}`,
      productId: `bespoke-${(selectedItem || "Item").replace(/\s+/g, "-").toLowerCase()}`,
      name: referenceItem !== "None" ? `Bespoke ${selectedItem} (Ref: ${referenceItem})` : `Bespoke ${selectedItem}`,
      color: fabricColor.trim() ? `${fabricType} (${fabricColor.trim()})` : fabricType,
      colorHex: "#D4AF37",
      configuration: customConfig,
      quantity: 1,
      tagline: referenceImages.length > 0
        ? `Custom design with ${referenceImages.length} reference image(s)`
        : (referenceItem !== "None" ? `Handcrafted custom size inspired by ${referenceItem}` : `Handcrafted custom size ${selectedItem}`),
      image: previewImage
    };

    const existingCartRaw = localStorage.getItem("stallion_cart");
    let existingCart = [];
    if (existingCartRaw) {
      try {
        existingCart = JSON.parse(existingCartRaw);
      } catch (err) {
        existingCart = [];
      }
    }

    existingCart.push(cartItem);
    localStorage.setItem("stallion_cart", JSON.stringify(existingCart));
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      router.push("/cart");
    }, 800);
  };

  // Submit via WhatsApp (Only patron details are required)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Patron details validation (ONLY required fields)
    if (!patronName.trim()) {
      setErrorMsg("Please provide your Patron Name under Patron Details.");
      return;
    }
    if (!patronPhone.trim()) {
      setErrorMsg("Please provide your Contact Number under Patron Details.");
      return;
    }
    if (!deliveryAddress.trim()) {
      setErrorMsg("Please provide your Delivery Address under Patron Details.");
      return;
    }

    setErrorMsg("");

    const isSofaCategory = ["Sofa", "U Shaped Sectional"].includes(itemType);
    const selectedItem = itemType === "Other" 
      ? (customItemType.trim() || "Bespoke Furniture") 
      : (isSofaCategory ? `${itemType} (${seatingCapacity})` : itemType);

    const dimsText = (length.trim() || width.trim() || height.trim())
      ? `  - Length: ${length.trim() ? `${length.trim()} inches` : "Standard / To be finalized"}
  - Width: ${width.trim() ? `${width.trim()} inches` : "Standard / To be finalized"}
  - Height: ${height.trim() ? `${height.trim()} inches` : "Standard / To be finalized"}`
      : "  - Standard dimensions / To be determined during consultation";

    let referenceImagesText = "None attached";
    if (referenceImages.length > 0) {
      referenceImagesText = `${referenceImages.length} Image(s) Attached:\n` + 
        referenceImages.map((img, idx) => `  ${idx + 1}. ${img.name}${img.isUrl ? ` (${img.url})` : " [Photo file ready to send in chat]"}`).join("\n");
    }

    // Build the WhatsApp message payload
    const rawMessage = `*STALLION STAINLESS - BESPOKE CUSTOMIZATION INQUIRY*
-------------------------------------------
*Patron Information (Required):*
• *Name:* ${patronName.trim()}
• *Contact Number:* ${patronPhone.trim()}
• *Delivery Address:* ${deliveryAddress.trim()}

*Bespoke Furniture Configuration:*
• *Item Type:* ${selectedItem || "Bespoke Furniture"}
• *Reference Catalog Item:* ${referenceItem !== "None" ? referenceItem : "None (Fully Custom)"}
• *Dimensions:*
${dimsText}

*Material Specifications:*
• *Metallic Finish Preference:* ${metalFinish || "Standard"}
• *Fabric Category:* ${fabricType || "Custom"}
• *Fabric Swatch Color/Details:* ${fabricColor.trim() ? fabricColor.trim() : "To be decided"}

*Reference Images & Visual Inspiration:*
${referenceImagesText}

*Additional Tailoring Requirements:*
${customNotes.trim() ? customNotes.trim() : "None specified"}
-------------------------------------------
Please review this custom fabrication request and revert with a design feasibility report, quotation, and production timeline.`;

    const encodedMessage = encodeURIComponent(rawMessage);
    const waNumber = "919019516846";
    const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    window.open(waLink, "_blank");
    setSuccess(true);
  };

  const itemCategories = [
    "Sofa",
    "Accent & Recliner",
    "Coffee & Corner Table",
    "Dining Table",
    "Partition & Console",
    "Chairs",
    "Themed",
    "Merchandising",
    "U Shaped Sectional",
    "Other"
  ];

  const metalFinishes = [
    "Golden",
    "Pink",
    "Silver",
    "MDF"
  ];

  const fabricTypes = [
    "Custom Fabric (I will provide swatch details)",
    ...SOFA_FABRICS.map((f) => f.name)
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />

      <main className="flex-grow max-w-container-max mx-auto px-12 md:px-20 py-16 w-full">
        {/* Page Title & Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-display tracking-widest text-stone-500 uppercase font-semibold">
            Bespoke Fabrication Studio
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-charcoal-ink leading-tight mt-4 uppercase">
            Tailor Your Space
          </h1>
          <div className="h-[2px] w-12 bg-charcoal-ink mx-auto mt-4 mb-6" />
          <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Stallion Stainless specializes in custom-made luxury furniture. All specification blanks are optional—only your patron contact details are required so our design artisans can connect with you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Form Intake */}
          <div className="lg:col-span-7 bg-white border border-stainless-silver p-8 md:p-10 rounded-sm shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 01: Item Selection (Optional) */}
              <div>
                <div className="flex items-center justify-between border-b border-stainless-silver pb-3 mb-6">
                  <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold flex items-center gap-2">
                    <Settings className="h-4 w-4" /> 01. Select Furniture Item
                  </h3>
                  <span className="text-[10px] font-sans font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    Optional
                  </span>
                </div>
                
                {(() => {
                  const isCategoryMatch = (pCat: string, typeName: string) => {
                    if (typeName === "Coffee & Corner Table" || typeName === "Coffee Table" || typeName === "Corner Table") {
                      return pCat === "coffee-corner-table" || pCat === "coffee-table" || pCat === "corner-table" || (pCat as string) === "table";
                    }
                    if (typeName === "Accent & Recliner" || typeName === "Accent" || typeName === "Recliner") {
                      return pCat === "accent-recliner" || pCat === "accent" || pCat === "recliner";
                    }
                    if (typeName === "Partition & Console" || typeName === "Partition" || typeName === "Console") {
                      return pCat === "partition-console" || pCat === "partition" || pCat === "console";
                    }
                    const itemTypeToCategoryMap: Record<string, string> = {
                      "Sofa": "sofa",
                      "Dining Table": "dining-table",
                      "Chairs": "chairs",
                      "Themed": "themed",
                      "Merchandising": "merchandising",
                      "U Shaped Sectional": "sofa"
                    };
                    const mappedCat = itemTypeToCategoryMap[typeName];
                    return mappedCat ? pCat === mappedCat : true;
                  };
                  const filteredProducts = productList.filter(p => isCategoryMatch(p.category, itemType));
                  const showSeating = ["Sofa", "U Shaped Sectional"].includes(itemType);
                  const isOther = itemType === "Other";
                  const colsCount = (showSeating || isOther) ? "3" : "2";

                  return (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${colsCount} gap-6`}>
                      <div>
                        <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Item Type</label>
                        <select
                          value={itemType}
                          onChange={(e) => setItemType(e.target.value)}
                          className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                        >
                          {itemCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {showSeating && (
                        <div>
                          <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Seating Configuration</label>
                          <select
                            value={seatingCapacity}
                            onChange={(e) => setSeatingCapacity(e.target.value)}
                            className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                          >
                            <option value="1 Seater">1 Seater</option>
                            <option value="2 Seater">2 Seater</option>
                            <option value="3 Seater">3 Seater</option>
                            <option value="4 Seater">4 Seater</option>
                            <option value="L Shaped Sectional">L Shaped Sectional</option>
                            <option value="U Shaped Sectional">U Shaped Sectional</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Reference Catalog Item (Optional)</label>
                        <select
                          value={referenceItem}
                          onChange={(e) => setReferenceItem(e.target.value)}
                          className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                        >
                          <option value="None">None - Fully Custom Design</option>
                          {filteredProducts.map((p) => (
                            <option key={p.id} value={p.name}>{p.name.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>

                      {isOther && (
                        <div>
                          <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Specify Item Name (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Media Console Cabinet"
                            value={customItemType}
                            onChange={(e) => setCustomItemType(e.target.value)}
                            className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Section 02: Dimensions (Optional) */}
              <div>
                <div className="flex items-center justify-between border-b border-stainless-silver pb-3 mb-6">
                  <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold flex items-center gap-2">
                    <Maximize2 className="h-4 w-4" /> 02. Specify Dimensions (Inches)
                  </h3>
                  <span className="text-[10px] font-sans font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    Optional
                  </span>
                </div>
                
                <p className="text-[10px] text-stone-500 font-sans mb-4 leading-relaxed bg-stone-50 p-3 border border-stainless-silver/50 rounded-sm">
                  📏 Optional: If you have room measurements, specify Length, Width, and Height below. If left blank, standard ergonomic sizing will be recommended.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Length (L)</label>
                    <input
                      type="number"
                      placeholder="e.g. 96"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Width / Depth (W)</label>
                    <input
                      type="number"
                      placeholder="e.g. 40"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Height (H)</label>
                    <input
                      type="number"
                      placeholder="e.g. 32"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Section 03: Materials & Aesthetics (Optional) */}
              <div>
                <div className="flex items-center justify-between border-b border-stainless-silver pb-3 mb-6">
                  <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold flex items-center gap-2">
                    <Palette className="h-4 w-4" /> 03. Frame Finish & Upholstery
                  </h3>
                  <span className="text-[10px] font-sans font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    Optional
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Metallic Finish</label>
                    <select
                      value={metalFinish}
                      onChange={(e) => setMetalFinish(e.target.value)}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                    >
                      {metalFinishes.map((finish) => (
                        <option key={finish} value={finish}>{finish}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Fabric Choice</label>
                    <select
                      value={fabricType}
                      onChange={(e) => setFabricType(e.target.value)}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans cursor-pointer text-charcoal-ink"
                    >
                      {fabricTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Fabric Color Swatch / Specifications (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Emerald Green, Off-white Cream #FCFCFC, or specific shade code..."
                      value={fabricColor}
                      onChange={(e) => setFabricColor(e.target.value)}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Section 04: Reference Images & Visual Inspiration (Optional) */}
              <div>
                <div className="flex items-center justify-between border-b border-stainless-silver pb-3 mb-6">
                  <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> 04. Reference Images & Visual Inspiration
                  </h3>
                  <span className="text-[10px] font-sans font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    Optional
                  </span>
                </div>

                <p className="text-[10px] text-stone-500 font-sans mb-4 leading-relaxed bg-stone-50 p-3 border border-stainless-silver/50 rounded-sm">
                  💡 Have a reference photo, sketch, room blueprint, or Pinterest inspiration? Upload it below. Our design division will reference it for 3D modeling and custom fabrication.
                </p>

                {/* Dropzone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-sm p-6 text-center transition-colors cursor-pointer ${
                    isDragging 
                      ? "border-charcoal-ink bg-stone-100" 
                      : "border-stone-300 hover:border-stone-400 bg-stone-50/60"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFiles(e.target.files)}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 shadow-xs">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold text-charcoal-ink">
                        Click to upload or drag & drop reference photos
                      </p>
                      <p className="font-sans text-[10px] text-stone-400 mt-0.5">
                        Supports PNG, JPG, WEBP (multiple files allowed • up to 10MB each)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option to add Web / Pinterest URL */}
                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[10px] font-mono uppercase tracking-wider text-stone-600 hover:text-charcoal-ink flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
                  >
                    <LinkIcon className="h-3 w-3" />
                    {showUrlInput ? "Cancel URL input" : "+ Or add photo via Web / Pinterest link"}
                  </button>
                  {referenceImages.length > 0 && (
                    <span className="text-[10px] font-mono text-stone-500">
                      {referenceImages.length} image{referenceImages.length > 1 ? "s" : ""} added
                    </span>
                  )}
                </div>

                {showUrlInput && (
                  <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-sm flex gap-2 items-center">
                    <input
                      type="url"
                      placeholder="Paste image or Pinterest URL (https://...)"
                      value={webUrl}
                      onChange={(e) => setWebUrl(e.target.value)}
                      className="flex-1 bg-white border border-stone-300 py-2 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                    />
                    <button
                      type="button"
                      onClick={handleAddWebUrl}
                      className="px-4 py-2 bg-charcoal-ink text-white font-sans text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-stone-800 cursor-pointer"
                    >
                      Attach
                    </button>
                  </div>
                )}

                {/* Live Previews Grid */}
                {referenceImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                    {referenceImages.map((img) => (
                      <div
                        key={img.id}
                        className="relative group bg-stone-100 border border-stone-200 rounded-sm overflow-hidden shadow-2xs aspect-[4/3] flex flex-col justify-end"
                      >
                        {img.isUrl ? (
                          <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center p-3 text-center">
                            <LinkIcon className="h-6 w-6 text-stone-400 mb-1" />
                            <span className="text-[9px] font-mono text-stone-600 truncate max-w-full px-1">
                              {img.name}
                            </span>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img.url}
                            alt={img.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeReferenceImage(img.id);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-charcoal-ink/80 text-white hover:bg-red-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
                          title="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        {/* Overlay Label */}
                        <div className="relative z-10 bg-charcoal-ink/80 backdrop-blur-xs text-white px-2 py-1 flex items-center justify-between text-[9px] font-mono">
                          <span className="truncate max-w-[70%]">{img.name}</span>
                          <span className="text-stone-300 shrink-0">{img.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 05: Patron Details & Custom Notes (THE ONLY REQUIRED SECTION) */}
              <div>
                <div className="flex items-center justify-between border-b border-charcoal-ink/40 pb-3 mb-6">
                  <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold flex items-center gap-2">
                    <User className="h-4 w-4" /> 05. Delivery & Patron Details
                  </h3>
                  <span className="text-[10px] font-sans font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Required
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">
                        Patron Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={patronName}
                        onChange={(e) => setPatronName(e.target.value)}
                        className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={patronPhone}
                        onChange={(e) => setPatronPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Street address, City, Pincode, State"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] tracking-wider uppercase text-on-surface-variant font-bold mb-2">Special Fabrication Requests / Styling Instructions (Optional)</label>
                    <textarea
                      placeholder="e.g. Need tufted cushioning, cushion firmness preferences, stainless steel frame style details..."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-stone-50 border border-stainless-silver py-2.5 px-3 text-xs focus:outline-none focus:border-charcoal-ink rounded-sm font-sans resize-none"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && <p className="text-red-500 text-xs font-sans mt-2 font-semibold">{errorMsg}</p>}
              {success && (
                <div className="space-y-1 bg-emerald-50 p-4 border border-emerald-200 rounded-sm">
                  <p className="text-emerald-700 text-xs font-sans font-bold">
                    ✓ Customization inquiry compiled & WhatsApp launched!
                  </p>
                  <p className="text-emerald-600 text-[11px] font-sans">
                    {referenceImages.length > 0 
                      ? "💡 Tip: You can also attach your selected reference photos directly into the WhatsApp chat with our design team."
                      : "Our bespoke design team will revert promptly with 3D feasibility and quotation."}
                  </p>
                </div>
              )}
              {addedToCart && (
                <p className="text-emerald-600 text-xs font-sans mt-2 font-semibold bg-emerald-50 p-3 border border-emerald-100 rounded-sm">
                  ✓ Customized item added to your shopping cart. Redirecting...
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 border border-charcoal-ink hover:bg-stone-50 text-charcoal-ink font-sans text-xs tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm font-bold cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" /> Add Configuration to Cart
                </button>
                
                <button
                  type="submit"
                  className="flex-1 py-4 bg-charcoal-ink hover:bg-stone-850 text-white font-sans text-xs tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md font-bold cursor-pointer"
                >
                  <MessageSquare className="h-4.5 w-4.5" /> Direct WhatsApp Inquiry
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Process & Value Props */}
          <div className="lg:col-span-5 space-y-8">
            {/* The Process Card */}
            <div className="border border-stainless-silver bg-warm-ivory p-8 rounded-sm">
              <h3 className="font-display text-xs tracking-wider uppercase text-charcoal-ink font-bold border-b border-stainless-silver pb-3 mb-6">
                Our Bespoke Process
              </h3>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-charcoal-ink text-charcoal-ink flex items-center justify-center font-display text-xs font-bold shrink-0 bg-white">
                    01
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-charcoal-ink uppercase">Configure Spec List</h4>
                    <p className="font-sans text-[10px] text-stone-600 mt-1 leading-relaxed">
                      Choose your preferred item, attach reference images if available, or simply leave specifications blank for consultation.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-charcoal-ink text-charcoal-ink flex items-center justify-center font-display text-xs font-bold shrink-0 bg-white">
                    02
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-charcoal-ink uppercase">WhatsApp Connect</h4>
                    <p className="font-sans text-[10px] text-stone-600 mt-1 leading-relaxed">
                      Submit details to our WhatsApp helpline. We will verify design feasibility and provide an immediate quotation.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-charcoal-ink text-charcoal-ink flex items-center justify-center font-display text-xs font-bold shrink-0 bg-white">
                    03
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-charcoal-ink uppercase">CAD Modeling</h4>
                    <p className="font-sans text-[10px] text-stone-600 mt-1 leading-relaxed">
                      For architectural setups, our engineering division drafts 2D/3D CAD mockups for sign-off prior to welding.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full border border-charcoal-ink text-charcoal-ink flex items-center justify-center font-display text-xs font-bold shrink-0 bg-white">
                    04
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-charcoal-ink uppercase">Handcrafted Assembly</h4>
                    <p className="font-sans text-[10px] text-stone-600 mt-1 leading-relaxed">
                      Using premium seasoned Neem wood frames and Grade 304 Stainless Steel structures, artisans construct your order.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-stainless-silver bg-white p-5 text-center rounded-sm">
                <Sparkles className="h-6 w-6 text-stone-500 mx-auto mb-2" />
                <h4 className="font-display text-[9px] tracking-wider uppercase text-charcoal-ink font-bold">LIFETIME FEASIBILITY</h4>
                <p className="font-sans text-[9px] text-stone-500 mt-1">Grade 304 Stainless base rails resist sag and rust.</p>
              </div>

              <div className="border border-stainless-silver bg-white p-5 text-center rounded-sm">
                <Clock className="h-6 w-6 text-stone-500 mx-auto mb-2" />
                <h4 className="font-display text-[9px] tracking-wider uppercase text-charcoal-ink font-bold">15-Day Timelines</h4>
                <p className="font-sans text-[9px] text-stone-500 mt-1">Fastest boutique factory fabrication timelines.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
