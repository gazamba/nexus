"use client";

import { Input } from "@/components/ui/input";

interface PercentageInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function PercentageInput({
  placeholder,
  value,
  onChange,
}: PercentageInputProps) {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        className="pr-6"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-muted-foreground">%</span>
      </div>
    </div>
  );
}
