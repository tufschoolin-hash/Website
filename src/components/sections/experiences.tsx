import buildNightImage from "@/assets/images/experience-build-night.webp";
import foundingCircleImage from "@/assets/images/experience-founding-circle.webp";
import openRoomImage from "@/assets/images/experience-open-room.webp";
import { ArrowLink } from "@/components/ui/arrow-link";
import { CardGrid } from "@/components/ui/card-grid";
import { MediaCard } from "@/components/ui/media-card";
import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./experiences.module.css";

export function Experiences() {
  return (
    <section className="section sectionLine" id="experiences" aria-labelledby="experiences-title">
      <div className="container">
        <SectionHeading
          eyebrow="TUF Networks / 04 — Experiences"
          id="experiences-title"
          title={
            <>
              Meet people <em>by doing things.</em>
            </>
          }
          lede="The best relationships rarely begin with “So, what do you do?” They begin with shared experiences."
        />

        <CardGrid>
          <MediaCard
            image={foundingCircleImage}
            alt="Founders sharing an intimate candlelit dinner around a table."
            kicker="Gathering"
            title="Founding Circle"
            description="An evening for people building what’s next."
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
          <MediaCard
            image={buildNightImage}
            alt="A collaborative workshop with people working together on laptops and notepads."
            kicker="Workshop"
            title="Build Night"
            description="Build. Think. Ship."
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
          <MediaCard
            image={openRoomImage}
            alt="Professionals in conversation at a standing gathering in a modern gallery-like space."
            kicker="Gathering"
            title="Open Room"
            description="A room full of interesting people."
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        </CardGrid>

        <p className={styles.foot}>
          <ArrowLink href="#apply">Request an invitation</ArrowLink>
        </p>
      </div>
    </section>
  );
}
