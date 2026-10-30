import { About } from "@/components/sections/about";
import { Access } from "@/components/sections/access";
import { Apply } from "@/components/sections/apply";
import { Experiences } from "@/components/sections/experiences";
import { FaqSection } from "@/components/sections/faq-section";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Membership } from "@/components/sections/membership";
import { Network } from "@/components/sections/network";
import { Opportunities } from "@/components/sections/opportunities";
import { People } from "@/components/sections/people";
import { Spaces } from "@/components/sections/spaces";
import { Standard } from "@/components/sections/standard";
import { Vision } from "@/components/sections/vision";
import { FAQ_ITEMS } from "@/lib/faq";
import {
  faqJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const structuredData = [
  organizationJsonLd(),
  websiteJsonLd(),
  faqJsonLd(FAQ_ITEMS),
] as const;

export default function HomePage() {
  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
        />
      ))}

      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Access />
        <People />
        <Experiences />
        <Spaces />
        <Opportunities />
        <Network />
        <Membership />
        <Standard />
        <Gallery />
        <Vision />
        <Apply />
        <FaqSection />
      </main>
    </>
  );
}
