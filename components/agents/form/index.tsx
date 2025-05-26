"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Agent, AgentInsert } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AgentFormProps {
  agentId?: string;
}

export function AgentForm({ agentId }: AgentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState<AgentInsert>({
    name: "",
    description: "",
    type: "chat",
    status: "active",
    capabilities: [],
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 2000,
    system_prompt: "",
    is_public: false,
    id: "",
  });

  useEffect(() => {
    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  const fetchAgent = async () => {
    setIsFetching(true);
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
          model: agent.model || "gpt-4",
          temperature: agent.temperature || 0.7,
          max_tokens: agent.max_tokens || 2000,
          system_prompt: agent.system_prompt || "",
          is_public: agent.is_public || false,
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
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = agentId ? `/api/agents/${agentId}` : "/api/agents";
      const method = agentId ? "PATCH" : "POST";
      console.log(`form Data Submitted: ${JSON.stringify(formData, null, 2)}`);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
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

  if (isFetching && agentId) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

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
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Enter agent description"
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            placeholder="Enter agent type"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={formData.status || "active"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                status: e.target.value as "active" | "inactive",
              }))
            }
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>
        <div>
          <Label htmlFor="capabilities">Capabilities (comma separated)</Label>
          <Input
            id="capabilities"
            name="capabilities"
            value={
              Array.isArray(formData.capabilities)
                ? formData.capabilities.join(", ")
                : formData.capabilities || ""
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                capabilities: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="e.g. search, summarize, translate"
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            placeholder="e.g. gpt-4"
          />
        </div>
        <div>
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.01"
            min="0"
            max="2"
            value={formData.temperature ?? 0.7}
            onChange={handleChange}
            placeholder="0.7"
          />
        </div>
        <div>
          <Label htmlFor="max_tokens">Max Tokens</Label>
          <Input
            id="max_tokens"
            name="max_tokens"
            type="number"
            value={formData.max_tokens ?? 2000}
            onChange={handleChange}
            placeholder="2000"
          />
        </div>
        <div>
          <Label htmlFor="system_prompt">System Prompt</Label>
          <Textarea
            id="system_prompt"
            name="system_prompt"
            value={formData.system_prompt || ""}
            onChange={handleChange}
            placeholder="Enter system prompt for the agent"
            rows={6}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            checked={!!formData.is_public}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, is_public: e.target.checked }))
            }
          />
          <Label htmlFor="is_public">Is Public</Label>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : agentId ? "Update Agent" : "Create Agent"}
      </Button>
    </form>
  );
}
