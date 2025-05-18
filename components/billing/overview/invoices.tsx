"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { InvoiceItem } from "./invoice-item";

interface Invoice {
  month: string;
  year: string;
  number: string;
  amount: string;
}

interface InvoicesProps {
  invoices: Invoice[];
}

export function Invoices({ invoices }: InvoicesProps) {
  return (
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
          {invoices.map((invoice) => (
            <InvoiceItem
              key={invoice.number}
              month={invoice.month}
              year={invoice.year}
              number={invoice.number}
              amount={invoice.amount}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
