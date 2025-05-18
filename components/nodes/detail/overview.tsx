"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Node } from "@/types/types";
import { Description } from "./overview/description";
import { Details } from "./overview/details";

interface OverviewProps {
  node: Node;
}

export function Overview({ node }: OverviewProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Description description={node.description} />
          <Details
            type={node.type}
            isPublic={node.is_public}
            createdAt={node.created_at}
            updatedAt={node.updated_at}
          />
        </div>
      </CardContent>
    </Card>
  );
}
