"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Play, ArrowLeft } from "lucide-react";

export function NodeDetail({ node }: { node: any }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link href="/nodes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Nodes
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/nodes/${node.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Node
            </Button>
          </Link>
          <Link href={`/nodes/${node.id}/test`}>
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Test Node
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {node.description || "No description provided."}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium">{node.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Public</dt>
                      <dd className="font-medium">
                        {node.is_public ? "Yes" : "No"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Created</dt>
                      <dd className="font-medium">
                        {node.created_at
                          ? new Date(node.created_at).toLocaleDateString()
                          : "Unknown"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Last Updated</dt>
                      <dd className="font-medium">
                        {node.updated_at
                          ? new Date(node.updated_at).toLocaleDateString()
                          : "Unknown"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardContent className="pt-6">
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 font-mono text-sm">
                {node.code}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs">
          <Card>
            <CardContent className="pt-6">
              {node.inputs && node.inputs.length > 0 ? (
                <div className="space-y-4">
                  {node.inputs.map((input: any, index: number) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">{input.name}</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Type</dt>
                          <dd className="font-medium">{input.type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Required</dt>
                          <dd className="font-medium">
                            {input.required ? "Yes" : "No"}
                          </dd>
                        </div>
                      </dl>
                      {input.description && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">
                            Description
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {input.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No inputs defined for this node.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
