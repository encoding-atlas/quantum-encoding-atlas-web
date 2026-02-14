export const SITE_CONFIG = {
  name: "Quantum Encoding Atlas",
  shortName: "QEA",
  tagline:
    "The definitive open-source resource for quantum data encodings in machine learning",
  description:
    "A unified Python library with 16 encoding implementations, multi-framework support for PennyLane, Qiskit, and Cirq, analysis tools, and an evidence-based decision guide.",
  url: "https://q-encoding-atlas.web.app",
} as const;

export const EXTERNAL_LINKS = {
  github: "https://github.com/encoding-atlas/quantum-encoding-atlas",
  pypi: "https://pypi.org/project/encoding-atlas/",
  docs: "https://encoding-atlas.github.io/quantum-encoding-atlas/",
  quickstart:
    "https://encoding-atlas.github.io/quantum-encoding-atlas/quickstart/",
  encodingGuide:
    "https://encoding-atlas.github.io/quantum-encoding-atlas/guide/which-encoding/",
  apiReference:
    "https://encoding-atlas.github.io/quantum-encoding-atlas/api/",
} as const;

export const INSTALL_COMMAND = "pip install encoding-atlas" as const;

export const NAV_ITEMS = [
  { label: "Encodings", href: "/encodings" },
  { label: "Compare", href: "/compare" },
  { label: "Guide", href: "/guide" },
] as const;

/**
 * All 16 encoding slugs for static page generation.
 * These slugs are used across the site for routing and must stay stable.
 */
export const ENCODING_SLUGS = [
  "angle",
  "higher-order-angle",
  "amplitude",
  "basis",
  "iqp",
  "zz-feature-map",
  "pauli-feature-map",
  "data-reuploading",
  "hardware-efficient",
  "qaoa",
  "hamiltonian",
  "trainable",
  "symmetry-inspired",
  "so2-equivariant",
  "cyclic-equivariant",
  "swap-equivariant",
] as const;

/** Encoding categories with metadata for badges and filtering. */
export const ENCODING_CATEGORIES = [
  {
    id: "angle",
    label: "Angle-based",
    colorClass: "cat-angle",
    encodings: ["angle", "higher-order-angle"],
  },
  {
    id: "amplitude",
    label: "Amplitude-based",
    colorClass: "cat-amplitude",
    encodings: ["amplitude"],
  },
  {
    id: "basis",
    label: "Basis",
    colorClass: "cat-basis",
    encodings: ["basis"],
  },
  {
    id: "entangling",
    label: "Entangling Feature Maps",
    colorClass: "cat-entangling",
    encodings: ["iqp", "zz-feature-map", "pauli-feature-map"],
  },
  {
    id: "variational",
    label: "Variational",
    colorClass: "cat-variational",
    encodings: [
      "data-reuploading",
      "hardware-efficient",
      "qaoa",
      "trainable",
    ],
  },
  {
    id: "physics",
    label: "Physics-inspired",
    colorClass: "cat-physics",
    encodings: ["hamiltonian"],
  },
  {
    id: "symmetry",
    label: "Symmetry & Equivariant",
    colorClass: "cat-symmetry",
    encodings: [
      "symmetry-inspired",
      "so2-equivariant",
      "cyclic-equivariant",
      "swap-equivariant",
    ],
  },
] as const;
