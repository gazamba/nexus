"use client";

import { CredentialsManager } from "@/components/credentials";
import { useAuth } from "@/contexts/auth-provider";
import { getClientId } from "@/lib/services/client-service";
import { useEffect, useState } from "react";

export default function CredentialsPage() {
  const [clientId, setClientId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchClientId = async () => {
      if (!user?.id) return;
      const clientId = await getClientId(user.id);
      setClientId(clientId);
    };
    fetchClientId();
  }, [user?.id]);

  return (
    <div className="flex h-screen bg-background">
      {clientId && <CredentialsManager clientId={clientId} />}
    </div>
  );
}
