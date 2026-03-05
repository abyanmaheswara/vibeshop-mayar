"use client";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink, Share2, Loader2, Check, RefreshCw, Download } from "lucide-react";
import NeonButton from "./NeonButton";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function StorefrontPreview({ data, views = 0, isPreviewOnly = false, customSlug = "", theme = "Bold", onRegenerate }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishUrl, setPublishUrl] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const storefrontRef = useRef(null);

  if (!data) return null;

  // Theme configuration
  const themeStyles = {
    Bold: {
      bg: "bg-[#080408]",
      textPrimary: "text-white",
      textSecondary: "text-[#ffffff99]",
      h1Font: "font-extrabold italic tracking-tighter uppercase",
      h1Gradient: "linear-gradient(to bottom, #ffffff, #ffffff80)",
      cardBg: "glass border-[#ffffff0d] hover:border-[#00e5ff4d] shadow-2xl",
      cardImageGradient: "linear-gradient(to top, #080408, #08040833, transparent)",
      productName: "font-black italic tracking-tighter uppercase group-hover:text-[#00E5FF]",
      priceTag: "glass border-[#ffffff1a] text-[#00E5FF] neon-glow-cyan italic font-black",
      primaryButton: "cyan",
    },
    Minimal: {
      bg: "bg-white",
      textPrimary: "text-black",
      textSecondary: "text-neutral-500",
      h1Font: "font-light tracking-tight",
      h1Gradient: "linear-gradient(to bottom, #000000, #404040)",
      cardBg: "bg-neutral-50 border border-neutral-200 hover:border-black shadow-none transition-colors",
      cardImageGradient: "linear-gradient(to top, #ffffff, #ffffff80, transparent)",
      productName: "font-medium tracking-tight group-hover:text-black",
      priceTag: "bg-white text-black font-medium border border-neutral-200 shadow-sm",
      primaryButton: "minimal", // Assuming NeonButton can handle 'minimal' or fallback to dark
    },
    Elegant: {
      bg: "bg-[#0A0D14]",
      textPrimary: "text-[#F2E8D5]",
      textSecondary: "text-[#A99D8F]",
      h1Font: "font-serif tracking-widest uppercase text-[#D4AF37]",
      h1Gradient: "none",
      cardBg: "bg-[#0A0D14] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 shadow-[0_10px_30px_rgba(212,175,55,0.05)]",
      cardImageGradient: "linear-gradient(to top, #0A0D14, #0A0D1480, transparent)",
      productName: "font-serif tracking-widest text-[#D4AF37] group-hover:text-[#F2E8D5]",
      priceTag: "bg-[#0A0D14] border border-[#D4AF37]/50 text-[#D4AF37] font-serif uppercase tracking-widest text-xs",
      primaryButton: "gold", // Assuming NeonButton handles this
    },
  };

  const style = themeStyles[theme] || themeStyles["Bold"];

  const handleCheckout = async (product) => {
    setIsCheckingOut(product.id);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to generate checkout link");
      if (result.url) {
        window.open(result.url, "_blank");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Error preparing checkout: " + error.message);
    } finally {
      setIsCheckingOut(null);
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
    <motion.div id="storefront-preview" ref={storefrontRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-5xl mx-auto space-y-12 pb-20 relative p-8 rounded-[3rem] ${style.bg} ${style.textPrimary}`}>
      <div className="text-center space-y-4">
        <h1
          className={`text-5xl md:text-7xl leading-none ${style.h1Font}`}
          style={{
            background: style.h1Gradient !== "none" ? style.h1Gradient : undefined,
            WebkitBackgroundClip: style.h1Gradient !== "none" ? "text" : undefined,
            WebkitTextFillColor: style.h1Gradient !== "none" ? "transparent" : undefined,
          }}
        >
          {data.name}
        </h1>
        {isPreviewOnly && (
          <div
            className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold ${theme === "Minimal" ? "bg-neutral-100 border-neutral-200 text-neutral-600" : "glass border-[#ffffff1a] text-[#ffffff99]"}`}
          >
            <Eye size={16} />
            {views.toLocaleString()} views
          </div>
        )}
        <p className={`text-lg max-w-xl mx-auto ${style.textSecondary}`}>{data.description}</p>

        {!isPreviewOnly && (
          <div className="storefront-actions download-ignore flex flex-wrap justify-center gap-4 pt-4 transition-opacity duration-300">
            {onRegenerate && (
              <NeonButton
                onClick={onRegenerate}
                color={theme === "Minimal" ? "black" : theme === "Elegant" ? "gold" : "magenta"}
                className="flex items-center gap-3 !px-6 !py-3 rounded-full font-bold uppercase tracking-widest text-sm group"
              >
                <RefreshCw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                <span>Regenerate</span>
              </NeonButton>
            )}

            <NeonButton
              onClick={handlePublish}
              color={isPublished ? (theme === "Minimal" ? "black" : theme === "Elegant" ? "gold" : "magenta") : theme === "Minimal" ? "black" : theme === "Elegant" ? "gold" : "cyan"}
              className="flex items-center gap-3 !px-6 !py-3 rounded-full font-bold uppercase tracking-widest text-sm group overflow-hidden relative"
            >
              {isPublishing ? <Loader2 className="animate-spin" size={18} /> : isPublished ? <Check size={18} /> : <Share2 size={18} className="group-hover:rotate-12 transition-transform" />}
              <span>{isPublishing ? "Publishing..." : isPublished ? "Copied!" : "Publish & Share"}</span>
            </NeonButton>

            <NeonButton
              onClick={handleDownloadImage}
              color={theme === "Minimal" ? "black" : theme === "Elegant" ? "gold" : "cyan"}
              className="flex items-center gap-3 !px-6 !py-3 rounded-full font-bold uppercase tracking-widest text-sm group"
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} className="group-hover:-translate-y-1 transition-transform" />}
              <span>{isDownloading ? "Capturing..." : "Download"}</span>
            </NeonButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {data.products.map((product) => (
          <motion.div key={product.id} whileHover={{ y: -10 }} className={`rounded-[3rem] overflow-hidden group transition-all duration-500 relative ${style.cardBg}`}>
            <div className="h-96 overflow-hidden relative">
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(product.image)}`}
                alt={product.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 opacity-90 transition-opacity group-hover:opacity-70" style={{ background: style.cardImageGradient }} />
              <div className={`absolute top-6 right-6 px-6 py-2 rounded-full ${style.priceTag}`}>Rp {product.price.toLocaleString("id-ID")}</div>
            </div>
            <div className="p-12 space-y-8 relative">
              <div className="space-y-2">
                <h3 className={`text-4xl leading-tight transition-colors duration-500 line-clamp-2 ${style.productName}`}>{product.name}</h3>
                <p className={`text-base leading-relaxed max-w-sm line-clamp-2 ${style.textSecondary}`}>{product.description || "Premium high-quality items designed carefully."}</p>
              </div>
              <NeonButton
                color={theme === "Minimal" ? "black" : theme === "Elegant" ? "gold" : "cyan"}
                className={`w-full !py-5 flex items-center justify-center gap-4 text-xl font-bold tracking-[0.1em] ${style.h1Font.includes("italic") ? "italic uppercase tracking-[0.2em] font-black" : ""} ${isCheckingOut === product.id ? "opacity-80" : ""}`}
                onClick={() => handleCheckout(product)}
                disabled={isCheckingOut === product.id}
              >
                {isCheckingOut === product.id ? <Loader2 className="animate-spin" size={24} /> : <ShoppingCart size={24} strokeWidth={theme === "Minimal" ? 2 : 3} />}
                {isCheckingOut === product.id ? "Preparing..." : theme === "Elegant" ? "Purchase" : "Buy Now"}
              </NeonButton>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
