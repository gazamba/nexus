import { createClient } from "../../utils/supabase/client";
import type { Node, NodeInput, WorkflowExecutionContext } from "@/types/types";

const supabase = createClient();

export const getNode = async (
  nodeId: string
): Promise<(Node & { credentials: any[] }) | null> => {
  const { data, error } = await supabase
    .from("node")
    .select(
      `
       *,
       node_credential (
         credential (
           *,
           credential_field (
             *
           )
         )
       )
     `
    )
    .eq("id", nodeId)
    .single();

  if (error || !data) {
    console.error("Error fetching node:", error);
    return null;
  }

  const credentials =
    data.node_credential?.map((nc: any) => ({
      ...nc.credential,
      fields: nc.credential.credential_field || [],
    })) || [];

  return { ...data, credentials };
};

export const listNodes = async (clientId: string): Promise<Node[]> => {
  const { data, error } = await supabase
    .from("node")
    .select("*")
    .eq("client_id", clientId);

  if (error || !data) {
    console.error("Error fetching nodes:", error);
    return [];
  }

  return data;
};

export const createNode = async (node: {
  name: string;
  description: string;
  type: string;
  code: string;
  clientId: string;
  createdBy: string;
  inputs?: NodeInput[];
  isPublic?: boolean;
  credentials?: string[];
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from("node")
    .insert({
      name: node.name,
      description: node.description,
      type: node.type,
      code: node.code,
      client_id: node.clientId,
      created_by: node.createdBy,
      inputs: node.inputs || [],
      is_public: node.isPublic || false,
      credentials: node.credentials || [],
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating node:", error);
    return null;
  }

  return data.id;
};

export const updateNode = async (
  nodeId: string,
  updates: {
    name?: string;
    description?: string;
    type?: string;
    code?: string;
    inputs?: NodeInput[];
    isPublic?: boolean;
    credentials?: string[];
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from("node")
    .update({
      name: updates.name,
      description: updates.description,
      type: updates.type,
      code: updates.code,
      inputs: updates.inputs,
      is_public: updates.isPublic,
      credentials: updates.credentials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", nodeId);

  if (error) {
    console.error("Error updating node:", error);
    return false;
  }

  return true;
};

export const deleteNode = async (nodeId: string): Promise<boolean> => {
  const { error } = await supabase.from("node").delete().eq("id", nodeId);

  if (error) {
    console.error("Error deleting node:", error);
    return false;
  }

  return true;
};

export const testNode = async (
  nodeId: string,
  inputs: Record<string, any>,
  context: {
    clientId: string;
    userId: string;
  }
): Promise<{
  success: boolean;
  outputs: Record<string, any>;
  error?: string;
}> => {
  const node = await getNode(nodeId);
  if (!node) {
    return {
      success: false,
      outputs: {},
      error: "Node not found",
    };
  }

  try {
    const executionContext: WorkflowExecutionContext = {
      workflowId: "test",
      executionId: "test-" + Date.now(),
      clientId: context.clientId,
      userId: context.userId,
      credentials: [],
    };

    const outputs = await node.execute(inputs, executionContext);
    return { success: true, outputs };
  } catch (error) {
    console.error("Error testing node:", error);
    return {
      success: false,
      outputs: {},
      error: String(error),
    };
  }
};

/**
 * Executes the code inside a Node's `code` field.
 * @param node The Node object (must have a `code` string field).
 * @param inputs The inputs to pass to the node's code.
 * @param context The execution context.
 * @returns The result of the node's code execution.
 */

export async function executeNode(
  node: Node,
  inputs: Record<string, any>,
  context: WorkflowExecutionContext
): Promise<Record<string, any>> {
  if (typeof node.code !== "string" || !node.code.trim()) {
    throw new Error("Node code is missing or invalid.");
  }

  let fn: (
    inputs: Record<string, any>,
    context: WorkflowExecutionContext
  ) => Promise<Record<string, any>>;

  try {
    fn = new Function("inputs", "context", node.code) as (
      inputs: Record<string, any>,
      context: WorkflowExecutionContext
    ) => Promise<Record<string, any>>;
  } catch (err) {
    throw new Error("Failed to compile node code: " + String(err));
  }

  try {
    const result = await fn(inputs, context);
    return result;
  } catch (err) {
    throw new Error("Error executing node code: " + String(err));
  }
}
