import { createClient } from "../../utils/supabase/client";
import type { SurveyResponse } from "@/types/types";
import OpenAI from "openai";
const openai = new OpenAI();

const supabase = createClient();

export const insertAnalyzedSurveyResponse = async (
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
