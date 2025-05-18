export interface WorkflowLog {
  id: number;
  timestamp: string;
  workflow: string;
  details: string;
}

export interface WorkflowOption {
  value: string;
  label: string;
}
