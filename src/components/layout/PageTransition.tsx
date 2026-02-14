"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps page content with a subtle CSS enter animation on route change.
 *
 * Uses `key={pathname}` so the div remounts on navigation,
 * replaying the fade-in + slide-up animation for each new page.
 *
 * Uses a CSS @keyframes animation instead of motion/react to avoid
 * SSR issues during static export prerendering.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-page-enter">
      {children}
    </div>
  );
}
