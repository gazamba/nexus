"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Key,
  AlertTriangle,
  Users,
  CreditCard,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { ClientSidebarItem } from "./item";
import { ClientSidebarLink } from "./types";

const links: ClientSidebarLink[] = [
  {
    href: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/workflow-roi",
    icon: BarChart2,
    label: "Workflow ROI",
  },
  {
    href: "/reporting",
    icon: FileText,
    label: "Reporting",
  },
  {
    href: "/credentials",
    icon: Key,
    label: "Credentials",
  },
  {
    href: "/exceptions",
    icon: AlertTriangle,
    label: "Exceptions",
  },
  {
    href: "/users",
    icon: Users,
    label: "Users",
  },
  {
    href: "/billing",
    icon: CreditCard,
    label: "Billing",
  },
  {
    href: "/messaging",
    icon: MessageSquare,
    label: "Messaging",
  },
  {
    href: "/surveys/new",
    icon: ClipboardList,
    label: "Workflow Survey",
  },
];

export function ClientSidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-2">
      <ul className="space-y-1">
        {links.map((link) => (
          <ClientSidebarItem
            key={link.href}
            href={link.href}
            icon={<link.icon className="h-4 w-4" />}
            label={link.label}
            active={pathname === link.href}
          />
        ))}
      </ul>
    </nav>
  );
}
