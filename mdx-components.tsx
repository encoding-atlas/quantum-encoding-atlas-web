import type { MDXComponents } from "mdx/types";
import { InlineMath, DisplayMath } from "@/components/math";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    InlineMath,
    DisplayMath,
  };
}
