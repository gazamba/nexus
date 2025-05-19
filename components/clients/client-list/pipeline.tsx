"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { PipelineStep } from "./types";
import { PIPELINE_STATUS } from "./constants";
import { useAuth } from "@/contexts/auth-provider";
import {
  createNextPipelineProgress,
  getPipelineDataByClient,
} from "@/lib/services/pipeline-service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface PipelineProps {
  pipelineData: PipelineStep[];
  clientId: string;
}

export function Pipeline({ pipelineData, clientId }: PipelineProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
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
      const step = localPipeline[currentStepIndex];
      console.log("Current step:", step);

      if (step?.step_name === "Credentials collected") {
        console.log("Processing 'Credentials collected' step...");
        const res = await fetch(
          `/api/surveys?client_id=${clientId}&user_id=${step.progress?.user_id}`
        );
        console.log("Survey API response:", res);
        if (res.ok) {
          const surveyResponse = await res.json();
          console.log("Survey response:", surveyResponse);
          if (surveyResponse && surveyResponse.analyzed_survey_response) {
            const insertRes = await fetch("/api/workflows/insert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(surveyResponse.analyzed_survey_response),
            });
            console.log("Insert workflows response:", insertRes);

            const factoryStep = localPipeline.find(
              (s) => s.step_name === "Factory build initiated"
            );
            console.log("Factory step:", factoryStep);
            if (factoryStep && factoryStep.progress === null) {
              await createNextPipelineProgress(
                step.progress?.user_id || "",
                clientId
              );
              console.log("Marked 'Factory build initiated' as completed.");
            }
            router.refresh();
            toast({
              title: "The workflow build is complete",
              description: "Your workflow has been built and is ready.",
              variant: "default",
            });
            setIsLoading(false);
            router.refresh();
          } else {
            console.log("No analyzed_survey_response found.");
          }
        } else {
          console.log("Survey API call failed.");
        }
      }

      await createNextPipelineProgress(step.progress?.user_id || "", clientId);

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
                  {isAdminOrSE &&
                    status === PIPELINE_STATUS.IN_PROGRESS &&
                    step.step_name !== "Factory build initiated" && (
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
