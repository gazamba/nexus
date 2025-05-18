"use client";

interface CredentialsManagerProps {
  clientId: string;
}

export function CredentialsManager({ clientId }: CredentialsManagerProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Credentials Manager</h1>
        <div className="bg-card p-6 rounded-md border">
          <p className="text-muted-foreground">
            Manage your API credentials and integrations here.
          </p>
        </div>
      </main>
    </div>
  );
}
