import { AgentForm } from "@/components/agent-form";

export default function EditAgentPage({
  params,
}: {
  params: { agentId: string };
}) {
  const { agentId } = params;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Agent</h1>
      <AgentForm agentId={agentId} />
    </div>
  );
}
