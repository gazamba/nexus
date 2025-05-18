"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Engineer } from "./types";

interface EngineersProps {
  engineers: Engineer[];
}

export function Engineers({ engineers }: EngineersProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Assigned Engineers</h3>
      </div>
      <div className="p-4 space-y-4">
        {engineers.map((engineer, index) => (
          <div key={index} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={engineer.avatar} alt={engineer.name} />
              <AvatarFallback>
                {engineer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{engineer.name}</div>
              <div className="text-sm text-muted-foreground">
                {engineer.role}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
