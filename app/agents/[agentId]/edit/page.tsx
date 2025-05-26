import { AgentForm } from "@/components/agents/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;

  return (
    <div className="p-4 space-y-6">
      <Link href="/agents" className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Agents</span>
      </Link>
      <AgentForm agentId={agentId} />
    </div>
  );
}
