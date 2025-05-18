"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Header } from "./header";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { FormActions } from "./form-actions";

export function AddNewPlan() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    billing_cycle: "monthly",
    trial_period: "",
    trial_period_unit: "days",
    setup_fee: "",
    cancellation_fee: "",
    refund_policy: "",
    discount_percentage: "",
    discount_duration: "",
    discount_duration_unit: "months",
  });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const supabase = createClient();

      const { error } = await supabase.from("plans").insert([
        {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          currency: formData.currency,
          billing_cycle: formData.billing_cycle,
          trial_period: formData.trial_period
            ? parseInt(formData.trial_period)
            : null,
          trial_period_unit: formData.trial_period_unit,
          setup_fee: formData.setup_fee ? parseFloat(formData.setup_fee) : null,
          cancellation_fee: formData.cancellation_fee
            ? parseFloat(formData.cancellation_fee)
            : null,
          refund_policy: formData.refund_policy,
          discount_percentage: formData.discount_percentage
            ? parseFloat(formData.discount_percentage)
            : null,
          discount_duration: formData.discount_duration
            ? parseInt(formData.discount_duration)
            : null,
          discount_duration_unit: formData.discount_duration_unit,
        },
      ]);

      if (error) throw error;

      router.push("/plans");
      router.refresh();
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <Header />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Plan Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter plan name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter plan description"
                rows={3}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Price</label>
              <CurrencyInput
                placeholder="Enter price"
                value={formData.price}
                onChange={(value) => setFormData({ ...formData, price: value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <select
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Billing Cycle</label>
              <select
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.billing_cycle}
                onChange={(e) =>
                  setFormData({ ...formData, billing_cycle: e.target.value })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trial Period</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.trial_period}
                  onChange={(e) =>
                    setFormData({ ...formData, trial_period: e.target.value })
                  }
                  placeholder="Enter trial period"
                />
                <select
                  className="mt-1 block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.trial_period_unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trial_period_unit: e.target.value,
                    })
                  }
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Setup Fee</label>
              <CurrencyInput
                placeholder="Enter setup fee"
                value={formData.setup_fee}
                onChange={(value) =>
                  setFormData({ ...formData, setup_fee: value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cancellation Fee</label>
              <CurrencyInput
                placeholder="Enter cancellation fee"
                value={formData.cancellation_fee}
                onChange={(value) =>
                  setFormData({ ...formData, cancellation_fee: value })
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Refund Policy</label>
              <textarea
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.refund_policy}
                onChange={(e) =>
                  setFormData({ ...formData, refund_policy: e.target.value })
                }
                placeholder="Enter refund policy"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Discount Percentage</label>
              <PercentageInput
                placeholder="Enter discount percentage"
                value={formData.discount_percentage}
                onChange={(value) =>
                  setFormData({ ...formData, discount_percentage: value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Discount Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.discount_duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_duration: e.target.value,
                    })
                  }
                  placeholder="Enter discount duration"
                />
                <select
                  className="mt-1 block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.discount_duration_unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_duration_unit: e.target.value,
                    })
                  }
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={isSubmitting ? "Creating..." : "Create Plan"}
        />
      </div>
    </div>
  );
}
