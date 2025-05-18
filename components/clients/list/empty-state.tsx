"use client";

import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="text-center py-12 border rounded-lg">
      <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium mb-2">No clients found</h3>
      <p className="text-gray-500 mb-4">
        Try adjusting your search or add a new client
      </p>
      <Link href="/clients/add">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </Link>
    </div>
  );
}
