"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Play, ArrowLeft } from "lucide-react";

interface HeaderProps {
  nodeId: string;
}

export function Header({ nodeId }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link href="/nodes">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Nodes
        </Button>
      </Link>
      <div className="flex gap-2">
        <Link href={`/nodes/${nodeId}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Node
          </Button>
        </Link>
        <Link href={`/nodes/${nodeId}/test`}>
          <Button variant="outline">
            <Play className="h-4 w-4 mr-2" />
            Test Node
          </Button>
        </Link>
      </div>
    </div>
  );
}
