"use client";

import { Bell, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-provider";

export function GlobalHeader() {
  const { user, isAdmin, isClient } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold">
          {isAdmin ? "Admin" : isClient ? "Client" : "SE"}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage
              src={user?.avatar_initial || ""}
              alt={user?.full_name || "User"}
            /> */}
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role || "User"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
