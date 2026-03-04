// OpenRouter switch - No SDK needed, using fetch
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

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

    const systemPrompt = `You are VibeShop AI, a high-conversion digital storefront generator. 
      Your goal is to generate a structured JSON object for a storefront based on a user's prompt.
      
      The JSON should follow this structure:
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

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API Error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    const text = result.choices[0].message.content;

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
