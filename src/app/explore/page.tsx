"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Fuse, { FuseResultMatch } from "fuse.js";

interface Prompt {
  id: string;
  title: string;
  prompt_text: string;
  category: string;
  tags: string[];
  copies: number;
}

const CATEGORIES = ["All", "Writing", "Coding", "Business", "Creative", "Learning", "Productivity"];

function highlightText(text: string, indices: readonly [number, number][] | undefined, maxLen = 200) {
  const truncated = text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  if (!indices || indices.length === 0) return <>{truncated}</>;

  const parts: React.ReactNode[] = [];
  let last = 0;
  const sorted = [...indices].sort((a, b) => a[0] - b[0]);
  for (const [start, end] of sorted) {
    if (start > maxLen) break;
    const s = Math.min(start, truncated.length);
    const e = Math.min(end + 1, truncated.length);
    if (s > last) parts.push(truncated.slice(last, s));
    parts.push(<mark key={s} className="bg-violet-500/30 text-violet-200 rounded px-0.5">{truncated.slice(s, e)}</mark>);
    last = e;
  }
  if (last < truncated.length) parts.push(truncated.slice(last));
  return <>{parts}</>;
}

export default function Explore() {
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all public prompts once
  useEffect(() => {
    fetch("/api/prompts?limit=200")
      .then((r) => r.json())
      .then((d) => { setAllPrompts(d.prompts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fuse = useMemo(
    () =>
      new Fuse(allPrompts, {
        keys: [
          { name: "title", weight: 2 },
          { name: "prompt_text", weight: 1 },
          { name: "category", weight: 0.5 },
          { name: "tags", weight: 1.5 },
        ],
        includeMatches: true,
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [allPrompts]
  );

  const filtered = useMemo(() => {
    let results: { item: Prompt; matches?: readonly FuseResultMatch[] }[];

    if (debouncedSearch) {
      results = fuse.search(debouncedSearch).map((r) => ({ item: r.item, matches: r.matches }));
    } else {
      results = allPrompts.map((item) => ({ item, matches: undefined }));
    }

    if (category !== "All") {
      results = results.filter((r) => r.item.category === category);
    }

    return results;
  }, [debouncedSearch, category, fuse, allPrompts]);

  const copyPrompt = useCallback((p: Prompt) => {
    navigator.clipboard.writeText(p.prompt_text);
    setCopied(p.id);
    setTimeout(() => setCopied(null), 2000);
    fetch("/api/prompts/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    }).catch(() => {});
  }, []);

  const getMatchIndices = (matches: readonly FuseResultMatch[] | undefined, key: string) => {
    if (!matches) return undefined;
    const m = matches.find((m) => m.key === key);
    return m?.indices as readonly [number, number][] | undefined;
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">Explore Prompts</h1>

        <input
          type="text"
          placeholder="Search prompts... just start typing"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
          autoFocus
        />

        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-sm ${
                category === c ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-16 text-center text-gray-500">Loading prompts...</p>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            {debouncedSearch ? (
              <p className="text-lg">No prompts match &quot;{debouncedSearch}&quot;</p>
            ) : (
              <>
                <p className="text-lg">No prompts yet. Be the first to submit one!</p>
                <a href="/submit" className="mt-4 inline-block text-violet-400 hover:text-violet-300">Submit a prompt</a>
              </>
            )}
          </div>
        ) : (
          <>
            {debouncedSearch && (
              <p className="mb-4 text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{debouncedSearch}&quot;</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map(({ item: p, matches }) => (
                <div
                  key={p.id}
                  onClick={() => copyPrompt(p)}
                  className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition hover:border-violet-500/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">{p.category}</span>
                    <span className="text-xs text-gray-500">{p.copies} copies</span>
                  </div>
                  <h3 className="mb-2 font-semibold group-hover:text-violet-300">
                    {highlightText(p.title, getMatchIndices(matches, "title"), 100)}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {highlightText(p.prompt_text, getMatchIndices(matches, "prompt_text"), 200)}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1">
                      {p.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">{t}</span>
                      ))}
                    </div>
                    <span className="text-xs text-violet-400">
                      {copied === p.id ? "Copied!" : "Click to copy"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
