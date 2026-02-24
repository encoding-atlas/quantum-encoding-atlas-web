"use client";

import type { StepConfig } from "@/hooks/useGuideWizard";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  activeSteps: StepConfig[];
  onStepClick: (step: number) => void;
}

export function WizardProgress({
  currentStep,
  activeSteps,
  onStepClick,
}: WizardProgressProps) {
  const totalSteps = activeSteps.length;

  return (
    <div className="w-full">
      {/* Desktop: dots + labels */}
      <div className="hidden sm:block" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Step ${currentStep + 1} of ${totalSteps}: ${activeSteps[currentStep]?.label}`}>
        <div className="flex items-center justify-center gap-0">
          {activeSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isFuture = index > currentStep;

            return (
              <div key={step.id} className="flex items-center">
                {/* Dot */}
                <button
                  type="button"
                  onClick={() => isCompleted && onStepClick(index)}
                  disabled={isFuture}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isCompleted &&
                      "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isFuture &&
                      "cursor-default border border-border bg-muted text-muted-foreground"
                  )}
                  aria-label={`${step.label}${isCompleted ? " (completed)" : isCurrent ? " (current)" : ""}`}
                >
                  {index + 1}
                </button>

                {/* Connector line */}
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 lg:w-12 transition-colors",
                      index < currentStep ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step labels (desktop only) */}
        <div className="mt-2 hidden lg:flex items-center justify-center gap-0">
          {activeSteps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center",
                index < totalSteps - 1 && "mr-0"
              )}
            >
              <span
                className={cn(
                  "block w-8 text-center text-[10px]",
                  index === currentStep
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.shortLabel}
              </span>
              {index < totalSteps - 1 && <div className="w-8 lg:w-12" />}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: text indicator */}
      <div className="sm:hidden text-center">
        <span className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="mx-2 text-muted-foreground/40">·</span>
        <span className="text-sm font-medium">
          {activeSteps[currentStep]?.label}
        </span>
      </div>
    </div>
  );
}
