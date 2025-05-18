"use client";

import { usePathname } from "next/navigation";
import { SidebarItem } from "./item";
import { SidebarLink } from "./types";

interface SidebarNavigationProps {
  links: SidebarLink[];
}

export function SidebarNavigation({ links }: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-2">
      <ul className="space-y-1">
        {links.map((link) => {
          const isActive = link.activePattern
            ? pathname.startsWith(link.activePattern)
            : pathname === link.href;

          return (
            <SidebarItem
              key={link.href}
              href={link.href}
              icon={<link.icon className="h-4 w-4" />}
              label={link.label}
              active={isActive}
            />
          );
        })}
      </ul>
    </nav>
  );
}
