"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface InvoiceItemProps {
  month: string;
  year: string;
  number: string;
  amount: string;
}

export function InvoiceItem({ month, year, number, amount }: InvoiceItemProps) {
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
