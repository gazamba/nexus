import type { Workflow } from "@/types/types";

export const invoiceProcessingWorkflow: Workflow = {
  id: "invoice-processing-workflow",
  name: "Invoice Processing Workflow",
  description: "Automates the processing of incoming invoices",
  nodes: [
    {
      id: "node1",
      nodeId: "email-monitor",
      position: { x: 100, y: 100 },
      inputs: {
        emailAccount: "invoices@example.com",
        searchCriteria: "subject:invoice",
      },
      outputs: ["email"],
      next: ["node2"],
    },
    {
      id: "node2",
      nodeId: "pdf-parser",
      position: { x: 300, y: 100 },
      inputs: {
        source: "$node1.email.attachments[0]",
      },
      outputs: ["text"],
      next: ["node3"],
    },
    {
      id: "node3",
      nodeId: "data-extractor",
      position: { x: 500, y: 100 },
      inputs: {
        text: "$node2.text",
        extractionRules: {
          invoiceNumber: "Invoice #:\\s*(\\d+)",
          amount: "Amount:\\s*\\$(\\d+\\.\\d{2})",
          date: "Date:\\s*(\\d{2}/\\d{2}/\\d{4})",
        },
      },
      outputs: ["extractedData"],
      next: ["node4"],
    },
    {
      id: "node4",
      nodeId: "salesforce-integration",
      position: { x: 700, y: 100 },
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
      next: [],
    },
  ],
  triggers: [
    {
      type: "schedule",
      config: {
        schedule: "*/15 * * * *", // Every 15 minutes
        nodeId: "node1",
      },
    },
  ],
};
