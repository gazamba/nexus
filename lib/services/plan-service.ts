import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/database.types";

type Plan = Database["public"]["Tables"]["plan"]["Row"];
type PlanInsert = Database["public"]["Tables"]["plan"]["Insert"];
type PlanUpdate = Database["public"]["Tables"]["plan"]["Update"];

const supabase = createClient();

export async function getPlans(): Promise<(Plan & { clientCount: number })[]> {
  const { data: plans, error: plansError } = await supabase.from("plan")
    .select(`
      *,
      client_plan!inner (
        client_id
      )
    `);

  if (plansError) {
    throw new Error(`Error fetching plans: ${plansError.message}`);
  }

  const plansWithClientCount = plans.map((plan) => {
    const clientCount = plan.client_plan?.length || 0;

    return {
      ...plan,
      clientCount,
    };
  });

  return plansWithClientCount;
}

export async function getPlanById(id: string): Promise<Plan | null> {
  const { data, error } = await supabase
    .from("plan")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching plan: ${error.message}`);
  }

  return data;
}

export async function createPlan(plan: PlanInsert): Promise<Plan> {
  const { data, error } = await supabase
    .from("plan")
    .insert(plan)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating plan: ${error.message}`);
  }

  return data;
}

export async function updatePlan(id: string, plan: PlanUpdate): Promise<Plan> {
  const { data, error } = await supabase
    .from("plan")
    .update(plan)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating plan: ${error.message}`);
  }

  return data;
}

export async function deletePlan(id: string): Promise<void> {
  const { error } = await supabase.from("plan").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting plan: ${error.message}`);
  }
}
