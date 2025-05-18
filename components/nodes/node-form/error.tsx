"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
      <h2 className="text-lg font-semibold">Node not found</h2>
      <Button asChild>
        <Link href="/nodes">Back to Nodes</Link>
      </Button>
    </div>
  );
}
