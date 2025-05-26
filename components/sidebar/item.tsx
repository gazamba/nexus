"use client";

import Link from "next/link";
import { cn } from "@/utils/utils";
import { SidebarItemProps } from "./types";

export function SidebarItem({ href, icon, label, active }: SidebarItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
          active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
}
