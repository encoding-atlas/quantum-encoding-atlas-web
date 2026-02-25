<div align="center">

<img src="public/logo.png" alt="Quantum Encoding Atlas" width="100" />

# Quantum Encoding Atlas — Web

**Interactive explorer for quantum data encodings in machine learning**

<!-- Version badges auto-update from package.json via shields.io dynamic JSON endpoint -->
[![Next.js](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fencoding-atlas%2Fquantum-encoding-atlas-web%2Fmain%2Fpackage.json&query=%24.dependencies.next&logo=next.js&logoColor=white&label=Next.js&color=black)](https://nextjs.org)
[![React](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fencoding-atlas%2Fquantum-encoding-atlas-web%2Fmain%2Fpackage.json&query=%24.dependencies.react&logo=react&label=React&color=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fencoding-atlas%2Fquantum-encoding-atlas-web%2Fmain%2Fpackage.json&query=%24.devDependencies.typescript&logo=typescript&logoColor=white&label=TypeScript&color=3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fencoding-atlas%2Fquantum-encoding-atlas-web%2Fmain%2Fpackage.json&query=%24.devDependencies.tailwindcss&logo=tailwindcss&logoColor=white&label=Tailwind%20CSS&color=06b6d4)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220?logo=pnpm&logoColor=white)](https://pnpm.io)

[![Deploy](https://img.shields.io/github/actions/workflow/status/encoding-atlas/quantum-encoding-atlas-web/deploy.yml?branch=main&logo=githubactions&logoColor=white&label=Build%20%26%20Deploy)](https://github.com/encoding-atlas/quantum-encoding-atlas-web/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fq-encoding-atlas.web.app&logo=firebase&logoColor=white&label=Website)](https://q-encoding-atlas.web.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

[**Live Website**](https://q-encoding-atlas.web.app) · [**Library Repository**](https://github.com/encoding-atlas/quantum-encoding-atlas) · [**Documentation**](https://encoding-atlas.github.io/quantum-encoding-atlas/) · [**PyPI**](https://pypi.org/project/encoding-atlas/)

</div>

<br />

## Overview

The **Quantum Encoding Atlas** web application is the interactive companion to the [`encoding-atlas`](https://pypi.org/project/encoding-atlas/) Python library. It provides an intuitive, browser-based interface for exploring, comparing, and selecting quantum data encodings for machine learning workflows — with publication-quality math rendering, interactive circuit diagrams, and an evidence-based recommendation engine.

### Pages

| Route | Description |
|:------|:------------|
| **`/`** | Landing page with hero, features overview, and encoding carousel |
| **`/encodings`** | Browsable, filterable catalog of all 16 quantum encodings |
| **`/encodings/[slug]`** | Detail page with circuit diagrams, properties, and MDX docs |
| **`/compare`** | Side-by-side radar chart comparison of encoding properties |
| **`/guide`** | 7-step interactive wizard for evidence-based encoding selection |

## Features

- **16 Encoding Methods** across 7 categories with detailed MDX documentation
- **Interactive Circuit Diagrams** — Custom SVG renderer for quantum gate visualization (H, RX, RY, RZ, CNOT, CZ, and more)
- **Radar Chart Comparisons** — [visx](https://airbnb.io/visx)-powered D3 charts for multi-dimensional property analysis
- **Decision Guide Wizard** — 7-step questionnaire with a deterministic recommendation engine and shareable URL results
- **KaTeX Math Rendering** — Publication-quality mathematical notation throughout
- **Dark Mode** — Full light/dark theme support with system preference detection
- **URL-Shareable State** — Comparison selections and guide results encoded in URL params for easy sharing
- **Fully Static** — Pre-rendered for instant loading, SEO-friendly, and zero server cost

## Encodings

<table>
<tr>
<td width="25%">

**Angle-based**
- Angle Encoding
- Higher-Order Angle

</td>
<td width="25%">

**Amplitude-based**
- Amplitude Encoding

</td>
<td width="25%">

**Basis**
- Basis Encoding

</td>
<td width="25%">

**Entangling**
- IQP Encoding
- ZZ Feature Map
- Pauli Feature Map

</td>
</tr>
<tr>
<td>

**Variational**
- Data Reuploading
- Hardware-Efficient
- QAOA-Inspired
- Hamiltonian

</td>
<td>

**Physics-Inspired**
- Trainable Encoding

</td>
<td colspan="2">

**Symmetry & Equivariant**
- Symmetry-Inspired
- SO(2) Equivariant
- Cyclic Equivariant
- Swap Equivariant

</td>
</tr>
</table>

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | [Next.js](https://nextjs.org) 16 — App Router, static export |
| **UI Library** | [React](https://react.dev) 19 |
| **Language** | [TypeScript](https://www.typescriptlang.org) 5 — strict mode |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 — CSS-first config, OKLCH colors |
| **Components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) — 19 primitives |
| **Visualizations** | [visx](https://airbnb.io/visx) (D3 bindings) + custom SVG circuit renderer |
| **Math** | [KaTeX](https://katex.org) via remark-math + rehype-katex |
| **Content** | [MDX](https://mdxjs.com) with [@next/mdx](https://nextjs.org/docs/app/building-your-application/configuring/mdx) |
| **Syntax Highlighting** | [Shiki](https://shiki.style) |
| **Animations** | [Motion](https://motion.dev) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Dark Mode** | [next-themes](https://github.com/pacocoursey/next-themes) |
| **Hosting** | [Firebase Hosting](https://firebase.google.com/products/hosting) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) — lint, build, deploy |
| **Package Manager** | [pnpm](https://pnpm.io) 10 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 22
- [pnpm](https://pnpm.io) >= 10

### Development

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev
```

### Build

```bash
# Create optimized static export → out/
pnpm build
```

### Lint

```bash
pnpm lint
```

## Deployment

Deployment is fully automated via **GitHub Actions** on every push to `main`:

```
push to main → install → lint → build → deploy to Firebase Hosting
```

For manual deployment:

```bash
firebase deploy
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── compare/            # Encoding comparison tool
│   ├── encodings/          # Catalog + [slug] detail pages
│   └── guide/              # Decision guide wizard
├── components/
│   ├── encodings/          # Catalog cards, detail sections
│   ├── guide/              # Wizard steps, results, option cards
│   ├── landing/            # Hero, features, carousel, stats
│   ├── layout/             # Header, footer, navigation
│   ├── math/               # InlineMath, DisplayMath (KaTeX)
│   ├── ui/                 # 19 shadcn/ui primitives
│   └── visualization/      # Circuit diagrams, radar charts
├── content/encodings/      # 16 MDX long-form documentation files
├── data/
│   ├── encodings/          # 16 TypeScript encoding definitions
│   ├── categories.ts       # 7 encoding categories
│   └── guide-rules.ts     # Recommendation rules & constraints
├── hooks/                  # useGuideWizard, useCompareEncodings, ...
└── lib/
    ├── recommender.ts      # Deterministic recommendation engine
    ├── mdx.ts              # Dynamic MDX import map
    ├── animation-variants.ts
    └── utils.ts
```

## Related

| | Link |
|:--|:-----|
| **Python Library** | [`pip install encoding-atlas`](https://pypi.org/project/encoding-atlas/) |
| **Source Code** | [github.com/encoding-atlas/quantum-encoding-atlas](https://github.com/encoding-atlas/quantum-encoding-atlas) |
| **Documentation** | [encoding-atlas.github.io/quantum-encoding-atlas](https://encoding-atlas.github.io/quantum-encoding-atlas/) |
| **Tutorials** | [encoding-atlas.github.io/.../tutorials](https://encoding-atlas.github.io/quantum-encoding-atlas/tutorials/) |
| **API Reference** | [encoding-atlas.github.io/.../api](https://encoding-atlas.github.io/quantum-encoding-atlas/api/) |

## License

[MIT](../quantum-encoding-atlas/LICENSE) © 2026 Quantum Encoding Atlas Contributors
