export interface Workflow {
  id: number;
  createDate: string;
  department: string;
  workflowName: string;
  description: string;
  nodes: number;
  executions: number;
  exceptions: number;
  timeSaved: string;
  costSaved: string;
}
