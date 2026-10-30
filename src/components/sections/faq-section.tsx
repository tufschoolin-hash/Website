import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ_ITEMS } from "@/lib/faq";

import styles from "./faq-section.module.css";

export function FaqSection() {
  return (
    <section className="section sectionLine" id="faq" aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <SectionHeading
          eyebrow="TUF Networks / 13 — FAQ"
          id="faq-title"
          title={
            <>
              Questions, <em>answered.</em>
            </>
          }
          lede="Everything you need to know before you request an invitation."
          tight
        />

        <div className={styles.faq}>
          {FAQ_ITEMS.map((item) => (
            <details className={styles.item} key={item.question}>
              <summary className={styles.question}>
                <span>{item.question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
