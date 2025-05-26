import { createClient } from "@/utils/supabase/client";
import { NodeDetail } from "@/components/nodes/detail";

export default async function NodeDetailPage({
  params,
}: {
  params: { nodeId: string };
}) {
  const { nodeId } = params;
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;

  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User not authenticated</h1>
        <p>Please login to continue.</p>
      </div>
    );
  }

  const { data: node } = await supabase
    .from("node")
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
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-6">{node.name}</h1>
      <NodeDetail node={node} />
    </div>
  );
}
