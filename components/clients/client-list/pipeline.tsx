"use client";

import { PipelineStep, PipelineProgress } from "./types";
import { useAuth } from "@/contexts/auth-provider";
import { usePipeline } from "@/hooks/use-pipeline";
import { PipelineStepComponent } from "./pipeline-step";
import { useState } from "react";

interface PipelineProps {
  pipelineData: PipelineStep[];
  clientId: string;
}

export function Pipeline({ pipelineData, clientId }: PipelineProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const { user } = useAuth();
  const isAdminOrSE = user?.role === "admin" || user?.role === "se";

  const pipelineGroups: Record<string, PipelineStep[]> = {};
  const stepProgressMap: Record<number, PipelineProgress> = {};

  for (const step of pipelineData) {
    if (step.progress) {
      const existingProgress = stepProgressMap[step.id];
      if (
        !existingProgress ||
        (step.progress.pipeline_group_id &&
          (!existingProgress.pipeline_group_id ||
            new Date(step.progress.created_at || "") >
              new Date(existingProgress.created_at || "")))
      ) {
        stepProgressMap[step.id] = step.progress;
      }
    }
  }

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
    const hasInProgress = steps.some(
      (step) => step.progress?.status === "in-progress"
    );
    if (hasInProgress) {
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
    if (progressStep) {
      return progressStep;
    }

    const mostRecentProgress = stepProgressMap[step.id];
    if (mostRecentProgress) {
      return { ...step, progress: mostRecentProgress };
    }
    const pendingProgress: PipelineProgress = {
      id: 0,
      client_id: clientId,
      user_id: user?.id || "",
      step_id: step.id,
      status: "pending",
      pipeline_group_id: currentGroupId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { ...step, progress: pendingProgress };
  });

  const { localPipeline, handleMarkAsComplete, handleGenerateProposal } =
    usePipeline(clientId, currentGroupId, allSteps);

  const stepsToRender =
    localPipeline.length === mergedSteps.length ? localPipeline : mergedSteps;

  const handleMarkAsCompleteWrapper = async (stepId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pipeline/mark-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          pipelineGroupId: currentGroupId,
          stepId: stepId,
        }),
      });
      if (!response.ok) throw new Error("Failed to mark step as complete");
      window.location.reload();
    } catch (error) {
      console.error("Error marking step as complete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProposalWrapper = async () => {
    setIsGeneratingProposal(true);
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflows: [{ client_id: clientId }],
          pipeline_group_id: pipelineData[0].pipeline_group_id,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate proposal");
      window.location.reload();
    } catch (error) {
      console.error("Error generating proposal:", error);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Pipeline Progress</h3>
      </div>
      <div className="p-4 space-y-4">
        {stepsToRender.map((step, index) => (
          <PipelineStepComponent
            key={index}
            step={step}
            isAdminOrSE={isAdminOrSE}
            isLoading={isLoading}
            isGeneratingProposal={isGeneratingProposal}
            onMarkAsComplete={() => handleMarkAsCompleteWrapper(step.id)}
            onGenerateProposal={handleGenerateProposalWrapper}
          />
        ))}
      </div>
    </div>
  );
}
