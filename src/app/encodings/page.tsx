import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogContent } from "@/components/encodings/CatalogContent";

export const metadata: Metadata = {
  title: "Quantum Encodings",
  description:
    "Browse all 16 quantum data encoding methods for machine learning. Filter by category, compare properties, and find the right encoding for PennyLane, Qiskit, or Cirq.",
  openGraph: {
    title: "Quantum Encodings — Quantum Encoding Atlas",
    description:
      "Browse all 16 quantum data encoding methods for machine learning.",
    type: "website",
    url: "https://q-encoding-atlas.web.app/encodings",
  },
};

export default function EncodingsPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Quantum Encodings
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Browse, filter, and compare 16 encoding methods for quantum machine
            learning across PennyLane, Qiskit, and Cirq.
          </p>
        </div>

        <div className="mt-12">
          <Suspense>
            <CatalogContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
