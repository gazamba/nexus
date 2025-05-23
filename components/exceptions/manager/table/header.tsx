"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface TableHeaderProps {
  children: React.ReactNode;
  sortable?: boolean;
}

export function TableHeader({ children, sortable }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
      <div className="flex items-center">
        {children}
        {sortable && (
          <Button variant="ghost" size="sm" className="ml-1 p-0">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        )}
      </div>
    </th>
  );
}
