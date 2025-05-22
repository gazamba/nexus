"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Client, Plan } from "@/types/types";
import { Loading } from "./ui/loading";

interface PlanWithClientCount extends Plan {
  clientCount: number;
}

export function PlanManager() {
  const router = useRouter();
  const [plans, setPlans] = useState<PlanWithClientCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch("/api/plans/clients");
      if (response.ok) {
        const data = await response.json();
        console.log("Plans data:", data);
        console.log("First plan example:", data[0]);
        setPlans(data);
      } else {
        console.error("Failed to fetch plans:", response.statusText);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const handleAddPlan = () => {
    router.push("/subscriptions/add");
  };

  const handleEditPlan = (planId: string) => {
    router.push(`/subscriptions/edit/${planId}`);
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        const response = await fetch(`/api/plans?id=${planId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the deleted plan from the state
          setPlans(plans.filter((plan) => plan.id !== planId));
        } else {
          console.error("Failed to delete plan:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Plan Manager</h2>
          <Button className="bg-black text-white" onClick={handleAddPlan}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          {loading ? (
            <Loading text="Loading plans..." />
          ) : (
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
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => (
                  <tr key={index} className="border-t hover:bg-muted/20">
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(plan.pricingModel)}
                    </TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(plan.contractLength)}
                    </TableCell>
                    <TableCell>
                      {capitalizeFirstLetter(plan.paymentCadence)}
                    </TableCell>
                    <TableCell>${plan.setupFee.toLocaleString()}</TableCell>
                    <TableCell>{plan.prepaymentPercentage}%</TableCell>
                    <TableCell>${plan.capAmount.toLocaleString()}</TableCell>
                    <TableCell>${plan.overageCost.toLocaleString()}</TableCell>
                    <TableCell>{plan.clientCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPlan(plan.id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm">{children}</td>;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
