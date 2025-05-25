import { Database } from "@/utils/supabase/database.types";

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
  id?: string;
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
  analyzed_survey_response: any;
  pipeline_group_id?: string;
}

export interface Document {
  id?: string;
  client_id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  related_id: string | null;
  related_type: "proposal" | "invoice" | null;
}

export type UserRole = "admin" | "client" | "se";

export type Profile = Database["public"]["Tables"]["profile"]["Row"];

export type SolutionsEngineerProfile = Profile & {
  role: "se";
};

export type ClientProfile = Profile & {
  role: "client";
};

export type Client = Database["public"]["Tables"]["client"]["Row"];

export type Credential = Database["public"]["Tables"]["credential"]["Row"];

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

interface Proposal {
  id: string;
  client_id: string;
  user_id: string;
  html_content: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  pricingModel: "fixed" | "tiered" | "usage";
  creditPerPeriod: number;
  pricePerCredit: number;
  productUsageApi: "air-direct" | "credit-card";
  contractLength: "month" | "quarter" | "year";
  paymentCadence: "monthly" | "quarterly";
  setupFee: number;
  prepaymentPercentage: number;
  capAmount: number;
  overageCost: number;
}

export interface WorkflowException {
  id: number;
  reported_at: string;
  client_id: string;
  department: string | null;
  workflow: { name: string };
  exception_type: string | null;
  severity: string | null;
  remedy_notes: string | null;
  status: string | null;
}

export interface Exception {
  id: number;
  datetime: string;
  clientName: string;
  department: string;
  workflow: string;
  notifications: number;
  exceptionType: string;
  severity: string;
  remedy: string;
  status: string;
}

export interface ExceptionFilters {
  clients: Client[];
  clientFilter: string;
  typeFilter: string;
  severityFilter: string;
  onClientFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onSeverityFilterChange: (value: string) => void;
}

export interface ExceptionTableProps {
  exceptions: Exception[];
  isLoading: boolean;
}

export interface ExceptionTableRowProps {
  exception: Exception;
}
