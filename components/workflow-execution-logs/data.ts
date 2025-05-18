import { WorkflowOption } from "./types";

export const workflowOptions: WorkflowOption[] = [
  {
    value: "invoice-processing",
    label: "Invoice Processing Workflow",
  },
  {
    value: "employee-onboarding",
    label: "Employee Onboarding Workflow",
  },
  {
    value: "expense-approval",
    label: "Expense Approval Workflow",
  },
  {
    value: "customer-onboarding",
    label: "Customer Onboarding Workflow",
  },
];

export const sampleLogs = [
  {
    id: 1,
    timestamp: "2025-05-14 02:15:47",
    workflow: "Invoice Processing",
    details: "Successfully processed invoice #INV-2025-001",
  },
  {
    id: 2,
    timestamp: "2025-05-14 02:14:32",
    workflow: "Invoice Processing",
    details: "Data extraction completed for invoice #INV-2025-002",
  },
  {
    id: 3,
    timestamp: "2025-05-14 02:13:15",
    workflow: "Invoice Processing",
    details: "Started processing invoice batch #BATCH-051",
  },
  {
    id: 4,
    timestamp: "2025-05-14 02:12:03",
    workflow: "Invoice Processing",
    details: "Validation checks passed for invoice #INV-2025-003",
  },
  {
    id: 5,
    timestamp: "2025-05-14 02:10:47",
    workflow: "Invoice Processing",
    details: "New invoice detected in input folder",
  },
];
