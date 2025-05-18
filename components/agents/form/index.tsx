"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AgentFormProps {
  agentId?: string;
}

export function AgentForm({ agentId }: AgentFormProps) {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter agent name" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter agent description"
            rows={4}
          />
        </div>
      </div>
      <Button type="submit">{agentId ? "Update Agent" : "Create Agent"}</Button>
    </form>
  );
}
