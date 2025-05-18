"use client";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
