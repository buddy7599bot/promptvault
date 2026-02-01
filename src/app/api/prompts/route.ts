import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Get public/featured prompts
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ prompts: [] });

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");

  let query = supabase.from("prompts").select("*").eq("is_public", true).order("copies", { ascending: false }).limit(50);

  if (tag) query = query.contains("tags", [tag]);
  if (q) query = query.or(`title.ilike.%${q}%,prompt_text.ilike.%${q}%`);

  const { data } = await query;
  return NextResponse.json({ prompts: data || [] });
}

// Save a prompt
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const body = await req.json();
  const { title, prompt_text, tags, category, is_public } = body;

  if (!title || !prompt_text) {
    return NextResponse.json({ error: "Title and prompt required" }, { status: 400 });
  }

  // Extract user from Authorization header if present
  let user_id = body.user_id || null;
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { createClient } = await import("@supabase/supabase-js");
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await authClient.auth.getUser(token);
    if (user) user_id = user.id;
  }

  const { data, error } = await supabase
    .from("prompts")
    .insert({ title, prompt_text, tags: tags || [], category: category || "General", is_public: is_public ?? true, copies: 0, user_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prompt: data });
}
