"use client";

import { BraintrustLogo } from "@/components/braintrust-logo";
import Link from "next/link";

interface SharedHeaderProps {
  className?: string;
}

export function SharedHeader({ className = "" }: SharedHeaderProps) {
  return (
    <div
      className={`h-14 border-b flex items-center justify-center gap-2 ${className}`}
    >
      <BraintrustLogo />
      <div className="flex items-center gap-2">
        <span className="font-semibold">Braintrust</span>
      </div>
    </div>
  );
}
