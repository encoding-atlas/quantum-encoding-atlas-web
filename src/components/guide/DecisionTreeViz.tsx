"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEncodingById } from "@/data/encodings";
import type { DecisionStep } from "@/lib/recommender";

interface DecisionTreeVizProps {
  steps: DecisionStep[];
  scoringResult?: string;
}

export function DecisionTreeViz({
  steps,
  scoringResult,
}: DecisionTreeVizProps) {
  const treeResult = steps[steps.length - 1]?.encodingId;
  const resultsDiffer = scoringResult && treeResult && scoringResult !== treeResult;

  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium hover:bg-accent/50 transition-colors [&[data-state=open]>svg:last-child]:rotate-180">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Decision Tree Path
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 rounded-lg border border-border bg-card p-4">
          <div className="relative space-y-0">
            {steps.map((step, index) => {
              const encoding = step.encodingId
                ? getEncodingById(step.encodingId)
                : undefined;
              const isLast = index === steps.length - 1;

              return (
                <div key={step.level} className="relative flex gap-3">
                  {/* Vertical line */}
                  {!isLast && (
                    <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
                  )}

                  {/* Dot */}
                  <div
                    className={cn(
                      "relative z-10 mt-1.5 h-[22px] w-[22px] shrink-0 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                      step.isTerminal
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {step.level}
                  </div>

                  {/* Content */}
                  <div className="pb-4">
                    <p className="text-xs text-muted-foreground">
                      {step.question}
                    </p>
                    <p className="text-sm font-medium">
                      {step.answer}
                      {step.isTerminal && encoding && (
                        <span className="ml-2 text-primary">
                          → {encoding.name}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {resultsDiffer && (
            <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium">Note:</span> The scoring engine
              recommends a different encoding because it accounts for
              additional factors like sample size and hardware suitability.
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
