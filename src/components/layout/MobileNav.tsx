"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, Github, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS, EXTERNAL_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const segment = useSelectedLayoutSegment();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="gradient-text-quantum text-left">
            {SITE_CONFIG.name}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = segment === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-secondary hover:text-secondary-foreground",
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <hr className="my-3 border-border" />

          <a
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <Github className="size-4" />
            GitHub
          </a>
          <a
            href={EXTERNAL_LINKS.pypi}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="size-4" />
            PyPI
          </a>
          <a
            href={EXTERNAL_LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <BookOpen className="size-4" />
            Documentation
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
