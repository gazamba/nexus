"use client";

import { Check, Circle, Loader2 } from "lucide-react";
import { PipelineStep } from "./types";
import { PIPELINE_STATUS } from "./constants";
import { useAuth } from "@/contexts/auth-provider";
import {
  createNextPipelineProgress,
  getPipelineDataByClient,
} from "@/lib/services/pipeline-service";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface PipelineProps {
  pipelineData: PipelineStep[];
  clientId: string;
}

function hasUserId(progress: any): progress is { user_id: string } {
  return (
    progress &&
    typeof progress.user_id === "string" &&
    Object.keys(progress).length > 1
  );
}

export function Pipeline({ pipelineData, clientId }: PipelineProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);

  const pipelineGroups: Record<string, PipelineStep[]> = {};
  for (const step of pipelineData) {
    const groupId = step.progress?.pipeline_group_id;
    if (!groupId) continue;
    if (!pipelineGroups[groupId]) pipelineGroups[groupId] = [];
    pipelineGroups[groupId].push(step);
  }

  let currentGroupId: string | undefined = undefined;
  let currentGroupProgress: Record<number, PipelineStep> = {};
  for (const groupId in pipelineGroups) {
    const steps = pipelineGroups[groupId];
    const lastStep = steps.reduce((prev, curr) =>
      prev.step_order > curr.step_order ? prev : curr
    );
    if (lastStep?.progress?.status !== "completed") {
      currentGroupId = groupId;
      steps.forEach((s) => {
        if (s.progress) currentGroupProgress[s.id] = s;
      });
      break;
    }
  }
  if (!currentGroupId) {
    let latestCreatedAt = 0;
    for (const groupId in pipelineGroups) {
      const steps = pipelineGroups[groupId];
      const lastStep = steps.reduce((prev, curr) =>
        prev.step_order > curr.step_order ? prev : curr
      );
      const createdAt = new Date(lastStep?.progress?.created_at || 0).getTime();
      if (createdAt > latestCreatedAt) {
        latestCreatedAt = createdAt;
        currentGroupId = groupId;
        steps.forEach((s) => {
          if (s.progress) currentGroupProgress[s.id] = s;
        });
      }
    }
  }

  if (!currentGroupId) {
    return <div className="p-4">No pipeline data available.</div>;
  }

  const allSteps = [...pipelineData]
    .filter((step, idx, arr) => arr.findIndex((s) => s.id === step.id) === idx)
    .sort((a, b) => a.step_order - b.step_order);

  const mergedSteps = allSteps.map((step) => {
    const progressStep = currentGroupProgress[step.id];
    return progressStep
      ? progressStep
      : { ...step, progress: { status: "pending" } };
  });

  const currentStepIndex = mergedSteps.findIndex(
    (step) => step.progress?.status !== PIPELINE_STATUS.COMPLETED
  );
  const isAdminOrSE = user?.role === "admin" || user?.role === "se";

  const handleMarkAsComplete = async () => {
    if (!user || currentStepIndex === -1) return;
    setIsLoading(true);
    try {
      const step = mergedSteps[currentStepIndex];
      const pipelineGroupId =
        (step.progress &&
          "pipeline_group_id" in step.progress &&
          step.progress.pipeline_group_id) ||
        currentGroupId;
      if (!pipelineGroupId) {
        throw new Error("Missing pipeline_group_id for this step");
      }
      console.log("Current step:", step);

      if (step?.step_name === "Credentials collected") {
        console.log("Processing 'Credentials collected' step...");
        const userId =
          step.progress && hasUserId(step.progress) && step.progress.user_id
            ? step.progress.user_id
            : user?.id || "";
        const res = await fetch(
          `/api/surveys?client_id=${clientId}&user_id=${userId}`
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

            const factoryStep = mergedSteps.find(
              (s) => s.step_name === "Factory build initiated"
            );
            console.log("Factory step:", factoryStep);
            if (factoryStep && factoryStep.progress === null) {
              let userIdForStep = user?.id || "";
              if (
                step.progress &&
                step.progress.status !== "pending" &&
                hasUserId(step.progress) &&
                step.progress.user_id
              ) {
                userIdForStep = step.progress.user_id;
              }
              await createNextPipelineProgress(
                userIdForStep,
                clientId,
                pipelineGroupId
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

      let userIdForStep = user?.id || "";
      if (
        step.progress &&
        step.progress.status !== "pending" &&
        hasUserId(step.progress) &&
        step.progress.user_id
      ) {
        userIdForStep = step.progress.user_id;
      }
      await createNextPipelineProgress(
        userIdForStep,
        clientId,
        pipelineGroupId
      );

      const { data } = await getPipelineDataByClient(clientId);

      const updatedGroups: Record<string, PipelineStep[]> = {};
      for (const step of data) {
        const groupId = step.progress?.pipeline_group_id;
        if (!groupId) continue;
        if (!updatedGroups[groupId]) updatedGroups[groupId] = [];
        updatedGroups[groupId].push(step);
      }
      let updatedCurrentGroupProgress: Record<number, PipelineStep> = {};
      if (updatedGroups[pipelineGroupId]) {
        updatedGroups[pipelineGroupId].forEach((s) => {
          if (s.progress) updatedCurrentGroupProgress[s.id] = s;
        });
      }
      const updatedMergedSteps = allSteps.map((step) => {
        const progressStep = updatedCurrentGroupProgress[step.id];
        return progressStep
          ? progressStep
          : { ...step, progress: { status: "pending" } };
      });
      setLocalPipeline(updatedMergedSteps);
    } catch (error) {
      console.error("Error marking step as complete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    try {
      const step = mergedSteps[currentStepIndex];
      let userId = user?.id || "";
      if (
        step.progress &&
        typeof step.progress === "object" &&
        "user_id" in step.progress &&
        step.progress.user_id
      ) {
        userId = step.progress.user_id;
      }
      const res = await fetch(
        `/api/surveys?pipeline_group_id=${currentGroupId}`
      );
      if (!res.ok) throw new Error("Failed to fetch survey response");
      const surveyResponse = await res.json();
      if (!surveyResponse.analyzed_survey_response) {
        throw new Error("No analyzed_survey_response found.");
      }
      console.log(
        "Survey response:",
        JSON.stringify(surveyResponse.analyzed_survey_response)
      );
      const proposalRes = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...surveyResponse.analyzed_survey_response,
          pipeline_group_id: currentGroupId,
        }),
      });
      if (!proposalRes.ok) throw new Error("Failed to generate proposal");
      toast({
        title: "Proposal generated",
        description: "The document proposal was generated successfully.",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const [localPipeline, setLocalPipeline] = useState(mergedSteps);
  const stepsToRender =
    localPipeline.length === mergedSteps.length ? localPipeline : mergedSteps;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Pipeline Progress</h3>
      </div>
      <div className="p-4 space-y-4">
        {stepsToRender.map((step, index) => {
          let status = step.progress?.status || PIPELINE_STATUS.PENDING;
          if (
            step.step_name === "Discovery: Initial Survey" &&
            status !== PIPELINE_STATUS.COMPLETED
          ) {
            status = PIPELINE_STATUS.IN_PROGRESS;
          }
          const completedAt =
            step.progress && "completed_at" in step.progress
              ? step.progress.completed_at
              : undefined;

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
                    step.step_name !== "Factory build initiated" &&
                    step.step_name !== "ADA Proposal Sent" && (
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
                  {isAdminOrSE &&
                    status === PIPELINE_STATUS.IN_PROGRESS &&
                    step.step_name === "ADA Proposal Sent" && (
                      <button
                        className="ml-2 px-3 py-1 bg-secondary text-black rounded hover:bg-secondary/90 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        onClick={handleGenerateProposal}
                        disabled={isGeneratingProposal}
                      >
                        {isGeneratingProposal ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Document Proposal"
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
