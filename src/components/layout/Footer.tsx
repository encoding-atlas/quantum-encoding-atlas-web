import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/constants";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Project",
    links: [
      { label: "Overview", href: "/" },
      { label: "All Encodings", href: "/encodings" },
      { label: "Compare", href: "/compare" },
      { label: "Decision Guide", href: "/guide" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: EXTERNAL_LINKS.docs, external: true },
      {
        label: "API Reference",
        href: `${EXTERNAL_LINKS.docs}api/`,
        external: true,
      },
      {
        label: "Tutorials",
        href: `${EXTERNAL_LINKS.docs}tutorials/`,
        external: true,
      },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: EXTERNAL_LINKS.github, external: true },
      { label: "PyPI Package", href: EXTERNAL_LINKS.pypi, external: true },
      {
        label: "Issues",
        href: `${EXTERNAL_LINKS.github}/issues`,
        external: true,
      },
      {
        label: "Contributing",
        href: `${EXTERNAL_LINKS.github}/blob/master/CONTRIBUTING.md`,
        external: true,
      },
    ],
  },
  {
    title: "About",
    links: [
      {
        label: "MIT License",
        href: `${EXTERNAL_LINKS.github}/blob/master/LICENSE`,
        external: true,
      },
      {
        label: "Changelog",
        href: `${EXTERNAL_LINKS.github}/blob/master/CHANGELOG.md`,
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* Gradient accent line */}
      <div className="h-px gradient-quantum" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Link grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Quantum Encoding Atlas. MIT
            Licensed. Built by{" "}
            <a
              href="https://github.com/encoding-atlas/quantum-encoding-atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              QEA Contributors
            </a>
            .{" "}
            <a
              href="https://github.com/encoding-atlas/quantum-encoding-atlas-web"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Web
            </a>
            {" | "}
            <a
              href="https://github.com/encoding-atlas/quantum-encoding-atlas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Project
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
