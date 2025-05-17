import { ClientsList } from "@/components/clients-list";

export default async function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const clientId = await params.clientId;
  return (
    <div className="flex-1 overflow-auto">
      <ClientsList clientId={clientId} />
    </div>
  );
}
