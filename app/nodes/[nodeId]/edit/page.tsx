import { NodeForm } from "@/components/nodes/node-form";

export default async function EditNodePage({
  params,
}: {
  params: { nodeId: string };
}) {
  const { nodeId } = await params;

  return (
    <div className="p-6">
      <NodeForm nodeId={nodeId} />
    </div>
  );
}
