"use client";

import { Button } from "@/components/ui/button";
import { Home, Settings, TestTube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NodesSidebar() {
  const pathname = usePathname();
  const nodeId = pathname.split("/")[2];

  return (
    <div className="w-64 border-r bg-card">
      <div className="p-4">
        <h2 className="text-lg font-medium mb-4">Node Navigation</h2>
        <nav className="space-y-2">
          <Link href={`/nodes/${nodeId}`}>
            <Button
              variant="ghost"
              className="w-full justify-start"
              disabled={pathname === `/nodes/${nodeId}`}
            >
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
          </Link>
          <Link href={`/nodes/${nodeId}/test`}>
            <Button
              variant="ghost"
              className="w-full justify-start"
              disabled={pathname === `/nodes/${nodeId}/test`}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test
            </Button>
          </Link>
          <Link href={`/nodes/${nodeId}/settings`}>
            <Button
              variant="ghost"
              className="w-full justify-start"
              disabled={pathname === `/nodes/${nodeId}/settings`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
