"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface ActionsProps {
  onAddWorkflow: () => void;
}

export function Actions({ onAddWorkflow }: ActionsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button className="bg-black text-white" onClick={onAddWorkflow}>
        <PlusIcon className="h-4 w-4 mr-2" />
        New Workflow
      </Button>
    </div>
  );
}
