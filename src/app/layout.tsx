import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "PromptVault - Save, Organize & Share AI Prompts",
  description: "Your personal prompt library. Save your best AI prompts, organize with tags, share collections. Free to start.",
  keywords: ["ai prompts", "chatgpt prompts", "claude prompts", "prompt library", "prompt manager"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
