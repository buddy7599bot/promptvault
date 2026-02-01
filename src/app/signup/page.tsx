"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="liquid-glass-card w-full max-w-sm p-8">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold">
          <span className="text-xl">🧠</span> <span className="metallic-text-gradient">PromptVault</span>
        </Link>
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Sign up</h1>
        {done ? (
          <div className="liquid-glass-preview-card p-4 text-center">
            <p className="text-green-600 dark:text-green-400">Check your email to confirm your account, then <Link href="/login" className="text-coral-600 dark:text-coral-400 underline">log in</Link>.</p>
          </div>
        ) : (
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
              placeholder="Password (min 6 characters)"
              minLength={6}
              className="glass-input w-full px-4 py-3 text-foreground placeholder-foreground-secondary"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="chrome-pill-button primary w-full !py-3 font-semibold disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-foreground-secondary">
          Already have an account? <Link href="/login" className="text-coral-600 dark:text-coral-400 hover:text-coral-500">Log in</Link>
        </p>
      </div>
    </main>
  );
}
