"use client";
import { motion } from "framer-motion";

export default function NeonButton({ children, onClick, color = "cyan", className = "", disabled = false }) {
  let glowColor, borderColor, textColor;

  switch (color) {
    case "black":
      glowColor = "rgba(0,0,0,0.15)";
      borderColor = "#000000";
      textColor = "text-black";
      break;
    case "gold":
      glowColor = "#D4AF374d";
      borderColor = "#D4AF37";
      textColor = "text-[#D4AF37]";
      break;
    case "magenta":
      glowColor = "#c0152a80";
      borderColor = "#C0152A";
      textColor = "text-white";
      break;
    case "cyan":
    default:
      glowColor = "#00e5ff80";
      borderColor = "#00E5FF";
      textColor = "text-white";
  }

  // clean any accidental text-white from className
  const cleanClass = className.replace(/text-white/g, "").trim();

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05, boxShadow: disabled ? "none" : `0 0 20px ${glowColor}` }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-3 rounded-full font-bold ${textColor} border-2 transition-all duration-300 ${cleanClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{ borderColor: borderColor }}
    >
      {children}
    </motion.button>
  );
}
