"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { BraintrustLogo } from "@/components/braintrust-logo";

export function ClientSidebar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="w-48 border-r bg-background h-full flex flex-col">
        <div className="h-14 border-b flex items-center justify-center gap-2">
          <div className="h-5 w-5 bg-muted animate-pulse rounded" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        </div>
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {[...Array(8)].map((_, i) => (
              <li key={i} className="h-9 bg-muted animate-pulse rounded" />
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-48 border-r bg-background h-full flex flex-col">
      <div className="h-14 border-b flex items-center justify-center gap-2">
        <BraintrustLogo />
        <span className="font-semibold">Braintrust</span>
      </div>
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <SidebarItem
            href="/"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            active={pathname === "/"}
          />
          <SidebarItem
            href="/workflow-roi"
            icon={<BarChart2 className="h-4 w-4" />}
            label="Workflow ROI"
            active={pathname === "/workflow-roi"}
          />
          <SidebarItem
            href="/reporting"
            icon={<FileText className="h-4 w-4" />}
            label="Reporting"
            active={pathname === "/reporting"}
          />
          <SidebarItem
            href="/credentials"
            icon={<Key className="h-4 w-4" />}
            label="Credentials"
            active={pathname === "/credentials"}
          />
          <SidebarItem
            href="/exceptions"
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Exceptions"
            active={pathname === "/exceptions"}
          />
          <SidebarItem
            href="/users"
            icon={<Users className="h-4 w-4" />}
            label="Users"
            active={pathname === "/users"}
          />
          <SidebarItem
            href="/billing"
            icon={<CreditCard className="h-4 w-4" />}
            label="Billing"
            active={pathname === "/billing"}
          />
          <SidebarItem
            href="/messaging"
            icon={<MessageSquare className="h-4 w-4" />}
            label="Messaging"
            active={pathname === "/messaging"}
          />
          <SidebarItem
            href="/survey"
            icon={<ClipboardList className="h-4 w-4" />}
            label="Workflow Survey"
            active={pathname === "/survey"}
          />
        </ul>
      </nav>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}
