import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-provider";
import {
  createNextPipelineProgress,
  getPipelineDataByClient,
} from "@/lib/services/pipeline-service";
import {
  PipelineStep,
  PipelineProgress,
} from "@/components/clients/client-list/types";

export const usePipeline = (
  clientId: string,
  currentGroupId: string,
  allSteps: PipelineStep[]
) => {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [localPipeline, setLocalPipeline] = useState<PipelineStep[]>([]);

  const updatePipelineState = async () => {
    const { data } = await getPipelineDataByClient(clientId);
    const updatedGroups: Record<string, PipelineStep[]> = {};

    for (const step of data) {
      const groupId = step.progress?.pipeline_group_id;
      if (!groupId) continue;
      if (!updatedGroups[groupId]) updatedGroups[groupId] = [];
      updatedGroups[groupId].push(step);
    }

    let updatedCurrentGroupProgress: Record<number, PipelineStep> = {};
    if (updatedGroups[currentGroupId]) {
      updatedGroups[currentGroupId].forEach((s) => {
        if (s.progress) updatedCurrentGroupProgress[s.id] = s;
      });
    }

    const updatedMergedSteps = allSteps.map((step) => {
      const progressStep = updatedCurrentGroupProgress[step.id];
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

    setLocalPipeline(updatedMergedSteps);
    router.refresh();
  };

  const handleMarkAsComplete = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await createNextPipelineProgress(user.id, clientId, currentGroupId);
      await updatePipelineState();
    } catch (error) {
      console.error("Error marking step as complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark step as complete",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProposal = async () => {
    setIsGeneratingProposal(true);
    try {
      const res = await fetch(
        `/api/surveys?pipeline_group_id=${currentGroupId}`
      );
      if (!res.ok) throw new Error("Failed to fetch survey response");
      const surveyResponse = await res.json();
      if (!surveyResponse.analyzed_survey_response) {
        throw new Error("No analyzed_survey_response found.");
      }

      const proposalRes = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...surveyResponse.analyzed_survey_response,
          pipeline_group_id: currentGroupId,
        }),
      });
      if (!proposalRes.ok) throw new Error("Failed to generate proposal");

      const proposal = await proposalRes.json();

      const documentRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: surveyResponse.client_id,
          related_id: proposal.id,
          related_type: "proposal",
          title: "ADA Proposal",
        }),
      });

      if (!documentRes.ok) {
        const errorData = await documentRes.json();
        console.error("Failed to create document:", errorData);
        throw new Error(
          `Failed to create document: ${errorData.error || "Unknown error"}`
        );
      }

      await createNextPipelineProgress(
        user?.id || "",
        clientId,
        currentGroupId
      );
      await updatePipelineState();

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

  return {
    isLoading,
    isGeneratingProposal,
    localPipeline,
    handleMarkAsComplete,
    handleGenerateProposal,
  };
};
