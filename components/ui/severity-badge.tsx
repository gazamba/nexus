import React from "react";

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

const severityStyles: Record<string, string> = {
  Critical: "bg-red-100 text-red-600",
  High: "bg-orange-100 text-orange-600",
  Medium: "bg-yellow-100 text-yellow-600",
  Low: "bg-green-100 text-green-600",
};

const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className = "",
}) => (
  <span
    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
      severityStyles[severity] || "bg-gray-100 text-gray-600"
    } ${className}`}
  >
    {severity}
  </span>
);

export default SeverityBadge;
