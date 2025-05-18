"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  hasNodes: boolean;
}

export function EmptyState({ hasNodes }: EmptyStateProps) {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-500">
        {hasNodes
          ? "No nodes match your search criteria. Try adjusting your filters."
          : "No nodes found. Create your first node to get started."}
      </p>
      {!hasNodes && (
        <div className="mt-4">
          <Link href="/nodes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Node
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
