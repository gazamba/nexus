"use client";

interface TableHeaderProps {
  children: React.ReactNode;
}

function SortIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 ml-1"
    >
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
      <div className="flex items-center">
        {children}
        <SortIcon />
      </div>
    </th>
  );
}
