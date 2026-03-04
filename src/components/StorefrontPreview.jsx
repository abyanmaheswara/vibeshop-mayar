"use client";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink, Share2, Loader2, Check } from "lucide-react";
import NeonButton from "./NeonButton";
import { generateMayarLink } from "@/lib/mayarHelper";
import { useState } from "react";

export default function StorefrontPreview({ data, isPreviewOnly = false }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishUrl, setPublishUrl] = useState("");

  if (!data) return null;

  const handlePublish = async () => {
    if (isPreviewOnly) return;
    setIsPublishing(true);

    try {
      // Generate a unique slug based on the shop name or random
      const slug = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substr(2, 5);

      const response = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, data: data }),
      });

      if (!response.ok) throw new Error("Failed to save to database");

      const url = `${window.location.origin}/preview/${slug}`;
      setPublishUrl(url);
      navigator.clipboard.writeText(url);
      setIsPublished(true);
      alert(`VibeShop Published! Link copied to clipboard: ${url}`);
    } catch (error) {
      console.error("Publish Error:", error);
      alert("Error publishing: " + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent italic tracking-tighter uppercase leading-none">{data.name}</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">{data.description}</p>
        {!isPreviewOnly && (
          <div className="flex justify-center gap-4">
            <NeonButton onClick={handlePublish} color={isPublished ? "magenta" : "cyan"} className="flex items-center gap-3 !px-8 !py-4 rounded-full font-bold uppercase tracking-widest text-lg group overflow-hidden relative">
              {isPublishing ? <Loader2 className="animate-spin" size={20} /> : isPublished ? <Check size={20} /> : <Share2 size={20} className="group-hover:rotate-12 transition-transform" />}
              <span>{isPublishing ? "Encrypting Vibe..." : isPublished ? "Link Copied!" : "Publish & Share"}</span>
            </NeonButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {data.products.map((product) => (
          <motion.div key={product.id} whileHover={{ y: -10 }} className="glass rounded-[3rem] overflow-hidden group border border-white/5 hover:border-[#00E5FF]/30 transition-all duration-500 shadow-2xl relative">
            <div className="h-96 overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080408] via-[#080408]/20 to-transparent opacity-90 transition-opacity group-hover:opacity-70" />
              <div className="absolute top-6 right-6 glass px-6 py-2 rounded-full border border-white/10 font-black text-xl text-[#00E5FF] neon-glow-cyan italic">Rp {product.price.toLocaleString("id-ID")}</div>
            </div>
            <div className="p-12 space-y-8 relative">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-[#00E5FF] transition-colors duration-500">{product.name}</h3>
                <p className="text-white/40 text-base font-medium leading-relaxed max-w-sm line-clamp-2">{product.description || "Premium high-quality items designed with vibe in mind and soul in core."}</p>
              </div>
              <NeonButton
                color="cyan"
                className="w-full !py-5 flex items-center justify-center gap-4 text-xl font-black uppercase tracking-[0.2em] italic"
                onClick={() => window.open(generateMayarLink(product.slug || product.id, product.price), "_blank")}
              >
                <ShoppingCart size={24} strokeWidth={3} /> Buy Vibe
              </NeonButton>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
