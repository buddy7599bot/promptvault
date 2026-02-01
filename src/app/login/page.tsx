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
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-2xl font-bold text-violet-400">🧠 PromptVault</Link>
        <h1 className="mb-6 text-center text-2xl font-bold">Log in</h1>
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
            placeholder="Password"
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          No account? <Link href="/signup" className="text-violet-400 hover:text-violet-300">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
