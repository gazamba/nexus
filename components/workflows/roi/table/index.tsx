"use client";

import { useState, useEffect } from "react";
import { TableHeader } from "./header";
import { TableCell } from "./cell";
import { Workflow } from "@/types/types";
import { AddWorkflowDialog } from "@/components/workflows/add-workflow-dialog";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortField =
  | "created_at"
  | "name"
  | "department"
  | "executions"
  | "exceptions"
  | "timesaved"
  | "costsaved";
type SortDirection = "asc" | "desc";

interface WorkflowTableProps {
  workflows: Workflow[];
  onRefresh?: () => Promise<void>;
}

export function WorkflowTable({ workflows, onRefresh }: WorkflowTableProps) {
  const [editWorkflow, setEditWorkflow] = useState<Workflow | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [localWorkflows, setLocalWorkflows] = useState<Workflow[]>(workflows);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    open: boolean;
    workflow: Workflow | null;
    newStatus: "active" | "inactive" | null;
  }>({
    open: false,
    workflow: null,
    newStatus: null,
  });

  // Update local workflows when props change
  useEffect(() => {
    setLocalWorkflows(workflows);
  }, [workflows]);

  const handleStatusChange = async (
    workflow: Workflow,
    newStatus: "active" | "inactive"
  ) => {
    try {
      setUpdatingStatus(workflow.id);
      console.log("updating status", workflow.id, newStatus);
      const response = await fetch(`/api/workflows/${workflow.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update workflow status");
      }

      // Update local state immediately
      setLocalWorkflows((prevWorkflows) =>
        prevWorkflows.map((w) =>
          w.id === workflow.id ? { ...w, status: newStatus } : w
        )
      );

      toast.success(`Workflow status updated to ${newStatus}`);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error updating workflow status:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update workflow status"
      );
    } finally {
      setUpdatingStatus(null);
      setStatusChangeDialog({ open: false, workflow: null, newStatus: null });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedWorkflows = [...localWorkflows].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "created_at":
        return (
          direction *
          (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        );
      case "name":
        return direction * a.name.localeCompare(b.name);
      case "department":
        return (
          direction * (a.department || "").localeCompare(b.department || "")
        );
      case "executions":
        return direction * (a.executions - b.executions);
      case "exceptions":
        return direction * (a.exceptions - b.exceptions);
      case "timesaved":
        return direction * (parseFloat(a.timesaved) - parseFloat(b.timesaved));
      case "costsaved":
        return direction * (parseFloat(a.costsaved) - parseFloat(b.costsaved));
      default:
        return 0;
    }
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            <TableHeader
              sortable
              field="created_at"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Create Date/Time
            </TableHeader>
            <TableHeader
              sortable
              field="department"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Department
            </TableHeader>
            <TableHeader
              sortable
              field="name"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Workflow Name
            </TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Nodes</TableHeader>
            <TableHeader
              sortable
              field="executions"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Executions
            </TableHeader>
            <TableHeader
              sortable
              field="exceptions"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Exceptions
            </TableHeader>
            <TableHeader
              sortable
              field="timesaved"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Time Saved
            </TableHeader>
            <TableHeader
              sortable
              field="costsaved"
              currentSort={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Cost Saved
            </TableHeader>
            <TableHeader>Status</TableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedWorkflows.map((workflow) => (
            <tr key={workflow.id} className="border-t hover:bg-muted/20">
              <TableCell>
                {workflow.created_at
                  ? new Date(workflow.created_at).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>{workflow.department || "-"}</TableCell>
              <TableCell className="text-blue-500">
                <button
                  className="hover:underline bg-transparent border-none p-0 m-0 cursor-pointer text-blue-500"
                  onClick={() =>
                    setEditWorkflow({
                      ...workflow,
                      department: workflow.department || "",
                    })
                  }
                  type="button"
                >
                  {workflow.name}
                </button>
              </TableCell>
              <TableCell>{workflow.description}</TableCell>
              <TableCell>
                {Array.isArray(workflow.nodes) ? workflow.nodes.length : "-"}
              </TableCell>
              <TableCell>
                <Link
                  href={`/workflows/${workflow.id}`}
                  className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  {workflow.executions}
                </Link>
              </TableCell>
              <TableCell>{workflow.exceptions}</TableCell>
              <TableCell>{workflow.timesaved}</TableCell>
              <TableCell>{workflow.costsaved}</TableCell>
              <TableCell>
                {workflow.status === "building" ? (
                  <span className="text-yellow-500">Building</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`status-${workflow.id}`}
                      checked={workflow.status === "active"}
                      onCheckedChange={(checked) => {
                        setStatusChangeDialog({
                          open: true,
                          workflow,
                          newStatus: checked ? "active" : "inactive",
                        });
                      }}
                      disabled={updatingStatus === workflow.id}
                    />
                    <Label
                      htmlFor={`status-${workflow.id}`}
                      className="text-sm"
                    >
                      {workflow.status === "active" ? "Active" : "Inactive"}
                    </Label>
                  </div>
                )}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
      {editWorkflow && (
        <AddWorkflowDialog
          open={!!editWorkflow}
          onOpenChange={(open) => !open && setEditWorkflow(null)}
          workflow={editWorkflow}
          mode="edit"
        />
      )}

      <AlertDialog
        open={statusChangeDialog.open}
        onOpenChange={(open) =>
          !open &&
          setStatusChangeDialog({
            open: false,
            workflow: null,
            newStatus: null,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Workflow Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of workflow "
              {statusChangeDialog.workflow?.name}" to{" "}
              {statusChangeDialog.newStatus}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                statusChangeDialog.workflow &&
                statusChangeDialog.newStatus &&
                handleStatusChange(
                  statusChangeDialog.workflow,
                  statusChangeDialog.newStatus
                )
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
