"use client";

import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  children: React.ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
      <div className="flex items-center">
        {children}
        <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground/50" />
      </div>
    </th>
  );
}
