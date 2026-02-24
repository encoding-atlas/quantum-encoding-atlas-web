"use client";

import { useState } from "react";
import { Monitor, Cpu, Atom } from "lucide-react";
import { OptionCard } from "../OptionCard";
import { Input } from "@/components/ui/input";

interface HardwareStepProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

const PRESET_OPTIONS: {
  value: string;
  label: string;
  description: string;
  icon: typeof Monitor;
}[] = [
  {
    value: "simulator",
    label: "Simulator",
    description:
      "Running on a classical simulator (no hardware constraints)",
    icon: Monitor,
  },
  {
    value: "nisq",
    label: "NISQ Device",
    description:
      "Running on a near-term quantum device (limited qubits, noisy gates)",
    icon: Cpu,
  },
  {
    value: "ionq",
    label: "IonQ",
    description: "Trapped-ion hardware (high fidelity, slower gates)",
    icon: Atom,
  },
];

export function HardwareStep({ value, onChange }: HardwareStepProps) {
  const isPreset = PRESET_OPTIONS.some((opt) => opt.value === value);
  const [customValue, setCustomValue] = useState(
    !isPreset && value ? value : ""
  );

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setCustomValue(v);
    if (v.trim()) {
      onChange(v.trim());
    }
  }

  return (
    <div className="space-y-4">
      <div
        role="radiogroup"
        aria-label="Hardware target selection"
        className="grid gap-3 sm:grid-cols-3"
      >
        {PRESET_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            description={opt.description}
            icon={opt.icon}
            selected={value === opt.value}
            onClick={() => {
              setCustomValue("");
              onChange(opt.value);
            }}
          />
        ))}
      </div>

      {/* Custom hardware input */}
      <div className="mx-auto max-w-sm">
        <label
          htmlFor="custom-hardware"
          className="block text-xs font-medium text-muted-foreground mb-1.5"
        >
          Or specify a custom device:
        </label>
        <Input
          id="custom-hardware"
          type="text"
          placeholder="e.g., IBM Eagle, IonQ Aria"
          value={customValue}
          onChange={handleCustomChange}
          onFocus={() => {
            // Clear preset selection when focusing custom input
            if (isPreset && customValue === "") {
              // Keep current selection
            }
          }}
          className="text-sm"
        />
      </div>
    </div>
  );
}
