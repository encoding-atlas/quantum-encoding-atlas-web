import type { Encoding, EncodingProperties } from "@/data/encodings";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RadarAxis {
  key: string;
  label: string;
  shortLabel: string;
  tooltip: string;
  angle: number;
}

export interface RadarDataPoint {
  axis: RadarAxis;
  value: number | null;
  x: number;
  y: number;
  isNull: boolean;
}

// ---------------------------------------------------------------------------
// Axis definitions
// ---------------------------------------------------------------------------

const AXES: Omit<RadarAxis, "angle">[] = [
  {
    key: "expressibility",
    label: "Expressibility",
    shortLabel: "Expr.",
    tooltip:
      "How much of the Hilbert space can be explored. Higher = more expressive quantum states.",
  },
  {
    key: "entanglementCapability",
    label: "Entanglement",
    shortLabel: "Ent.",
    tooltip:
      "Ability to create multi-qubit entanglement. Higher = stronger quantum correlations.",
  },
  {
    key: "trainability",
    label: "Trainability",
    shortLabel: "Train.",
    tooltip:
      "Ease of gradient-based optimization. Higher = less prone to barren plateaus.",
  },
  {
    key: "resourceEfficiency",
    label: "Resource Efficiency",
    shortLabel: "Effic.",
    tooltip:
      "Inverse of gate count (normalized). Higher = fewer gates needed.",
  },
  {
    key: "noiseResilience",
    label: "Noise Resilience",
    shortLabel: "Noise",
    tooltip:
      "Robustness to quantum noise and decoherence. Higher = more resilient.",
  },
];

export const RADAR_AXES: RadarAxis[] = AXES.map((axis, i) => ({
  ...axis,
  angle: (i * 2 * Math.PI) / AXES.length - Math.PI / 2,
}));

export const NUM_AXES = RADAR_AXES.length;

// ---------------------------------------------------------------------------
// Resource efficiency computation
// ---------------------------------------------------------------------------

/** Computes the min and max gate counts across all encodings. */
export function computeGateCountRange(
  allEncodings: readonly Encoding[],
): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const enc of allEncodings) {
    const gc = enc.properties.gateCount;
    if (gc < min) min = gc;
    if (gc > max) max = gc;
  }
  return { min, max };
}

/** Derives resource efficiency from gate count (inverted, normalized 0–1). */
export function computeResourceEfficiency(
  gateCount: number,
  range: { min: number; max: number },
): number {
  if (range.max === range.min) return 1;
  return 1 - (gateCount - range.min) / (range.max - range.min);
}

// ---------------------------------------------------------------------------
// Radar data computation
// ---------------------------------------------------------------------------

/**
 * Extracts the 5-axis radar values from an encoding's properties.
 * Returns null for properties that are undefined.
 */
export function getRadarValues(
  properties: EncodingProperties,
  resourceEfficiency: number,
): (number | null)[] {
  return [
    properties.expressibility ?? null,
    properties.entanglementCapability ?? null,
    properties.trainabilityEstimate ?? null,
    resourceEfficiency,
    properties.noiseResilienceEstimate ?? null,
  ];
}

/**
 * Computes positioned radar data points for SVG rendering.
 */
export function computeRadarPoints(
  values: (number | null)[],
  radius: number,
  center: { x: number; y: number },
): RadarDataPoint[] {
  return RADAR_AXES.map((axis, i) => {
    const value = values[i];
    const isNull = value === null;
    const r = radius * (isNull ? 0 : value);

    return {
      axis,
      value,
      x: center.x + r * Math.cos(axis.angle),
      y: center.y + r * Math.sin(axis.angle),
      isNull,
    };
  });
}

/**
 * Computes polygon vertices for the concentric grid rings.
 */
export function computeGridPolygon(
  level: number,
  radius: number,
  center: { x: number; y: number },
): { x: number; y: number }[] {
  return RADAR_AXES.map((axis) => ({
    x: center.x + radius * level * Math.cos(axis.angle),
    y: center.y + radius * level * Math.sin(axis.angle),
  }));
}
