"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push("/my-prompts");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="liquid-glass-card w-full max-w-sm p-8">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold">
          <span className="text-xl">🧠</span> <span className="metallic-text-gradient">PromptVault</span>
        </Link>
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Log in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="chrome-pill-button primary w-full !py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-foreground-secondary">
          No account? <Link href="/signup" className="text-coral-600 dark:text-coral-400 hover:text-coral-500">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
