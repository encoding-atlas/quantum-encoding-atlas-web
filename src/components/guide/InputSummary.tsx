"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { GuideInput } from "@/data/encodings/types";

interface InputSummaryProps {
  input: Partial<GuideInput>;
  onEdit: () => void;
}

const LABELS: Record<string, string> = {
  dataType: "Data Type",
  nFeatures: "Features",
  symmetry: "Symmetry",
  task: "Task",
  priority: "Priority",
  hardware: "Hardware",
  trainable: "Trainable",
  problemStructure: "Problem Structure",
  featureInteractions: "Feature Interactions",
  nSamples: "Samples",
};

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "Not specified";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  const str = String(value);
  // Capitalize and format snake_case
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function InputSummary({ input, onEdit }: InputSummaryProps) {
  const entries = Object.entries(LABELS)
    .map(([key, label]) => ({
      key,
      label,
      value: formatValue(key, input[key as keyof GuideInput]),
    }))
    .filter(
      (entry) =>
        input[entry.key as keyof GuideInput] !== undefined
    );

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h4 className="text-sm font-semibold">Your Input Summary</h4>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="mr-1.5 h-3 w-3" aria-hidden="true" />
          Edit Answers
        </Button>
      </div>
      <dl className="divide-y divide-border">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="flex items-center justify-between px-4 py-2 text-sm"
          >
            <dt className="text-muted-foreground">{entry.label}</dt>
            <dd className="font-medium">{entry.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
