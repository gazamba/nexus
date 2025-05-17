import { createClient } from "../../utils/supabase/client";
import { createWorkflow } from "./workflow-service";
import type { SurveyResponse, WorkflowDoc } from "@/types/types";

const supabase = createClient();

export const processSurveyResponse = async (surveyResponse: {
  clientId: string;
  userId: string;
  responses: Record<string, any>;
}): Promise<{ id: string; analysisResult?: Record<string, any> }> => {
  const { data, error } = await supabase
    .from("survey_response")
    .insert({
      client_id: surveyResponse.clientId,
      user_id: surveyResponse.userId,
      responses: surveyResponse.responses,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error storing survey response:", error);
    throw new Error("Failed to store survey response");
  }

  const analysisResult = await analyzeSurveyResponse(surveyResponse.responses);

  return { id: data.id, analysisResult };
};

export const processWorkflowDoc = async (doc: {
  clientId: string;
  uploadedBy: string;
  filePath: string;
  fileName: string;
  fileType: string;
}): Promise<{
  id: string;
  analysisStatus: "pending" | "processing" | "completed" | "failed";
}> => {
  const { data, error } = await supabase
    .from("workflow_doc")
    .insert({
      client_id: doc.clientId,
      uploaded_by: doc.uploadedBy,
      file_path: doc.filePath,
      file_name: doc.fileName,
      file_type: doc.fileType,
      analysis_status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error storing workflow document:", error);
    throw new Error("Failed to store workflow document");
  }

  analyzeWorkflowDoc(data.id, doc.filePath, doc.fileType).catch((error) => {
    console.error("Error analyzing workflow document:", error);
    updateWorkflowDocStatus(data.id, "failed");
  });

  return { id: data.id, analysisStatus: "pending" };
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
    id: data.id,
    clientId: data.client_id,
    userId: data.user_id,
    responses: data.responses,
    createdAt: data.created_at,
    workflowId: data.workflow_id,
  };
};

export const getWorkflowDoc = async (
  id: string
): Promise<WorkflowDoc | null> => {
  const { data, error } = await supabase
    .from("workflow_doc")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching workflow document:", error);
    return null;
  }

  return {
    id: data.id,
    clientId: data.client_id,
    workflowId: data.workflow_id,
    filePath: data.file_path,
    fileName: data.file_name,
    fileType: data.file_type,
    uploadedBy: data.uploaded_by,
    createdAt: data.created_at,
    analysisStatus: data.analysis_status,
    analysisResult: data.analysis_result,
  };
};

export const generateWorkflowFromInputs = async (
  clientId: string,
  userId: string,
  inputs: {
    surveyResponseIds?: string[];
    workflowDocIds?: string[];
    name: string;
    description: string;
  }
): Promise<{ workflowId: string | null; error?: string }> => {
  try {
    const surveyResponses: SurveyResponse[] = [];
    const workflowDocs: WorkflowDoc[] = [];

    if (inputs.surveyResponseIds && inputs.surveyResponseIds.length > 0) {
      for (const id of inputs.surveyResponseIds) {
        const response = await getSurveyResponse(id);
        if (response) surveyResponses.push(response);
      }
    }

    if (inputs.workflowDocIds && inputs.workflowDocIds.length > 0) {
      for (const id of inputs.workflowDocIds) {
        const doc = await getWorkflowDoc(id);
        if (doc && doc.analysisStatus === "completed") workflowDocs.push(doc);
      }
    }

    if (surveyResponses.length === 0 && workflowDocs.length === 0) {
      return { workflowId: null, error: "No valid inputs provided" };
    }

    const workflowStructure = await generateWorkflowStructure(
      surveyResponses,
      workflowDocs,
      inputs.name,
      inputs.description
    );

    const workflowId = await createWorkflow({
      name: inputs.name,
      description: inputs.description,
      clientId,
      createdBy: userId,
      nodes: workflowStructure.nodes,
      triggers: workflowStructure.triggers,
    });

    if (!workflowId) {
      return { workflowId: null, error: "Failed to create workflow" };
    }

    for (const response of surveyResponses) {
      await supabase
        .from("survey_response")
        .update({ workflow_id: workflowId })
        .eq("id", response.id);
    }

    for (const doc of workflowDocs) {
      await supabase
        .from("workflow_doc")
        .update({ workflow_id: workflowId })
        .eq("id", doc.id);
    }

    return { workflowId };
  } catch (error) {
    console.error("Error generating workflow from inputs:", error);
    return { workflowId: null, error: String(error) };
  }
};

const analyzeSurveyResponse = async (
  responses: Record<string, any>
): Promise<Record<string, any>> => {
  return {
    automationPotential: "high",
    suggestedWorkflows: [
      {
        name: "Invoice Processing",
        description: "Automate the processing of customer invoices",
        confidence: 0.85,
      },
      {
        name: "Customer Service Ticket Handling",
        description: "Streamline the handling of customer service tickets",
        confidence: 0.75,
      },
    ],
    suggestedNodes: [
      {
        type: "email-monitor",
        description: "Monitor email inbox for new invoices",
        confidence: 0.9,
      },
      {
        type: "pdf-parser",
        description: "Extract data from PDF invoices",
        confidence: 0.8,
      },
      {
        type: "salesforce-integration",
        description: "Update customer records in Salesforce",
        confidence: 0.7,
      },
    ],
  };
};

const analyzeWorkflowDoc = async (
  docId: string,
  filePath: string,
  fileType: string
): Promise<void> => {
  try {
    await updateWorkflowDocStatus(docId, "processing");

    const { data, error } = await supabase.storage
      .from("workflow-docs")
      .download(filePath);

    if (error || !data) {
      throw new Error(
        `Failed to download workflow document: ${error?.message}`
      );
    }

    let text: string;
    if (fileType === "application/pdf") {
      text = await extractTextFromPDF(data);
    } else {
      text = await data.text();
    }

    const analysisResult = await analyzeWorkflowText(text);

    await supabase
      .from("workflow_doc")
      .update({
        analysis_status: "completed",
        analysis_result: analysisResult,
      })
      .eq("id", docId);
  } catch (error) {
    console.error("Error analyzing workflow document:", error);
    await updateWorkflowDocStatus(docId, "failed");
  }
};

const updateWorkflowDocStatus = async (
  docId: string,
  status: "pending" | "processing" | "completed" | "failed"
): Promise<void> => {
  await supabase
    .from("workflow_doc")
    .update({ analysis_status: status })
    .eq("id", docId);
};

const extractTextFromPDF = async (pdfData: Blob): Promise<string> => {
  return "This is a mock PDF text extraction";
};

const analyzeWorkflowText = async (
  text: string
): Promise<Record<string, any>> => {
  return {
    automationPotential: "high",
    suggestedWorkflows: [
      {
        name: "Invoice Processing",
        description: "Automate the processing of customer invoices",
        confidence: 0.85,
      },
    ],
    suggestedNodes: [
      {
        type: "email-monitor",
        description: "Monitor email inbox for new invoices",
        confidence: 0.9,
      },
      {
        type: "pdf-parser",
        description: "Extract data from PDF invoices",
        confidence: 0.8,
      },
      {
        type: "salesforce-integration",
        description: "Update customer records in Salesforce",
        confidence: 0.7,
      },
    ],
    extractedEntities: {
      systems: ["Email", "Salesforce", "Ariba"],
      roles: ["Accounts Payable Clerk", "Finance Manager"],
      documents: ["Invoice", "Purchase Order", "Receipt"],
    },
  };
};

const generateWorkflowStructure = async (
  surveyResponses: SurveyResponse[],
  workflowDocs: WorkflowDoc[],
  name: string,
  description: string
): Promise<{ nodes: any[]; triggers: any[] }> => {
  const { data: nodeData } = await supabase
    .from("nodes")
    .select("id, name, type")
    .in("type", [
      "email-monitor",
      "pdf-parser",
      "data-extractor",
      "salesforce-integration",
    ])
    .limit(10);

  const nodes = nodeData || [];

  const emailMonitorNode = nodes.find((n) => n.type === "email-monitor");
  const pdfParserNode = nodes.find((n) => n.type === "pdf-parser");
  const dataExtractorNode = nodes.find((n) => n.type === "data-extractor");
  const salesforceNode = nodes.find((n) => n.type === "salesforce-integration");

  const workflowNodes = [];
  const triggers = [];

  if (emailMonitorNode) {
    workflowNodes.push({
      id: "node1",
      nodeId: emailMonitorNode.id,
      inputs: {
        emailAccount: "invoices@example.com",
        searchCriteria: "subject:invoice",
      },
      outputs: ["email"],
      position: { x: 100, y: 100 },
      next: ["node2"],
    });

    triggers.push({
      type: "schedule",
      config: {
        schedule: "*/15 * * * *",
        nodeId: "node1",
      },
    });
  }

  if (pdfParserNode) {
    workflowNodes.push({
      id: "node2",
      nodeId: pdfParserNode.id,
      inputs: {
        source: "$node1.email.attachments[0]",
      },
      outputs: ["text"],
      position: { x: 300, y: 100 },
      next: ["node3"],
    });
  }

  if (dataExtractorNode) {
    workflowNodes.push({
      id: "node3",
      nodeId: dataExtractorNode.id,
      inputs: {
        text: "$node2.text",
        extractionRules: {
          invoiceNumber: "Invoice #:\\s*(\\d+)",
          amount: "Amount:\\s*\\$(\\d+\\.\\d{2})",
          date: "Date:\\s*(\\d{2}/\\d{2}/\\d{4})",
        },
      },
      outputs: ["extractedData"],
      position: { x: 500, y: 100 },
      next: ["node4"],
    });
  }

  if (salesforceNode) {
    workflowNodes.push({
      id: "node4",
      nodeId: salesforceNode.id,
      inputs: {
        operation: "create",
        objectType: "Invoice__c",
        data: {
          InvoiceNumber__c: "$node3.extractedData.invoiceNumber",
          Amount__c: "$node3.extractedData.amount",
          Date__c: "$node3.extractedData.date",
        },
      },
      outputs: ["result"],
      position: { x: 700, y: 100 },
      next: [],
    });
  }

  return {
    nodes: workflowNodes,
    triggers,
  };
};
