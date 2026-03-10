# ⚡ VibeShop AI

> Generate a high-conversion digital storefront in 60 seconds with AI.

[![Live Demo](https://img.shields.io/badge/Live-vibeshop--mayar.vercel.app-00E5FF?style=for-the-badge)](https://vibeshop-mayar.vercel.app)

## ✨ Features

- 🤖 **AI Storefront Generator** — Describe your shop, get a full storefront with products, pricing, and descriptions
- 💬 **AI-Generated Reviews** — "Wall of Vibes" section with auto-generated thematic customer reviews
- 🛒 **Sliding Shopping Cart** — Glassmorphism cart drawer with add/remove items and total calculation
- 💳 **Mayar Payment Integration** — Real checkout via Mayar Headless Payment API
- 🔗 **Publish & Share** — Save storefronts to Supabase and share with a unique URL
- 🖼️ **Global Showcase** — Community gallery of all published AI-generated storefronts
- 📸 **Download as Image** — Export your storefront as a high-res PNG
- 🎨 **Cyberpunk Glassmorphism UI** — Neon glow, 3D card tilts, staggered animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| AI (Primary) | Groq SDK — LLaMA 3.1 8B Instant |
| AI (Fallback) | OpenRouter — Gemma 3, Mistral, LLaMA 3.3 |
| Database | Supabase (PostgreSQL + JSONB) |
| Payment | Mayar Headless API |
| Styling | Tailwind CSS v4 + Custom Glassmorphism |
| Animation | Framer Motion |
| Deployment | Vercel |

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/abyanmaheswara/vibeshop-mayar.git
cd vibeshop-mayar
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# AI Providers
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Payment
MAYAR_API_KEY=your_mayar_api_key

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE storefronts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.js    # AI storefront generation (Groq + OpenRouter)
│   │   ├── store/route.js       # Supabase CRUD for storefronts
│   │   ├── checkout/route.js    # Mayar payment integration
│   │   └── proxy-image/route.js # Image proxy for CORS
│   ├── preview/[slug]/page.js   # Public storefront preview
│   ├── showcase/page.js         # Global gallery
│   ├── page.js                  # Homepage + AI generator
│   ├── layout.js                # Root layout
│   └── globals.css              # Custom glassmorphism + scrollbar
├── components/
│   ├── ChatInterface.jsx        # AI prompt input + loading animation
│   ├── StorefrontPreview.jsx    # Generated store display + cart + reviews
│   ├── GlassNavbar.jsx          # Navigation bar
│   └── NeonButton.jsx           # Reusable neon button
└── lib/
    ├── aiGenerator.js           # AI API helper
    └── supabase.js              # Supabase client
```

## 🏆 Mayar Vibecoding Competition 2026

This project was built for the **Mayar Vibecoding Competition 2026** — developed entirely through AI pair-programming (vibecoding).

---

**Built with ⚡ by [Abyan Studio](https://github.com/abyanmaheswara)**
