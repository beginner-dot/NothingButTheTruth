import type { Metadata } from "next";
import Link from "next/link";
import { AccessibilityTools } from "@/components/course/AccessibilityTools";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Christianity of Christ",
  description: "Interactive short course on the Christianity of Christ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-serif text-xl font-bold text-slate-900">
              The Christianity of Christ
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/community">Community</Link>
              <Link href="/admin">Admin</Link>
              <Link href="/privacy">Privacy</Link>
              <AccessibilityTools />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
