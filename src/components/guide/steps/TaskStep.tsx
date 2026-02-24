"use client";

import { Tag, LineChart } from "lucide-react";
import { OptionCard } from "../OptionCard";
import type { Task } from "@/data/encodings/types";

interface TaskStepProps {
  value: Task | undefined;
  onChange: (value: Task) => void;
}

const OPTIONS: {
  value: Task;
  label: string;
  description: string;
  icon: typeof Tag;
}[] = [
  {
    value: "classification",
    label: "Classification",
    description:
      "Assigning inputs to discrete categories (e.g., spam detection, image classification)",
    icon: Tag,
  },
  {
    value: "regression",
    label: "Regression",
    description:
      "Predicting continuous output values (e.g., energy prediction, price forecasting)",
    icon: LineChart,
  },
];

export function TaskStep({ value, onChange }: TaskStepProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Task type selection"
      className="grid gap-3 sm:grid-cols-2 max-w-lg mx-auto"
    >
      {OPTIONS.map((opt) => (
        <OptionCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          icon={opt.icon}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}
