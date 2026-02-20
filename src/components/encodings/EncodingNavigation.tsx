import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { encodings } from "@/data/encodings";
import type { Encoding } from "@/data/encodings";

interface EncodingNavigationProps {
  currentSlug: string;
}

export function EncodingNavigation({ currentSlug }: EncodingNavigationProps) {
  const currentIndex = encodings.findIndex((e) => e.slug === currentSlug);
  const prev: Encoding | undefined = encodings[currentIndex - 1];
  const next: Encoding | undefined = encodings[currentIndex + 1];

  return (
    <nav className="mt-12 flex items-stretch gap-4 border-t border-border pt-8">
      {prev ? (
        <Link
          href={`/encodings/${prev.slug}`}
          className="group flex flex-1 items-center gap-3 rounded-lg border border-border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="truncate text-sm font-medium">{prev.name}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={`/encodings/${next.slug}`}
          className="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-border p-4 text-right transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="truncate text-sm font-medium">{next.name}</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
