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

export const insertWorkflowsAndNodesFromSurveyResponse = async (
  analyzedSurveyResponse: any
): Promise<void> => {
  try {
    const { workflows, notes } = analyzedSurveyResponse;

    console.log("Notes for setup:", notes);

    for (const workflow of workflows) {
      const workflowData = {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        client_id: workflow.client_id,
        department: workflow.department,
        status: workflow.status,
        executions: workflow.executions,
        exceptions: workflow.exceptions,
        timesaved: workflow.timesaved,
        costsaved: workflow.costsaved,
        schedule_days: workflow.schedule_days,
        schedule_months: workflow.schedule_months,
        schedule_hours: workflow.schedule_hours,
        trigger_option: workflow.trigger_option,
        created_at: workflow.nodes[0]?.created_at || null,
        updated_at: workflow.nodes[0]?.updated_at || null,
      };

      const { error: workflowError } = await supabase
        .from("workflow")
        .upsert([workflowData], { onConflict: "id" });

      if (workflowError) {
        console.error("Error inserting workflow:", workflowError);
        throw new Error(`Failed to insert workflow ${workflow.id}`);
      }

      console.log(`Inserted/Updated workflow: ${workflow.name}`);

      for (const node of workflow.nodes) {
        const nodeData = {
          id: node.id,
          name: node.name,
          description: node.description,
          type: node.type,
          code: node.code,
          workflow_id: node.workflow_id,
          created_at: node.created_at || null,
          updated_at: node.updated_at || null,
        };

        const { error: nodeError } = await supabase
          .from("node")
          .upsert([nodeData], { onConflict: "id" });

        if (nodeError) {
          console.error("Error inserting node:", nodeError);
          throw new Error(`Failed to insert node ${node.id}`);
        }

        if (node.inputs && Array.isArray(node.inputs)) {
          const nodeInputs = node.inputs.map((input: any) => ({
            name: input.name,
            type: input.type,
            required: input.required || false,
            node_id: node.id,
            description: input.description || null,
          }));

          const { error: inputsError } = await supabase
            .from("node_input")
            .upsert(nodeInputs, { onConflict: "id" });

          if (inputsError) {
            console.error("Error inserting node inputs:", inputsError);
            throw new Error(`Failed to insert inputs for node ${node.id}`);
          }
        }

        console.log(`Inserted/Updated node: ${node.name}`);
      }
    }

    console.log("All workflows and nodes inserted successfully");
  } catch (error: any) {
    console.error("Insertion failed:", error.message);
    throw new Error(`Failed to insert workflows and nodes: ${error.message}`);
  }
};
