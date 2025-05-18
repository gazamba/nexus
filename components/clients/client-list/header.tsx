"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  clientName: string;
}

export function Header({ clientName }: HeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <Link
          href="/clients"
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Back to Clients</span>
        </Link>
        <span className="text-gray-400 mx-2">|</span>
        <h1 className="text-xl font-medium">Client Manager: {clientName}</h1>
      </div>
    </div>
  );
}
