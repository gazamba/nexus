"use client";

import { PipelineStep, PipelineProgress } from "./types";
import { useAuth } from "@/contexts/auth-provider";
import { usePipeline } from "@/hooks/use-pipeline";
import { PipelineStepComponent } from "./pipeline-step";
import { useState, useEffect } from "react";
import { getPipelineDataByClient } from "@/lib/services/pipeline-service";
import { useRouter } from "next/navigation";

interface PipelineProps {
  pipelineData: PipelineStep[];
  clientId: string;
}

export function Pipeline({ pipelineData, clientId }: PipelineProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const isAdminOrSE = user?.role === "admin" || user?.role === "se";

  const [currentGroupIdState, setCurrentGroupIdState] = useState<
    string | undefined
  >(pipelineData[0]?.pipeline_group_id);
  const [pipelineDataState, setPipelineDataState] = useState(pipelineData);
  const [currentGroupId, setCurrentGroupId] = useState<string | undefined>(
    pipelineData[0]?.pipeline_group_id
  );
  const [forcedGroupId, setForcedGroupId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const pipelineGroups: Record<string, PipelineStep[]> = {};
    for (const step of pipelineDataState) {
      const groupId = step.progress?.pipeline_group_id;
      if (!groupId) continue;
      if (!pipelineGroups[groupId]) pipelineGroups[groupId] = [];
      pipelineGroups[groupId].push(step);
    }

    if (forcedGroupId && pipelineGroups[forcedGroupId]) {
      setCurrentGroupId(forcedGroupId);
      return;
    }
    if (forcedGroupId && !pipelineGroups[forcedGroupId]) {
      setForcedGroupId(undefined);
    }

    for (const groupId in pipelineGroups) {
      const steps = pipelineGroups[groupId];
      const hasInProgress = steps.some(
        (step) => step.progress?.status === "in-progress"
      );
      if (hasInProgress) {
        setCurrentGroupId(groupId);
        return;
      }
    }

    let latestCreatedAt = 0;
    let latestGroupId: string | undefined;
    for (const groupId in pipelineGroups) {
      const steps = pipelineGroups[groupId];
      const lastStep = steps.reduce((prev, curr) =>
        prev.step_order > curr.step_order ? prev : curr
      );
      const createdAt = new Date(lastStep?.progress?.created_at || 0).getTime();
      if (createdAt > latestCreatedAt) {
        latestCreatedAt = createdAt;
        latestGroupId = groupId;
      }
    }
    if (latestGroupId) {
      setCurrentGroupId(latestGroupId);
    }
  }, [pipelineDataState, forcedGroupId]);

  const fetchPipelineDataForGroup = async (groupId: string) => {
    try {
      const { data } = await getPipelineDataByClient(clientId);
      if (data && data.length > 0) {
        setPipelineDataState(data);
        setCurrentGroupIdState(groupId);
      }
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const pipelineGroups: Record<string, PipelineStep[]> = {};
  const stepProgressMap: Record<number, PipelineProgress> = {};

  for (const step of pipelineDataState) {
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

  for (const step of pipelineDataState) {
    const groupId = step.progress?.pipeline_group_id;
    if (!groupId) continue;
    if (!pipelineGroups[groupId]) pipelineGroups[groupId] = [];
    pipelineGroups[groupId].push(step);
  }

  const groupIdToUse = forcedGroupId || currentGroupId;

  let currentGroupProgress: Record<number, PipelineStep> = {};

  if (groupIdToUse) {
    const steps = pipelineGroups[groupIdToUse] || [];
    steps.forEach((s) => {
      if (s.progress) currentGroupProgress[s.id] = s;
    });
  }

  const allSteps = [...pipelineDataState]
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
      pipeline_group_id: groupIdToUse,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { ...step, progress: pendingProgress };
  });

  const { localPipeline, handleMarkAsComplete, handleGenerateProposal } =
    usePipeline(clientId, groupIdToUse || "", allSteps);

  const stepsToRender =
    localPipeline.length === mergedSteps.length ? localPipeline : mergedSteps;

  const handleMarkAsCompleteWrapper = async (stepId: number) => {
    if (!groupIdToUse) {
      console.error("No current pipeline group ID available.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/pipeline/mark-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          pipelineGroupId: groupIdToUse,
          stepId: stepId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark step as complete");
      }

      const result = await response.json();
      console.log(`result:`, result);

      if (result.restarted && result.newGroupId) {
        setCurrentGroupIdState(result.newGroupId);
        setForcedGroupId(result.newGroupId);
        const { data } = await getPipelineDataByClient(clientId);
        if (data && data.length > 0) {
          setPipelineDataState(data);
          setCurrentGroupIdState(result.newGroupId);
          setCurrentGroupId(result.newGroupId);
          setRefreshTrigger((prev) => prev + 1);
          router.refresh();
        }
      } else {
        await fetchPipelineDataForGroup(groupIdToUse);
      }
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
          pipeline_group_id: pipelineDataState[0].pipeline_group_id,
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

  console.log(`refreshTrigger:`, refreshTrigger);
  console.log(`currentGroupId:`, currentGroupId);
  console.log(`currentGroupIdState:`, currentGroupIdState);
  console.log(`pipelineDataState:`, pipelineDataState);
  console.log(`stepsToRender:`, stepsToRender);
  console.log(`localPipeline:`, localPipeline);
  console.log(`mergedSteps:`, mergedSteps);
  console.log(`isLoading:`, isLoading);
  console.log(`isGeneratingProposal:`, isGeneratingProposal);
  console.log(`isAdminOrSE:`, isAdminOrSE);

  return (
    <div className="border rounded-md overflow-hidden" key={refreshTrigger}>
      <div className="p-4 border-b">
        <h3 className="font-medium">Pipeline Progress</h3>
      </div>
      <div className="p-4 space-y-4">
        {!groupIdToUse ? (
          <div className="p-4">No pipeline data available.</div>
        ) : (
          stepsToRender.map((step, index) => (
            <PipelineStepComponent
              key={`${step.id}-${groupIdToUse}-${step.progress?.status}-${refreshTrigger}`}
              step={step}
              isAdminOrSE={isAdminOrSE}
              isLoading={isLoading}
              isGeneratingProposal={isGeneratingProposal}
              onMarkAsComplete={() => handleMarkAsCompleteWrapper(step.id)}
              onGenerateProposal={handleGenerateProposalWrapper}
              disabled={isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
}
