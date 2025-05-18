"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MetricsInputProps {
  executions: string;
  exceptions: string;
  timeSaved: string;
  costSaved: string;
  onExecutionsChange: (value: string) => void;
  onExceptionsChange: (value: string) => void;
  onTimeSavedChange: (value: string) => void;
  onCostSavedChange: (value: string) => void;
}

export function MetricsInput({
  executions,
  exceptions,
  timeSaved,
  costSaved,
  onExecutionsChange,
  onExceptionsChange,
  onTimeSavedChange,
  onCostSavedChange,
}: MetricsInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="executions">Executions</Label>
        <Input
          id="executions"
          type="number"
          value={executions}
          onChange={(e) => onExecutionsChange(e.target.value)}
          placeholder="Number of executions"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="exceptions">Exceptions</Label>
        <Input
          id="exceptions"
          type="number"
          value={exceptions}
          onChange={(e) => onExceptionsChange(e.target.value)}
          placeholder="Number of exceptions"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="timeSaved">Time Saved (hours)</Label>
        <Input
          id="timeSaved"
          type="number"
          value={timeSaved}
          onChange={(e) => onTimeSavedChange(e.target.value)}
          placeholder="Hours saved"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="costSaved">Cost Saved ($)</Label>
        <Input
          id="costSaved"
          type="number"
          value={costSaved}
          onChange={(e) => onCostSavedChange(e.target.value)}
          placeholder="Cost saved"
        />
      </div>
    </div>
  );
}
