"use client";
import { motion } from "framer-motion";

export default function NeonButton({ children, onClick, color = "cyan", className = "" }) {
  const glowColor = color === "cyan" ? "#00e5ff80" : "#c0152a80";
  const borderColor = color === "cyan" ? "#00E5FF" : "#C0152A";

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${glowColor}` }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-bold text-white border-2 transition-all duration-300 ${className}`}
      style={{ borderColor: borderColor }}
    >
      {children}
    </motion.button>
  );
}
