import { createClient } from "@/utils/supabase/server";
import { NodeTester } from "@/components/nodes/tester";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TestNodePage({
  params,
}: {
  params: { nodeId: string };
}) {
  const supabase = await createClient();
  const { nodeId } = await params;
  const { data: node, error } = await supabase
    .from("node")
    .select("*")
    .eq("id", nodeId)
    .single();

  if (error || !node) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link href="/nodes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Nodes
            </Button>
          </Link>
        </div>
        <NodeTester node={node} />
      </div>
    </div>
  );
}
