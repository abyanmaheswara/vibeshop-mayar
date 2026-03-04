import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { slug, data } = await req.json();

    const { data: result, error } = await supabase.from("storefronts").upsert({ slug, data }, { onConflict: "slug" }).select();

    if (error) throw error;

    return new Response(JSON.stringify(result[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Supabase Save Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase.from("storefronts").select("*").eq("slug", slug).single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Supabase Fetch Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
