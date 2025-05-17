"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Agent } from "@/types/types";

const MOCK_AGENTS: Record<string, Agent> = {
  "1": {
    id: "1",
    name: "Email Assistant",
    description: "AI agent that helps process and respond to emails",
    type: "email",
    status: "active",
    capabilities: ["email processing", "response generation", "scheduling"],
    lastActive: "2024-03-15T10:30:00Z",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt:
      "You are an email assistant that helps process and respond to emails professionally.",
    isPublic: true,
  },
};

export function AgentForm({ agentId }: { agentId?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: "",
    description: "",
    type: "email",
    status: "active",
    capabilities: [],
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "",
    isPublic: false,
  });

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      const mockAgent = MOCK_AGENTS[agentId];
      if (mockAgent) {
        setFormData(mockAgent);
      }
      setLoading(false);

      // In production, you would fetch from the API
      /*
      fetch(`/api/agents/${agentId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch agent data")
          }
          return response.json()
        })
        .then(data => {
          setFormData(data)
        })
        .catch(err => {
          setError(err.message)
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive"
          })
        })
        .finally(() => {
          setLoading(false)
        })
      */
    }
  }, [agentId, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleModelChange = (value: string) => {
    setFormData((prev) => ({ ...prev, model: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Submitting agent data:", formData);

      // In production, you would send to the API
      /*
      const response = await fetch(agentId ? `/api/agents/${agentId}` : "/api/agents", {
        method: agentId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error("Failed to save agent")
      }
      */

      toast({
        title: agentId ? "Agent updated" : "Agent created",
        description: agentId
          ? "The agent has been updated successfully."
          : "The agent has been created successfully.",
      });

      router.push("/agents");
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{agentId ? "Loading agent data..." : "Preparing form..."}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{agentId ? "Edit Agent" : "Create New Agent"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="model">Model Settings</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter agent description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select agent type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPublic: checked }))
                  }
                />
                <Label htmlFor="isPublic">Make this agent public</Label>
              </div>
            </TabsContent>

            <TabsContent value="model" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">
                      Claude 3 Sonnet
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  name="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Controls randomness: 0 is deterministic, 2 is more creative
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  name="maxTokens"
                  type="number"
                  min="1"
                  max="4000"
                  value={formData.maxTokens}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={handleChange}
                  placeholder="Enter system prompt"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="capabilities" className="space-y-4">
              <div className="space-y-2">
                <Label>Capabilities</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "email processing",
                    "response generation",
                    "scheduling",
                    "document parsing",
                    "data extraction",
                    "summarization",
                    "query understanding",
                    "ticket routing",
                  ].map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center space-x-2"
                    >
                      <Switch
                        id={capability}
                        checked={formData.capabilities?.includes(capability)}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            capabilities: checked
                              ? [...(prev.capabilities || []), capability]
                              : (prev.capabilities || []).filter(
                                  (c) => c !== capability
                                ),
                          }));
                        }}
                      />
                      <Label htmlFor={capability}>{capability}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mt-4">
              {error}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : agentId
                ? "Update Agent"
                : "Create Agent"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
