"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserTable } from "@/components/user-table";
import { PlusIcon } from "lucide-react";

export function UserManagerDashboard() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddUserOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
      <Tabs defaultValue="admin">
        <TabsList>
          <TabsTrigger
            value="admin"
            className="px-6 py-2 rounded-md"
            onClick={() => setActiveTab("admin")}
          >
            Admin Users
          </TabsTrigger>
          <TabsTrigger
            value="se"
            className="px-6 py-2 rounded-md"
            onClick={() => setActiveTab("se")}
          >
            SE Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <UserTable users={[]} />
        </TabsContent>
        <TabsContent value="se">
          <UserTable users={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
