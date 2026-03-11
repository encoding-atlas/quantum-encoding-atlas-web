"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Github, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { NAV_ITEMS, EXTERNAL_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const segment = useSelectedLayoutSegment();

  return (
    <header className="sticky top-0 z-50 h-16 glass-navbar">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-display gradient-text-quantum">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop navigation links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = segment === item.href.slice(1);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:text-primary",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right section: external links + theme toggle + mobile trigger */}
        <div className="flex items-center gap-1">
          {/* External links — desktop only */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden sm:inline-flex"
              >
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                >
                  <Github className="size-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>GitHub</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden sm:inline-flex"
              >
                <a
                  href={EXTERNAL_LINKS.pypi}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PyPI package"
                >
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>PyPI</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden sm:inline-flex"
              >
                <a
                  href={EXTERNAL_LINKS.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Documentation"
                >
                  <BookOpen className="size-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Docs</TooltipContent>
          </Tooltip>

          <ThemeToggle />

          {/* Mobile nav trigger — below lg breakpoint */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
