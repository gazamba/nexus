import { createClient } from "../../utils/supabase/client";
import type {
  Node,
  NodeInput,
  NodeTestExecutionContext,
  WorkflowExecutionContext,
} from "@/types/types";

const supabase = createClient();

export const getNode = async (
  nodeId: string
): Promise<(Node & { credentials: any[]; inputs: NodeInput[] }) | null> => {
  const { data: nodeData, error } = await supabase
    .from("node")
    .select(`*`)
    .eq("id", nodeId)
    .single();

  if (error || !nodeData) {
    console.error("Error fetching node:", error);
    throw new Error("Error fetching node");
  }
  console.log(`nodeData: ${JSON.stringify(nodeData.client_id)}`);
  const { data: credentialsData, error: credentialsError } = await supabase
    .from("credential")
    .select("*")
    .eq("client_id", nodeData.client_id);

  if (credentialsError || !credentialsData) {
    console.error("Error fetching credentials:", credentialsError);
    throw new Error("Error fetching credentials");
  }

  const { data: inputsData, error: inputsError } = await supabase
    .from("node_input")
    .select("*")
    .eq("node_id", nodeId);
  if (inputsError) {
    console.error("Error fetching node inputs:", inputsError);
    throw new Error("Error fetching node inputs");
  }

  console.log(`credentialsData: ${JSON.stringify(credentialsData)}`);
  return {
    ...nodeData,
    credentials: credentialsData,
    inputs: inputsData || [],
  };
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
      is_public: node.isPublic || false,
      credentials: node.credentials || [],
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating node:", error);
    return null;
  }

  if (node.inputs) {
    for (const input of node.inputs) {
      const { error: inputError } = await supabase.from("node_input").insert({
        node_id: data.id,
        name: input.name,
        type: input.type,
        required: input.required,
        description: input.description,
        value: input.value,
      });
      if (inputError) {
        console.error("Error creating node input:", inputError);
        return null;
      }
    }
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
      is_public: updates.isPublic,
      credentials: updates.credentials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", nodeId);

  if (updates.inputs) {
    const { data: currentInputs, error: fetchError } = await supabase
      .from("node_input")
      .select("id")
      .eq("node_id", nodeId);
    if (fetchError) {
      console.error("Error fetching current node inputs:", fetchError);
      return false;
    }
    const currentIds = (currentInputs || []).map((i) => i.id);
    const formIds = updates.inputs.map((i) => i.id).filter(Boolean);

    for (const input of updates.inputs) {
      if (input.id) {
        await supabase
          .from("node_input")
          .update({
            name: input.name,
            type: input.type,
            required: input.required,
            description: input.description,
            value: input.value,
          })
          .eq("id", input.id);
      } else {
        await supabase.from("node_input").insert({
          node_id: nodeId,
          name: input.name,
          type: input.type,
          required: input.required,
          description: input.description,
          value: input.value,
        });
      }
    }

    for (const id of currentIds) {
      if (!formIds.includes(id)) {
        await supabase.from("node_input").delete().eq("id", id);
      }
    }
  }

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

interface Inputs {
  [key: string]: string;
}

interface ExecutionResult {
  success: boolean;
  result?: unknown;
  error?: string;
}

export async function executeNodeCode(
  code: string,
  inputs: Partial<NodeInput>[],
  context: NodeTestExecutionContext
): Promise<ExecutionResult> {
  try {
    // const fullContext: NodeTestExecutionContext = {
    //   clientId: context.clientId || '',
    //   userId: context.userId || '',
    //   credentials: context.credentials || []
    // };

    const sandbox = (
      code: string,
      inputs: Partial<NodeInput>[],
      context: NodeTestExecutionContext
    ): unknown => {
      const fn: Function = new Function(
        "inputs",
        "context",
        `
          "use strict";
          ${code}
          return main(inputs, context); // Assumes code defines a 'main' function
        `
      );
      return fn(inputs, context);
    };

    const result: unknown = sandbox(code, inputs, context);

    console.log(`result: ${JSON.stringify(result)}`);

    if (result instanceof Promise) {
      return { success: true, result: await result };
    }
    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
