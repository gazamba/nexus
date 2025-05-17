import type { Agent } from "@/types/types";

export const customerServiceAgent: Agent = {
  id: "customer-service-agent",
  name: "Customer Service Agent",
  description: "Handles customer service inquiries and support requests",
  channels: ["email", "slack", "text"],
  config: {
    responseTime: "within 24 hours",
    supportedLanguages: ["en", "es", "fr"],
    escalationThreshold: 3,
  },
};
