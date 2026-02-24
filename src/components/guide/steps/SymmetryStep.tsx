"use client";

import { Minus, RotateCw, RefreshCw, ArrowLeftRight, Shapes } from "lucide-react";
import { OptionCard } from "../OptionCard";
import type { SymmetryType } from "@/data/encodings/types";

interface SymmetryStepProps {
  value: SymmetryType | null | undefined;
  nFeatures: number;
  onChange: (value: SymmetryType | null) => void;
}

export function SymmetryStep({
  value,
  nFeatures,
  onChange,
}: SymmetryStepProps) {
  const rotationWarning =
    nFeatures !== 2
      ? `SO(2) equivariant encoding requires exactly 2 features. Your feature count is ${nFeatures}.`
      : undefined;

  const pairWarning =
    nFeatures % 2 !== 0
      ? "Swap equivariant encoding requires an even number of features."
      : undefined;

  const options: {
    value: SymmetryType | null;
    label: string;
    description: string;
    whenToChoose?: string;
    icon: typeof Minus;
    warning?: string;
  }[] = [
    {
      value: null,
      label: "No Symmetry",
      description: "No known symmetry or I'm not sure",
      icon: Minus,
    },
    {
      value: "rotation",
      label: "2D Rotation (SO\u2082)",
      description: "Data is invariant under 2D rotations",
      whenToChoose: "Only for 2-feature data (x, y coordinates)",
      icon: RotateCw,
      warning: rotationWarning,
    },
    {
      value: "cyclic",
      label: "Cyclic (Z\u2099)",
      description: "Data has cyclic/periodic shift symmetry",
      whenToChoose: "Periodic signals, ring structures",
      icon: RefreshCw,
    },
    {
      value: "permutation_pairs",
      label: "Pair Permutation (S\u2082)",
      description: "Swapping feature pairs doesn't change the problem",
      whenToChoose: "Requires even number of features",
      icon: ArrowLeftRight,
      warning: pairWarning,
    },
    {
      value: "general",
      label: "General (Heuristic)",
      description:
        "Data has some symmetry but doesn't fit the above categories",
      whenToChoose: "Heuristic symmetry-aware encoding",
      icon: Shapes,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Symmetry selection"
      className="grid gap-3 sm:grid-cols-2"
    >
      {options.map((opt) => (
        <OptionCard
          key={String(opt.value)}
          label={opt.label}
          description={opt.description}
          whenToChoose={opt.whenToChoose}
          icon={opt.icon}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          warning={opt.warning}
        />
      ))}
    </div>
  );
}
