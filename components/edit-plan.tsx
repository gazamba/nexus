"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Plan } from "@/types/types";
import { Loading } from "./ui/loading";

interface PlanFormData {
  name: string;
  pricingModel: string;
  creditPerPeriod: number;
  pricePerCredit: number;
  productUsageApi: string;
  contractLength: string;
  paymentCadence: string;
  setupFee: number;
  prepaymentPercentage: number;
  capAmount: number;
  overageCost: number;
}

export function EditPlan({ planId }: { planId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState<PlanFormData>({
    name: "",
    pricingModel: "fixed",
    creditPerPeriod: 0,
    pricePerCredit: 0,
    productUsageApi: "air-direct",
    contractLength: "month",
    paymentCadence: "monthly",
    setupFee: 0,
    prepaymentPercentage: 0,
    capAmount: 0,
    overageCost: 0,
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plans?id=${planId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch plan");
        }
        const plan: Plan = await response.json();
        setFormData({
          name: plan.name,
          pricingModel: plan.pricingModel,
          creditPerPeriod: plan.creditPerPeriod,
          pricePerCredit: plan.pricePerCredit,
          productUsageApi: plan.productUsageApi,
          contractLength: plan.contractLength,
          paymentCadence: plan.paymentCadence,
          setupFee: plan.setupFee,
          prepaymentPercentage: plan.prepaymentPercentage,
          capAmount: plan.capAmount,
          overageCost: plan.overageCost,
        });
      } catch (error) {
        toast.error("Failed to load plan details");
        router.push("/subscriptions");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchPlan();
  }, [planId, router]);

  const handleCancel = () => {
    router.push("/subscriptions");
  };

  const handleInputChange = (
    field: keyof PlanFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/plans?id=${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update plan");
      }

      toast.success("Plan updated successfully");
      router.push("/subscriptions");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return <Loading text="Loading plan details..." />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold mb-6">Edit Plan</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-card p-8 rounded-md border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Plan Name</Label>
                <Input
                  placeholder="Enter plan name"
                  className="w-full mt-2"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Pricing Model</Label>
                <Select
                  value={formData.pricingModel}
                  onValueChange={(value) =>
                    handleInputChange("pricingModel", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Credit per period</Label>
                <Input
                  type="number"
                  placeholder="Credit per period"
                  className="w-full mt-2"
                  value={formData.creditPerPeriod}
                  onChange={(e) =>
                    handleInputChange("creditPerPeriod", Number(e.target.value))
                  }
                  required
                />
              </div>

              <div>
                <Label>Price per credit</Label>
                <Input
                  type="number"
                  placeholder="$"
                  className="w-full mt-2"
                  value={formData.pricePerCredit}
                  onChange={(e) =>
                    handleInputChange("pricePerCredit", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Product Usage API</Label>
                <Select
                  value={formData.productUsageApi}
                  onValueChange={(value) =>
                    handleInputChange("productUsageApi", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air-direct">AIR Direct</SelectItem>
                    <SelectItem value="credit-card">Nexus Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Contract Length</Label>
                <Select
                  value={formData.contractLength}
                  onValueChange={(value) =>
                    handleInputChange("contractLength", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label>Payment Cadence</Label>
                <Select
                  value={formData.paymentCadence}
                  onValueChange={(value) =>
                    handleInputChange("paymentCadence", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select billing frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Label>Setup fee</Label>
                <Input
                  type="number"
                  placeholder="$"
                  className="w-full mt-2"
                  value={formData.setupFee}
                  onChange={(e) =>
                    handleInputChange("setupFee", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <Label>Prepayment %</Label>
                <Input
                  type="number"
                  placeholder="Prepayment percentage"
                  className="w-full mt-2"
                  value={formData.prepaymentPercentage}
                  onChange={(e) =>
                    handleInputChange(
                      "prepaymentPercentage",
                      Number(e.target.value)
                    )
                  }
                  required
                />
              </div>

              <div className="relative">
                <Label>Cap Amount</Label>
                <Input
                  type="number"
                  placeholder="$"
                  className="w-full mt-2"
                  value={formData.capAmount}
                  onChange={(e) =>
                    handleInputChange("capAmount", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <Label>Overage Cost</Label>
                <Input
                  type="number"
                  placeholder="$"
                  className="w-full mt-2"
                  value={formData.overageCost}
                  onChange={(e) =>
                    handleInputChange("overageCost", Number(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loading size="sm" text="Saving..." />
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
