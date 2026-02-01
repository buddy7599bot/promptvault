"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

const TYPEWRITER_PROMPTS = [
  "Write a blog post about...",
  "Generate a marketing email...",
  "Create a landing page for...",
  "Analyze this data and...",
  "Build a React component that...",
];

const FLOATING_CARDS = [
  // Left edge only
  { text: "Summarize this article in 3 bullet points", left: "1%", top: "5%", duration: "18s", delay: "0s", opacity: 0.30, rot: "-2deg", size: "medium" },
  { text: "Explain quantum computing to a 5 year old", left: "2%", top: "55%", duration: "21s", delay: "3s", opacity: 0.28, rot: "-3deg", size: "small" },
  { text: "Rewrite this landing page copy", left: "1%", top: "30%", duration: "23s", delay: "2s", opacity: 0.25, rot: "-1.5deg", size: "small" },
  // Right edge only
  { text: "Write a professional email to decline politely", left: "78%", top: "3%", duration: "22s", delay: "2s", opacity: 0.30, rot: "1.5deg", size: "medium" },
  { text: "Create a weekly meal plan for a family of 4", left: "80%", top: "45%", duration: "24s", delay: "1s", opacity: 0.28, rot: "2.5deg", size: "small" },
  { text: "Build a React component with TypeScript", left: "83%", top: "18%", duration: "20s", delay: "4s", opacity: 0.25, rot: "2deg", size: "small" },
];

function useTypewriter(phrases: string[], typingSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentPhrase.length) {
          // Variable speed: slower on spaces and punctuation
          const char = currentPhrase[text.length];
          const extraDelay = char === " " ? 40 : char === "." ? 120 : Math.random() * 30;
          setText(currentPhrase.slice(0, text.length + 1));
          return;
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
          return;
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deleteSpeed : typingSpeed + (Math.random() * 30));

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deleteSpeed, pauseTime]);

  return text;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reveal the section
            entry.target.classList.add("revealed");
            // Stagger children with .stagger-card
            const cards = entry.target.querySelectorAll(".stagger-card");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("revealed"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function CopyParticles({ show }: { show: boolean }) {
  if (!show) return null;
  const particles = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const dist = 15 + Math.random() * 10;
    return {
      key: i,
      px: Math.cos(angle) * dist,
      py: Math.sin(angle) * dist,
      delay: Math.random() * 0.1,
    };
  });
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.key}
          className="copy-particle"
          style={{
            "--px": `${p.px}px`,
            "--py": `${p.py}px`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const typedText = useTypewriter(TYPEWRITER_PROMPTS);

  const categoriesRef = useScrollReveal();
  const featuredRef = useScrollReveal();
  const howItWorksRef = useScrollReveal();
  const pricingRef = useScrollReveal();

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

  const copyPrompt = useCallback((index: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-coral-950/20 via-transparent to-transparent dark:from-coral-950/30" />

        {/* Floating prompt cards background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {FLOATING_CARDS.map((card, i) => (
            <div
              key={i}
              className={`floating-card floating-card-${card.size}`}
              style={{
                left: card.left,
                top: card.top,
                "--duration": card.duration,
                "--delay": card.delay,
                "--enter-delay": `${0.3 + i * 0.4}s`,
                "--max-opacity": card.opacity,
                "--rot": card.rot,
              } as React.CSSProperties}
            >
              {card.text}
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-500/10 px-4 py-1.5 text-sm text-coral-600 dark:text-coral-300">
            🧠 Your AI prompt library
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Stop losing your
            <span className="metallic-text-gradient"> best prompts</span>
          </h1>

          {/* Typewriter effect */}
          <div className="mx-auto mb-10 max-w-2xl">
            <p className="text-lg text-foreground-secondary mb-4">
              Save, organize, and share your AI prompts. Tag them, search them, build collections.
              Your prompt library, always one click away.
            </p>
            <div className="h-10 flex items-center justify-center">
              <span className="font-mono text-lg text-coral-600 dark:text-coral-400">
                &quot;{typedText}&quot;
              </span>
              <span className="typewriter-cursor" />
            </div>
          </div>

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
              <button type="submit" className="chrome-pill-button primary btn-interactive">
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
      <section ref={categoriesRef} className="scroll-reveal mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Prompts for every use case</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.name}
              className="liquid-glass-card card-interactive stagger-card p-5 cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="mt-2 font-semibold text-foreground">{cat.name}</h3>
              <p className="text-sm text-foreground-secondary">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Prompts */}
      <section ref={featuredRef} className="scroll-reveal mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold">Try these prompts now</h2>
        <p className="mb-8 text-center text-foreground-secondary">Click to copy. Paste into ChatGPT, Claude, or any AI.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURED_PROMPTS.map((p, i) => (
            <div
              key={i}
              onClick={() => copyPrompt(i, p.prompt)}
              className="liquid-glass-card card-interactive card-flip-container stagger-card group cursor-pointer p-5"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="card-flip-inner">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-coral-500/10 px-2.5 py-0.5 text-xs font-medium text-coral-600 dark:text-coral-300">{p.category}</span>
                  <span className="text-xs text-foreground-secondary">{p.copies.toLocaleString()} copies</span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground group-hover:text-coral-600 dark:group-hover:text-coral-300 transition">{p.title}</h3>
                <p className="text-sm leading-relaxed text-foreground-secondary">{p.prompt}</p>
                <div className="mt-3 text-xs font-medium text-coral-600 dark:text-coral-400 relative inline-flex items-center gap-1">
                  {copied === i ? (
                    <>
                      <span className="copy-check inline-block">✓</span>
                      <span>Copied!</span>
                      <CopyParticles show={true} />
                    </>
                  ) : (
                    "Click to copy →"
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="scroll-reveal mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Save", desc: "Paste any prompt. Tag it. Done. Takes 5 seconds." },
            { step: "2", title: "Organize", desc: "Tags, folders, categories. Search across everything instantly." },
            { step: "3", title: "Share", desc: "Create public collections. Share with a link. Build your prompt portfolio." },
          ].map((s, i) => (
            <div key={s.step} className="text-center stagger-card" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="chrome-ring-button chrome-ring-hover mx-auto mb-4 !w-14 !h-14">
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

      {/* Chrome Extension */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="liquid-glass-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-500/10 px-3 py-1 text-xs text-coral-600 dark:text-coral-300 mb-4">
                🧩 Chrome Extension
              </div>
              <h2 className="text-3xl font-bold mb-4">Save prompts from anywhere</h2>
              <p className="text-foreground-secondary mb-6">
                Our Chrome extension lets you save prompts directly from ChatGPT, Claude, Gemini, or any webpage.
                Right-click to save. One click to search your entire library. No copy-pasting between tabs.
              </p>
              <ul className="space-y-3 text-sm text-foreground-secondary mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-coral-500 mt-0.5">✓</span>
                  <span>Right-click any text to save as a prompt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-500 mt-0.5">✓</span>
                  <span>Quick search popup - find any prompt in seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-500 mt-0.5">✓</span>
                  <span>Auto-detects prompts on ChatGPT and Claude</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coral-500 mt-0.5">✓</span>
                  <span>Syncs with your PromptVault account</span>
                </li>
              </ul>
              <button className="chrome-pill-button primary btn-interactive">
                Get the Extension
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                {/* Browser mockup */}
                <div className="w-72 h-80 rounded-xl border border-white/10 bg-[#1a1a2e] overflow-hidden shadow-2xl">
                  {/* Browser toolbar */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#0f0f1a] border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 mx-2 px-3 py-1 rounded-md bg-white/5 text-[10px] text-white/30">chatgpt.com</div>
                  </div>
                  {/* Extension popup mockup */}
                  <div className="p-4">
                    <div className="rounded-lg border border-coral-500/20 bg-[#12121f] p-3 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center text-[8px] text-white font-bold">P</div>
                        <span className="text-xs font-semibold text-white">PromptVault</span>
                      </div>
                      <div className="rounded-md bg-white/5 px-2.5 py-1.5 text-[10px] text-white/40 mb-3">Search prompts...</div>
                      <div className="space-y-2">
                        <div className="rounded-md bg-white/5 p-2">
                          <div className="text-[10px] font-medium text-coral-400">Code Reviewer</div>
                          <div className="text-[8px] text-white/30 mt-0.5">Act as a senior engineer...</div>
                        </div>
                        <div className="rounded-md bg-white/5 p-2">
                          <div className="text-[10px] font-medium text-coral-400">AIDA Framework</div>
                          <div className="text-[8px] text-white/30 mt-0.5">Write marketing copy...</div>
                        </div>
                        <div className="rounded-md bg-white/5 p-2">
                          <div className="text-[10px] font-medium text-coral-400">Learning Roadmap</div>
                          <div className="text-[8px] text-white/30 mt-0.5">Create a 30-day plan...</div>
                        </div>
                      </div>
                      <button className="mt-3 w-full rounded-md bg-coral-500/20 border border-coral-500/30 py-1.5 text-[10px] text-coral-400 font-medium">+ Save New Prompt</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} className="scroll-reveal mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Simple pricing</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="liquid-glass-card card-interactive stagger-card p-6">
            <h3 className="text-lg font-semibold">Free</h3>
            <div className="mt-2 text-3xl font-bold">$0</div>
            <ul className="mt-4 space-y-2 text-sm text-foreground-secondary">
              <li>✓ 50 prompts</li>
              <li>✓ Basic tagging</li>
              <li>✓ Search</li>
              <li>✓ 1 public collection</li>
            </ul>
          </div>
          <div className="liquid-glass-card card-interactive stagger-card p-6 ring-2 ring-coral-500/30 relative" style={{ transitionDelay: "100ms" }}>
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
          <div className="liquid-glass-card card-interactive stagger-card p-6" style={{ transitionDelay: "200ms" }}>
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
