import { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export interface SidebarLink {
  href: string;
  icon: LucideIcon;
  label: string;
  activePattern?: string;
}
