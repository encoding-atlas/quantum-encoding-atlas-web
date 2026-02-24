"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  confidence: number;
  animated?: boolean;
}

function getConfidenceColor(c: number): string {
  if (c >= 0.85) return "bg-emerald-500";
  if (c >= 0.65) return "bg-amber-500";
  return "bg-orange-500";
}

function getConfidenceLabel(c: number): string {
  if (c >= 0.85) return "High confidence";
  if (c >= 0.65) return "Moderate confidence";
  return "Low confidence";
}

export function ConfidenceBar({
  confidence,
  animated = true,
}: ConfidenceBarProps) {
  const targetWidth = confidence * 100;
  const [displayWidth, setDisplayWidth] = useState(animated ? 0 : targetWidth);
  const mounted = useRef(false);

  useEffect(() => {
    if (!animated) return;
    if (!mounted.current) {
      mounted.current = true;
      // Delay the animation start to trigger CSS transition
      const timer = setTimeout(() => {
        setDisplayWidth(targetWidth);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animated, targetWidth]);

  const percentage = Math.round(confidence * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{percentage}% confident</span>
        <span className="text-muted-foreground">{getConfidenceLabel(confidence)}</span>
      </div>
      <div
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Confidence: ${percentage}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            animated ? "duration-800 ease-out" : "",
            getConfidenceColor(confidence)
          )}
          style={{ width: `${animated ? displayWidth : targetWidth}%` }}
        />
      </div>
    </div>
  );
}
