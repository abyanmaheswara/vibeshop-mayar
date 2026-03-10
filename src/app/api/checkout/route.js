export async function POST(req) {
  try {
    const product = await req.json();

    if (!process.env.MAYAR_API_KEY) {
      throw new Error("MAYAR_API_KEY is not configured in environment variables.");
    }

    // Prepare payload for Mayar Headless API
    const payload = {
      name: "VibeShop Customer", // Default generic requested by API strict validation
      amount: parseInt(product.price) || 0,
      email: "guest@vibeshop.local", // Required field
      mobile: "080000000000", // Required field
      description: product.description || `Payment for ${product.name} from VibeShop AI`, // Support cart descriptions
    };

    const response = await fetch("https://api.mayar.id/hl/v1/payment/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MAYAR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Mayar API Error:", result);
      throw new Error(result.messages || "Failed to create Mayar payment link");
    }

    if (result.data && result.data.link) {
      return new Response(JSON.stringify({ url: result.data.link }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      throw new Error("Invalid response from Mayar API: missing link");
    }
  } catch (error) {
    console.error("Checkout Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
