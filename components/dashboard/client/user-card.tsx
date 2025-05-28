"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/types/types";

export function UserCard({ user }: { user: User }) {
  console.log(`user: ${JSON.stringify(user)}`);
  return (
    <div className="bg-card p-6 rounded-md border">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-bold">{user?.avatar_initial}</span>
        </div>
        <div>
          <div className="font-medium text-lg">
            {user?.full_name || "John Smith"}
          </div>
          <div className="text-sm text-muted-foreground">
            Solutions Engineer
          </div>
        </div>
      </div>
      <Button variant="default" className="w-full">
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
