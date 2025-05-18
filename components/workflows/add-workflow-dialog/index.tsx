"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkflowForm } from "./workflow-form";
import { NodeSelector } from "./node-selector";
import { MetricsInput } from "./metrics-input";

interface AddWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWorkflow: (workflow: any) => void;
}

export function AddWorkflowDialog({
  open,
  onOpenChange,
  onAddWorkflow,
}: AddWorkflowDialogProps) {
  const [department, setDepartment] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");
  const [executions, setExecutions] = useState("");
  const [exceptions, setExceptions] = useState("");
  const [timeSaved, setTimeSaved] = useState("");
  const [costSaved, setCostSaved] = useState("");
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newWorkflow = {
      id: Date.now(),
      createDate: new Date()
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", ""),
      department,
      workflowName,
      description,
      nodes: selectedNodeIds.length,
      nodesList: selectedNodeIds,
      executions: Number.parseInt(executions) || 0,
      exceptions: Number.parseInt(exceptions) || 0,
      timeSaved: `${timeSaved} hrs`,
      costSaved: `$${costSaved}`,
    };

    onAddWorkflow(newWorkflow);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDepartment("");
    setWorkflowName("");
    setDescription("");
    setSelectedNodeIds([]);
    setExecutions("");
    setExceptions("");
    setTimeSaved("");
    setCostSaved("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Add New Workflow</DialogTitle>
            <DialogDescription>
              Enter the details for the new workflow ROI.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="grid gap-4 py-4">
              <WorkflowForm
                department={department}
                workflowName={workflowName}
                description={description}
                onDepartmentChange={setDepartment}
                onWorkflowNameChange={setWorkflowName}
                onDescriptionChange={setDescription}
              />

              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">Select Nodes</div>
                <div className="col-span-3 border rounded-md p-3">
                  <NodeSelector
                    selectedNodeIds={selectedNodeIds}
                    onNodeSelectionChange={setSelectedNodeIds}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">Metrics</div>
                <div className="col-span-3">
                  <MetricsInput
                    executions={executions}
                    exceptions={exceptions}
                    timeSaved={timeSaved}
                    costSaved={costSaved}
                    onExecutionsChange={setExecutions}
                    onExceptionsChange={setExceptions}
                    onTimeSavedChange={setTimeSaved}
                    onCostSavedChange={setCostSaved}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button type="submit">Add Workflow</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
