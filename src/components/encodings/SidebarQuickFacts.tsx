import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { PropertyTable } from "./PropertyTable";
import { getEncodingBySlug } from "@/data/encodings";
import { EXTERNAL_LINKS } from "@/lib/constants";
import type { Encoding, EncodingCategoryId } from "@/data/encodings";
import { Separator } from "@/components/ui/separator";

interface SidebarQuickFactsProps {
  encoding: Encoding;
}

export function SidebarQuickFacts({ encoding }: SidebarQuickFactsProps) {
  const relatedEncodings = encoding.relatedEncodings
    .map((slug) => getEncodingBySlug(slug))
    .filter(Boolean) as Encoding[];

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Quick Facts */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">Quick Facts</h3>
        <div className="mt-3">
          <div className="flex items-center justify-between border-b border-border py-2.5">
            <span className="text-sm text-muted-foreground">Category</span>
            <CategoryBadge
              categoryId={encoding.category as EncodingCategoryId}
            />
          </div>
          <PropertyTable properties={encoding.properties} variant="compact" />
        </div>
      </div>

      {/* Related Encodings */}
      {relatedEncodings.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Related Encodings</h3>
          <ul className="mt-3 space-y-2">
            {relatedEncodings.map((related) => (
              <li key={related.id}>
                <Link
                  href={`/encodings/${related.slug}`}
                  className="block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
                >
                  {related.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* External Links */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">Resources</h3>
        <Separator className="my-3" />
        <a
          href={`${EXTERNAL_LINKS.github}/tree/main/encoding_atlas/encodings`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ExternalLink className="size-3.5" />
          View on GitHub
        </a>
      </div>
    </aside>
  );
}
