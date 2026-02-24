import type { Metadata } from "next";
import { Suspense } from "react";
import { GuideClient } from "./GuideClient";

export const metadata: Metadata = {
  title: "Encoding Decision Guide — Quantum Encoding Atlas",
  description:
    "Find the right quantum data encoding for your machine learning task. Answer a few questions about your problem and get a personalized recommendation from 16 encoding methods.",
  openGraph: {
    title: "Encoding Decision Guide — Quantum Encoding Atlas",
    description:
      "Interactive wizard to find the right quantum encoding for your problem.",
    type: "website",
    url: "https://q-encoding-atlas.web.app/guide",
  },
};

function GuideSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="mx-auto h-9 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-5 w-96 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
        <div className="flex justify-between">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <Suspense fallback={<GuideSkeleton />}>
      <GuideClient />
    </Suspense>
  );
}
