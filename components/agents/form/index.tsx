"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Agent } from "@/types/types";

interface AgentFormProps {
  agentId?: string;
}

export function AgentForm({ agentId }: AgentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Agent>({
    name: "",
    description: "",
    type: "chat",
    status: "active",
    capabilities: [],
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "",
    isPublic: false,
    id: "",
    lastActive: "",
  });

  useEffect(() => {
    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  const fetchAgent = async () => {
    try {
      const response = await fetch(`/api/agents/${agentId}`);
      if (response.ok) {
        const agent = await response.json();
        setFormData({
          name: agent.name || "",
          description: agent.description || "",
          type: agent.type || "chat",
          status: agent.status || "active",
          capabilities: agent.capabilities || "",
          lastActive: "",
          model: agent.model || "gpt-4",
          temperature: agent.temperature || 0.7,
          maxTokens: agent.maxtokens || 2000,
          systemPrompt: agent.systemprompt || "",
          isPublic: agent.ispublic || false,
          id: agent.id || "",
        });
      }
    } catch (error) {
      console.error("Error fetching agent:", error);
      toast({
        title: "Error",
        description: "Failed to fetch agent details",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = agentId ? `/api/agents/${agentId}` : "/api/agents";
      const method = agentId ? "PUT" : "POST";
      console.log(`formData: ${JSON.stringify(formData)}`);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          channels: ["chat"],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save agent");
      }

      toast({
        title: "Success",
        description: `Agent ${agentId ? "updated" : "created"} successfully`,
      });

      router.push("/agents");
      router.refresh();
    } catch (error) {
      console.error("Error saving agent:", error);
      toast({
        title: "Error",
        description: "Failed to save agent",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter agent name"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter agent description"
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            name="systemPrompt"
            value={formData.systemPrompt}
            onChange={handleChange}
            placeholder="Enter system prompt for the agent"
            rows={6}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : agentId ? "Update Agent" : "Create Agent"}
      </Button>
    </form>
  );
}
