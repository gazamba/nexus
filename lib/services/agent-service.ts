import { createClient } from "../../utils/supabase/client";
import type { Agent, AgentExecutionContext } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export const getAgent = async (agentId: string): Promise<Agent | null> => {
  const { data, error } = await supabase
    .from("agent")
    .select("*")
    .eq("id", agentId)
    .single();

  if (error || !data) {
    console.error("Error fetching agent:", error);
    return null;
  }
  console.log(`agent: ${JSON.stringify(data)}`);
  return {
    ...data,
  };
};

export const listAgents = async (clientId?: string): Promise<Agent[]> => {
  let query = supabase.from("agent").select("*");

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Error fetching agents:", error);
    return [];
  }

  return data.map((agent) => ({
    ...agent,
  }));
};

export const createAgent = async (agent: {
  name: string;
  description?: string | null;
  type?: string | null;
  status: "active" | "inactive";
  capabilities?: string[] | null;
  model?: string | null;
  temperature?: number | null;
  maxtokens?: number | null;
  systemprompt?: string | null;
  ispublic?: boolean | null;
  clientId: string;
  createdBy: string;
}): Promise<string | null> => {
  const { data, error } = await supabase
    .from("agent")
    .insert({
      name: agent.name,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      capabilities: agent.capabilities,
      model: agent.model,
      temperature: agent.temperature,
      max_tokens: agent.maxtokens,
      system_prompt: agent.systemprompt,
      is_public: agent.ispublic,
      client_id: agent.clientId,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating agent:", error);
    return null;
  }

  return data.id;
};

export const updateAgent = async (
  agentId: string,
  updates: {
    name?: string;
    description?: string | null;
    type?: string | null;
    status?: "active" | "inactive";
    capabilities?: string[] | null;
    model?: string | null;
    temperature?: number | null;
    maxtokens?: number | null;
    systemprompt?: string | null;
    ispublic?: boolean | null;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from("agent")
    .update({
      name: updates.name,
      description: updates.description,
      type: updates.type,
      status: updates.status,
      capabilities: updates.capabilities,
      model: updates.model,
      temperature: updates.temperature,
      max_tokens: updates.maxtokens,
      system_prompt: updates.systemprompt,
      is_public: updates.ispublic,
      updated_at: new Date().toISOString(),
    })
    .eq("id", agentId);

  if (error) {
    console.error("Error updating agent:", error);
    return false;
  }

  return true;
};

export const deleteAgent = async (agentId: string): Promise<boolean> => {
  const { error } = await supabase.from("agent").delete().eq("id", agentId);

  if (error) {
    console.error("Error deleting agent:", error);
    return false;
  }

  return true;
};

const logExecution = async (
  agentId: string,
  executionId: string,
  status: "success" | "error" | "warning" | "info",
  message: string,
  details: any = null,
  clientId: string
): Promise<void> => {
  try {
    await supabase.from("execution_log").insert({
      agent_id: agentId,
      execution_id: executionId,
      status,
      message,
      details,
      client_id: clientId,
    });
  } catch (error) {
    console.error("Error logging execution:", error);
  }
};

export const executeAgent = async (
  agentId: string,
  input: {
    message: string;
    channel: "email" | "slack" | "text" | "phone";
    metadata?: Record<string, any>;
  },
  context: {
    clientId: string;
    userId: string;
  }
): Promise<{
  success: boolean;
  response?: string;
  error?: string;
}> => {
  const agent = await getAgent(agentId);
  if (!agent) {
    return {
      success: false,
      error: "Agent not found",
    };
  }

  const executionId = uuidv4();
  const executionContext: AgentExecutionContext = {
    workflowId: "none",
    executionId,
    clientId: context.clientId,
    userId: context.userId,
    credentials: [],
  };

  try {
    return {
      success: true,
      response: `Agent ${agent.name} received your message: ${input.message}`,
    };
  } catch (error) {
    console.error("Error executing agent:", error);
    return {
      success: false,
      error: String(error),
    };
  }
};
