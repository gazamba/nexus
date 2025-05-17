"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface AddWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWorkflow: (workflow: any) => void;
}

interface Node {
  id: string;
  name: string;
  description: string;
  type: string;
}

export function AddWorkflowDialog({
  open,
  onOpenChange,
  onAddWorkflow,
}: AddWorkflowDialogProps) {
  const [department, setDepartment] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");
  const [executions, setExecutions] = useState("");
  const [exceptions, setExceptions] = useState("");
  const [timeSaved, setTimeSaved] = useState("");
  const [costSaved, setCostSaved] = useState("");

  const [availableNodes, setAvailableNodes] = useState<Node[]>([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [nodesError, setNodesError] = useState("");

  useEffect(() => {
    if (open) {
      fetchNodes();
    }
  }, [open]);

  const fetchNodes = async () => {
    setLoadingNodes(true);
    setNodesError("");

    try {
      const response = await fetch("/api/nodes");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAvailableNodes(data.nodes || []);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      setNodesError("Failed to load nodes. Please try again.");

      setAvailableNodes([
        {
          id: "1",
          name: "Email Parser",
          description: "Parses emails for data extraction",
          type: "Parser",
        },
        {
          id: "2",
          name: "Slack Notifier",
          description: "Sends notifications to Slack",
          type: "Notification",
        },
        {
          id: "3",
          name: "PDF Extractor",
          description: "Extracts data from PDF files",
          type: "Parser",
        },
        {
          id: "4",
          name: "Salesforce Connector",
          description: "Connects to Salesforce API",
          type: "Integration",
        },
        {
          id: "5",
          name: "Data Transformer",
          description: "Transforms data between formats",
          type: "Processor",
        },
      ]);
    } finally {
      setLoadingNodes(false);
    }
  };

  const toggleNodeSelection = (nodeId: string) => {
    setSelectedNodeIds((prev) =>
      prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedNodes = availableNodes.filter((node) =>
      selectedNodeIds.includes(node.id)
    );

    const newWorkflow = {
      id: Date.now(),
      createDate: new Date()
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", ""),
      department,
      workflowName,
      description,
      nodes: selectedNodes.length,
      nodesList: selectedNodes,
      executions: Number.parseInt(executions) || 0,
      exceptions: Number.parseInt(exceptions) || 0,
      timeSaved: `${timeSaved} hrs`,
      costSaved: `$${costSaved}`,
    };

    onAddWorkflow(newWorkflow);

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setDepartment("");
    setWorkflowName("");
    setDescription("");
    setSelectedNodeIds([]);
    setExecutions("");
    setExceptions("");
    setTimeSaved("");
    setCostSaved("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <DialogTitle>Add New Workflow</DialogTitle>
            <DialogDescription>
              Enter the details for the new workflow ROI.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <div className="col-span-3">
                  <Select
                    value={department}
                    onValueChange={setDepartment}
                    required
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="workflowName" className="text-right">
                  Workflow Name
                </Label>
                <Input
                  id="workflowName"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Select Nodes</Label>
                <div className="col-span-3 border rounded-md p-3">
                  {loadingNodes ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Loading nodes...
                      </span>
                    </div>
                  ) : nodesError ? (
                    <div className="text-red-500 py-2">{nodesError}</div>
                  ) : availableNodes.length === 0 ? (
                    <div className="text-muted-foreground py-2">
                      No nodes available
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {availableNodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-start space-x-2 p-2 border rounded-md"
                        >
                          <Checkbox
                            id={`node-${node.id}`}
                            checked={selectedNodeIds.includes(node.id)}
                            onCheckedChange={() => toggleNodeSelection(node.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`node-${node.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {node.name}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              {node.description}
                            </p>
                            <div className="text-xs bg-muted inline-block px-2 py-0.5 rounded mt-1">
                              {node.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected: {selectedNodeIds.length} nodes
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Workflow</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
