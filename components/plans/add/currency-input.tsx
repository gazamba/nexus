"use client";

import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function CurrencyInput({
  placeholder,
  value,
  onChange,
}: CurrencyInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span className="text-muted-foreground">$</span>
      </div>
      <Input
        placeholder={placeholder}
        className="pl-6"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
