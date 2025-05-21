"use server";

import { SurveyResponse } from "@/types/types";
import { createClient } from "../../utils/supabase/client";
const supabase = createClient();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export const createSurveyResponse = async (
  surveyResponse: SurveyResponse & { pipeline_group_id?: string }
) => {
  const { data, error } = await supabase
    .from("survey_response")
    .insert([surveyResponse])
    .select("id")
    .single();

  return { data, error };
};

export const getSurveyResponse = async (
  id: string
): Promise<SurveyResponse | null> => {
  const { data, error } = await supabase
    .from("survey_response")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching survey response:", error);
    return null;
  }

  return {
    ...data,
  };
};

export const updateAnalyzedSurveyResponse = async (
  analyzedSurveyResponse: any,
  surveyId: string
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("survey_response")
      .update({ analyzed_survey_response: analyzedSurveyResponse })
      .eq("id", surveyId)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to insert analyzed survey response: ${error.message}`
      );
    }

    console.log(`Inserted/Updated analyzed survey response: ${data.id}`);
  } catch (error: any) {
    console.error("Insertion failed:", error.message);
    throw new Error(
      `Failed to insert analyzed survey response: ${error.message}`
    );
  }
};

export const listSurveyResponses = async (
  userId: string
): Promise<SurveyResponse[] | null> => {
  const { data, error } = await supabase.from("survey_response").select("*");
  // .eq("user_id", userId);

  if (error || !data) {
    console.error("Error fetching survey response:", error);
    return null;
  }

  return data;
};

export const getSurveyResponseByClientAndUser = async (
  clientId: string,
  userId: string
): Promise<SurveyResponse | null> => {
  const { data, error } = await supabase
    .from("survey_response")
    .select("*")
    .eq("client_id", clientId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching survey response by client and user:", error);
    return null;
  }

  return data;
};

export const getSurveyResponseByPipelineGroupId = async (
  pipelineGroupId: string
): Promise<SurveyResponse | null> => {
  const { data, error } = await supabase
    .from("survey_response")
    .select("*")
    .eq("pipeline_group_id", pipelineGroupId)
    .single();

  if (error || !data) {
    console.error(
      "Error fetching survey response by pipeline group id:",
      error
    );
    return null;
  }

  return data;
};

export const analyzeSurveyResponse = async (
  surveyResponse: SurveyResponse
): Promise<Record<string, any>> => {
  const currentTimestamp = new Date().toISOString();

  console.log(`surveyResponse: ${JSON.stringify(surveyResponse, null, 2)}`);

  const promptAnalysis = `
You are an automation engineer for the Nexus Factory, a platform that generates automated workflows from client survey responses and documentation. Your input is a JSON payload from a webhook, containing survey responses about one or more client workflows, including workflow type, current process (steps, data flow), triggers, pain points, systems, API access, outputs, interaction channels, volume, priority, compliance, constraints, error handling, user ID, and documentation.

Your task is to:
- Analyze the survey responses and documentation to identify distinct workflows (e.g., email monitoring to Slack notification as one workflow).
- For each workflow, create a Workflow object and associated Node objects, mapping each step to Nexus Nodes (e.g., EmailMonitor for email monitoring, Slack for notifications).
- Generate a JSON output with an array of workflow objects, each containing its nodes array, to populate the workflow and node database tables.
- Omit Agent data if agent_interaction specifies "None."
- Include notes for missing information or requirements (e.g., API credentials).

### Guidelines:
- **Input**: Webhook JSON payload with survey responses and documentation. Assume basic authentication is configured.
- **Workflow Identification**: Use current_process.steps and documentation to identify distinct workflows. Each workflow should have a clear trigger, steps, and outputs.
- **Nexus Nodes**: Map to tasks like:
  - Monitor email inbox (Gmail API, type: EmailMonitor).
  - Send Slack notifications (Slack API, type: Slack).
  - Use HTTP requests for unsupported APIs (type: HTTPRequest).
- **Node Code**: Provide JavaScript snippets for a Node.js environment (e.g., using googleapis for Gmail, @slack/web-api for Slack). Include basic error handling (e.g., try-catch, logging).
- **Workflow Trigger**: Set trigger_option to event for event-based triggers (e.g., email received) or schedule for time-based triggers.
- **Outputs**: Map outputs to node tasks (e.g., Slack notification).
- **Systems**: Use systems to configure nodes (e.g., Gmail API, Slack API). Note custom code needs for unsupported systems in notes.
- **Pain Points**: Prioritize automation for manual tasks, delays, or errors.
- **Error Handling**: Incorporate error_handling.strategy in node logic or notes (e.g., retry API calls twice, notify admin).
- **UUIDs**: Generate new UUIDs for id fields using standard format.
- **Timestamps**: Use "${currentTimestamp}" for created_at and updated_at.
- **Execute Logic**: Describe the execute function's behavior in plain text, focusing on inputs, outputs, and error handling.
- **Documentation**: Use documentation to validate steps and fill gaps (e.g., Slack channel names).
- **Compliance**: Note GDPR or other compliance_requirements in notes.
- **Numeric Fields**: Use numeric values for timesaved (hours) and costsaved (dollars) to match database schema.

### Input Format:
${JSON.stringify(surveyResponse, null, 2)}

### Output Format:
{
  "workflows": [
    {
      "id": "UUID",
      "name": "string",
      "description": "Description of execution logic",
      "client_id": "client_id from input",
      "department": "define a department for the workflow",
      "status": "building",
      "executions": 0,
      "exceptions": 0,
      "timesaved": 0,
      "costsaved": 0,
      "nodes": [
        {
          "id": "UUID",
          "name": "string",
          "description": "string",
          "type": "string (e.g., EmailMonitor, Slack, HTTPRequest)",
          "code": "JavaScript code for task",
          "workflow_id": "workflow.id",
          "inputs": [
            {
              "name": "string",
              "description": "string",
              "type": "string",
              "required": boolean
            }
          ],
          "is_public": false,
          "created_at": "${currentTimestamp}",
          "updated_at": "${currentTimestamp}"
        }
      ],
      "schedule_days": null,
      "schedule_months": null,
      "schedule_hours": null,
      "trigger_option": "event"
    }
  ],
  "notes": ["string"]
}

### Task:
Analyze the webhook JSON payload to identify distinct workflows. For each workflow, generate a Workflow object with its associated Node objects, mapping steps to Nexus Nodes. Include JavaScript code for node tasks, use numeric timesaved and costsaved, and note any missing information or compliance requirements (e.g., GDPR) in notes. Use new UUIDs for id fields and the timestamp "${currentTimestamp}" for created_at and updated_at. Omit Agent data if agent_interaction is "None."
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: promptAnalysis }],
      response_format: { type: "json_object" },
    });

    console.log(`response from openai: ${response.choices[0].message.content}`);

    const result = JSON.parse(response.choices[0].message.content || "{}");

    console.log(`parsed result: ${JSON.stringify(result, null, 2)}`);

    if (!result.workflows || !Array.isArray(result.workflows)) {
      throw new Error(
        "Invalid output: workflows array is missing or not an array"
      );
    }

    result.workflows = result.workflows.map((workflow: any) => ({
      ...workflow,
      nodes: workflow.nodes.map((node: any) => ({
        ...node,
        workflow_id: node.workflow_id || workflow.id,
      })),
    }));

    console.log(`result`);
    return result;
  } catch (error: any) {
    console.error("Error analyzing survey response:", error.message);
    throw new Error(`Failed to analyze survey response: ${error.message}`);
  }
};
