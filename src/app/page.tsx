import {
  HeroSection,
  FeaturesSection,
  EncodingCarousel,
  EncodingOverviewSection,
  HowItWorksSection,
  StatsSection,
  FooterCTA,
} from "@/components/landing";
import { SITE_CONFIG, EXTERNAL_LINKS } from "@/lib/constants";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    license: "https://opensource.org/licenses/MIT",
    codeRepository: EXTERNAL_LINKS.github,
    programmingLanguage: "Python",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <EncodingCarousel />
      <HowItWorksSection />
      <EncodingOverviewSection />
      <StatsSection />
      <FooterCTA />
    </>
  );
}
