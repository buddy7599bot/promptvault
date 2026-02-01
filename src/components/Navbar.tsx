"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <nav className="border-b border-gray-800 px-6 py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-lg font-bold text-violet-400">🧠 PromptVault</Link>
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm text-gray-400 hover:text-white">Explore</Link>
          {!loading && (
            user ? (
              <>
                <Link href="/submit" className="text-sm text-gray-400 hover:text-white">Submit</Link>
                <Link href="/my-prompts" className="text-sm text-gray-400 hover:text-white">My Prompts</Link>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <button onClick={signOut} className="text-sm text-gray-500 hover:text-white">Logout</button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-400 hover:text-white">Log in</Link>
                <Link href="/signup" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">
                  Sign up
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
