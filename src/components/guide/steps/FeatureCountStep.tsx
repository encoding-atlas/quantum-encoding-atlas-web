"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureCountStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

const PRESETS = [2, 4, 8, 16, 32];

export function FeatureCountStep({ value, onChange }: FeatureCountStepProps) {
  const currentValue = value ?? 4;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      onChange(parsed);
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      {/* Number input */}
      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(Math.max(1, currentValue - 1))}
          aria-label="Decrease feature count"
          disabled={currentValue <= 1}
        >
          &minus;
        </Button>
        <label className="sr-only" htmlFor="feature-count">
          Number of features
        </label>
        <Input
          id="feature-count"
          type="number"
          min={1}
          max={1000}
          value={currentValue}
          onChange={handleInputChange}
          className="w-24 text-center text-lg font-semibold"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onChange(currentValue + 1)}
          aria-label="Increase feature count"
        >
          +
        </Button>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={currentValue === preset ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset)}
            className={cn(
              "min-w-[48px]",
              currentValue === preset && "pointer-events-none"
            )}
          >
            {preset}
          </Button>
        ))}
      </div>

      {/* Helper text */}
      <p className="text-center text-xs text-muted-foreground">
        {currentValue <= 4
          ? "Small \u2014 most encodings work well"
          : currentValue <= 8
            ? "Medium \u2014 consider entangling encodings"
            : currentValue <= 20
              ? "Large \u2014 amplitude encoding offers compression"
              : "Very large \u2014 amplitude encoding strongly recommended"}
      </p>
    </div>
  );
}
