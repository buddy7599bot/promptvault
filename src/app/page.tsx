"use client";

import { useState } from "react";

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/50 to-gray-950" />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            🧠 Your AI prompt library
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Stop losing your
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"> best prompts</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
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
                className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
              >
                Get Early Access
              </button>
            </form>
          ) : (
            <div className="mx-auto max-w-md rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-300">
              ✓ You&apos;re on the list! We&apos;ll notify you when PromptVault launches.
            </div>
          )}
          <p className="mt-4 text-sm text-gray-500">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Prompts for every use case</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition hover:border-violet-500/50 hover:bg-gray-900"
            >
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="mt-2 font-semibold">{cat.name}</h3>
              <p className="text-sm text-gray-400">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Try these prompts now</h2>
        <p className="mb-8 text-center text-gray-400">Click to copy. Paste into ChatGPT, Claude, or any AI.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED_PROMPTS.map((p, i) => (
            <div
              key={i}
              onClick={() => copyPrompt(i, p.prompt)}
              className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-5 transition hover:border-violet-500/50 hover:bg-gray-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">{p.category}</span>
                <span className="text-xs text-gray-500">{p.copies.toLocaleString()} copies</span>
              </div>
              <h3 className="mb-2 font-semibold group-hover:text-violet-300">{p.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{p.prompt}</p>
              <div className="mt-3 text-xs text-violet-400">
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-xl font-bold">
                {s.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Simple pricing</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-lg font-semibold">Free</h3>
            <div className="mt-2 text-3xl font-bold">$0</div>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>✓ 50 prompts</li>
              <li>✓ Basic tagging</li>
              <li>✓ Search</li>
              <li>✓ 1 public collection</li>
            </ul>
          </div>
          <div className="rounded-xl border border-violet-500/50 bg-violet-500/5 p-6 ring-1 ring-violet-500/20">
            <h3 className="text-lg font-semibold text-violet-300">Pro</h3>
            <div className="mt-2 text-3xl font-bold">$5<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>✓ Unlimited prompts</li>
              <li>✓ Folders and collections</li>
              <li>✓ Share with link</li>
              <li>✓ Import/Export</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-lg font-semibold">Team</h3>
            <div className="mt-2 text-3xl font-bold">$12<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
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
      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        <p>PromptVault. Built for people who talk to AI every day.</p>
      </footer>
    </main>
  );
}
