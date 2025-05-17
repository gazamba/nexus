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

export function AddNewPlan() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/subscriptions");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-medium">Add New Plan</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto bg-card p-8 rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input placeholder="Enter plan name" className="w-full" />
            </div>

            <div>
              <Select defaultValue="fixed">
                <SelectTrigger>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input placeholder="Contract length" className="w-full" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
              <Input placeholder="Setup fee" className="pl-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Select defaultValue="air-direct">
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air-direct">AIR Direct</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select defaultValue="month">
                <SelectTrigger>
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
              <Select defaultValue="monthly">
                <SelectTrigger>
                  <SelectValue placeholder="Select billing frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
              <Input placeholder="Prepayment amount" className="pl-6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <Input placeholder="Prepayment percentage" className="pr-6" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-muted-foreground">%</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
              <Input placeholder="Cap amount" className="pl-6" />
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
              <Input placeholder="Overage cost" className="pl-6" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button>Create Plan</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
