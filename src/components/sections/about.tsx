import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./about.module.css";

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionHeading
            eyebrow="TUF Networks / 01 — The idea"
            id="about-title"
            title={
              <>
                Not another <em>networking group.</em>
              </>
            }
            tight
          />

          <div className={styles.prose}>
            <p>
              We don’t believe meaningful relationships are built by collecting LinkedIn
              connections.
            </p>
            <p>
              They are built around shared experiences, honest conversations, interesting problems
              and time spent in the same room.
            </p>
          </div>

          <div className={styles.principle}>
            <p className={styles.principleLabel}>Our standard</p>
            <p className={styles.principleStatement}>
              Quality <em>over quantity.</em>
            </p>
            <p className={styles.principleNote}>
              TUF Networks is intentionally small, curated and relationship-first.
            </p>
          </div>
        </div>

        <aside className={styles.quoteCard} aria-label="The TUF Networks philosophy">
          <p className="eyebrow">The philosophy</p>
          <blockquote className={styles.quote}>
            “The right room changes what you see, who you meet, and what you build.”
          </blockquote>
          <p className={styles.cite}>— TUF Networks</p>
          <p className={styles.note}>A room built on shared experience, not transaction.</p>
        </aside>
      </div>
    </section>
  );
}
