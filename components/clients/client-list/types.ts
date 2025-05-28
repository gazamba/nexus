export interface Engineer {
  id: string;
  user_id: string;
  full_name: string;
  avatar_initial: string;
  role: string;
  created_at: string;
  updated_at: string;
  email: string;
}

export interface User {
  full_name: string;
  email: string;
  phone: string;
  billing: boolean;
  admin: boolean;
  notes: string;
}

export interface Document {
  id: string;
  title: string;
  url: string;
  related_id: string;
  related_type: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineStep {
  id: number;
  step_name: string;
  step_order: number;
  created_at?: string;
  updated_at?: string;
  progress?: PipelineProgress;
  pipeline_group_id?: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export interface ClientUser {
  id: string;
  name: string;
  solutions_engineer: Engineer[];
  client_user: User[];
  document: Document[];
}

export interface PipelineProgress {
  id: number;
  client_id: string;
  user_id: string;
  step_id: number;
  completed_at?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  pipeline_group_id?: string;
}
