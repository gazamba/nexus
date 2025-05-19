import { createClient } from "../../utils/supabase/client";

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

  const { data: progress, error: progressError } = await supabase
    .from("pipeline_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("pipeline_group_id", pipelineGroupId);

  if (progressError) {
    throw new Error("Could not fetch pipeline progress");
  }

  const currentStep = progress.find((p) => p.status === "in-progress");

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
  let nextStep;

  if (currentStep) {
    nextStep = steps.find((step) => !completedStepNumbers.has(step.step_order));
  } else {
    nextStep = steps.find((step) => step.step_order === 1);
  }

  if (!nextStep) {
    throw new Error("All steps are already in progress or completed");
  }

  const { data: newProgress, error: insertError } = await supabase
    .from("pipeline_progress")
    .insert([
      {
        user_id: userId,
        client_id: clientId,
        step_id: nextStep.id,
        status: "in-progress",
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
