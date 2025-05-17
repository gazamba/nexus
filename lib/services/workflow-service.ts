import { createClient } from "../../utils/supabase/client";
import { nodeService } from "./node-service";
import type {
  Workflow,
  ExecutionContext,
  WorkflowNodeReference,
} from "@/types/types";
import { v4 as uuidv4 } from "uuid";

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

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    nodes: (data.workflow_nodes as any) || [],
    triggers: data.config?.triggers || [],
  };
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

  return data.map((workflow) => ({
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    nodes: (workflow.workflow_nodes as any) || [],
    triggers: workflow.config?.triggers || [],
  }));
};

export const createWorkflow = async (workflow: {
  name: string;
  description: string;
  clientId: string;
  createdBy: string;
  nodes?: WorkflowNodeReference[];
  triggers?: any[];
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from("workflow")
    .insert({
      name: workflow.name,
      description: workflow.description,
      client_id: workflow.clientId,
      created_by: workflow.createdBy,
      workflow_nodes: workflow.nodes || [],
      config: {
        triggers: workflow.triggers || [],
      },
      status: "draft",
      version: 1,
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
  updates: {
    name?: string;
    description?: string;
    nodes?: WorkflowNodeReference[];
    triggers?: any[];
    status?: "draft" | "active" | "inactive";
  }
): Promise<boolean> => {
  const { data: currentWorkflow, error: fetchError } = await supabase
    .from("workflow")
    .select("version, config")
    .eq("id", workflowId)
    .single();

  if (fetchError || !currentWorkflow) {
    console.error("Error fetching workflow for update:", fetchError);
    return false;
  }

  const updatedConfig = { ...currentWorkflow.config };
  if (updates.triggers) {
    updatedConfig.triggers = updates.triggers;
  }

  const { error } = await supabase
    .from("workflow")
    .update({
      name: updates.name,
      description: updates.description,
      workflow_nodes: updates.nodes,
      config: updatedConfig,
      status: updates.status,
      updated_at: new Date().toISOString(),
      version: (currentWorkflow.version || 0) + 1,
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

export const executeWorkflow = async (
  workflowId: string,
  initialInputs: Record<string, any>,
  context: {
    clientId: string;
    userId: string;
  }
): Promise<{
  success: boolean;
  outputs: Record<string, any>;
  executionId: string;
}> => {
  const workflow = await getWorkflow(workflowId);
  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  const executionId = uuidv4();
  const executionContext: ExecutionContext = {
    workflowId,
    executionId,
    clientId: context.clientId,
    userId: context.userId,
    logger: {
      info: async (message, details) =>
        logExecution(
          workflowId,
          executionId,
          "info",
          message,
          details,
          context.clientId
        ),
      error: async (message, details) =>
        logExecution(
          workflowId,
          executionId,
          "error",
          message,
          details,
          context.clientId
        ),
      warning: async (message, details) =>
        logExecution(
          workflowId,
          executionId,
          "warning",
          message,
          details,
          context.clientId
        ),
      success: async (message, details) =>
        logExecution(
          workflowId,
          executionId,
          "success",
          message,
          details,
          context.clientId
        ),
    },
    storage: {
      get: async (key) => {
        // Implement workflow storage
        return null;
      },
      set: async (key, value) => {
        // Implement workflow storage
      },
    },
  };

  await executionContext.logger.info(
    `Starting workflow execution: ${workflow.name}`
  );

  try {
    // Find start nodes (nodes with no incoming connections)
    const startNodeIds = findStartNodes(workflow);
    if (startNodeIds.length === 0) {
      throw new Error("No start nodes found in workflow");
    }

    // Execute the workflow starting from each start node
    const outputs: Record<string, any> = {};
    for (const startNodeId of startNodeIds) {
      const result = await executeNode(
        workflow,
        startNodeId,
        initialInputs,
        {},
        executionContext
      );
      Object.assign(outputs, result);
    }

    await executionContext.logger.success(
      `Workflow execution completed successfully: ${workflow.name}`
    );
    return { success: true, outputs, executionId };
  } catch (error) {
    await executionContext.logger.error(
      `Workflow execution failed: ${String(error)}`
    );
    return { success: false, outputs: { error: String(error) }, executionId };
  }
};

const findStartNodes = (workflow: Workflow): string[] => {
  const nodesWithIncoming = new Set<string>();
  for (const node of workflow.nodes) {
    for (const nextNodeId of node.next) {
      nodesWithIncoming.add(nextNodeId);
    }
  }

  return workflow.nodes
    .filter((node) => !nodesWithIncoming.has(node.id))
    .map((node) => node.id);
};

const executeNode = async (
  workflow: Workflow,
  nodeInstanceId: string,
  workflowInputs: Record<string, any>,
  previousOutputs: Record<string, any>,
  context: ExecutionContext
): Promise<Record<string, any>> => {
  const nodeInstance = workflow.nodes.find((n) => n.id === nodeInstanceId);
  if (!nodeInstance) {
    throw new Error(`Node instance not found in workflow: ${nodeInstanceId}`);
  }

  const node = await nodeService.getNode(nodeInstance.nodeId);
  if (!node) {
    throw new Error(`Node implementation not found: ${nodeInstance.nodeId}`);
  }

  await context.logger.info(`Executing node: ${node.name}`);

  const nodeInputs: Record<string, any> = {};
  for (const [inputName, inputValue] of Object.entries(nodeInstance.inputs)) {
    if (typeof inputValue === "string" && inputValue.startsWith("$")) {
      const outputPath = inputValue.substring(1).split(".");
      let value = { ...workflowInputs, ...previousOutputs };
      for (const key of outputPath) {
        if (value === undefined || value === null) break;
        value = value[key];
      }
      nodeInputs[inputName] = value;
    } else {
      nodeInputs[inputName] = inputValue;
    }
  }

  const outputs = await node.execute(nodeInputs, context);
  await context.logger.info(`Node execution completed: ${node.name}`);

  const allOutputs = { ...previousOutputs, [nodeInstanceId]: outputs };
  for (const nextNodeId of nodeInstance.next) {
    const nextOutputs = await executeNode(
      workflow,
      nextNodeId,
      workflowInputs,
      allOutputs,
      context
    );
    Object.assign(allOutputs, nextOutputs);
  }

  return allOutputs;
};

const logExecution = async (
  workflowId: string,
  executionId: string,
  status: "success" | "error" | "warning" | "info",
  message: string,
  details: any = null,
  clientId: string,
  nodeId: string | null = null,
  agentId: string | null = null
): Promise<void> => {
  try {
    await supabase.from("execution_logs").insert({
      workflow_id: workflowId,
      node_id: nodeId,
      agent_id: agentId,
      status,
      message,
      details,
      client_id: clientId,
    });
  } catch (error) {
    console.error("Error logging execution:", error);
  }
};
