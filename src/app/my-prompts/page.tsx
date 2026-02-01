"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface Prompt {
  id: string;
  title: string;
  prompt_text: string;
  category: string;
  tags: string[];
  is_public: boolean;
  copies: number;
  created_at: string;
}

const CATEGORIES = ["Writing", "Coding", "Business", "Creative", "Learning", "Productivity"];

export default function MyPrompts() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [editForm, setEditForm] = useState({ title: "", prompt_text: "", category: "", tags: "", is_public: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    loadPrompts();
  }, [user]);

  const loadPrompts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setPrompts(data || []);
    setLoading(false);
  };

  const startEdit = (p: Prompt) => {
    setEditing(p);
    setEditForm({
      title: p.title,
      prompt_text: p.prompt_text,
      category: p.category,
      tags: p.tags?.join(", ") || "",
      is_public: p.is_public,
    });
  };

  const saveEdit = async () => {
    if (!editing || !session) return;
    setSaving(true);
    const res = await fetch(`/api/prompts/${editing.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        title: editForm.title,
        prompt_text: editForm.prompt_text,
        category: editForm.category,
        tags: editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        is_public: editForm.is_public,
      }),
    });
    if (res.ok) {
      setEditing(null);
      loadPrompts();
    }
    setSaving(false);
  };

  const deletePrompt = async (id: string) => {
    if (!session || !confirm("Delete this prompt?")) return;
    await fetch(`/api/prompts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    loadPrompts();
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-20 text-gray-500">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">My Prompts</h1>

        {loading ? (
          <p className="text-gray-500">Loading your prompts...</p>
        ) : prompts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-lg">You have not submitted any prompts yet.</p>
            <button onClick={() => router.push("/submit")} className="mt-4 text-violet-400 hover:text-violet-300">
              Submit your first prompt
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((p) => (
              <div key={p.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">{p.category}</span>
                    <span className="text-xs text-gray-500">{p.is_public ? "Public" : "Private"}</span>
                    <span className="text-xs text-gray-500">{p.copies} copies</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="rounded px-3 py-1 text-xs text-violet-400 hover:bg-violet-500/10">
                      Edit
                    </button>
                    <button onClick={() => deletePrompt(p.id)} className="rounded px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">
                      Delete
                    </button>
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">{p.prompt_text}</p>
                {p.tags?.length > 0 && (
                  <div className="mt-3 flex gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-6">
            <h2 className="mb-4 text-xl font-bold">Edit Prompt</h2>
            <div className="space-y-4">
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-violet-500 focus:outline-none"
                placeholder="Title"
              />
              <textarea
                value={editForm.prompt_text}
                onChange={(e) => setEditForm({ ...editForm, prompt_text: e.target.value })}
                rows={5}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-violet-500 focus:outline-none"
                placeholder="Prompt text"
              />
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-violet-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-violet-500 focus:outline-none"
                placeholder="Tags (comma separated)"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.is_public}
                  onChange={(e) => setEditForm({ ...editForm, is_public: e.target.checked })}
                />
                <span className="text-sm text-gray-400">Public</span>
              </label>
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white">
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
