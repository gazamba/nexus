"use client";

import { useEffect, useState } from "react";
import { listWorkflows } from "@/lib/services/workflow-service";
import { Workflow } from "@/types/types";
import { WorkflowTable } from "@/components/workflows/roi/table";
import { Loading } from "@/components/ui/loading";

interface ClientWorkflowsProps {
  clientId: string;
}

export function ClientWorkflows({ clientId }: ClientWorkflowsProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      setLoading(true);
      const data = await listWorkflows(clientId);
      setWorkflows(data);
      setLoading(false);
    };
    fetchWorkflows();
  }, [clientId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <WorkflowTable workflows={workflows} />
    </div>
  );
}
