import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareClient } from "./CompareClient";

export const metadata: Metadata = {
  title: "Compare Encodings",
  description:
    "Compare quantum data encodings side-by-side. Visualize property differences, resource requirements, and trade-offs across 16 encoding methods.",
  openGraph: {
    title: "Compare Encodings — Quantum Encoding Atlas",
    description:
      "Compare quantum data encodings side-by-side with interactive charts.",
    type: "website",
    url: "https://q-encoding-atlas.web.app/compare",
  },
};

function ComparePageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-5 w-96 animate-pulse rounded bg-muted" />
      <div className="mt-8 h-10 w-48 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<ComparePageSkeleton />}>
      <CompareClient />
    </Suspense>
  );
}
