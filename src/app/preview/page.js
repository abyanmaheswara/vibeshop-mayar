"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import StorefrontPreview from "@/components/StorefrontPreview";
import GlassNavbar from "@/components/GlassNavbar";

function PreviewContent() {
  const searchParams = useSearchParams();
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
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

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080408] text-white flex items-center justify-center font-mono">
          <div className="text-center space-y-4">
            <div className="text-4xl animate-pulse">BOOTING VIBE...</div>
          </div>
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
