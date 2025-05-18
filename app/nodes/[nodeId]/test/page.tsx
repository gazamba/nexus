"use client";

import { createClient } from "@/utils/supabase/client";
import { NodesSidebar } from "@/components/nodes/sidebar";
import { NodeTester } from "@/components/nodes/tester";
import { notFound } from "next/navigation";

export default async function TestNodePage({
  params,
}: {
  params: { nodeId: string };
}) {
  const supabase = createClient();

  const { data: node, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", params.nodeId)
    .single();

  if (error || !node) {
    notFound();
  }

  return (
    <div className="flex h-screen">
      <NodesSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Test Node: {node.name}</h1>
          <NodeTester node={node} />
        </div>
      </div>
    </div>
  );
}
