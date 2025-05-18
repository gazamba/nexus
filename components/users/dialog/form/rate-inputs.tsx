"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function RateInputs() {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="cost-rate">Hourly Rate: Cost</Label>
        <Input id="cost-rate" placeholder="$0/hr" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bill-rate">Hourly Rate: Billable</Label>
        <Input id="bill-rate" placeholder="$0/hr" required />
      </div>
    </>
  );
}
