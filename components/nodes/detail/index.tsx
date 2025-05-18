"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Node } from "@/types/types";
import { Header } from "./header";
import { Overview } from "./overview";
import { Code } from "./code";
import { Inputs } from "./inputs";

interface NodeDetailProps {
  node: Node;
}

export function NodeDetail({ node }: NodeDetailProps) {
  return (
    <div>
      <Header nodeId={node.id} />

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Overview node={node} />
        </TabsContent>

        <TabsContent value="code">
          <Code node={node} />
        </TabsContent>

        <TabsContent value="inputs">
          <Inputs node={node} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
