import Image from "next/image";

import conversationImage from "@/assets/images/gallery-conversation.webp";
import networkingImage from "@/assets/images/gallery-networking.webp";
import overheadImage from "@/assets/images/gallery-overhead.webp";
import foundingCircleImage from "@/assets/images/experience-founding-circle.webp";
import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./gallery.module.css";

export function Gallery() {
  return (
    <section className="section sectionLine" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHeading
          eyebrow="TUF Networks / 10 — Inside the room"
          id="gallery-title"
          title={
            <>
              Inside <em>the room.</em>
            </>
          }
          lede="A glimpse of the atmosphere TUF Networks is building — the conversations, the energy and the rooms we want more of."
        />

        <div className={styles.grid}>
          <figure className={`${styles.item} ${styles.wide}`}>
            <Image
              src={foundingCircleImage}
              alt="A small group in conversation around a candlelit table."
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              placeholder="blur"
              quality={82}
              className={styles.image}
            />
          </figure>
          <figure className={`${styles.item} ${styles.tall}`}>
            <Image
              src={conversationImage}
              alt="Two people in a focused conversation over coffee in a dimly lit space."
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              placeholder="blur"
              quality={82}
              className={styles.image}
            />
          </figure>
          <figure className={styles.item}>
            <Image
              src={networkingImage}
              alt="A group laughing together at an evening gathering, city lights behind them."
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              placeholder="blur"
              quality={82}
              className={styles.image}
            />
          </figure>
          <figure className={styles.item}>
            <Image
              src={overheadImage}
              alt="Overhead view of people sketching and brainstorming at a shared table."
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              placeholder="blur"
              quality={82}
              className={styles.image}
            />
          </figure>
        </div>

        <p className={styles.note}>
          Images are representative of the atmosphere TUF Networks is building.
        </p>
      </div>
    </section>
  );
}
