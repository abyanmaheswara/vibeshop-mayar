import Link from "next/link";

export default function GlassNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-[#00E5FF] to-[#C0152A] bg-clip-text text-transparent italic">
          VIBESHOP AI
        </Link>
      </div>
    </nav>
  );
}
