import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 2000,
      system: `You are VibeShop AI, a high-conversion digital storefront generator. 
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
      
      Only return the JSON object. No other text.`,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const data = JSON.parse(text);

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
