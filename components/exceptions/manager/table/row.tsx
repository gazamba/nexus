"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "./cell";
import { ExceptionTableRowProps } from "../types";
import SeverityBadge from "@/components/ui/severity-badge";

export function ExceptionTableRow({ exception }: ExceptionTableRowProps) {
  console.log("Exception data in row:", exception);
  return (
    <tr className="border-t hover:bg-muted/20">
      <TableCell>
        {exception.datetime
          ? new Date(exception.datetime).toLocaleString()
          : "-"}
      </TableCell>
      <TableCell>{exception.clientName || "-"}</TableCell>
      <TableCell>{exception.department}</TableCell>
      <TableCell>{exception.workflowName}</TableCell>
      <TableCell>
        <div className="flex -space-x-2">
          <div className="h-6 w-6 rounded-full bg-primary border-2 border-background flex items-center justify-center text-primary-foreground text-xs">
            JD
          </div>
          <div className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-secondary-foreground text-xs">
            AS
          </div>
          <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-muted-foreground text-xs">
            +2
          </div>
        </div>
      </TableCell>
      <TableCell>{exception.exceptionType}</TableCell>
      <TableCell>
        <SeverityBadge severity={exception.severity} />
      </TableCell>
      <TableCell>{exception.remedy}</TableCell>
      <TableCell>
        <Select defaultValue={exception.status.toLowerCase()}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </tr>
  );
}
