import OpenAI from "openai";

const OPENROUTER_URL = "https://openrouter.ai/api/v1";

// Mock data as fallback
const MOCK_STOREFRONT = {
  name: "Neon Vibe Shop",
  tagline: "The Future of Aesthetics",
  description: "A premium digital storefront generated with AI and high-octane vibes.",
  theme: {
    primaryColor: "#00e5ff",
    secondaryColor: "#c0152a",
    accentColor: "#ffffff",
  },
  products: [
    {
      id: "prod-1",
      name: "Cyber Hoodie v1",
      price: 850000,
      description: "Oversized fit with reactive neon fibers and moisture-wicking tech.",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "prod-2",
      name: "Neural Optic Shades",
      price: 1200000,
      description: "AR-ready sunglasses with polarized HUD technology.",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281303f?q=80&w=1000&auto=format&fit=crop",
    },
  ],
};

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === "your_openrouter_api_key_here") {
      console.warn("OPENROUTER_API_KEY is not configured. Using mock fallback.");
      return new Response(JSON.stringify(MOCK_STOREFRONT), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({
      baseURL: OPENROUTER_URL,
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Required for OpenRouter
        "X-Title": "VibeShop AI", // Optional
      }
    });

    const systemPrompt = `You are VibeShop AI, a high-conversion digital storefront generator. 
      Your goal is to generate a structured JSON object for a storefront based on a user's prompt.
      
      The storefront should have a high-octane, neon, cyberpunk aesthetic (Bold theme).
      Use vibrant colors like #00E5FF (Cyan) and #C0152A (Magenta) in your suggestions if applicable.
      
      The JSON should follow this structure. Do NOT wrap output with \`\`\`json:
      {
        "name": "Shop Name",
        "tagline": "A catchy tagline",
        "description": "Short compelling description",
        "theme": {
            "primaryColor": "#HEX",
            "secondaryColor": "#HEX",
            "accentColor": "#HEX"
        },
        "products": [
          {
            "id": "unique-id",
            "name": "Product Name",
            "price": 100000,
            "description": "Product description",
            "image": "https://images.unsplash.com/photo-..."
          }
        ]
      }
      
      Only return the JSON object. No other text.`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0].message.content;

    try {
      // Clean up response (handle potential markdown code blocks)
      const jsonStr = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const data = JSON.parse(jsonStr);

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("AI Response Parsing Failed:", text);
      throw parseError;
    }
  } catch (error) {
    console.error("AI Generation Error Details:", {
      message: error.message,
      stack: error.stack,
      raw: error,
    });

    // Fallback to mock data on ANY error
    console.warn("OpenRouter failing. Triggering VibeShop AI Mock Fallback.");
    return new Response(JSON.stringify(MOCK_STOREFRONT), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
