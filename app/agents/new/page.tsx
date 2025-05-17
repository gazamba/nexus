import { AgentForm } from "@/components/agent-form";

export default function NewAgentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Create New Agent</h1>
      <AgentForm />
    </div>
  );
}
