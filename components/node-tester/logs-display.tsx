"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogsDisplayProps {
  logs: any[];
}

export function LogsDisplay({ logs }: LogsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded-md text-sm font-mono ${
                  log.level === "error"
                    ? "bg-red-50 text-red-700"
                    : log.level === "warn"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{log.timestamp}</span>
                  <span className="font-medium">{log.level.toUpperCase()}</span>
                </div>
                <p className="mt-1">{log.message}</p>
                {log.data && (
                  <pre className="mt-2 p-2 bg-white/50 rounded text-xs">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No logs available.</p>
        )}
      </CardContent>
    </Card>
  );
}
