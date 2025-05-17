export interface NodeInput {
  id: string;
  node_id: string;
  name: string;
  type: string;
  required: boolean;
  description: string | null;
}

export interface Node {
  id: string;
  name: string;
  description: string | null;
  type: string;
  code: string | null;
  workflow_id: string;
  inputs: NodeInput[];
  execute: (
    inputs: Record<string, any>,
    context: ExecutionContext
  ) => Promise<Record<string, any>>;
}

export interface WorkflowNodeReference {
  id: string;
  nodeId: string;
  position: {
    // Position in the workflow canvas
    x: number;
    y: number;
  };
  inputs: Record<string, any>;
  outputs: string[];
  next: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNodeReference[];
  triggers: {
    type: "schedule" | "webhook" | "event";
    config: Record<string, any>;
  }[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "inactive";
  capabilities: string[];
  lastActive: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  isPublic: boolean;
}

export interface ExecutionContext {
  workflowId: string;
  executionId: string;
  clientId: string;
  userId: string;
  logger: {
    info: (message: string, details?: any) => Promise<void>;
    error: (message: string, details?: any) => Promise<void>;
    warning: (message: string, details?: any) => Promise<void>;
    success: (message: string, details?: any) => Promise<void>;
  };
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
}

export interface SurveyResponse {
  id: string;
  clientId: string;
  userId: string;
  responses: Record<string, any>;
  createdAt: string;
  workflowId?: string;
}

export interface WorkflowDoc {
  id: string;
  clientId: string;
  workflowId?: string;
  filePath: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
  analysisStatus: "pending" | "processing" | "completed" | "failed";
  analysisResult?: Record<string, any>;
}

export type UserRole = "admin" | "client" | "se";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  url: string | null;
  created_at: string | null;
  active: boolean;
  industry: string | null;
  status: string | null;
}

export interface CredentialField {
  id: string;
  variable_name: string;
  vault_key: string;
  credential_id: string;
}

export interface Credential {
  id: string;
  client_id: string;
  name: string;
  fields: CredentialField[];
  created_at: string;
}

export interface PipelineStep {
  id: number;
  step_name: string;
  step_order: number;
}

export interface PipelineProgress {
  id: number;
  client_id: string;
  step_id: number;
  user_id: string;
  status: "pending" | "completed" | "in-progress";
  completed_at: string;
}
