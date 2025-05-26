"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SurveyBannerProps {
  isPipelineFullyCompleted: boolean;
}

export function SurveyBanner({ isPipelineFullyCompleted }: SurveyBannerProps) {
  return (
    <div className="mb-6 bg-muted p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg font-medium text-foreground">
            Help Us Improve Your Workflow
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete our workflow survey to help us automate your processes
          </p>
        </div>
        {!isPipelineFullyCompleted ? (
          <Link href="/surveys/new">
            <Button>Start Workflow Survey</Button>
          </Link>
        ) : (
          <Button disabled>Survey Completed</Button>
        )}
      </div>
    </div>
  );
}
