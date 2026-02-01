"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

const CATEGORIES = [
  { icon: "✍️", name: "Writing", desc: "Blog posts, emails, copy" },
  { icon: "💻", name: "Coding", desc: "Debug, generate, explain" },
  { icon: "📊", name: "Business", desc: "Strategy, analysis, plans" },
  { icon: "🎨", name: "Creative", desc: "Stories, images, ideas" },
  { icon: "📚", name: "Learning", desc: "Summarize, teach, quiz" },
  { icon: "🔧", name: "Productivity", desc: "Automate, organize, plan" },
];

const FEATURED_PROMPTS = [
  {
    title: "Senior Dev Code Reviewer",
    category: "Coding",
    prompt: "Act as a senior software engineer. Review my code for bugs, performance issues, security vulnerabilities, and best practice violations. Be specific and suggest fixes.",
    copies: 2847,
    author: "promptvault",
  },
  {
    title: "AIDA Copywriting Framework",
    category: "Writing",
    prompt: "Write marketing copy using the AIDA framework (Attention, Interest, Desire, Action) for [product]. Target audience: [audience]. Tone: [tone]. Include a compelling headline and CTA.",
    copies: 1923,
    author: "promptvault",
  },
  {
    title: "First Principles Analyzer",
    category: "Business",
    prompt: "Break down [problem] using first principles thinking. Strip away all assumptions. What are the fundamental truths? Rebuild the solution from scratch. Challenge conventional wisdom.",
    copies: 1456,
    author: "promptvault",
  },
  {
    title: "Learning Roadmap Generator",
    category: "Learning",
    prompt: "Create a 30-day learning roadmap for [topic]. Include daily tasks (30 min each), key concepts, practical exercises, and recommended resources. Start from [level].",
    copies: 3102,
    author: "promptvault",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  const copyPrompt = (index: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-coral-950/20 via-transparent to-transparent dark:from-coral-950/30" />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-500/10 px-4 py-1.5 text-sm text-coral-600 dark:text-coral-300">
            🧠 Your AI prompt library
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Stop losing your
            <span className="metallic-text-gradient"> best prompts</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-foreground-secondary">
            Save, organize, and share your AI prompts. Tag them, search them, build collections.
            Your prompt library, always one click away.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="glass-input flex-1 px-4 py-3 text-foreground placeholder-foreground-secondary"
                required
              />
              <button type="submit" className="chrome-pill-button primary">
                Get Early Access
              </button>
            </form>
          ) : (
            <div className="liquid-glass-card mx-auto max-w-md p-4 text-center">
              <p className="text-green-600 dark:text-green-400">✓ You&apos;re on the list! We&apos;ll notify you when PromptVault launches.</p>
            </div>
          )}
          <p className="mt-4 text-sm text-foreground-secondary">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Prompts for every use case</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="liquid-glass-card p-5 transition hover:scale-[1.02] cursor-pointer">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="mt-2 font-semibold text-foreground">{cat.name}</h3>
              <p className="text-sm text-foreground-secondary">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Try these prompts now</h2>
        <p className="mb-8 text-center text-foreground-secondary">Click to copy. Paste into ChatGPT, Claude, or any AI.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED_PROMPTS.map((p, i) => (
            <div
              key={i}
              onClick={() => copyPrompt(i, p.prompt)}
              className="liquid-glass-card group cursor-pointer p-5 transition hover:scale-[1.01]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-coral-500/10 px-2.5 py-0.5 text-xs font-medium text-coral-600 dark:text-coral-300">{p.category}</span>
                <span className="text-xs text-foreground-secondary">{p.copies.toLocaleString()} copies</span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground group-hover:text-coral-600 dark:group-hover:text-coral-300 transition">{p.title}</h3>
              <p className="text-sm leading-relaxed text-foreground-secondary">{p.prompt}</p>
              <div className="mt-3 text-xs font-medium text-coral-600 dark:text-coral-400">
                {copied === i ? "✓ Copied!" : "Click to copy →"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Save", desc: "Paste any prompt. Tag it. Done. Takes 5 seconds." },
            { step: "2", title: "Organize", desc: "Tags, folders, categories. Search across everything instantly." },
            { step: "3", title: "Share", desc: "Create public collections. Share with a link. Build your prompt portfolio." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="chrome-ring-button mx-auto mb-4 !w-14 !h-14">
                <div className="chrome-ring-inner text-xl font-bold text-coral-400">
                  {s.step}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-foreground-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Simple pricing</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="liquid-glass-card p-6">
            <h3 className="text-lg font-semibold">Free</h3>
            <div className="mt-2 text-3xl font-bold">$0</div>
            <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
              <li>✓ 50 prompts</li>
              <li>✓ Basic tagging</li>
              <li>✓ Search</li>
              <li>✓ 1 public collection</li>
            </ul>
          </div>
          <div className="liquid-glass-card p-6 ring-2 ring-coral-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-coral-500 to-coral-600 px-3 py-0.5 text-xs font-bold text-white">Popular</div>
            <h3 className="text-lg font-semibold metallic-text-gradient">Pro</h3>
            <div className="mt-2 text-3xl font-bold">$5<span className="text-lg text-foreground-secondary">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
              <li>✓ Unlimited prompts</li>
              <li>✓ Folders and collections</li>
              <li>✓ Share with link</li>
              <li>✓ Import/Export</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <div className="liquid-glass-card p-6">
            <h3 className="text-lg font-semibold">Team</h3>
            <div className="mt-2 text-3xl font-bold">$12<span className="text-lg text-foreground-secondary">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
              <li>✓ Everything in Pro</li>
              <li>✓ Team workspace</li>
              <li>✓ Usage analytics</li>
              <li>✓ Shared prompt library</li>
              <li>✓ API access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-foreground-secondary">
        <p>PromptVault. Built for people who talk to AI every day.</p>
      </footer>
    </main>
  );
}
