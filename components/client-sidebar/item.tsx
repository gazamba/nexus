"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClientSidebarItemProps } from "./types";

export function ClientSidebarItem({
  href,
  icon,
  label,
  active,
}: ClientSidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}
