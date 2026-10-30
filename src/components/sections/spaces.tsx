import blendImage from "@/assets/images/space-blend.webp";
import commonsImage from "@/assets/images/space-commons.webp";
import studioImage from "@/assets/images/space-studio.webp";
import { CardGrid } from "@/components/ui/card-grid";
import { MediaCard } from "@/components/ui/media-card";
import { SectionHeading } from "@/components/ui/section-heading";

export function Spaces() {
  return (
    <section className="section" id="spaces" aria-labelledby="spaces-title">
      <div className="container">
        <SectionHeading
          eyebrow="TUF Networks / 05 — Partner spaces"
          id="spaces-title"
          title={
            <>
              Partner spaces. <em>Where it happens.</em>
            </>
          }
          lede="Curated cafés, coworking spaces and gathering places designed for meaningful conversations."
        />

        <CardGrid>
          <MediaCard
            image={blendImage}
            alt="A minimalist café with warm lighting and wooden tables."
            kicker="Café & workspace"
            title="The Blend Coffee Co."
            description="Modern café with private meeting nooks."
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            partner
          />
          <MediaCard
            image={studioImage}
            alt="A bright, plant-filled coworking space with open-plan desks."
            kicker="Co-working space"
            title="Studio Labs"
            description="Collaborative workspace for builders."
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            partner
          />
          <MediaCard
            image={commonsImage}
            alt="A spacious event hall with exposed brick, warm lighting and round tables."
            kicker="Gathering hall"
            title="The Commons"
            description="Event space for founder circles."
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            partner
          />
        </CardGrid>
      </div>
    </section>
  );
}
