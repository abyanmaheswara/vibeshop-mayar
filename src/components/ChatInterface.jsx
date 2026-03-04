"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import NeonButton from "./NeonButton";

export default function ChatInterface({ onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const loadingSteps = ["Analyzing your vibe...", "Designing storefront components...", "Generating product catalog...", "Hardening payment security...", "VibeShop is ready! 🔥"];

  useEffect(() => {
    if (isGenerating) {
      let currentStep = 0;
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 1;
          if (next % 20 === 0 && currentStep < loadingSteps.length - 1) {
            currentStep++;
            setStatus(loadingSteps[currentStep]);
          }
          return next;
        });
      }, 50);
      setStatus(loadingSteps[0]);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    setIsGenerating(true);
    setProgress(0);

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      onGenerate(prompt);
    }, 5500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleSubmit} className="glass p-2 rounded-3xl flex items-center gap-2 shadow-2xl">
            <div className="pl-4 text-[#00E5FF]">
              <Sparkles size={20} />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your shop (e.g. Toko kaos trendy Gen Z)"
              className="flex-1 bg-transparent border-none outline-none text-white py-3 placeholder:text-white/30"
            />
            <NeonButton type="submit" color="cyan" className="!px-4 !py-2 rounded-2xl">
              <ArrowRight size={20} />
            </NeonButton>
          </motion.form>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-8 rounded-3xl text-center space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
            <div className="relative w-20 h-20 mx-auto">
              <Loader2 className="w-full h-full text-[#00E5FF] animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">{progress}%</div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold neon-glow-cyan italic tracking-wider animate-pulse">{status}</h3>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10">
                <motion.div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#C0152A]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
