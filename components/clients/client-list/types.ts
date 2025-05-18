export interface Engineer {
  avatar: string;
  name: string;
  role: string;
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
  name: string;
  engineers: Engineer[];
  users: User[];
  documents: Document[];
}
