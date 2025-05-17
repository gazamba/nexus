"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Building,
  Users,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Client } from "@/types/types";

export function ClientsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const clients = await fetch("/api/clients").then((res) => res.json());
      setClients(clients);
      setLoading(false);
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [clients, searchQuery]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <Link href="/clients/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search clients by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <Card
                key={client.id}
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
                            variant={
                              client.active === true ? "default" : "secondary"
                            }
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
            ))
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
