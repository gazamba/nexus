"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultDisplay } from "@/components/node-tester/result-display";
import { LogsDisplay } from "@/components/node-tester/logs-display";

interface TestResultsProps {
  result: any;
  error: string | null;
  logs: any[];
  node: any;
}

export function TestResults({ result, error, logs, node }: TestResultsProps) {
  if (!result && !error && logs.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue="result">
      <TabsList>
        <TabsTrigger value="result">Result</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>

      <TabsContent value="result">
        <ResultDisplay result={result} error={error} node={node} />
      </TabsContent>

      <TabsContent value="logs">
        <LogsDisplay logs={logs} />
      </TabsContent>
    </Tabs>
  );
}
