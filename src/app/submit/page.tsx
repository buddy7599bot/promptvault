"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["Writing", "Coding", "Business", "Creative", "Learning", "Productivity"];

export default function Submit() {
  const { user, session } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("Writing");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !session) {
      router.push("/login");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          prompt_text: promptText,
          category,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          is_public: isPublic,
          user_id: user.id,
        }),
      });
      if (res.ok) {
        setStatus("saved");
        setTitle("");
        setPromptText("");
        setTags("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">Submit a Prompt</h1>
        <p className="mb-8 text-gray-400">Share your best prompts with the community.</p>

        {!user && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300 text-sm">
            Please <button onClick={() => router.push("/login")} className="underline">log in</button> to submit prompts.
          </div>
        )}

        {status === "saved" ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
            <p className="text-lg text-green-300">Prompt saved!</p>
            <div className="mt-4 flex justify-center gap-4">
              <button onClick={() => setStatus("idle")} className="text-violet-400 hover:text-violet-300">Submit another</button>
              <button onClick={() => router.push("/explore")} className="text-violet-400 hover:text-violet-300">Browse prompts</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Dev Code Reviewer"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Prompt</label>
              <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder="Paste your prompt here..." rows={6}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-violet-500 focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. chatgpt, writing, seo"
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none" />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded border-gray-600" />
              <span className="text-sm text-gray-400">Make this prompt public (visible to everyone)</span>
            </label>
            <button type="submit" disabled={status === "saving" || !user}
              className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50">
              {status === "saving" ? "Saving..." : "Submit Prompt"}
            </button>
            {status === "error" && <p className="text-center text-sm text-red-400">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </main>
  );
}
