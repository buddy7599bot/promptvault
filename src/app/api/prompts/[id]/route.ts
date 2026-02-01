import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getUserIdFromToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  try {
    const token = auth.replace("Bearer ", "");
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: existing } = await supabase.from("prompts").select("user_id").eq("id", id).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, prompt_text, category, tags, is_public } = body;

  const { data, error } = await supabase
    .from("prompts")
    .update({ title, prompt_text, category, tags, is_public })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prompt: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const userId = getUserIdFromToken(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: existing } = await supabase.from("prompts").select("user_id").eq("id", id).single();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supabase.from("prompts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
