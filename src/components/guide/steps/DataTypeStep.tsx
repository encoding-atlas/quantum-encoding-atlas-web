"use client";

import { TrendingUp, Binary, Hash } from "lucide-react";
import { OptionCard } from "../OptionCard";
import type { DataType } from "@/data/encodings/types";

interface DataTypeStepProps {
  value: DataType | undefined;
  onChange: (value: DataType) => void;
}

const OPTIONS: {
  value: DataType;
  label: string;
  description: string;
  icon: typeof TrendingUp;
}[] = [
  {
    value: "continuous",
    label: "Continuous",
    description:
      "Real-valued numbers (e.g., sensor readings, coordinates, pixel intensities)",
    icon: TrendingUp,
  },
  {
    value: "binary",
    label: "Binary",
    description: "Binary values only (0 or 1, true/false)",
    icon: Binary,
  },
  {
    value: "discrete",
    label: "Discrete",
    description:
      "Categorical or integer values (e.g., labels, counts)",
    icon: Hash,
  },
];

export function DataTypeStep({ value, onChange }: DataTypeStepProps) {
  return (
    <div role="radiogroup" aria-label="Data type selection" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
