import { EditPlan } from "@/components/edit-plan";

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  return (
    <div className="flex h-screen bg-background">
      <EditPlan planId={planId} />
    </div>
  );
}
