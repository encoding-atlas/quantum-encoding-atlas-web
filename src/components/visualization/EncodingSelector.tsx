"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { encodings } from "@/data/encodings";
import { ENCODING_CATEGORIES } from "@/data/categories";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORY_COLOR_MAP } from "./color-utils";
import type { EncodingCategoryId } from "@/data/encodings";

interface EncodingSelectorProps {
  selectedSlugs: string[];
  canAdd: boolean;
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export function EncodingSelector({
  selectedSlugs,
  canAdd,
  onAdd,
  onRemove,
  onClear,
}: EncodingSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedSet = new Set(selectedSlugs);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={!canAdd}
              className="justify-between gap-2"
            >
              Add encoding...
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search encodings..." />
              <CommandList>
                <CommandEmpty>No encoding found.</CommandEmpty>
                {ENCODING_CATEGORIES.map((category) => {
                  const categoryEncodings = encodings.filter(
                    (e) => e.category === category.id,
                  );
                  if (categoryEncodings.length === 0) return null;

                  return (
                    <CommandGroup
                      key={category.id}
                      heading={category.name}
                    >
                      {categoryEncodings.map((encoding) => {
                        const isSelected = selectedSet.has(encoding.slug);
                        return (
                          <CommandItem
                            key={encoding.slug}
                            value={encoding.name}
                            onSelect={() => {
                              if (isSelected) {
                                onRemove(encoding.slug);
                              } else {
                                onAdd(encoding.slug);
                              }
                              setOpen(false);
                            }}
                            disabled={!isSelected && !canAdd}
                          >
                            <div
                              className="mr-2 size-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor:
                                  CATEGORY_COLOR_MAP[
                                    encoding.category as EncodingCategoryId
                                  ],
                              }}
                            />
                            {encoding.name}
                            {isSelected && (
                              <Check className="ml-auto size-4" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedSlugs.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Selected encoding chips */}
      {selectedSlugs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSlugs.map((slug) => {
            const encoding = encodings.find((e) => e.slug === slug);
            if (!encoding) return null;

            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLOR_MAP[
                        encoding.category as EncodingCategoryId
                      ],
                  }}
                />
                {encoding.name}
                <button
                  onClick={() => onRemove(slug)}
                  className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Remove ${encoding.name}`}
                >
                  <X className="size-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
