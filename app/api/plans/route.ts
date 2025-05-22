import { NextResponse } from "next/server";
import {
  createPlan,
  deletePlan,
  getPlans,
  getPlanById,
  updatePlan,
} from "@/lib/services/plan-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const plan = await getPlanById(id);
      return NextResponse.json(plan);
    }

    const plans = await getPlans();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      name,
      pricingModel,
      contractLength,
      paymentCadence,
      setupFee,
      prepaymentPercentage,
      capAmount,
      overageCost,
      creditPerPeriod,
      pricePerCredit,
      productUsageApi,
    } = await request.json();
    const plan = await createPlan({
      name: name,
      pricing_model: pricingModel,
      contract_length: contractLength,
      payment_cadence: paymentCadence,
      setup_fee: setupFee,
      prepayment_percentage: prepaymentPercentage,
      cap_amount: capAmount,
      overage_cost: overageCost,
      credit_per_period: creditPerPeriod,
      price_per_credit: pricePerCredit,
      product_usage_api: productUsageApi,
    });
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const plan = await updatePlan(id, body);
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    await deletePlan(id);
    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
