import { Client } from "@/types/types";

export interface Exception {
  id: number;
  datetime: string;
  clientName: string;
  department: string;
  workflowName: string;
  notifications: number;
  exceptionType: string;
  severity: string;
  remedy: string;
  status: string;
}

export interface FiltersProps {
  clients: Client[];
  clientFilter: string;
  typeFilter: string;
  severityFilter: string;
  onClientFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onSeverityFilterChange: (value: string) => void;
}

export interface ExceptionsTableProps {
  exceptions: Exception[];
  isLoading: boolean;
  clients: Client[];
}

export interface ExceptionTableRowProps {
  exception: Exception;
  clients: Client[];
}

export interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}
