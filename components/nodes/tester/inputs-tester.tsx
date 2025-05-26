"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NodeInput } from "@/types/types";
import { Node } from "@/types/types";
import { Loading } from "@/components/ui/loading";

interface NodeInputsTesterProps {
  node: Node | null;
  nodeInputs: NodeInput[];
  onTest: (values: Record<string, any>) => void;
  isLoading?: boolean;
}

export function NodeInputsTester({
  node,
  nodeInputs,
  onTest,
  isLoading = false,
}: NodeInputsTesterProps) {
  const [testNodeInputs, setTestNodeInputs] = useState<NodeInput[]>([]);
  const [testValues, setTestValues] = useState<Record<string, any>>({});
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!hasLoadedOnce) {
      const timeout = setTimeout(() => {
        setTestNodeInputs(nodeInputs);
        const initial: Record<string, any> = {};
        nodeInputs.forEach((input) => {
          initial[input.name] = input.value ?? "";
        });
        setTestValues(initial);
        setHasLoadedOnce(true);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setTestNodeInputs(nodeInputs);
      const initial: Record<string, any> = {};
      nodeInputs.forEach((input) => {
        initial[input.name] = input.value ?? "";
      });
      setTestValues(initial);
    }
  }, [nodeInputs, hasLoadedOnce]);

  const handleChange = (name: string, value: any) => {
    setTestValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFieldChange = (
    idx: number,
    field: keyof NodeInput,
    value: any
  ) => {
    setTestNodeInputs((inputs) =>
      inputs.map((inp, i) => (i === idx ? { ...inp, [field]: value } : inp))
    );
    if (field === "name") {
      setTestValues((prev) => {
        const newValues = { ...prev };
        delete newValues[testNodeInputs[idx].name];
        newValues[value] = prev[testNodeInputs[idx].name] ?? "";
        return newValues;
      });
    }
  };

  const handleAddInput = () => {
    setTestNodeInputs((inputs) => [
      ...inputs,
      {
        id: "",
        node_id: "",
        name: "",
        type: "string",
        value: "",
      } as any,
    ]);
  };

  return (
    <>
      {isLoading ? (
        <Loading size="md" />
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onTest(testValues);
            }}
            className="space-y-4"
          >
            {testNodeInputs.map((input, idx) => (
              <div
                key={input.id || idx}
                className={`flex items-center gap-2${
                  idx === testNodeInputs.length - 1 ? " mb-2" : ""
                }`}
              >
                <Input
                  value={input.name}
                  onChange={(e) =>
                    handleInputFieldChange(idx, "name", e.target.value)
                  }
                  placeholder="Input name"
                  className="w-1/3"
                />
                <select
                  value={input.type}
                  onChange={(e) =>
                    handleInputFieldChange(idx, "type", e.target.value)
                  }
                  className="w-1/3 border rounded px-3 py-2"
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="object">object</option>
                  <option value="array">array</option>
                  <option value="boolean">boolean</option>
                </select>
                <Input
                  value={testValues[input.name] ?? ""}
                  onChange={(e) => handleChange(input.name, e.target.value)}
                  placeholder="Value"
                  type={input.type === "number" ? "number" : "text"}
                  className="w-1/3"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInput}
              >
                Add Input
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loading size="sm" />
                    Running...
                  </span>
                ) : (
                  "Test Node"
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}
