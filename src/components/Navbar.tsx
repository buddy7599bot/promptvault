"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="glass-navbar sticky top-0 z-50 px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-xl">🧠</span>
          <span className="metallic-text-gradient">PromptVault</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm text-foreground-secondary hover:text-foreground transition">Explore</Link>
          {!loading && (
            user ? (
              <>
                <Link href="/submit" className="text-sm text-foreground-secondary hover:text-foreground transition">Submit</Link>
                <Link href="/my-prompts" className="text-sm text-foreground-secondary hover:text-foreground transition">My Prompts</Link>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-coral-400 to-coral-600 text-sm font-bold text-white">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <button onClick={signOut} className="text-sm text-foreground-secondary hover:text-foreground transition">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-foreground-secondary hover:text-foreground transition">Log in</Link>
                <Link href="/signup" className="chrome-pill-button primary text-sm !py-2 !px-5">
                  Sign up
                </Link>
              </>
            )
          )}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="chrome-ring-button !w-9 !h-9 flex items-center justify-center"
              aria-label="Toggle theme"
            >
              <span className="chrome-ring-inner !text-sm flex items-center justify-center">
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
