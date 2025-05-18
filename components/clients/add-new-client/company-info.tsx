"use client";

import { Input } from "@/components/ui/input";

export function CompanyInfo() {
  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="company-name"
          className="block text-sm font-medium mb-1"
        >
          Company Name*
        </label>
        <Input id="company-name" placeholder="Enter company name" />
      </div>
      <div>
        <label htmlFor="company-url" className="block text-sm font-medium mb-1">
          Company URL*
        </label>
        <Input id="company-url" placeholder="https://" />
      </div>
    </div>
  );
}
