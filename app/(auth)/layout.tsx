"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SharedHeader } from "@/components/shared/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="absolute left-8 top-8 flex items-center gap-2 font-bold text-xl md:left-12 md:top-12 z-50"
      >
        <SharedHeader className="!h-auto !border-0" />
      </Link>
      <div className="absolute right-8 top-8 md:right-12 md:top-12 z-50">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
