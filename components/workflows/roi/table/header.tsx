"use client";

import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortField =
  | "created_at"
  | "name"
  | "department"
  | "executions"
  | "exceptions"
  | "timesaved"
  | "costsaved";
type SortDirection = "asc" | "desc";

interface TableHeaderProps {
  children: React.ReactNode;
  sortable?: boolean;
  field?: SortField;
  currentSort?: SortField;
  direction?: SortDirection;
  onSort?: (field: SortField) => void;
}

export function TableHeader({
  children,
  sortable,
  field,
  currentSort,
  direction,
  onSort,
}: TableHeaderProps) {
  const isSorted = field && currentSort === field;
  const isAscending = direction === "asc";

  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
        sortable && "cursor-pointer hover:bg-muted/80"
      )}
      onClick={() => sortable && field && onSort?.(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable && (
          <ArrowUpDown
            className={cn(
              "h-4 w-4",
              isSorted && "text-foreground",
              isSorted && isAscending && "rotate-180"
            )}
          />
        )}
      </div>
    </th>
  );
}
