"use client";

import { useAuth } from "@/contexts/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(auth)/login/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function TopBar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [userInitial, setUserInitial] = useState("U");
  const [clientName, setClientName] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setUserInitial(user.name.charAt(0).toUpperCase());
    }

    if (user?.role === "client") {
      const fetchClientName = async () => {
        const supabase = createClient();
        const { data: assignments } = await supabase
          .from("client_user_assignment")
          .select("client_id")
          .eq("client_user_id", user.id)
          .single();

        if (assignments?.client_id) {
          const { data: client } = await supabase
            .from("client")
            .select("name")
            .eq("id", assignments.client_id)
            .single();

          if (client?.name) {
            setClientName(client.name);
          }
        }
      };

      fetchClientName();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const getPageTitle = () => {
    if (pathname === "/")
      return clientName ? `${clientName} Dashboard` : "Dashboard Overview";
    if (pathname.includes("/clients")) return "Clients";
    if (pathname.includes("/users")) return "Users";
    if (pathname.includes("/credentials")) return "Credentials";
    if (pathname.includes("/exceptions")) return "Exceptions";
    if (pathname.includes("/billing")) return "Billing";
    if (pathname.includes("/reporting")) return "Reporting";
    if (pathname.includes("/workflow-roi")) return "Workflow ROI";
    if (pathname.includes("/nodes")) return "Nodes";
    if (pathname.includes("/agents")) return "Custom Agents";
    if (pathname.includes("/subscriptions")) return "Plan Manager";
    if (pathname.includes("/messaging")) return "Messaging";
    if (pathname.includes("/survey")) return "Workflow Surveys";

    return "Add new path";
  };

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {userInitial}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
