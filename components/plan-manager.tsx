"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

// Plan data
const plans = [
  {
    name: "Enterprise Pro",
    pricingModel: "Tiered",
    contractLength: "12 months",
    billingCadence: "Monthly",
    setupFee: "$5,000",
    prepaymentPercentage: "25%",
    cap: "$100,000",
    overageCost: "$150/hr",
    clients: 12,
  },
  {
    name: "Business Plus",
    pricingModel: "Fixed",
    contractLength: "6 months",
    billingCadence: "Quarterly",
    setupFee: "$2,500",
    prepaymentPercentage: "15%",
    cap: "$50,000",
    overageCost: "$125/hr",
    clients: 28,
  },
  {
    name: "Starter",
    pricingModel: "Usage",
    contractLength: "3 months",
    billingCadence: "Monthly",
    setupFee: "$1,000",
    prepaymentPercentage: "10%",
    cap: "$25,000",
    overageCost: "$100/hr",
    clients: 45,
  },
];

export function PlanManager() {
  const router = useRouter();

  const handleAddPlan = () => {
    router.push("/subscriptions/add");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Plan Manager</h2>
          <Button className="bg-black text-white" onClick={handleAddPlan}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <TableHeader>Name</TableHeader>
                <TableHeader>Pricing Model</TableHeader>
                <TableHeader>Contract Length</TableHeader>
                <TableHeader>Billing Cadence</TableHeader>
                <TableHeader>Setup Fee</TableHeader>
                <TableHeader>Prepayment %</TableHeader>
                <TableHeader>$ Cap</TableHeader>
                <TableHeader>Overage Cost</TableHeader>
                <TableHeader># Clients</TableHeader>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={index} className="border-t hover:bg-muted/20">
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.pricingModel}</TableCell>
                  <TableCell>{plan.contractLength}</TableCell>
                  <TableCell>{plan.billingCadence}</TableCell>
                  <TableCell>{plan.setupFee}</TableCell>
                  <TableCell>{plan.prepaymentPercentage}</TableCell>
                  <TableCell>{plan.cap}</TableCell>
                  <TableCell>{plan.overageCost}</TableCell>
                  <TableCell>{plan.clients}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
      {children}
    </th>
  );
}

function TableCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
