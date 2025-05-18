import { LucideIcon } from "lucide-react";

export interface ClientSidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export interface ClientSidebarLink {
  href: string;
  icon: LucideIcon;
  label: string;
}
