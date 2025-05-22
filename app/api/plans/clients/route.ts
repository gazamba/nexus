import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { data: plans, error: plansError } = await supabase
      .from("plan")
      .select("*");

    if (plansError) {
      throw new Error(`Error fetching plans: ${plansError.message}`);
    }

    console.log("Raw plans data from database:", plans);

    const { data: clients, error: clientsError } = await supabase
      .from("client")
      .select("id, plan_id");

    if (clientsError) {
      throw new Error(`Error fetching clients: ${clientsError.message}`);
    }

    const clientsByPlan = plans.map((plan) => {
      const clientCount = clients.filter(
        (client) => client.plan_id === plan.id
      ).length;

      console.log("Processing plan:", plan);

      return {
        name: plan.name,
        id: plan.id,
        pricingModel: plan.pricing_model,
        contractLength: plan.contract_length,
        paymentCadence: plan.payment_cadence,
        setupFee: plan.setup_fee,
        prepaymentPercentage: plan.prepayment_percentage,
        capAmount: plan.cap_amount,
        overageCost: plan.overage_cost,
        clientCount,
      };
    });

    console.log("Processed plans data:", clientsByPlan);

    return NextResponse.json(clientsByPlan);
  } catch (error) {
    console.error("Error in plans/clients route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
