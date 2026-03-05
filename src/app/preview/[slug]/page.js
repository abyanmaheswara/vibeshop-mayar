"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StorefrontPreview from "@/components/StorefrontPreview";
import GlassNavbar from "@/components/GlassNavbar";
import { supabase } from "@/lib/supabase";

export default function DynamicPreviewPage() {
  const params = useParams();
  const slug = params.slug;
  const [storeData, setStoreData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/store?slug=${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Storefront not found");
          return res.json();
        })
        .then((data) => {
          const store = data;
          setStoreData(store);
          setLoading(false);

          // Increment view counter
          if (store && store.slug) {
            const currentViews = store.views || 0;
            supabase
              .from("storefronts")
              .update({ views: currentViews + 1 })
              .eq("slug", slug)
              .then(() => {
                // Update local state to reflect the new view count
                setStoreData((prev) => ({ ...prev, views: currentViews + 1 }));
              })
              .catch((e) => console.error("Failed to update view count", e));
          }
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080408] text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse uppercase tracking-widest">LOADING VIBE...</div>
          <p className="text-white/30 italic">Decrypting storefront data from the vibe-grid...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080408] text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-6 glass p-12 rounded-[3rem] border border-[#C0152A]/20">
          <h1 className="text-4xl font-black text-[#C0152A] italic uppercase">404 VIBE NOT FOUND</h1>
          <p className="text-white/50">{error}</p>
          <a href="/" className="inline-block text-[#00E5FF] border-b border-[#00E5FF]/30 hover:border-[#00E5FF] transition-all">
            Back to Generator
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080408] text-white selection:bg-[#00E5FF]/30">
      <GlassNavbar />
      <div className="pt-24 pb-20 px-6">
        <StorefrontPreview data={storeData?.data} views={storeData?.views} isPreviewOnly={true} />
      </div>
      <footer className="py-10 text-center border-t border-white/5 text-white/20 text-sm font-mono tracking-widest uppercase italic">Powered by VibeShop AI — Future Commerce</footer>
    </main>
  );
}
