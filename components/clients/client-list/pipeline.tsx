"use client";

import { Check, Circle } from "lucide-react";
import { PipelineStep } from "./types";
import { PIPELINE_STATUS } from "./constants";

interface PipelineProps {
  pipelineData: PipelineStep[];
}

export function Pipeline({ pipelineData }: PipelineProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Pipeline Progress</h3>
      </div>
      <div className="p-4 space-y-4">
        {pipelineData.map((step, index) => {
          let status = step.progress?.status || PIPELINE_STATUS.PENDING;
          if (
            step.step_name === "Discovery: Initial Survey" &&
            status !== PIPELINE_STATUS.COMPLETED
          ) {
            status = PIPELINE_STATUS.IN_PROGRESS;
          }
          const completedAt = step.progress?.completed_at;

          return (
            <div key={index} className="flex items-start gap-3">
              {status === PIPELINE_STATUS.COMPLETED ? (
                <Check className="h-5 w-5 text-green-500 rounded-full bg-green-100 p-1" />
              ) : status === PIPELINE_STATUS.IN_PROGRESS ? (
                <Circle className="h-5 w-5 text-blue-500 rounded-full bg-blue-100 p-1" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <div className="font-medium">{step.step_name}</div>
                {status === PIPELINE_STATUS.COMPLETED && completedAt && (
                  <div className="text-sm text-muted-foreground">
                    Completed {completedAt}
                  </div>
                )}
                {status === PIPELINE_STATUS.IN_PROGRESS && (
                  <div className="text-sm text-primary">In Progress</div>
                )}
                {status === PIPELINE_STATUS.PENDING && (
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
