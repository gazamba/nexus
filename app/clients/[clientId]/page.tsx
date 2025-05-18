import { ClientList } from "@/components/clients/client-list";

export default async function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  return (
    <div className="p-6">
      <ClientList />
    </div>
  );
}
