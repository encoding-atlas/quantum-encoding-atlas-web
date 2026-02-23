import type { EncodingCategoryId } from "@/data/encodings";

/** Maps category IDs to their CSS custom property references. */
export const CATEGORY_COLOR_MAP: Record<EncodingCategoryId, string> = {
  "angle-based": "var(--cat-angle)",
  "amplitude-based": "var(--cat-amplitude)",
  basis: "var(--cat-basis)",
  entangling: "var(--cat-entangling)",
  variational: "var(--cat-variational)",
  "physics-inspired": "var(--cat-physics)",
  symmetry: "var(--cat-symmetry)",
};

/** Ordered chart colors for multi-encoding comparisons. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

/** Returns the CSS variable reference for an encoding's category color. */
export function getCategoryColor(categoryId: EncodingCategoryId): string {
  return CATEGORY_COLOR_MAP[categoryId];
}
