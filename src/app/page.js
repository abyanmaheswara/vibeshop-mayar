"use client";
import { useState, useEffect } from "react";
import GlassNavbar from "@/components/GlassNavbar";
import ChatInterface from "@/components/ChatInterface";
import StorefrontPreview from "@/components/StorefrontPreview";
import { generateStore } from "@/lib/aiGenerator";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [storeData, setStoreData] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleGenerate = async (prompt, slug) => {
    const data = await generateStore(prompt);
    setStoreData(data);
    setCustomSlug(slug || "");
    localStorage.setItem("lastGeneratedStore", JSON.stringify(data));
    setIsGenerated(true);
    // Scroll to preview
    setTimeout(() => {
      document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleRegenerate = () => {
    setIsGenerated(false);
    setTimeout(() => {
      setStoreData(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300); // Wait for AnimatePresence exit
  };

  return (
    <main className="min-h-screen bg-[#080408] text-white selection:bg-[#00e5ff4d]">
      <GlassNavbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Animated Background Orbs - Toned Down for comfort */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00e5ff0a] blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#c0152a0a] blur-[150px] rounded-full" />

        <div className="z-10 text-center space-y-8 max-w-4xl">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black italic tracking-tighter">
            THE <span className="text-[#00E5FF] neon-glow-cyan">FUTURE</span> OF <br />
            COMMERCE IS <span className="text-[#C0152A] neon-glow-red">VIBES.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[#ffffff80] text-xl font-medium">
            Generate a high-conversion digital storefront in 60 seconds with AI.
          </motion.p>

          <ChatInterface onGenerate={handleGenerate} />
        </div>
      </section>

      {/* Preview Section */}
      <AnimatePresence>
        {isGenerated && (
          <section id="preview" className="min-h-screen py-20 px-6" style={{ background: "linear-gradient(to bottom, transparent, #ffffff05)" }}>
            <StorefrontPreview data={storeData} customSlug={customSlug} onRegenerate={handleRegenerate} />
          </section>
        )}
      </AnimatePresence>

      {/* Footer Vibe */}
      <footer className="py-12 text-center border-t border-[#ffffff0d] flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <img src="/logo.png" alt="Abyan Studio" className="w-6 h-6 rounded-md" />
          <span className="text-xs font-mono tracking-widest uppercase">Built by Abyan Studio</span>
        </div>
        <p className="text-[#ffffff26] text-[10px] font-mono tracking-[0.3em] uppercase italic">VibeShop AI — 2026 Competition Ready</p>
      </footer>
    </main>
  );
}
