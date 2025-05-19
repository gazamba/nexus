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
  title: string;
  url: string;
}

export interface PipelineStep {
  step_name: string;
  progress?: {
    status: string;
    completed_at?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  solutions_engineer_profile: Engineer[];
  client_user_profile: User[];
  document: Document[];
}
