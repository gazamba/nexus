"use client";

import { createContext, useContext, useState } from "react";
import { Agent } from "@/types/types";

interface AgentFormContextType {
  formData: Partial<Agent>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Agent>>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AgentFormContext = createContext<AgentFormContextType | undefined>(
  undefined
);

export function AgentFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: "",
    description: "",
    type: "email",
    status: "active",
    capabilities: [],
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "",
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AgentFormContext.Provider
      value={{
        formData,
        setFormData,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AgentFormContext.Provider>
  );
}

export function useAgentForm() {
  const context = useContext(AgentFormContext);
  if (context === undefined) {
    throw new Error("useAgentForm must be used within an AgentFormProvider");
  }
  return context;
}
