"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddNewClient() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Client</h1>
        <form className="max-w-2xl space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" placeholder="Enter company name" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter company description"
                rows={4}
              />
            </div>
          </div>
          <Button type="submit">Create Client</Button>
        </form>
      </main>
    </div>
  );
}
