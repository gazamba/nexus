export const PIPELINE_STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in-progress",
  PENDING: "pending",
} as const;

export const TAB_NAMES = {
  OVERVIEW: "overview",
  WORKFLOWS: "workflows",
} as const;

export const API_ENDPOINTS = {
  CLIENT_PROFILE: (id: string) => `/api/clients/${id}`,
  PIPELINE: (id: string) => `/api/clients/${id}/pipeline`,
  WORKFLOWS: (id: string) => `/api/clients/${id}/workflows`,
} as const;
