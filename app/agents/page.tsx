import { AgentsList } from "@/components/agents-list";

export const dynamic = "force-dynamic";

export default function AgentsPage() {
  return (
    <div className="mx-auto">
      <p className="mb-6">
        Manage your AI Agents - intelligent assistants that can help automate
        tasks and workflows.
      </p>
      <AgentsList />
    </div>
  );
}
