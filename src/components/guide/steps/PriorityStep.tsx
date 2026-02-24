"use client";

import { Target, Zap, Clock, Shield } from "lucide-react";
import { OptionCard } from "../OptionCard";
import type { Priority } from "@/data/encodings/types";

interface PriorityStepProps {
  value: Priority | undefined;
  onChange: (value: Priority) => void;
}

const OPTIONS: {
  value: Priority;
  label: string;
  description: string;
  icon: typeof Target;
}[] = [
  {
    value: "accuracy",
    label: "Accuracy",
    description:
      "Maximize model performance and expressiveness \u2014 prioritize quantum advantage",
    icon: Target,
  },
  {
    value: "speed",
    label: "Speed",
    description:
      "Minimize circuit depth and gate count \u2014 prioritize fast execution",
    icon: Clock,
  },
  {
    value: "trainability",
    label: "Trainability",
    description:
      "Ensure the model can be trained effectively \u2014 avoid barren plateaus",
    icon: Zap,
  },
  {
    value: "noise_resilience",
    label: "Noise Resilience",
    description:
      "Optimize for real quantum hardware \u2014 minimize noise sensitivity",
    icon: Shield,
  },
];

export function PriorityStep({ value, onChange }: PriorityStepProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Priority selection"
      className="grid gap-3 sm:grid-cols-2"
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
