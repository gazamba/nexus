"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { SolutionsEngineerUser } from "@/types/types";

interface User {
  name: string;
  email: string;
  phone: string;
  department: string;
  exceptions: {
    email: boolean;
    sms: boolean;
  };
  access: {
    billing: boolean;
    admin: boolean;
  };
}

export function AddClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");
  const [description, setDescription] = useState("");

  const [users, setUsers] = useState<User[]>([
    {
      name: "",
      email: "",
      phone: "",
      department: "",
      exceptions: { email: false, sms: false },
      access: { billing: false, admin: false },
    },
  ]);

  const [solutionsEngineers, setSolutionsEngineers] = useState<
    SolutionsEngineerUser[]
  >([]);
  const [assignedSEs, setAssignedSEs] = useState<any[]>([]);
  const [selectedSE, setSelectedSE] = useState("");

  useEffect(() => {
    fetch("/api/users/se")
      .then((res) => res.json())
      .then((data) => {
        setSolutionsEngineers(data.solutionsEngineers);
      });
  }, []);

  const addDepartment = () => {
    if (departmentInput && !departments.includes(departmentInput)) {
      setDepartments([...departments, departmentInput]);
      setDepartmentInput("");
    }
  };
  const removeDepartment = (dep: string) => {
    setDepartments(departments.filter((d) => d !== dep));
    setUsers(
      users.map((u) => (u.department === dep ? { ...u, department: "" } : u))
    );
  };

  const addUser = () => {
    setUsers([
      ...users,
      {
        name: "",
        email: "",
        phone: "",
        department: "",
        exceptions: { email: false, sms: false },
        access: { billing: false, admin: false },
      },
    ]);
  };
  const removeUser = (idx: number) => {
    setUsers(users.filter((_, i) => i !== idx));
  };
  const updateUser = (idx: number, field: keyof User, value: any) => {
    setUsers(users.map((u, i) => (i === idx ? { ...u, [field]: value } : u)));
  };
  const updateUserNested = (
    idx: number,
    group: "exceptions" | "access",
    field: "email" | "sms" | "billing" | "admin",
    value: boolean
  ) => {
    setUsers(
      users.map((u, i) =>
        i === idx ? { ...u, [group]: { ...u[group], [field]: value } } : u
      )
    );
  };

  const addSE = () => {
    if (selectedSE && !assignedSEs.some((se) => se.id === selectedSE)) {
      const se = solutionsEngineers.find((se) => se.id === selectedSE);
      if (se) setAssignedSEs([...assignedSEs, se]);
    }
  };
  const removeSE = (id: string) => {
    setAssignedSEs(assignedSEs.filter((se) => se.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const clientRes = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, departments, description }),
      });
      if (!clientRes.ok) throw new Error("Failed to create client");
      const client = await clientRes.json();

      for (const user of users) {
        if (!user.email) continue;
        await fetch("/api/client-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, clientId: client.id }),
        });
      }

      for (const se of assignedSEs) {
        await fetch("/api/assign-se", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: client.id, seId: se.id }),
        });
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4 w-[1/2]">
              <Label htmlFor="name">Company Name*</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter company name"
                className="mb-4"
              />
              <Label htmlFor="url">Company URL*</Label>
              <Input
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                placeholder="https://"
                className="mb-4"
              />
            </div>
            <div className="w-1/2 bg-muted/20 rounded p-4">
              <div className="font-medium mb-2">Manage Departments</div>
              <div className="mb-4 flex flex-col">
                <Label htmlFor="department-input" className="mb-1 block">
                  Add Department
                </Label>
                <Input
                  id="department-input"
                  value={departmentInput}
                  onChange={(e) => setDepartmentInput(e.target.value)}
                  placeholder="Department name"
                  className="mb-2"
                />
                <Button
                  type="button"
                  onClick={addDepartment}
                  className="w-full"
                  variant="outline"
                >
                  + Add Department
                </Button>
                <ul className="mt-3 space-y-2">
                  {departments.map((dep) => (
                    <li
                      key={dep}
                      className="flex items-center justify-between bg-muted px-3 py-2 rounded"
                    >
                      <span>{dep}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeDepartment(dep)}
                        aria-label={`Remove ${dep}`}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium mb-2">Users</div>
            <table className="w-full border-2 mb-2 rounded-lg overflow-hidden bg-muted/20 shadow-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-medium">
                    Exceptions
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx} className="bg-white">
                    <td className="px-4 py-2">
                      <Input
                        value={user.name}
                        onChange={(e) =>
                          updateUser(idx, "name", e.target.value)
                        }
                        placeholder="Full name"
                        className="rounded-lg bg-muted/30 border border-muted w-44"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={user.email}
                        onChange={(e) =>
                          updateUser(idx, "email", e.target.value)
                        }
                        placeholder="Email"
                        className="rounded-lg bg-muted/30 border border-muted w-44"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={user.phone}
                        onChange={(e) =>
                          updateUser(idx, "phone", e.target.value)
                        }
                        placeholder="Phone"
                        className="rounded-lg bg-muted/30 border border-muted w-36"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={user.department}
                        onChange={(e) =>
                          updateUser(idx, "department", e.target.value)
                        }
                        className="rounded-lg bg-muted/30 border border-muted w-40 px-2 py-2"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dep) => (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <label className="inline-flex items-center mr-3">
                        <input
                          type="checkbox"
                          checked={user.exceptions.email}
                          onChange={(e) =>
                            updateUserNested(
                              idx,
                              "exceptions",
                              "email",
                              e.target.checked
                            )
                          }
                          className="mr-1"
                        />
                        Email
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={user.exceptions.sms}
                          onChange={(e) =>
                            updateUserNested(
                              idx,
                              "exceptions",
                              "sms",
                              e.target.checked
                            )
                          }
                          className="mr-1"
                        />
                        SMS
                      </label>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <label className="inline-flex items-center mr-3">
                        <input
                          type="checkbox"
                          checked={user.access.billing}
                          onChange={(e) =>
                            updateUserNested(
                              idx,
                              "access",
                              "billing",
                              e.target.checked
                            )
                          }
                          className="mr-1"
                        />
                        Billing Access
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={user.access.admin}
                          onChange={(e) =>
                            updateUserNested(
                              idx,
                              "access",
                              "admin",
                              e.target.checked
                            )
                          }
                          className="mr-1"
                        />
                        Admin Access
                      </label>
                    </td>
                    <td className="px-2 py-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeUser(idx)}
                        aria-label="Remove user"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button type="button" variant="outline" onClick={addUser}>
              + Add User
            </Button>
          </div>

          <div>
            <div className="font-medium mb-2">Assign Solutions Engineers</div>
            <table className="w-full border mb-2 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">
                    <select
                      id="se-select"
                      value={selectedSE}
                      onChange={(e) => setSelectedSE(e.target.value)}
                      className="rounded-lg bg-muted/30 border border-muted w-56 px-2 py-2"
                    >
                      <option value="">Select SE</option>
                      {solutionsEngineers.map((se) => (
                        <option key={se.id} value={se.id}>
                          {se.full_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground w-56">
                    {selectedSE
                      ? solutionsEngineers.find((se) => se.id === selectedSE)
                          ?.email || ""
                      : "email@example.com"}
                  </td>
                  <td className="px-4 py-2"></td>
                </tr>
                {assignedSEs.map((se) => (
                  <tr key={se.id}>
                    <td className="px-4 py-2">{se.full_name}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {se.email}
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeSE(se.id)}
                        aria-label={`Remove ${se.full_name}`}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={addSE}
                disabled={!selectedSE}
              >
                + Add Solutions Engineer
              </Button>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/clients")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
