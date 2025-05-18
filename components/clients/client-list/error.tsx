"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Error() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium mb-2">Client not found</h2>
        <p className="text-gray-500 mb-4">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/clients">
          <Button>Back to Clients</Button>
        </Link>
      </div>
    </div>
  );
}
