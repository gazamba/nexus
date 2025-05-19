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
  is_public: boolean;
  created_at: string | null;
  updated_at: string | null;
  execute: (
    inputs: Record<string, any>,
    context: WorkflowExecutionContext
  ) => Promise<Record<string, any>>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  client_id: string;
  department: string;
  status: "active" | "inactive" | "building";
  executions: number;
  exceptions: number;
  timesaved: string;
  costsaved: string;
  nodes: Node[];
  schedule_days: number | null;
  schedule_months: number | null;
  schedule_hours: number | null;
  trigger_option: "event" | "schedule";
  created_at: string;
  updated_at: string;
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

export interface WorkflowExecutionContext {
  workflowId: string;
  executionId: string;
  clientId: string;
  userId: string;
  credentials: Credential[];
}

export interface NodeExecutionContext {
  workflowId: string;
  executionId: string;
  clientId: string;
  userId: string;
  credentials: Credential[];
}

export interface AgentExecutionContext {
  workflowId: string;
  executionId: string;
  clientId: string;
  userId: string;
  credentials: Credential[];
}

export interface SurveyResponse {
  workflow_type: string;
  current_process: string;
  triggers: string[];
  pain_points: string[];
  systems: string[];
  api_access: string;
  outputs: string[];
  agent_interaction: string[];
  volume: string;
  priority: string;
  user_id: string;
  client_id: string;
  pipeline_group_id?: string;
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
  role?: UserRole;
  avatar?: string;
  full_name?: string;
  phone?: string;
  billing?: boolean;
  admin?: boolean;
  notes?: string;
  department?: string;
  exceptions?: string[];
  access?: string[];
  cost_rate?: number;
  bill_rate?: number;
  assigned_clients?: string[];
}

export interface Client {
  id: string;
  name: string;
  url?: string | null;
  created_at?: string | null;
  active?: boolean;
  industry?: string | null;
  status?: string | null;
  contractId?: string;
  contractStart?: string;
  workflows?: number;
  nodes?: number;
  executions?: number;
  exceptions?: number;
  revenue?: string;
  timeSaved?: string;
  moneySaved?: string;
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
  created_at?: string;
  updated_at?: string;
  progress?: PipelineProgress;
}

export interface PipelineProgress {
  id: number;
  client_id: string;
  user_id: string;
  step_id: number;
  completed_at?: string;
  status: "pending" | "completed" | "in-progress";
  created_at?: string;
  updated_at?: string;
  pipeline_group_id?: string;
}

export interface NodeListItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
}

export type QuestionType = "text" | "textarea" | "radio" | "checkbox" | "scale";

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  followUp?: {
    id: string;
    type: QuestionType;
    question: string;
    required?: boolean;
    placeholder?: string;
    min?: number;
    max?: number;
    condition: {
      field: string;
      value: string | string[];
    };
  };
}
