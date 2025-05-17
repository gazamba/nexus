export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workflows: {
        Row: {
          id: string;
          name: string;
          description: string;
          client_id: string;
          created_at: string;
          updated_at: string;
          status: "draft" | "active" | "inactive";
          workflow_nodes: Json;
          config: Json;
          version: number;
          created_by: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          client_id: string;
          created_at?: string;
          updated_at?: string;
          status?: "draft" | "active" | "inactive";
          workflow_nodes?: Json;
          config?: Json;
          version?: number;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          client_id?: string;
          created_at?: string;
          updated_at?: string;
          status?: "draft" | "active" | "inactive";
          workflow_nodes?: Json;
          config?: Json;
          version?: number;
          created_by?: string;
        };
      };
      nodes: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: string;
          code: string;
          inputs: Json;
          outputs: Json;
          created_by: string;
          is_public: boolean;
          client_id: string | null;
          version: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          type: string;
          code: string;
          inputs?: Json;
          outputs?: Json;
          created_by: string;
          is_public?: boolean;
          client_id?: string | null;
          version?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          type?: string;
          code?: string;
          inputs?: Json;
          outputs?: Json;
          created_by?: string;
          is_public?: boolean;
          client_id?: string | null;
          version?: number;
        };
      };
      agents: {
        Row: {
          id: string;
          name: string;
          description: string;
          client_id: string;
          created_at: string;
          updated_at: string;
          status: "draft" | "active" | "inactive";
          config: Json;
          channels: string[];
          workflow_id: string | null;
          created_by: string;
          version: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          client_id: string;
          created_at?: string;
          updated_at?: string;
          status?: "draft" | "active" | "inactive";
          config?: Json;
          channels?: string[];
          workflow_id?: string | null;
          created_by: string;
          version?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          client_id?: string;
          created_at?: string;
          updated_at?: string;
          status?: "draft" | "active" | "inactive";
          config?: Json;
          channels?: string[];
          workflow_id?: string | null;
          created_by?: string;
          version?: number;
        };
      };
      survey_responses: {
        Row: {
          id: string;
          client_id: string;
          user_id: string;
          responses: Json;
          created_at: string;
          workflow_id: string | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          user_id: string;
          responses: Json;
          created_at?: string;
          workflow_id?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          user_id?: string;
          responses?: Json;
          created_at?: string;
          workflow_id?: string | null;
        };
      };
      workflow_docs: {
        Row: {
          id: string;
          client_id: string;
          workflow_id: string | null;
          file_path: string;
          file_name: string;
          file_type: string;
          uploaded_by: string;
          created_at: string;
          analysis_status: "pending" | "processing" | "completed" | "failed";
          analysis_result: Json | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          workflow_id?: string | null;
          file_path: string;
          file_name: string;
          file_type: string;
          uploaded_by: string;
          created_at?: string;
          analysis_status?: "pending" | "processing" | "completed" | "failed";
          analysis_result?: Json | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          workflow_id?: string | null;
          file_path?: string;
          file_name?: string;
          file_type?: string;
          uploaded_by?: string;
          created_at?: string;
          analysis_status?: "pending" | "processing" | "completed" | "failed";
          analysis_result?: Json | null;
        };
      };
      execution_logs: {
        Row: {
          id: string;
          workflow_id: string;
          agent_id: string | null;
          node_id: string | null;
          status: "success" | "error" | "warning" | "info";
          message: string;
          details: Json | null;
          created_at: string;
          client_id: string;
        };
        Insert: {
          id?: string;
          workflow_id: string;
          agent_id?: string | null;
          node_id?: string | null;
          status: "success" | "error" | "warning" | "info";
          message: string;
          details?: Json | null;
          created_at?: string;
          client_id: string;
        };
        Update: {
          id?: string;
          workflow_id?: string;
          agent_id?: string | null;
          node_id?: string | null;
          status?: "success" | "error" | "warning" | "info";
          message?: string;
          details?: Json | null;
          created_at?: string;
          client_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface CredentialType {
  id: string;
  name: string;
  service: string;
  fields: CredentialField[];
  created_at: string;
}

export interface CredentialField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  variable_name?: string;
}

export interface Credential {
  id: string;
  user_id: string;
  type_id: string;
  name: string;
  fields: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowNodeReference {
  id: string;
  nodeId: string;
  position: {
    x: number;
    y: number;
  };
  inputs: Record<string, any>;
  outputs: string[];
  next: string[]; // IDs of the next nodes in the workflow
}
