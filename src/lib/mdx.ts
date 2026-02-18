import type { ComponentType } from "react";

type MDXModule = { default: ComponentType };

const mdxModules: Record<string, () => Promise<MDXModule>> = {
  angle: () => import("@/content/encodings/angle.mdx"),
  amplitude: () => import("@/content/encodings/amplitude.mdx"),
  basis: () => import("@/content/encodings/basis.mdx"),
  iqp: () => import("@/content/encodings/iqp.mdx"),
  "zz-feature-map": () => import("@/content/encodings/zz-feature-map.mdx"),
  "pauli-feature-map": () =>
    import("@/content/encodings/pauli-feature-map.mdx"),
  "data-reuploading": () =>
    import("@/content/encodings/data-reuploading.mdx"),
  "hardware-efficient": () =>
    import("@/content/encodings/hardware-efficient.mdx"),
  "higher-order-angle": () =>
    import("@/content/encodings/higher-order-angle.mdx"),
  qaoa: () => import("@/content/encodings/qaoa.mdx"),
  hamiltonian: () => import("@/content/encodings/hamiltonian.mdx"),
  trainable: () => import("@/content/encodings/trainable.mdx"),
  "symmetry-inspired": () =>
    import("@/content/encodings/symmetry-inspired.mdx"),
  "so2-equivariant": () =>
    import("@/content/encodings/so2-equivariant.mdx"),
  "cyclic-equivariant": () =>
    import("@/content/encodings/cyclic-equivariant.mdx"),
  "swap-equivariant": () =>
    import("@/content/encodings/swap-equivariant.mdx"),
};

export async function getMDXContent(
  slug: string,
): Promise<ComponentType | null> {
  const loader = mdxModules[slug];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

export function hasMDXContent(slug: string): boolean {
  return slug in mdxModules;
}

export const mdxSlugs = Object.keys(mdxModules);
