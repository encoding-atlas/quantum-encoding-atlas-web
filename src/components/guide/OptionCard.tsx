"use client";

import type { LucideIcon } from "lucide-react";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  description?: string;
  whenToChoose?: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  warning?: string;
}

export function OptionCard({
  label,
  description,
  whenToChoose,
  icon: Icon,
  selected,
  onClick,
  disabled = false,
  warning,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all",
        "hover:border-primary/40 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
              selected
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-sm font-semibold">{label}</span>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {selected && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" aria-hidden="true" />
          </div>
        )}
      </div>

      {whenToChoose && (
        <p className="text-xs italic text-muted-foreground/80 pl-[52px]">
          {whenToChoose}
        </p>
      )}

      {warning && (
        <div className="flex items-start gap-1.5 rounded-md bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{warning}</span>
        </div>
      )}
    </button>
  );
}
