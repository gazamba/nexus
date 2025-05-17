import { createClient } from "@/utils/supabase/client";
import { NodeDetail } from "@/components/node-detail";

export default async function NodeDetailPage({
  params,
}: {
  params: { nodeId: string };
}) {
  const { nodeId } = params;
  const supabase = createClient();

  const { data: node } = await supabase
    .from("nodes")
    .select("*")
    .eq("id", nodeId)
    .single();

  if (!node) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Node Not Found</h1>
        <p>The requested node could not be found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{node.name}</h1>
      <NodeDetail node={node} />
    </div>
  );
}
