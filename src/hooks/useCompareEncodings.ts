"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getEncodingBySlug } from "@/data/encodings";
import type { Encoding } from "@/data/encodings";

const PARAM_KEY = "encodings";
const MAX_ENCODINGS = 4;
const MIN_ENCODINGS = 2;

export function useCompareEncodings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedSlugs = useMemo(() => {
    const param = searchParams.get(PARAM_KEY);
    return param ? param.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedEncodings = useMemo(
    () =>
      selectedSlugs
        .map((slug) => getEncodingBySlug(slug))
        .filter((e): e is Encoding => e != null),
    [selectedSlugs],
  );

  const updateParams = useCallback(
    (slugs: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slugs.length > 0) {
        params.set(PARAM_KEY, slugs.join(","));
      } else {
        params.delete(PARAM_KEY);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const addEncoding = useCallback(
    (slug: string) => {
      if (selectedSlugs.length >= MAX_ENCODINGS || selectedSlugs.includes(slug))
        return;
      updateParams([...selectedSlugs, slug]);
    },
    [selectedSlugs, updateParams],
  );

  const removeEncoding = useCallback(
    (slug: string) => {
      updateParams(selectedSlugs.filter((s) => s !== slug));
    },
    [selectedSlugs, updateParams],
  );

  const clearAll = useCallback(() => {
    updateParams([]);
  }, [updateParams]);

  return {
    selectedEncodings,
    selectedSlugs,
    canAdd: selectedSlugs.length < MAX_ENCODINGS,
    hasEnough: selectedSlugs.length >= MIN_ENCODINGS,
    addEncoding,
    removeEncoding,
    clearAll,
  };
}
