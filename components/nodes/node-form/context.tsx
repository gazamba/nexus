"use client";

import { createContext, useContext, useState } from "react";

interface NodeFormContextType {
  formData: {
    name: string;
    description: string;
    type: string;
    code: string;
    inputs: any[];
    credentials: any[];
    is_public: boolean;
    activeTab: string;
  };
  setFormData: (data: any) => void;
  inputs: any[];
  setInputs: (inputs: any[]) => void;
  loading: boolean;
  error: any;
  nodeId?: string;
}

const NodeFormContext = createContext<NodeFormContextType | undefined>(
  undefined
);

export function NodeFormProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: NodeFormContextType;
}) {
  return (
    <NodeFormContext.Provider value={value}>
      {children}
    </NodeFormContext.Provider>
  );
}

export function useNodeForm() {
  const context = useContext(NodeFormContext);
  if (context === undefined) {
    throw new Error("useNodeForm must be used within a NodeFormProvider");
  }
  return context;
}
