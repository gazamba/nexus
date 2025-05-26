"use client";

import { useNodeForm } from "./context";

export function Tabs() {
  const { formData, setFormData } = useNodeForm();

  const setActiveTab = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData({
      ...formData,
      activeTab: tab,
    });
  };

  return (
    <div className="flex space-x-4 border-b">
      <button
        type="button"
        className={`pb-2 px-1 ${
          formData.activeTab === "inputs"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        }`}
        onClick={setActiveTab("inputs")}
      >
        Inputs
      </button>
      <button
        type="button"
        className={`pb-2 px-1 ${
          formData.activeTab === "code"
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        }`}
        onClick={setActiveTab("code")}
      >
        Code
      </button>
    </div>
  );
}
