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
  clientId: string
) {
  const supabase = createClient();

  // First, get all steps and current progress
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
    .eq("user_id", userId);

  if (progressError) {
    throw new Error("Could not fetch pipeline progress");
  }

  // Find the current in-progress step
  const currentStep = progress.find((p) => p.status === "in-progress");
  if (!currentStep) {
    throw new Error("No step is currently in progress");
  }

  // Mark current step as completed
  const { error: updateError } = await supabase
    .from("pipeline_progress")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", currentStep.id);

  if (updateError) {
    throw new Error(
      `Could not mark current step as completed: ${updateError.message}`
    );
  }

  // Find the next step
  const completedStepNumbers = new Set(progress.map((p) => p.step_id));
  const nextStep = steps.find(
    (step) => !completedStepNumbers.has(step.step_order)
  );

  if (!nextStep) {
    throw new Error("All steps are already in progress or completed");
  }

  // Create the next step
  const { data: newProgress, error: insertError } = await supabase
    .from("pipeline_progress")
    .insert([
      {
        user_id: userId,
        client_id: clientId,
        step_id: nextStep.id,
        status: "in-progress",
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
