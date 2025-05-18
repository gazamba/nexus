"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { AgentFormProvider, useAgentForm } from "./context";
import { BasicInfo } from "./basic-info";
import { ModelSettings } from "./model-settings";
import { Capabilities } from "./capabilities";
import { Actions } from "./actions";

const MOCK_AGENTS: Record<string, any> = {
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

function AgentFormContent({ agentId }: { agentId?: string }) {
  const { formData, setFormData, loading, setLoading } = useAgentForm();

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      const mockAgent = MOCK_AGENTS[agentId];
      if (mockAgent) {
        setFormData(mockAgent);
      }
      setLoading(false);
    }
  }, [agentId, setFormData, setLoading]);

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
    <form>
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

            <TabsContent value="basic">
              <BasicInfo />
            </TabsContent>

            <TabsContent value="model">
              <ModelSettings />
            </TabsContent>

            <TabsContent value="capabilities">
              <Capabilities />
            </TabsContent>
          </Tabs>

          <Actions />
        </CardContent>
      </Card>
    </form>
  );
}

export function AgentForm({ agentId }: { agentId?: string }) {
  return (
    <AgentFormProvider>
      <AgentFormContent agentId={agentId} />
    </AgentFormProvider>
  );
}
