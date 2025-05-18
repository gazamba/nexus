"use client";

import { Building, Users, FileText, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/types";
import { useRouter } from "next/navigation";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  const router = useRouter();

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/clients/${client.id}`)}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
              <Building className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg flex items-center">
                {client.name}
                <ArrowUpRight className="h-4 w-4 ml-2 text-gray-400" />
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={client.active === true ? "default" : "secondary"}
                  className={
                    client.active === true
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {client.active === true ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm">123 Users</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-sm">123 Documents</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 9a3 3 0 0 1 0-6h20a3 3 0 0 1 0 6H2Z" />
              <path d="M2 15a3 3 0 0 0 0 6h20a3 3 0 0 0 0-6H2Z" />
              <path d="M6 9v6" />
              <path d="M18 9v6" />
            </svg>
            <span className="text-sm">123 Workflows</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
