"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CredentialField {
  id: string;
  label: string;
  type: "text" | "password" | "url";
  value: string;
  placeholder?: string;
  required?: boolean;
  masked?: boolean;
}

export interface ServiceCredentials {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  fields: CredentialField[];
}

interface CredentialFormProps {
  service: ServiceCredentials | null;
  onSave: (serviceId: string, fields: CredentialField[]) => void;
  className?: string;
}

export function CredentialForm({
  service,
  onSave,
  className,
}: CredentialFormProps) {
  const [fields, setFields] = useState<CredentialField[]>(
    service?.fields || []
  );
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (service) {
      setFields(service.fields);
      setVisibleFields(new Set());
    }
  }, [service]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const toggleFieldVisibility = (fieldId: string) => {
    const newVisible = new Set(visibleFields);
    if (newVisible.has(fieldId)) {
      newVisible.delete(fieldId);
    } else {
      newVisible.add(fieldId);
    }
    setVisibleFields(newVisible);
  };

  const handleSave = () => {
    if (service) {
      onSave(service.id, fields);
    }
  };

  if (!service) {
    return (
      <Card className={cn("flex-1", className)}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">Select a service</div>
            <div className="text-gray-500">
              Choose a third-party service to manage its credentials
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("flex-1", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 flex items-center justify-center">
              {service.icon}
            </div>
            <CardTitle className="text-xl">
              {service.name} Credentials
            </CardTitle>
          </div>
          {service.connected && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label
              htmlFor={field.id}
              className="text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type={
                  field.type === "password" && !visibleFields.has(field.id)
                    ? "password"
                    : "text"
                }
                value={field.value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="pr-10"
              />
              {field.type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => toggleFieldVisibility(field.id)}
                >
                  {visibleFields.has(field.id) ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="bg-black text-white hover:bg-gray-800"
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
