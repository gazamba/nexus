"use client";

import { PlanCard } from "./plan-card";
import { UsageSummary } from "./usage-summary";
import { Invoices } from "./invoices";
import { BillingActions } from "./billing-actions";

export function BillingOverview() {
  const usageItems = [
    { label: "API Calls", value: "245,678" },
    { label: "Storage Used", value: "1.2 TB" },
    { label: "Active Users", value: "127" },
  ];

  const recentInvoices = [
    {
      month: "April",
      year: "2025",
      number: "2025-04",
      amount: "$2,450.00",
    },
    {
      month: "March",
      year: "2025",
      number: "2025-03",
      amount: "$2,450.00",
    },
    {
      month: "February",
      year: "2025",
      number: "2025-02",
      amount: "$2,450.00",
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">Billing Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PlanCard
            title="Current Plan"
            value="Enterprise"
            subtitle="$2,000/month base fee"
          />
          <PlanCard
            title="Credits Remaining"
            value="8,450"
            subtitle="Renews on May 1, 2025"
          />
          <PlanCard
            title="SE Hours This Month"
            value="12.5 / 20"
            subtitle="7.5 hours remaining"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UsageSummary items={usageItems} />
          <Invoices invoices={recentInvoices} />
        </div>

        <BillingActions />
      </main>
    </div>
  );
}
