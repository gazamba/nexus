"use client";

import { CheckCircle, Circle } from "lucide-react";

interface PipelineStep {
  step_name: string;
  progress?: {
    status: string;
    completed_at?: string;
  };
}

interface PipelineProgressProps {
  steps: PipelineStep[];
}

export function PipelineProgress({ steps }: PipelineProgressProps) {
  return (
    <div className="bg-card p-6 rounded-md border">
      <h2 className="text-lg font-medium mb-4">Pipeline Progress</h2>
      <div className="space-y-4">
        {steps.map((step, index) => {
          let status = step.progress?.status || "pending";
          if (
            step.step_name === "Discovery: Initial Survey" &&
            status !== "completed"
          ) {
            status = "in-progress";
          }
          const completedAt = step.progress?.completed_at;
          return (
            <div key={index} className="flex items-start gap-3">
              {status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              ) : status === "in-progress" ? (
                <Circle className="h-5 w-5 text-primary mt-0.5 fill-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <div>
                <div className="font-medium">{step.step_name}</div>
                {status === "completed" && completedAt && (
                  <div className="text-sm text-muted-foreground">
                    Completed {completedAt}
                  </div>
                )}
                {status === "in-progress" && (
                  <div className="text-sm text-primary">In Progress</div>
                )}
                {status === "pending" && (
                  <div className="text-sm text-muted-foreground">Pending</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
