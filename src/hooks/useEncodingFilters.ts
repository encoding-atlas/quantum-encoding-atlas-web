"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { encodings } from "@/data/encodings";
import type { Encoding, EncodingCategoryId } from "@/data/encodings";

export type SortOption = "default" | "name" | "qubits" | "depth";

export interface FilterState {
  query: string;
  categories: EncodingCategoryId[];
  sort: SortOption;
}

export function useEncodingFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("q") ?? "";
  const categories = useMemo(() => {
    const cat = searchParams.getAll("category");
    return cat as EncodingCategoryId[];
  }, [searchParams]);
  const sort = (searchParams.get("sort") as SortOption) ?? "default";

  const setParams = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if ("query" in updates) {
        if (updates.query) {
          params.set("q", updates.query);
        } else {
          params.delete("q");
        }
      }

      if ("categories" in updates) {
        params.delete("category");
        updates.categories?.forEach((c) => params.append("category", c));
      }

      if ("sort" in updates) {
        if (updates.sort && updates.sort !== "default") {
          params.set("sort", updates.sort);
        } else {
          params.delete("sort");
        }
      }

      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setQuery = useCallback(
    (q: string) => setParams({ query: q }),
    [setParams],
  );

  const toggleCategory = useCallback(
    (categoryId: EncodingCategoryId) => {
      const next = categories.includes(categoryId)
        ? categories.filter((c) => c !== categoryId)
        : [...categories, categoryId];
      setParams({ categories: next });
    },
    [categories, setParams],
  );

  const setSort = useCallback(
    (s: SortOption) => setParams({ sort: s }),
    [setParams],
  );

  const clearAll = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const filtered = useMemo(() => {
    let result: Encoding[] = [...encodings];

    // Filter by search query
    if (query) {
      const lower = query.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.shortDescription.toLowerCase().includes(lower) ||
          e.category.toLowerCase().includes(lower),
      );
    }

    // Filter by categories
    if (categories.length > 0) {
      result = result.filter((e) => categories.includes(e.category));
    }

    // Sort
    switch (sort) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "qubits":
        result.sort((a, b) => a.properties.nQubits - b.properties.nQubits);
        break;
      case "depth":
        result.sort((a, b) => a.properties.depth - b.properties.depth);
        break;
      default:
        // Keep canonical order (by category grouping from the array)
        break;
    }

    return result;
  }, [query, categories, sort]);

  return {
    query,
    categories,
    sort,
    filtered,
    total: encodings.length,
    setQuery,
    toggleCategory,
    setSort,
    clearAll,
  };
}
