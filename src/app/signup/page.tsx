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
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-violet-400">🧠 PromptVault</Link>
        <h1 className="mb-6 text-center text-2xl font-bold">Sign up</h1>
        {done ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center text-green-300">
            Check your email to confirm your account, then <Link href="/login" className="text-violet-400 underline">log in</Link>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              minLength={6}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-violet-400 hover:text-violet-300">Log in</Link>
        </p>
      </div>
    </main>
  );
}
