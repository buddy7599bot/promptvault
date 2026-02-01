"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
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

const CATEGORIES = ["All", "Writing", "Coding", "Business", "Creative", "Learning", "Productivity", "Image Gen", "Career", "Marketing"];

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
    parts.push(<mark key={s} className="bg-coral-500/30 text-coral-700 dark:text-coral-200 rounded px-0.5">{truncated.slice(s, e)}</mark>);
    last = e;
  }
  if (last < truncated.length) parts.push(truncated.slice(last));
  return <>{parts}</>;
}

function CopyParticles({ show }: { show: boolean }) {
  if (!show) return null;
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const dist = 15 + Math.random() * 10;
    return { key: i, px: Math.cos(angle) * dist, py: Math.sin(angle) * dist, delay: Math.random() * 0.1 };
  });
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.key}
          className="copy-particle"
          style={{ "--px": `${p.px}px`, "--py": `${p.py}px`, animationDelay: `${p.delay}s` } as React.CSSProperties}
        />
      ))}
    </>
  );
}

export default function Explore() {
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/prompts?limit=200")
      .then((r) => r.json())
      .then((d) => { setAllPrompts(d.prompts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Staggered card reveal on data change
  useEffect(() => {
    setRevealedCards(new Set());
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Small delay to allow DOM update
    const startTimer = setTimeout(() => {
      const grid = gridRef.current;
      if (!grid) return;
      const cards = grid.querySelectorAll(".stagger-card");
      cards.forEach((_, i) => {
        const t = setTimeout(() => {
          setRevealedCards((prev) => new Set(prev).add(i));
        }, i * 80);
        timers.push(t);
      });
    }, 50);
    return () => {
      clearTimeout(startTimer);
      timers.forEach(clearTimeout);
    };
  }, [debouncedSearch, category, loading]);

  // Typing indicator for aurora
  useEffect(() => {
    if (search) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
    setIsTyping(false);
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

        {/* Aurora glow search bar */}
        <div className={`aurora-search mb-4 ${isTyping ? "typing" : ""}`}>
          <input
            type="text"
            placeholder="Search prompts... just start typing"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary relative z-10"
            autoFocus
          />
        </div>

        {/* Category tabs with underline animation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`liquid-glass-tab tab-underline whitespace-nowrap flex-shrink-0 ${category === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="py-16 text-center text-foreground-secondary">Loading prompts...</p>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-foreground-secondary">
            {debouncedSearch ? (
              <p className="text-lg">No prompts match &quot;{debouncedSearch}&quot;</p>
            ) : (
              <>
                <p className="text-lg">No prompts yet. Be the first to submit one!</p>
                <a href="/submit" className="mt-4 inline-block text-coral-600 dark:text-coral-400 hover:text-coral-500">Submit a prompt</a>
              </>
            )}
          </div>
        ) : (
          <>
            {debouncedSearch && (
              <p className="mb-4 text-sm text-foreground-secondary">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{debouncedSearch}&quot;</p>
            )}
            <div ref={gridRef} className="grid gap-4 sm:grid-cols-2">
              {filtered.map(({ item: p, matches }, i) => (
                <div
                  key={p.id}
                  onClick={() => copyPrompt(p)}
                  className={`liquid-glass-card card-interactive card-flip-container stagger-card group cursor-pointer p-5 ${revealedCards.has(i) ? "revealed" : ""}`}
                >
                  <div className="card-flip-inner">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-coral-500/10 px-2.5 py-0.5 text-xs font-medium text-coral-600 dark:text-coral-300">{p.category}</span>
                      <span className="text-xs text-foreground-secondary">{p.copies} copies</span>
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground group-hover:text-coral-600 dark:group-hover:text-coral-300 transition">
                      {highlightText(p.title, getMatchIndices(matches, "title"), 100)}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground-secondary">
                      {highlightText(p.prompt_text, getMatchIndices(matches, "prompt_text"), 200)}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-1">
                        {p.tags?.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-coral-500/5 border border-coral-500/10 px-2 py-0.5 text-xs text-foreground-secondary">{t}</span>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-coral-600 dark:text-coral-400 relative inline-flex items-center gap-1">
                        {copied === p.id ? (
                          <>
                            <span className="copy-check inline-block">✓</span>
                            <span>Copied!</span>
                            <CopyParticles show={true} />
                          </>
                        ) : (
                          "Click to copy"
                        )}
                      </span>
                    </div>
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
