"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThirdPartyService {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  color?: string;
}

interface ServiceSidebarProps {
  services: ThirdPartyService[];
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
  className?: string;
}

export function ServiceSidebar({
  services,
  selectedService,
  onServiceSelect,
  className,
}: ServiceSidebarProps) {
  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Third Party Services
      </h3>
      <div className="space-y-2">
        {services.map((service) => (
          <Button
            key={service.id}
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 px-3",
              selectedService === service.id && "bg-green-50 text-green-700",
              service.connected &&
                selectedService !== service.id &&
                "bg-green-50/50"
            )}
            onClick={() => onServiceSelect(service.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  {service.icon}
                </div>
                <span className="font-medium">{service.name}</span>
              </div>
              {service.connected && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}
