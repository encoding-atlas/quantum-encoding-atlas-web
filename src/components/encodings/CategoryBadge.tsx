import { cn } from "@/lib/utils";
import { CATEGORY_MAP } from "@/data/categories";
import type { EncodingCategoryId } from "@/data/encodings";

const COLOR_MAP: Record<EncodingCategoryId, string> = {
  "angle-based": "var(--cat-angle)",
  "amplitude-based": "var(--cat-amplitude)",
  basis: "var(--cat-basis)",
  entangling: "var(--cat-entangling)",
  variational: "var(--cat-variational)",
  "physics-inspired": "var(--cat-physics)",
  symmetry: "var(--cat-symmetry)",
};

interface CategoryBadgeProps {
  categoryId: EncodingCategoryId;
  className?: string;
}

export function CategoryBadge({ categoryId, className }: CategoryBadgeProps) {
  const category = CATEGORY_MAP.get(categoryId);
  const color = COLOR_MAP[categoryId];
  const label = category?.name ?? categoryId;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
        color,
      }}
    >
      {label}
    </span>
  );
}
