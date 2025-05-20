"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function AddClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const clientData = {
      name: formData.get("name"),
      url: formData.get("url"),
      industry: formData.get("industry"),
      description: formData.get("description"),
    };

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create client");
      }

      toast({
        title: "Client created",
        description: "The client has been created successfully.",
      });

      router.refresh();
      router.push("/clients");
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Client</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <Label htmlFor="url">Company Website</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                placeholder="e.g., Technology, Healthcare, Finance"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter company description"
                rows={4}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Client"}
          </Button>
        </form>
      </main>
    </div>
  );
}
