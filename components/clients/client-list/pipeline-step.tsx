import { Check, Circle, Loader2 } from "lucide-react";
import { PipelineStep } from "./types";
import { PIPELINE_STATUS } from "./constants";

interface PipelineStepProps {
  step: PipelineStep;
  isAdminOrSE: boolean;
  isLoading: boolean;
  isGeneratingProposal: boolean;
  onMarkAsComplete: () => void;
  onGenerateProposal: () => void;
  disabled?: boolean;
}

export function PipelineStepComponent({
  step,
  isAdminOrSE,
  isLoading,
  isGeneratingProposal,
  onMarkAsComplete,
  onGenerateProposal,
  disabled = false,
}: PipelineStepProps) {
  let status = step.progress?.status || PIPELINE_STATUS.PENDING;
  if (
    step.step_name === "Discovery: Initial Survey" &&
    status !== PIPELINE_STATUS.COMPLETED
  ) {
    status = PIPELINE_STATUS.IN_PROGRESS;
  }
  const completedAt =
    step.progress && "completed_at" in step.progress
      ? step.progress.completed_at
      : undefined;

  return (
    <div className="flex items-start gap-3">
      {status === PIPELINE_STATUS.COMPLETED ? (
        <Check className="h-5 w-5 text-green-500 rounded-full bg-green-100 p-1" />
      ) : status === PIPELINE_STATUS.IN_PROGRESS ? (
        <Circle className="h-5 w-5 text-blue-500 rounded-full bg-blue-100 p-1" />
      ) : (
        <Circle className="h-5 w-5 text-gray-400" />
      )}
      <div>
        <div className="font-medium flex items-center gap-2">
          {step.step_name}
          {isAdminOrSE &&
            status === PIPELINE_STATUS.IN_PROGRESS &&
            step.step_name !== "ADA Proposal Sent" && (
              <button
                className="ml-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={onMarkAsComplete}
                disabled={isLoading || disabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Mark as Complete"
                )}
              </button>
            )}
          {isAdminOrSE &&
            status === PIPELINE_STATUS.IN_PROGRESS &&
            step.step_name === "ADA Proposal Sent" && (
              <button
                className="ml-2 px-3 py-1 bg-secondary text-black rounded hover:bg-secondary/90 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={onGenerateProposal}
                disabled={isGeneratingProposal || disabled}
              >
                {isGeneratingProposal ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Document Proposal"
                )}
              </button>
            )}
        </div>
        {status === PIPELINE_STATUS.COMPLETED && completedAt && (
          <div className="text-sm text-muted-foreground">
            Completed {completedAt}
          </div>
        )}
        {status === PIPELINE_STATUS.IN_PROGRESS && (
          <div className="text-sm text-primary">In Progress</div>
        )}
        {status === PIPELINE_STATUS.PENDING && (
          <div className="text-sm text-muted-foreground">Pending</div>
        )}
      </div>
    </div>
  );
}
