"use client";

import { PipelineStep, PipelineProgress } from "./types";
import { useAuth } from "@/contexts/auth-provider";
import { usePipeline } from "@/hooks/use-pipeline";
import { PipelineStepComponent } from "./pipeline-step";

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
  const isAdminOrSE = user?.role === "admin" || user?.role === "se";

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
    if (progressStep) {
      return progressStep;
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

  const {
    isLoading,
    isGeneratingProposal,
    localPipeline,
    handleMarkAsComplete,
    handleGenerateProposal,
  } = usePipeline(clientId, currentGroupId, allSteps);

  const stepsToRender =
    localPipeline.length === mergedSteps.length ? localPipeline : mergedSteps;

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
            onMarkAsComplete={handleMarkAsComplete}
            onGenerateProposal={handleGenerateProposal}
          />
        ))}
      </div>
    </div>
  );
}
