"use client";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink, Share2, Loader2, Check, RefreshCw, Download } from "lucide-react";
import NeonButton from "./NeonButton";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function StorefrontPreview({ data, views = 0, isPreviewOnly = false, customSlug = "", onRegenerate }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishUrl, setPublishUrl] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const storefrontRef = useRef(null);

  if (!data) return null;

  if (!data) return null;

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
    <motion.div id="storefront-preview" ref={storefrontRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto space-y-12 pb-20 relative p-8 rounded-[3rem]">
      <div className="text-center space-y-4">
        <h1
          className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent italic tracking-tighter uppercase leading-none"
          style={{ background: "linear-gradient(to bottom, #ffffff, #ffffff80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {data.name}
        </h1>
        {isPreviewOnly && (
          <div className="inline-flex items-center justify-center gap-2 glass px-4 py-1.5 rounded-full border border-[#ffffff1a] text-sm font-bold text-[#ffffff99]">
            <Eye size={16} />
            {views.toLocaleString()} views
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {data.products.map((product) => (
          <motion.div key={product.id} whileHover={{ y: -10 }} className="glass rounded-[3rem] overflow-hidden group border border-[#ffffff0d] hover:border-[#00e5ff4d] transition-all duration-500 shadow-2xl relative">
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
                className={`w-full !py-5 flex items-center justify-center gap-4 text-xl font-black uppercase tracking-[0.2em] italic ${isCheckingOut === product.id ? "opacity-80" : ""}`}
                onClick={() => handleCheckout(product)}
                disabled={isCheckingOut === product.id}
              >
                {isCheckingOut === product.id ? <Loader2 className="animate-spin" size={24} /> : <ShoppingCart size={24} strokeWidth={3} />}
                {isCheckingOut === product.id ? "Preparing..." : "Buy Vibe"}
              </NeonButton>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
