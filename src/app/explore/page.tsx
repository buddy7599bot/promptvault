"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Prompt {
  id: string;
  title: string;
  prompt_text: string;
  category: string;
  tags: string[];
  copies: number;
}

const CATEGORIES = ["All", "Writing", "Coding", "Business", "Creative", "Learning", "Productivity"];

export default function Explore() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "All") params.set("tag", category);
    fetch(`/api/prompts?${params}`)
      .then((r) => r.json())
      .then((d) => setPrompts(d.prompts || []))
      .catch(() => {});
  }, [search, category]);

  const copyPrompt = (p: Prompt) => {
    navigator.clipboard.writeText(p.prompt_text);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 2000);
    fetch("/api/prompts/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    }).catch(() => {});
  };

  return (
    <main className="min-h-screen">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-violet-400">🧠 PromptVault</Link>
          <Link href="/submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">
            Submit Prompt
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">Explore Prompts</h1>

        <input
          type="text"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
        />

        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-sm ${
                category === c
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {prompts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-lg">No prompts yet. Be the first to submit one!</p>
            <Link href="/submit" className="mt-4 inline-block text-violet-400 hover:text-violet-300">Submit a prompt →</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {prompts.map((p) => (
              <div
                key={p.id}
                onClick={() => copyPrompt(p)}
                className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition hover:border-violet-500/50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">{p.category}</span>
                  <span className="text-xs text-gray-500">{p.copies} copies</span>
                </div>
                <h3 className="mb-2 font-semibold group-hover:text-violet-300">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">{p.prompt_text}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    {p.tags?.slice(0, 3).map((t) => (
                      <span key={t} className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">{t}</span>
                    ))}
                  </div>
                  <span className="text-xs text-violet-400">
                    {copied === p.id ? "✓ Copied!" : "Click to copy"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
