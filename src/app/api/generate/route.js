import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    const text = response.text();

    // Clean up response (sometimes Gemini adds ```json ... ```)
    const jsonStr = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const data = JSON.parse(jsonStr);

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate storefront" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
