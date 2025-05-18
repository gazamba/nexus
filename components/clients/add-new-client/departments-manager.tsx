"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export function DepartmentsManager() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentInput, setDepartmentInput] = useState("");

  const addDepartment = () => {
    if (departmentInput.trim()) {
      setDepartments([...departments, departmentInput]);
      setDepartmentInput("");
    }
  };

  const removeDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
  };

  return (
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
        <Button variant="outline" className="w-full" onClick={addDepartment}>
          + Add Department
        </Button>
      </div>
    </div>
  );
}
