import Image from "next/image";

import peopleImage from "@/assets/images/people-aerial.webp";
import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./people.module.css";

const CHIPS = ["Founders", "Builders", "Creators", "Operators", "Students", "Artists"] as const;

export function People() {
  return (
    <section className="section" id="people" aria-labelledby="people-title">
      <div className={`container ${styles.grid}`}>
        <figure className={styles.figure}>
          <Image
            src={peopleImage}
            alt="Aerial view of a large, diverse group gathered in one room."
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            placeholder="blur"
            quality={82}
            className={styles.image}
          />
          <figcaption className={styles.caption}>
            <span>The atmosphere we’re building</span>
            <span aria-hidden="true">One room · One city</span>
          </figcaption>
        </figure>

        <div className={styles.copy}>
          <SectionHeading
            eyebrow="TUF Networks / 03 — The people"
            id="people-title"
            title={
              <>
                100 insiders. <em>One city.</em>
              </>
            }
            lede="You’re selected. Curated for ambition, execution, and the belief that the right room changes everything."
            tight
          />

          <p className={styles.body}>
            A diverse collection of ambitious people. Founders. Builders. Creators. Operators.
            Professionals. Students. Artists. People exploring what’s possible.
          </p>

          <ul className={styles.chips} aria-label="Who is in the room">
            {CHIPS.map((chip) => (
              <li className={styles.chip} key={chip}>
                {chip}
              </li>
            ))}
          </ul>

          <div className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <h3>The curated 100</h3>
              <p>
                Not everyone gets in. We select people who build, create, lead, and think
                differently. One city. One network. Infinite possibilities.
              </p>
            </article>
            <article className={styles.infoCard}>
              <h3>What connects them</h3>
              <blockquote>
                “Ambition. Curiosity. A willingness to learn. A belief that who you know changes
                what becomes possible.”
              </blockquote>
            </article>
          </div>

          <ArrowLink href="#apply">See if you belong</ArrowLink>
        </div>
      </div>
    </section>
  );
}
