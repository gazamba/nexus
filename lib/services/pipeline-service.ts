import { createClient } from "../../utils/supabase/client";
import { insertWorkflowsAndNodesFromSurveyResponse } from "./workflow-service";
import {
  getSurveyResponseByPipelineGroupId,
  analyzeSurveyResponse,
} from "./survey-service";

export async function getPipelineData(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const supabase = createClient();

  const [stepsResult, progressResult] = await Promise.all([
    supabase.from("pipeline_steps").select("*"),
    supabase.from("pipeline_progress").select("*").eq("user_id", userId),
  ]);

  const steps = stepsResult.data ?? [];
  const progress = progressResult.data ?? [];

  if (stepsResult.error) {
    console.error("Error fetching pipeline steps:", stepsResult.error);
  }
  if (progressResult.error) {
    console.error("Error fetching pipeline progress:", progressResult.error);
  }

  const progressByStepId = new Map(progress.map((p) => [p.step_id, p]));

  const stepsWithProgress = steps.map((step) => ({
    ...step,
    progress: progressByStepId.get(step.id) || null,
  }));

  return { data: stepsWithProgress };
}

export const advancePipelineStep = async (
  userId: string,
  currentStep: number,
  nextStep: number
) => {
  const supabase = createClient();
  const { error: completeError } = await supabase
    .from("pipeline_progress")
    .update({ status: "completed" })
    .eq("user_id", userId)
    .eq("step_number", currentStep);

  const { error: progressError } = await supabase
    .from("pipeline_progress")
    .update({ status: "in-progress" })
    .eq("user_id", userId)
    .eq("step_number", nextStep);

  return { completeError, progressError };
};

export async function getPipelineDataByClient(clientId: string) {
  if (!clientId) {
    throw new Error("Client ID is required");
  }

  const supabase = createClient();

  const [stepsResult, progressResult] = await Promise.all([
    supabase.from("pipeline_steps").select("*"),
    supabase.from("pipeline_progress").select("*").eq("client_id", clientId),
  ]);

  const steps = stepsResult.data ?? [];
  const progress = progressResult.data ?? [];

  if (stepsResult.error) {
    console.error("Error fetching pipeline steps:", stepsResult.error);
  }
  if (progressResult.error) {
    console.error("Error fetching pipeline progress:", progressResult.error);
  }

  const progressByStepId = new Map(progress.map((p) => [p.step_id, p]));

  const stepsWithProgress = steps.map((step) => ({
    ...step,
    progress: progressByStepId.get(step.id) || null,
  }));

  return { data: stepsWithProgress };
}

export async function createNextPipelineProgress(
  userId: string,
  clientId: string,
  pipelineGroupId: string
) {
  const supabase = createClient();

  const { data: steps, error: stepsError } = await supabase
    .from("pipeline_steps")
    .select("*")
    .order("step_order", { ascending: true });

  if (stepsError || !steps) {
    throw new Error("Could not fetch pipeline steps");
  }
  console.log(`userId: ${userId}`);
  console.log(`clientId: ${clientId}`);
  console.log(`pipelineGroupId: ${pipelineGroupId}`);
  const { data: progress, error: progressError } = await supabase
    .from("pipeline_progress")
    .select("*")
    .eq("pipeline_group_id", pipelineGroupId);

  if (progressError) {
    throw new Error(`Could not fetch pipeline progress: ${progressError}`);
  }

  console.log(`progress: ${JSON.stringify(progress, null, 2)}`);

  const currentStep = progress.find((p) => p.status === "in-progress");
  console.log(`currentStep: ${JSON.stringify(currentStep, null, 2)}`);

  if (currentStep) {
    if (currentStep.step_id === 8) {
      const { error: updateError } = await supabase
        .from("pipeline_progress")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", currentStep.id)
        .eq("pipeline_group_id", pipelineGroupId);

      if (updateError) {
        throw new Error(
          `Could not mark current step as completed: ${updateError.message}`
        );
      }
      return { completedFinalStep: true };
    }
    const { error: updateError } = await supabase
      .from("pipeline_progress")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", currentStep.id)
      .eq("pipeline_group_id", pipelineGroupId);

    if (updateError) {
      throw new Error(
        `Could not mark current step as completed: ${updateError.message}`
      );
    }
  }

  const completedStepNumbers = new Set(progress.map((p) => p.step_id));
  console.log(`completed step numbers: ${Array.from(completedStepNumbers)}`);
  let nextStep;

  if (currentStep) {
    console.log(`Current step ID: ${currentStep.step_id}`);

    nextStep = steps.find((step) => step.id === currentStep.step_id + 1);
    console.log(`Found next step: ${JSON.stringify(nextStep)}`);
  } else {
    nextStep = steps.find((step) => !completedStepNumbers.has(step.id));
    console.log(
      `No current step, found first incomplete step: ${JSON.stringify(
        nextStep
      )}`
    );
  }

  if (!nextStep) {
    throw new Error("All steps are already in progress or completed");
  }
  console.log(JSON.stringify(nextStep, null, 2));
  const { data: newProgress, error: insertError } = await supabase
    .from("pipeline_progress")
    .insert([
      {
        user_id: userId,
        client_id: clientId,
        step_id: nextStep.id,
        pipeline_group_id: pipelineGroupId,
      },
    ])
    .select()
    .single();

  if (insertError) {
    throw new Error(
      `Could not create new pipeline progress step: ${insertError.message}`
    );
  }

  return newProgress;
}

export async function markPipelineStepCompleted(
  userId: string,
  pipelineGroupId: string,
  stepId: number
) {
  const supabase = await createClient();

  console.log(`userId: ${userId}`);
  console.log(`pipelineGroupId: ${pipelineGroupId}`);

  const { data: progress, error: progressError } = await supabase
    .from("pipeline_progress")
    .select("*")
    .eq("pipeline_group_id", pipelineGroupId);

  console.log(`progress: ${JSON.stringify(progress, null, 2)}`);

  if (progressError) {
    throw new Error(`Could not fetch pipeline progress: ${progressError}`);
  }

  if (progress) {
    const { error: updateError } = await supabase
      .from("pipeline_progress")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("step_id", stepId)
      .eq("pipeline_group_id", pipelineGroupId);

    if (updateError) {
      throw new Error(
        `Could not mark step as completed: ${updateError.message}`
      );
    }

    const currentStep = progress.find((p) => p.step_id === stepId);
    if (!currentStep) {
      throw new Error("Current step not found in progress");
    }

    if (stepId === 7) {
      try {
        const surveyResponse = await getSurveyResponseByPipelineGroupId(
          pipelineGroupId
        );
        if (!surveyResponse) {
          throw new Error("Survey response not found");
        }

        const analyzedSurveyResponse = await analyzeSurveyResponse(
          surveyResponse.analyzed_survey_response
        );
        console.log(
          `analyzedSurveyResponse: ${JSON.stringify(
            analyzedSurveyResponse,
            null,
            2
          )}`
        );

        await insertWorkflowsAndNodesFromSurveyResponse(analyzedSurveyResponse);

        const { error: factoryBuildError } = await supabase
          .from("pipeline_progress")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("step_id", 8)
          .eq("pipeline_group_id", pipelineGroupId);

        if (factoryBuildError) {
          throw new Error(
            `Could not mark factory build as completed: ${factoryBuildError.message}`
          );
        }

        await createNextPipelineProgress(
          userId,
          currentStep.client_id,
          pipelineGroupId
        );
      } catch (error) {
        console.error("Error in workflow handling:", error);
        throw error;
      }
    } else {
      // Normal flow for other steps
      await createNextPipelineProgress(
        userId,
        currentStep.client_id,
        pipelineGroupId
      );
    }
  }

  return { success: true };
}
