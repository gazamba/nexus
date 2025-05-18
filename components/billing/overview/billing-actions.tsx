"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BillingActions() {
  return (
    <Card>
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
  );
}
