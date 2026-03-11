"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlassNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:pr-8 sm:border-r sm:border-[#ffffff1a]">
          <img src="/logo.png" alt="Abyan Studio" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg" />
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#C0152A] bg-clip-text text-transparent italic tracking-tighter">VIBESHOP AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 ml-8 mr-auto text-sm font-bold uppercase tracking-widest text-[#ffffff66]">
          <a href="/" className="px-4 py-2 rounded-xl hover:text-[#00E5FF] hover:bg-[#ffffff0a] transition-all duration-300">
            Create
          </a>
          <Link href="/showcase" className="px-4 py-2 rounded-xl hover:text-[#C0152A] hover:bg-[#ffffff0a] transition-all duration-300">
            Showcase
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white/70 hover:text-[#00E5FF] hover:bg-[#ffffff0a] transition-all"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mt-2 mx-auto max-w-7xl glass rounded-2xl overflow-hidden border border-[#ffffff0d]"
          >
            <a
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#ffffff66] hover:text-[#00E5FF] hover:bg-[#ffffff0a] transition-all border-b border-[#ffffff0d]"
            >
              Create
            </a>
            <Link
              href="/showcase"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#ffffff66] hover:text-[#C0152A] hover:bg-[#ffffff0a] transition-all"
            >
              Showcase
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
