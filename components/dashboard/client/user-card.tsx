"use client";

import { Button } from "@/components/ui/button";

interface User {
  name?: string;
  avatar?: string;
}

interface UserCardProps {
  user: User;
}

function getUserAvatar(user: User) {
  return user?.avatar || "/placeholder.svg?height=64&width=64&query=avatar";
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-card p-6 rounded-md border">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 overflow-hidden">
          <img
            src={getUserAvatar(user)}
            alt="Solutions Engineer"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="font-medium text-lg">
            {user?.name || "John Smith"}
          </div>
          <div className="text-sm text-muted-foreground">
            Solutions Engineer
          </div>
        </div>
      </div>
      <Button variant="outline" className="w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 mr-2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Message SE
      </Button>
    </div>
  );
}
