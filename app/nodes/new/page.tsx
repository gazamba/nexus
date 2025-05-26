import { NodeForm } from "@/components/nodes/node-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewNodePage() {
  return (
    <div className="p-4 space-y-6">
      <Link href="/nodes">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Nodes
        </Button>
      </Link>
      <NodeForm />
    </div>
  );
}
