import { createClient } from "../../utils/supabase/client";
import type { Workflow, WorkflowExecutionContext } from "@/types/types";

const supabase = createClient();

export const getWorkflow = async (
  workflowId: string
): Promise<Workflow | null> => {
  const { data, error } = await supabase
    .from("workflow")
    .select("*")
    .eq("id", workflowId)
    .single();

  if (error || !data) {
    console.error("Error fetching workflow:", error);
    return null;
  }

  return data;
};

export const listWorkflows = async (clientId: string): Promise<Workflow[]> => {
  const { data, error } = await supabase
    .from("workflow")
    .select("*")
    .eq("client_id", clientId);

  if (error || !data) {
    console.error("Error fetching workflows:", error);
    return [];
  }

  return data;
};

export type WorkflowInput = Omit<Workflow, "id" | "created_at" | "updated_at">;

export const createWorkflow = async (
  workflow: WorkflowInput
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("workflow")
    .insert({
      name: workflow.name,
      description: workflow.description,
      client_id: workflow.client_id,
      department: workflow.department,
      status: workflow.status,
      executions: workflow.executions,
      exceptions: workflow.exceptions,
      timesaved: workflow.timesaved,
      costsaved: workflow.costsaved,
      nodes: workflow.nodes,
      schedule_days: workflow.schedule_days,
      schedule_months: workflow.schedule_months,
      schedule_hours: workflow.schedule_hours,
      trigger_option: workflow.trigger_option,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating workflow:", error);
    return null;
  }

  return data.id;
};

export const updateWorkflow = async (
  workflowId: string,
  updates: Partial<Omit<Workflow, "id" | "created_at" | "updated_at">>
): Promise<boolean> => {
  const { data: currentWorkflow, error: fetchError } = await supabase
    .from("workflow")
    .select("version")
    .eq("id", workflowId)
    .single();

  if (fetchError || !currentWorkflow) {
    console.error("Error fetching workflow for update:", fetchError);
    return false;
  }

  const {
    name,
    description,
    department,
    status,
    executions,
    exceptions,
    timesaved,
    costsaved,
    nodes,
    schedule_days,
    schedule_months,
    schedule_hours,
    trigger_option,
  } = updates;

  const { error } = await supabase
    .from("workflow")
    .update({
      name,
      description,
      department,
      status,
      executions,
      exceptions,
      timesaved,
      costsaved,
      nodes,
      schedule_days,
      schedule_months,
      schedule_hours,
      trigger_option,
    })
    .eq("id", workflowId);

  if (error) {
    console.error("Error updating workflow:", error);
    return false;
  }

  return true;
};

export const deleteWorkflow = async (workflowId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("workflow")
    .delete()
    .eq("id", workflowId);

  if (error) {
    console.error("Error deleting workflow:", error);
    return false;
  }

  return true;
};

export async function executeWorkflow(
  workflow: Workflow,
  inputs: Record<string, any>,
  context: WorkflowExecutionContext
): Promise<Record<string, any>> {
  if (
    !workflow ||
    !Array.isArray(workflow.nodes) ||
    workflow.nodes.length === 0
  ) {
    throw new Error("Invalid workflow or no nodes to execute.");
  }

  const outputs: Record<string, any> = {};

  for (const node of workflow.nodes) {
    const nodeInputs: Record<string, any> = {};
    if (Array.isArray(node.inputs)) {
      for (const input of node.inputs) {
        nodeInputs[input.name] =
          inputs[input.name] !== undefined
            ? inputs[input.name]
            : outputs[input.name];
      }
    }

    if (typeof node.execute === "function") {
      outputs[node.id] = await node.execute(nodeInputs, context);
    } else {
      throw new Error(`Node ${node.id} does not have an executable function.`);
    }
  }

  return outputs;
}
