"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ENCODING_CATEGORIES } from "@/data/categories";
import type { EncodingCategoryId } from "@/data/encodings";
import type { SortOption } from "@/hooks/useEncodingFilters";

const CATEGORY_COLORS: Record<EncodingCategoryId, string> = {
  "angle-based": "var(--cat-angle)",
  "amplitude-based": "var(--cat-amplitude)",
  basis: "var(--cat-basis)",
  entangling: "var(--cat-entangling)",
  variational: "var(--cat-variational)",
  "physics-inspired": "var(--cat-physics)",
  symmetry: "var(--cat-symmetry)",
};

interface CatalogFiltersProps {
  query: string;
  categories: EncodingCategoryId[];
  sort: SortOption;
  onQueryChange: (q: string) => void;
  onCategoryToggle: (id: EncodingCategoryId) => void;
  onSortChange: (s: SortOption) => void;
}

export function CatalogFilters({
  query,
  categories,
  sort,
  onQueryChange,
  onCategoryToggle,
  onSortChange,
}: CatalogFiltersProps) {
  const [localQuery, setLocalQuery] = useState(query);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync local query with external state (e.g., URL param changes)
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleQueryChange = useCallback(
    (value: string) => {
      setLocalQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onQueryChange(value), 200);
    },
    [onQueryChange],
  );

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search encodings..."
            className="pl-9 pr-9"
          />
          {localQuery && (
            <button
              onClick={() => handleQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default order</SelectItem>
            <SelectItem value="name">A — Z</SelectItem>
            <SelectItem value="qubits">Qubits (asc)</SelectItem>
            <SelectItem value="depth">Depth (asc)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {ENCODING_CATEGORIES.map((cat) => {
          const isActive = categories.includes(cat.id);
          const color = CATEGORY_COLORS[cat.id];

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryToggle(cat.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                isActive
                  ? "border-transparent shadow-sm"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
              style={
                isActive
                  ? {
                      backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)`,
                      color,
                      borderColor: `color-mix(in oklch, ${color} 30%, transparent)`,
                    }
                  : undefined
              }
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
