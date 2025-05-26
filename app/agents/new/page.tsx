import { AgentForm } from "@/components/agents/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentPage() {
  return (
    <div className="p-4 space-y-6">
      <Link href="/agents">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">New Agent</h1>
      <AgentForm />
    </div>
  );
}
