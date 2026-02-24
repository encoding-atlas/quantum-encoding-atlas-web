"use client";

import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  GuideInput,
  FeatureInteraction,
  ProblemStructure,
} from "@/data/encodings/types";

interface AdvancedStepProps {
  answers: Partial<GuideInput>;
  onFieldChange: (
    field: keyof GuideInput,
    value: GuideInput[keyof GuideInput]
  ) => void;
}

const SAMPLE_PRESETS = [50, 100, 500, 1000, 5000];

export function AdvancedStep({ answers, onFieldChange }: AdvancedStepProps) {
  const trainable = answers.trainable ?? false;
  const problemStructure = answers.problemStructure ?? null;
  const featureInteractions = answers.featureInteractions ?? null;
  const nSamples = answers.nSamples ?? 500;

  return (
    <div className="mx-auto max-w-lg space-y-8">
      {/* Trainable parameters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="trainable-switch"
            className="text-sm font-medium cursor-pointer"
          >
            Include trainable parameters
          </label>
          <Switch
            id="trainable-switch"
            checked={trainable}
            onCheckedChange={(checked) => onFieldChange("trainable", checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Enables learnable parameters in the encoding circuit for
          task-specific optimization.
        </p>
      </div>

      {/* Problem structure */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Problem structure</label>
        <RadioGroup
          value={problemStructure ?? "none"}
          onValueChange={(v) =>
            onFieldChange(
              "problemStructure",
              v === "none" ? null : (v as ProblemStructure)
            )
          }
          className="grid gap-2 sm:grid-cols-2"
        >
          {[
            { value: "none", label: "None / General" },
            { value: "combinatorial", label: "Combinatorial / Graph" },
            { value: "physics_simulation", label: "Physics Simulation" },
            { value: "time_series", label: "Time Series / Periodic" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                "hover:bg-accent/50",
                (problemStructure ?? "none") === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <RadioGroupItem value={opt.value} />
              <span>{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Feature interactions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Feature interactions
        </label>
        <RadioGroup
          value={featureInteractions ?? "none"}
          onValueChange={(v) =>
            onFieldChange(
              "featureInteractions",
              v === "none" ? null : (v as FeatureInteraction)
            )
          }
          className="grid gap-2 sm:grid-cols-3"
        >
          {[
            { value: "none", label: "None / Automatic" },
            { value: "polynomial", label: "Polynomial" },
            { value: "custom_pauli", label: "Custom Pauli" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                "hover:bg-accent/50",
                (featureInteractions ?? "none") === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <RadioGroupItem value={opt.value} />
              <span>{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Sample count */}
      <div className="space-y-3">
        <label htmlFor="sample-count" className="block text-sm font-medium">
          Number of training samples
        </label>
        <div className="flex items-center gap-3">
          <Input
            id="sample-count"
            type="number"
            min={1}
            max={100000}
            value={nSamples}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!isNaN(parsed) && parsed >= 1) {
                onFieldChange("nSamples", parsed);
              }
            }}
            className="w-28 text-center"
          />
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant={nSamples === preset ? "default" : "outline"}
                size="xs"
                onClick={() => onFieldChange("nSamples", preset)}
              >
                {preset >= 1000 ? `${preset / 1000}k` : preset}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Affects simulability bonus for small datasets (&lt; 100 samples).
        </p>
      </div>
    </div>
  );
}
