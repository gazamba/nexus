"use client";

import { Suspense } from "react";
import {
  Home,
  Users,
  Building2,
  CreditCard,
  Settings,
  Ticket,
  MessageSquare,
  BarChart2,
  AlertTriangle,
  Code,
  Bot,
  LayoutDashboard,
} from "lucide-react";
import { SidebarHeader } from "./header";
import { SidebarNavigation } from "./navigation";
import { SidebarLoading } from "./loading";
import { SidebarLink } from "./types";
import { useAuth } from "@/contexts/auth-provider";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const links: SidebarLink[] = [
  {
    href: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    activePattern: "/$|^/$",
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
    href: "/subscriptions",
    icon: Ticket,
    label: "Subscriptions",
    activePattern: "/subscriptions",
  },
  {
    href: "/messaging",
    icon: MessageSquare,
    label: "Messaging",
    activePattern: "/messaging",
  },
  {
    href: "/reporting",
    icon: BarChart2,
    label: "Reporting",
    activePattern: "/reporting",
  },
  {
    href: "/exceptions",
    icon: AlertTriangle,
    label: "Exceptions",
    activePattern: "/exceptions",
  },
  {
    href: "/nodes",
    icon: Code,
    label: "Nodes",
    activePattern: "/nodes",
  },
  {
    href: "/agents",
    icon: Bot,
    label: "Custom Agents",
    activePattern: "/agents",
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const [filteredLinks, setFilteredLinks] = useState(links);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("profile")
        .select("billing")
        .eq("user_id", user.id)
        .single();
      if (data && data.billing === false) {
        setFilteredLinks(links.filter((l) => l.href !== "/billing"));
      } else {
        setFilteredLinks(links);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="w-48 border-r bg-background h-full flex flex-col">
      <SidebarHeader />
      <Suspense fallback={<SidebarLoading />}>
        <SidebarNavigation links={filteredLinks} />
      </Suspense>
    </div>
  );
}
