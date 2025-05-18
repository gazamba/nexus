"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkflowROI() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow ROI Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will show ROI analysis for your workflows.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
