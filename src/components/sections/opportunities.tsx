import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./opportunities.module.css";

const ITEMS = [
  { title: "Collaborations", description: "Find people to build with." },
  { title: "Ventures", description: "Discover companies and projects." },
  { title: "Mentorship", description: "Learn from experienced builders." },
] as const;

export function Opportunities() {
  return (
    <section className="section sectionLine" id="opportunities" aria-labelledby="opportunities-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionHeading
            eyebrow="TUF Networks / 06 — Opportunities"
            id="opportunities-title"
            title={
              <>
                Discover what <em>comes next.</em>
              </>
            }
            lede="Meet collaborators. Find your next venture. Build something that matters. The best opportunities are often one conversation away."
            tight
          />
          <ArrowLink href="#apply">Start with an introduction</ArrowLink>
        </div>

        <ol className={styles.list}>
          {ITEMS.map((item, index) => (
            <li className={styles.item} key={item.title}>
              <span className={styles.num} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
