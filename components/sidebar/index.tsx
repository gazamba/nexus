"use client";

import { Suspense } from "react";
import { Home, Users, Building2, CreditCard, Settings } from "lucide-react";
import { SidebarHeader } from "./header";
import { SidebarNavigation } from "./navigation";
import { SidebarLoading } from "./loading";
import { SidebarLink } from "./types";

const links: SidebarLink[] = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    href: "/users",
    icon: Users,
    label: "Users",
    activePattern: "/users",
  },
  {
    href: "/clients",
    icon: Building2,
    label: "Clients",
    activePattern: "/clients",
  },
  {
    href: "/billing",
    icon: CreditCard,
    label: "Billing",
    activePattern: "/billing",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
    activePattern: "/settings",
  },
];

export function Sidebar() {
  return (
    <div className="w-48 border-r bg-background h-full flex flex-col">
      <SidebarHeader />
      <Suspense fallback={<SidebarLoading />}>
        <SidebarNavigation links={links} />
      </Suspense>
    </div>
  );
}
