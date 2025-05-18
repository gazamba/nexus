"use client";

import { AddNewClientHeader } from "./header";
import { CompanyInfo } from "./company-info";
import { DepartmentsManager } from "./departments-manager";
import { UsersTable } from "./users-table";

export function AddNewClient() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AddNewClientHeader />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <CompanyInfo />
            <DepartmentsManager />
          </div>
          <UsersTable />
        </div>
      </main>
    </div>
  );
}
