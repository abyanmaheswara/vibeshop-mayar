"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StorefrontPreview from "@/components/StorefrontPreview";
import GlassNavbar from "@/components/GlassNavbar";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    // In a real app, we would fetch this from a database using the ID
    // For now, let's try to get it from localStorage as a workaround for the demo
    const savedData = localStorage.getItem("lastGeneratedStore");
    if (savedData) {
      setStoreData(JSON.parse(savedData));
    }
  }, []);

  if (!storeData) {
    return (
      <div className="min-h-screen bg-[#080408] text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">LOADING VIBE...</div>
          <p className="text-white/30">Searching for storefront data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080408] text-white">
      <GlassNavbar />
      <div className="pt-24 pb-20 px-6">
        <StorefrontPreview data={storeData} isPreviewOnly={true} />
      </div>
      <footer className="py-10 text-center border-t border-white/5 text-white/20 text-sm font-mono tracking-widest uppercase">Powered by VibeShop AI</footer>
    </main>
  );
}
