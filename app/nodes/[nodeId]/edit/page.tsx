import { NodeForm } from "@/components/nodes/node-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EditNodePage({
  params,
}: {
  params: Promise<{ nodeId: string }>;
}) {
  const { nodeId } = await params;

  return (
    <div className="p-6 flex flex-col gap-4">
      <Link href="/nodes">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Nodes
        </Button>
      </Link>
      <NodeForm nodeId={nodeId} />
    </div>
  );
}
