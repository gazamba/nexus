"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Workflow } from "./types";

interface WorkflowsProps {
  workflows: Workflow[];
}

export function Workflows({ workflows }: WorkflowsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workflows</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>
      <div className="border rounded-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-medium">Active Workflows</h3>
        </div>
        <div className="divide-y">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{workflow.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Created {workflow.created_at}
                  </div>
                </div>
                <div className="text-sm font-medium text-primary">
                  {workflow.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
