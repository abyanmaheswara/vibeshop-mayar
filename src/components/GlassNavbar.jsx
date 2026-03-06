import Link from "next/link";

export default function GlassNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 pr-8 border-r border-[#ffffff1a]">
          <img src="/logo.png" alt="Abyan Studio" className="w-8 h-8 rounded-lg" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#C0152A] bg-clip-text text-transparent italic tracking-tighter">VIBESHOP AI</span>
        </Link>
        <div className="flex items-center gap-6 ml-8 mr-auto text-sm font-bold uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-[#00E5FF] transition-colors">
            Create
          </Link>
          <Link href="/showcase" className="hover:text-[#C0152A] transition-colors">
            Showcase
          </Link>
        </div>
      </div>
    </nav>
  );
}
