import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { encodings, getEncodingBySlug } from "@/data/encodings";
import { SITE_CONFIG, EXTERNAL_LINKS } from "@/lib/constants";
import { EncodingHeader } from "@/components/encodings/EncodingHeader";
import { MathDisplay } from "@/components/encodings/MathDisplay";
import {
  LazyCircuitDiagram,
  LazyPropertyRadar,
} from "@/components/encodings/EncodingVisualizations";
import { PropertyTable } from "@/components/encodings/PropertyTable";
import { CodeExampleTabs } from "@/components/encodings/CodeExampleTabs";
import { UseCasesSection } from "@/components/encodings/UseCasesSection";
import { ProsConsSection } from "@/components/encodings/ProsConsSection";
import { ResourceProfilesTable } from "@/components/encodings/ResourceProfilesTable";
import { ReferencesSection } from "@/components/encodings/ReferencesSection";
import { EncodingNavigation } from "@/components/encodings/EncodingNavigation";
import { SidebarQuickFacts } from "@/components/encodings/SidebarQuickFacts";
import { Separator } from "@/components/ui/separator";

export function generateStaticParams() {
  return encodings.map((encoding) => ({
    slug: encoding.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const encoding = getEncodingBySlug(slug);
  if (!encoding) return {};

  return {
    title: `${encoding.name}`,
    description: encoding.shortDescription,
    openGraph: {
      title: `${encoding.name} — ${SITE_CONFIG.name}`,
      description: encoding.shortDescription,
      type: "article",
      url: `${SITE_CONFIG.url}/encodings/${encoding.slug}`,
    },
  };
}

export default async function EncodingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const encoding = getEncodingBySlug(slug);

  if (!encoding) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: encoding.name,
    description: encoding.shortDescription,
    author: {
      "@type": "Person",
      name: "Ashutosh Mishra",
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    about: {
      "@type": "SoftwareSourceCode",
      name: "encoding-atlas",
      codeRepository: EXTERNAL_LINKS.github,
      programmingLanguage: "Python",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <EncodingHeader encoding={encoding} />

          {/* Two-column layout */}
          <div className="mt-12 flex flex-col gap-10 lg:flex-row">
            {/* Main column */}
            <div className="min-w-0 flex-1 space-y-10">
              {/* Mathematical Formulation */}
              <section>
                <h2 className="text-xl font-semibold tracking-tight">
                  Mathematical Formulation
                </h2>
                <MathDisplay
                  formula={encoding.mathFormulation}
                  ariaLabel={`Mathematical formula for ${encoding.name}`}
                />
              </section>

              {/* Description */}
              <section>
                <h2 className="text-xl font-semibold tracking-tight">
                  Description
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  {encoding.description.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>

              {/* Circuit Diagram placeholder */}
              <section>
                <h2 className="text-xl font-semibold tracking-tight">
                  Circuit Diagram
                </h2>
                <div className="mt-4">
                  <LazyCircuitDiagram encoding={encoding} />
                </div>
              </section>

              {/* Property Radar placeholder */}
              <section>
                <h2 className="text-xl font-semibold tracking-tight">
                  Property Radar
                </h2>
                <div className="mt-4">
                  <LazyPropertyRadar encoding={encoding} />
                </div>
              </section>

              <Separator />

              {/* Properties Table (full) */}
              <section>
                <h2 className="text-xl font-semibold tracking-tight">
                  Properties
                </h2>
                <div className="mt-4">
                  <PropertyTable
                    properties={encoding.properties}
                    variant="full"
                  />
                </div>
              </section>

              {/* Resource Profiles */}
              {encoding.resourceProfiles.length > 0 && (
                <>
                  <Separator />
                  <ResourceProfilesTable
                    profiles={encoding.resourceProfiles}
                  />
                </>
              )}

              <Separator />

              {/* Code Examples */}
              <section>
                <h2 className="text-xl font-semibold tracking-tight">
                  Code Examples
                </h2>
                <div className="mt-4">
                  <CodeExampleTabs examples={encoding.codeExamples} />
                </div>
              </section>

              <Separator />

              {/* Use Cases */}
              <UseCasesSection useCases={encoding.useCases} />

              <Separator />

              {/* Pros & Cons */}
              <ProsConsSection
                pros={encoding.prosAndCons.pros}
                cons={encoding.prosAndCons.cons}
              />

              <Separator />

              {/* References */}
              <ReferencesSection references={encoding.references} />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 xl:w-96">
              <SidebarQuickFacts encoding={encoding} />
            </div>
          </div>

          {/* Prev/Next Navigation */}
          <EncodingNavigation currentSlug={encoding.slug} />
        </div>
      </article>
    </>
  );
}
