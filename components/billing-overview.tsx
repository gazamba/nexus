"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export function BillingOverview() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto">
        <h2 className="text-2xl font-semibold mb-6">Billing Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm text-gray-500 mb-2">Current Plan</h3>
              <div className="text-xl font-semibold mb-1">Enterprise</div>
              <div className="text-sm text-gray-600">$2,000/month base fee</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm text-gray-500 mb-2">Credits Remaining</h3>
              <div className="text-xl font-semibold mb-1">8,450</div>
              <div className="text-sm text-gray-600">Renews on May 1, 2025</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm text-gray-500 mb-2">
                SE Hours This Month
              </h3>
              <div className="text-xl font-semibold mb-1">12.5 / 20</div>
              <div className="text-sm text-gray-600">7.5 hours remaining</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Usage Summary</h3>
                <Link
                  href="/billing/detailed-report"
                  className="text-blue-500 text-sm flex items-center"
                >
                  View detailed report <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">API Calls</span>
                  <span className="font-medium">245,678</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="font-medium">1.2 TB</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-medium">127</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Invoices</h3>
                <Link
                  href="/billing/invoices"
                  className="text-blue-500 text-sm flex items-center"
                >
                  View all invoices <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                <InvoiceItem
                  month="April"
                  year="2025"
                  number="2025-04"
                  amount="$2,450.00"
                />
                <InvoiceItem
                  month="March"
                  year="2025"
                  number="2025-03"
                  amount="$2,450.00"
                />
                <InvoiceItem
                  month="February"
                  year="2025"
                  number="2025-02"
                  amount="$2,450.00"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Billing Actions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Payment Method</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gray-900 text-white p-1 rounded w-8 h-6 flex items-center justify-center text-xs">
                    VISA
                  </div>
                  <div>
                    <div className="text-sm">Visa ending in 4242</div>
                    <div className="text-xs text-gray-500">Expires 12/25</div>
                  </div>
                </div>
                <Button variant="link" className="text-blue-500 p-0 h-auto">
                  Update payment method
                </Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Need Help?</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-center">
                    Download Contract
                  </Button>
                  <Button className="w-full justify-center bg-black text-white">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function InvoiceItem({
  month,
  year,
  number,
  amount,
}: {
  month: string;
  year: string;
  number: string;
  amount: string;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <div>
        <div className="font-medium">
          {month} {year}
        </div>
        <div className="text-sm text-gray-500">Invoice #{number}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{amount}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
