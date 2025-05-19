"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { PipelineStep } from "./types";
import { PIPELINE_STATUS } from "./constants";
import { useAuth } from "@/contexts/auth-provider";
import {
  advancePipelineStep,
  createNextPipelineProgress,
  getPipelineDataByClient,
} from "@/lib/services/pipeline-service";
import { useState } from "react";

interface PipelineProps {
  pipelineData: PipelineStep[];
  clientId: string;
}

export function Pipeline({ pipelineData, clientId }: PipelineProps) {
  const { user } = useAuth();
  const [localPipeline, setLocalPipeline] = useState(pipelineData);
  const [isLoading, setIsLoading] = useState(false);

  const currentStepIndex = localPipeline.findIndex(
    (step) => step.progress?.status !== PIPELINE_STATUS.COMPLETED
  );
  const isAdminOrSE = user?.role === "admin" || user?.role === "se";

  const handleMarkAsComplete = async () => {
    if (!user || currentStepIndex === -1) return;
    setIsLoading(true);
    try {
      await createNextPipelineProgress(user.id, clientId);
      const { data } = await getPipelineDataByClient(clientId);
      setLocalPipeline(data);
    } catch (error) {
      console.error("Error marking step as complete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Pipeline Progress</h3>
      </div>
      <div className="p-4 space-y-4">
        {localPipeline.map((step, index) => {
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
                <div className="font-medium flex items-center gap-2">
                  {step.step_name}
                  {isAdminOrSE && status === PIPELINE_STATUS.IN_PROGRESS && (
                    <button
                      className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      onClick={handleMarkAsComplete}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Mark as Complete"
                      )}
                    </button>
                  )}
                </div>
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
