"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/encodings/CategoryBadge";
import type { Encoding } from "@/data/encodings/types";

interface AlternativeCardProps {
  encoding: Encoding;
  rank: number;
  delay?: number;
}

export function AlternativeCard({
  encoding,
  rank,
  delay = 0,
}: AlternativeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
        delay,
      }}
    >
      <Link href={`/encodings/${encoding.slug}`} className="block group">
        <Card className="h-full transition-colors hover:border-primary/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  #{rank}
                </span>
                <span className="font-semibold text-sm">{encoding.name}</span>
              </div>
              <ArrowRight
                className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </div>
            <CategoryBadge categoryId={encoding.category} />
            <p className="text-xs text-muted-foreground line-clamp-2">
              {encoding.shortDescription}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
