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
        <p className="mb-8 text-foreground-secondary">Share your best prompts with the community.</p>

        {!user && (
          <div className="liquid-glass-card mb-6 p-4 text-sm">
            <span className="text-coral-600 dark:text-coral-300">Please </span>
            <button onClick={() => router.push("/login")} className="underline text-coral-600 dark:text-coral-300">log in</button>
            <span className="text-coral-600 dark:text-coral-300"> to submit prompts.</span>
          </div>
        )}

        {status === "saved" ? (
          <div className="liquid-glass-card p-6 text-center">
            <p className="text-lg text-green-600 dark:text-green-400">Prompt saved!</p>
            <div className="mt-4 flex justify-center gap-4">
              <button onClick={() => setStatus("idle")} className="chrome-pill-button">Submit another</button>
              <button onClick={() => router.push("/explore")} className="chrome-pill-button primary">Browse prompts</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Dev Code Reviewer"
                className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Prompt</label>
              <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} placeholder="Paste your prompt here..." rows={6}
                className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="glass-input w-full px-4 py-3 text-foreground">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Tags (comma separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. chatgpt, writing, seo"
                  className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary" />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="accent-coral-500" />
              <span className="text-sm text-foreground-secondary">Make this prompt public (visible to everyone)</span>
            </label>
            <button type="submit" disabled={status === "saving" || !user}
              className="chrome-pill-button primary w-full !py-3 text-base font-semibold disabled:opacity-50">
              {status === "saving" ? "Saving..." : "Submit Prompt"}
            </button>
            {status === "error" && <p className="text-center text-sm text-red-500">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </main>
  );
}
