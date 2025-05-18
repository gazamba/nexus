import { NodesList } from "@/components/nodes/list";

export const dynamic = "force-dynamic";

export default function NodesPage() {
  return (
    <div className="mx-auto">
      <p className="mb-6">
        Manage your Nodes - reusable components for your workflows.
      </p>
      <NodesList />
    </div>
  );
}
