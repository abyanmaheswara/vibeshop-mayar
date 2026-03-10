"use client";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink, Share2, Loader2, Check, RefreshCw, Download, Star, X, ShoppingBag, ArrowLeft } from "lucide-react";
import NeonButton from "./NeonButton";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function StorefrontPreview({ data, views = 0, isPreviewOnly = false, customSlug = "", onRegenerate }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishUrl, setPublishUrl] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const storefrontRef = useRef(null);

  if (!data) return null;

  if (!data) return null;

  const handleAddToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true);
    toast.success("Added to cart!", { style: { background: "#080408", color: "#00E5FF", border: "1px solid #00e5ff4d" } });
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    
    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
    const itemNames = cartItems.map(item => item.name).join(", ");
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send a combined product representation for the cart
        body: JSON.stringify({
          name: "VibeShop Order",
          price: totalAmount,
          description: `Order containing: ${itemNames}`
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to generate checkout link");
      if (result.url) {
        setCartItems([]);
        setIsCartOpen(false);
        window.open(result.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Error preparing checkout: " + error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handlePublish = async () => {
    if (isPreviewOnly) return;
    setIsPublishing(true);

    try {
      // Validate Custom Slug Availability
      let finalSlug = customSlug;

      if (finalSlug) {
        const checkRes = await fetch(`/api/store?slug=${finalSlug}`);
        const checkData = await checkRes.json();
        if (checkRes.ok && checkData && !checkData.error && checkData.id) {
          toast.error(`The custom URL "${finalSlug}" is already taken!`);
          setIsPublishing(false);
          return;
        }
      } else {
        // Generate a unique slug based on the shop name or random
        finalSlug = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substr(2, 5);
      }

      const response = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: finalSlug, data: data }),
      });

      if (!response.ok) throw new Error("Failed to save to database");

      const url = `${window.location.origin}/preview/${finalSlug}`;
      setPublishUrl(url);
      navigator.clipboard.writeText(url);
      setIsPublished(true);
      toast.success("VibeShop Published! Link copied to clipboard.", {
        icon: "🚀",
        style: { border: "1px solid #00e5ff4d" },
      });
    } catch (error) {
      console.error("Publish Error:", error);
      toast.error("Error publishing: " + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!storefrontRef.current) return;
    setIsDownloading(true);
    try {
      const actionsDiv = storefrontRef.current.querySelector(".storefront-actions");
      if (actionsDiv) actionsDiv.style.opacity = "0";

      const htmlToImage = await import("html-to-image");

      const dataUrl = await htmlToImage.toPng(storefrontRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#080408",
        filter: (node) => {
          return !node.classList?.contains("download-ignore");
        },
      });

      if (actionsDiv) actionsDiv.style.opacity = "1";

      const link = document.createElement("a");
      link.download = `vibeshop-${data.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("VibeSnap Captured! 📸", { style: { border: "1px solid #00e5ff4d" } });
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Failed to generate image: " + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div id="storefront-preview" ref={storefrontRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto space-y-12 pb-20 relative p-8 rounded-[3rem]">
      <div className="text-center space-y-4">
        <h1
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent italic tracking-tighter uppercase leading-none"
          style={{ background: "linear-gradient(to bottom, #ffffff, #ffffff80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {data.name}
        </h1>
        {isPreviewOnly && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center justify-center gap-2 glass px-4 py-1.5 rounded-full border border-[#ffffff1a] text-sm font-bold text-[#ffffff99]">
              <Eye size={16} />
              {views.toLocaleString()} views
            </div>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#00E5FF] text-[#00E5FF] font-bold uppercase tracking-widest text-sm hover:bg-[#00E5FF] hover:text-[#080408] transition-all download-ignore">
              <ArrowLeft size={16} />
              Create Your Own
            </Link>
          </div>
        )}
        <p className="text-[#ffffff99] text-lg max-w-xl mx-auto">{data.description}</p>

        {!isPreviewOnly && (
          <div className="storefront-actions download-ignore flex flex-wrap justify-center gap-4 pt-4 transition-opacity duration-300">
            {onRegenerate && (
              <NeonButton onClick={onRegenerate} color="magenta" className="flex items-center gap-3 !px-6 !py-3 rounded-full font-bold uppercase tracking-widest text-sm group">
                <RefreshCw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                <span>Regenerate</span>
              </NeonButton>
            )}

            <Link href="/" className="flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm border-2 border-[#ffffff33] text-[#ffffff99] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all download-ignore">
              <ArrowLeft size={18} />
              <span>Create New</span>
            </Link>

            <NeonButton onClick={handlePublish} color={isPublished ? "magenta" : "cyan"} className="flex items-center gap-3 !px-6 !py-3 rounded-full font-bold uppercase tracking-widest text-sm group overflow-hidden relative">
              {isPublishing ? <Loader2 className="animate-spin" size={18} /> : isPublished ? <Check size={18} /> : <Share2 size={18} className="group-hover:rotate-12 transition-transform" />}
              <span>{isPublishing ? "Encrypting..." : isPublished ? "Copied!" : "Publish & Share"}</span>
            </NeonButton>

            <NeonButton onClick={handleDownloadImage} color="cyan" className="flex items-center gap-3 !px-6 !py-3 rounded-full font-bold uppercase tracking-widest text-sm group" disabled={isDownloading}>
              {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} className="group-hover:-translate-y-1 transition-transform" />}
              <span>{isDownloading ? "Capturing..." : "Download"}</span>
            </NeonButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ perspective: "1000px" }}>
        {data.products.map((product, index) => (
          <motion.div 
            key={product.id} 
            initial={{ opacity: 0, y: 50, rotateX: -10 }} 
            animate={{ opacity: 1, y: 0, rotateX: 0 }} 
            transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
            whileHover={{ y: -10, scale: 1.02, rotateX: 5, rotateY: -5 }} 
            className="glass rounded-[3rem] overflow-hidden group border border-[#ffffff0d] hover:border-[#00e5ff4d] transition-all duration-500 shadow-2xl relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="h-96 overflow-hidden relative">
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(product.image)}`}
                alt={product.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 opacity-90 transition-opacity group-hover:opacity-70" style={{ background: "linear-gradient(to top, #080408, #08040833, transparent)" }} />
              <div className="absolute top-6 right-6 glass px-6 py-2 rounded-full border border-[#ffffff1a] font-black text-xl text-[#00E5FF] neon-glow-cyan italic">Rp {product.price.toLocaleString("id-ID")}</div>
            </div>
            <div className="p-12 space-y-8 relative">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-[#00E5FF] transition-colors duration-500">{product.name}</h3>
                <p className="text-[#ffffff66] text-base font-medium leading-relaxed max-w-sm line-clamp-2">{product.description || "Premium high-quality items designed with vibe in mind and soul in core."}</p>
              </div>
              <NeonButton
                color="cyan"
                className="w-full !py-5 flex items-center justify-center gap-4 text-xl font-black uppercase tracking-[0.2em] italic"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart size={24} strokeWidth={3} />
                Add to Cart
              </NeonButton>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-end pt-8">
        <button
          onClick={() => setIsCartOpen(true)}
          className="glass download-ignore flex items-center justify-center gap-3 px-8 py-4 rounded-full font-black text-white hover:text-[#00E5FF] transition-all border border-[#ffffff1a] hover:border-[#00e5ff4d] shadow-xl relative"
        >
          <ShoppingCart size={24} />
          <span className="tracking-widest uppercase">View Cart</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#C0152A] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Reviews Section */}
      {data.reviews && data.reviews.length > 0 && (
        <div className="pt-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase line-clamp-1">Wall of <span className="text-[#00E5FF] neon-glow-cyan">Vibes</span></h2>
            <p className="text-[#ffffff66] font-medium tracking-wide">What people say about this shop</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.reviews.map((review, i) => (
              <motion.div
                key={review.id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 + 0.5, duration: 0.6 }}
                className="glass p-8 rounded-[2.5rem] space-y-4 border border-[#ffffff0d] hover:border-[#ffffff26] transition-colors relative shadow-lg"
              >
                <div className="flex items-center gap-1 text-[#00E5FF]">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={16} fill={index < review.rating ? "currentColor" : "transparent"} opacity={index < review.rating ? 1 : 0.3} />
                  ))}
                </div>
                <p className="text-white/80 font-medium italic leading-relaxed">"{review.text}"</p>
                <div className="pt-4 border-t border-[#ffffff1a] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#C0152A] flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {review.author.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-[#ffffff99] text-sm font-bold tracking-wider">{review.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sliding Cart Drawer */}
      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 download-ignore"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#080408] border-l border-[#ffffff1a] z-50 flex flex-col shadow-2xl download-ignore"
          >
            <div className="p-6 border-b border-[#ffffff1a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#00E5FF]" size={24} />
                <h2 className="text-2xl font-black italic tracking-widest uppercase text-white">Your Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:text-[#C0152A] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <ShoppingCart size={48} />
                  <p className="text-lg font-bold uppercase tracking-widest">Cart is empty</p>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className="glass p-4 rounded-2xl flex items-center gap-4">
                    <img src={`/api/proxy-image?url=${encodeURIComponent(item.image)}`} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[#00E5FF] text-xs font-bold">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="p-2 text-white/50 hover:text-[#C0152A] transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-[#ffffff1a] bg-[#00000033]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-white/60 font-medium uppercase tracking-widest text-sm">Total</span>
                <span className="text-2xl font-black italic text-[#00E5FF]">
                  Rp {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString("id-ID")}
                </span>
              </div>
              <NeonButton
                color="magenta"
                className="w-full !py-4 flex items-center justify-center gap-3 text-lg"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {isCheckingOut ? "Processing..." : "Checkout Now"}
              </NeonButton>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
