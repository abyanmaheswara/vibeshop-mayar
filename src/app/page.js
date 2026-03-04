"use client";
import { useState } from "react";
import GlassNavbar from "@/components/GlassNavbar";
import ChatInterface from "@/components/ChatInterface";
import StorefrontPreview from "@/components/StorefrontPreview";
import { generateStore } from "@/lib/aiGenerator";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [storeData, setStoreData] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = async (prompt) => {
    const data = await generateStore(prompt);
    setStoreData(data);
    localStorage.setItem("lastGeneratedStore", JSON.stringify(data));
    setIsGenerated(true);
    // Scroll to preview
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-[#080408] text-white selection:bg-[#00E5FF]/30">
      <GlassNavbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00E5FF]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#C0152A]/10 blur-[120px] rounded-full animate-pulse delay-700" />

        <div className="z-10 text-center space-y-8 max-w-4xl">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-8xl font-black italic tracking-tighter">
            THE <span className="text-[#00E5FF] neon-glow-cyan">FUTURE</span> OF <br />
            COMMERCE IS <span className="text-[#C0152A] neon-glow-red">VIBES.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/50 text-xl font-medium">
            Generate a high-conversion digital storefront in 60 seconds with AI.
          </motion.p>

          <ChatInterface onGenerate={handleGenerate} />
        </div>
      </section>

      {/* Preview Section */}
      <AnimatePresence>
        {isGenerated && (
          <section id="preview" className="min-h-screen py-20 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
            <StorefrontPreview data={storeData} />
          </section>
        )}
      </AnimatePresence>

      {/* Footer Vibe */}
      <footer className="py-10 text-center border-t border-white/5 text-white/20 text-sm font-mono tracking-widest uppercase">Built by VibeShop AI — 2026 Competition Ready</footer>
    </main>
  );
}
