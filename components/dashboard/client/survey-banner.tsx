"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SurveyBannerProps {
  isInitialSurveyCompleted: boolean;
}

export function SurveyBanner({ isInitialSurveyCompleted }: SurveyBannerProps) {
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
        {isInitialSurveyCompleted ? (
          <Button disabled>Pipeline is already in progress</Button>
        ) : (
          <Link href="/survey">
            <Button>Start Workflow Survey</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
