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

const supabase = createClient();

export const advancePipelineStep = async (
  userId: string,
  currentStep: number,
  nextStep: number
) => {
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
