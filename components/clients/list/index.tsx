"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Client } from "@/types/types";
import { SearchBar } from "./search";
import { ClientCard } from "./client-card";
import { LoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";

export function ClientsList() {
  const [searchQuery, setSearchQuery] = useState("");
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

  if (loading) {
    return <LoadingState />;
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
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="grid gap-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
