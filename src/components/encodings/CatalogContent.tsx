"use client";

import { motion } from "motion/react";
import { staggerContainer } from "@/lib/animation-variants";
import { useEncodingFilters } from "@/hooks/useEncodingFilters";
import { CatalogFilters } from "./CatalogFilters";
import { EncodingCard } from "./EncodingCard";
import { EmptyState } from "./EmptyState";

export function CatalogContent() {
  const {
    query,
    categories,
    sort,
    filtered,
    total,
    setQuery,
    toggleCategory,
    setSort,
    clearAll,
  } = useEncodingFilters();

  return (
    <>
      <CatalogFilters
        query={query}
        categories={categories}
        sort={sort}
        onQueryChange={setQuery}
        onCategoryToggle={toggleCategory}
        onSortChange={setSort}
      />

      <p className="mt-6 text-sm text-muted-foreground">
        Showing {filtered.length} of {total} encodings
      </p>

      {filtered.length === 0 ? (
        <EmptyState onClearFilters={clearAll} />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          key={`${query}-${categories.join(",")}-${sort}`}
        >
          {filtered.map((encoding) => (
            <EncodingCard key={encoding.id} encoding={encoding} />
          ))}
        </motion.div>
      )}
    </>
  );
}
