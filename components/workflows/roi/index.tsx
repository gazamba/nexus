"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { getClientId } from "@/lib/services/client-service";
import { AddWorkflowDialog } from "../add-workflow-dialog";
import { Actions } from "./actions";
import { WorkflowTable } from "./table";
import { Workflow } from "@/types/types";
import { listWorkflows } from "@/lib/services/workflow-service";
import { Loading } from "@/components/ui/loading";

export function WorkflowROI() {
  const { user } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);
  const [workflowData, setWorkflowData] = useState<Workflow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientIdAndWorkflows = async () => {
      if (!user?.id) return;
      const clientId = await getClientId(user.id);
      setClientId(clientId);
      if (clientId) {
        const data = await listWorkflows(clientId);
        setWorkflowData(data);
      }
      setLoading(false);
    };
    fetchClientIdAndWorkflows();
  }, [user?.id]);

  const handleAddWorkflow = (newWorkflow: Workflow) => {
    setWorkflowData([newWorkflow, ...workflowData]);
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Workflow ROI</h1>
          <Actions onAddWorkflow={() => setDialogOpen(true)} />
        </div>

        <WorkflowTable workflows={workflowData} />
      </main>

      <AddWorkflowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddWorkflow={handleAddWorkflow}
      />
    </div>
  );
}
