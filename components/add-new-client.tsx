"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export function AddNewClient() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([
    { name: "Select SE", email: "email@example.com" },
  ]);

  const addDepartment = () => {
    if (departmentInput.trim()) {
      setDepartments([...departments, departmentInput]);
      setDepartmentInput("");
    }
  };

  const removeDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const addUser = () => {
    setUsers([
      ...users,
      {
        name: "",
        email: "",
        phone: "",
        department: "",
        exceptions: [],
        access: [],
      },
    ]);
  };

  const addEngineer = () => {
    setEngineers([...engineers, { name: "Select SE", email: "" }]);
  };

  const removeEngineer = (index: number) => {
    setEngineers(engineers.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Clients</span>
            </Button>
          </Link>
          <h1 className="text-xl font-medium">Add New Client</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Notifications</span>
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
              className="h-5 w-5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
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
              className="h-4 w-4"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium mb-1"
                >
                  Company Name*
                </label>
                <Input id="company-name" placeholder="Enter company name" />
              </div>
              <div>
                <label
                  htmlFor="company-url"
                  className="block text-sm font-medium mb-1"
                >
                  Company URL*
                </label>
                <Input id="company-url" placeholder="https://" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Manage Departments</h3>
              <div className="space-y-2">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={dept} readOnly />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDepartment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Department name"
                    value={departmentInput}
                    onChange={(e) => setDepartmentInput(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDepartment(departments.length - 1)}
                    className="text-red-500 hover:text-red-700 invisible"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addDepartment}
                >
                  + Add Department
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4">Users</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Exceptions
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Access
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2">
                      <Input placeholder="Full name" className="h-9" />
                    </td>
                    <td className="px-4 py-2">
                      <Input placeholder="Email" className="h-9" />
                    </td>
                    <td className="px-4 py-2">
                      <Input placeholder="Phone" className="h-9" />
                    </td>
                    <td className="px-4 py-2">
                      <Select>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept, index) => (
                            <SelectItem key={index} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="email" />
                        <label htmlFor="email" className="text-sm">
                          Email
                        </label>
                        <Checkbox id="sms" />
                        <label htmlFor="sms" className="text-sm">
                          SMS
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Checkbox id="billing-access" />
                          <label htmlFor="billing-access" className="text-sm">
                            Billing Access
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="admin-access" />
                          <label htmlFor="admin-access" className="text-sm">
                            Admin Access
                          </label>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Button variant="outline" className="mt-4" onClick={addUser}>
              + Add User
            </Button>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium mb-4">
              Assign Solutions Engineers
            </h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {engineers.map((engineer, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">
                        <Select defaultValue={engineer.name}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select SE" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Jane Smith">
                              Jane Smith
                            </SelectItem>
                            <SelectItem value="Alex Johnson">
                              Alex Johnson
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          value={engineer.email}
                          readOnly
                          className="h-9"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEngineer(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" className="mt-4" onClick={addEngineer}>
              + Add Solutions Engineer
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/clients">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button className="bg-black text-white">Create Client</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
