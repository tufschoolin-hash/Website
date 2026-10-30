import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

import styles from "./vision.module.css";

export function Vision() {
  return (
    <section className={`section ${styles.vision}`} id="vision" aria-labelledby="vision-title">
      <div className={`container ${styles.inner}`}>
        <p className={`eyebrow ${styles.eyebrow}`}>TUF Networks / 11 — Vision</p>
        <h2 id="vision-title" className={styles.title}>
          One day, <em>this room will be everywhere.</em>
        </h2>
        <p className={styles.body}>
          TUF Networks starts with a small room. Then another. Then another. Different cities.
          Different industries. Same philosophy.
        </p>
        <p className={styles.route}>
          Kerala <span aria-hidden="true">→</span> India <span aria-hidden="true">→</span> Beyond
        </p>
        <ButtonLink href="#apply" className={styles.cta}>
          Be part of the first room
          <ArrowRight aria-hidden="true" strokeWidth={1.8} />
        </ButtonLink>
      </div>
    </section>
  );
}
