import { ApplicationForm } from "@/components/forms/application-form";
import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./apply.module.css";

const STEPS = [
  "Tell us who you are.",
  "Show us what you’re building.",
  "Tell us what you’re curious about.",
  "Tell us why you want to be in the room.",
] as const;

export function Apply() {
  return (
    <section className="section sectionLine" id="apply" aria-labelledby="apply-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionHeading
            eyebrow="TUF Networks / 12 — Access"
            id="apply-title"
            title={
              <>
                Think you <em>belong here?</em>
              </>
            }
            lede="Tell us who you are, what you’re building and what you’re curious about. We care about evidence of action more than impressive titles."
            tight
          />

          <ol className={styles.steps}>
            {STEPS.map((step, index) => (
              <li className={styles.step} key={step}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>

          <p className={styles.note}>
            Applications are reviewed for fit. Applying does not guarantee a place.
          </p>
        </div>

        <div className={styles.formCard}>
          <p className="eyebrow">Request an invitation</p>
          <h3>Tell us about you.</h3>
          <p className={styles.intro}>
            A few honest answers are more useful than a polished pitch.
          </p>
          <noscript>
            <p className={styles.noscript}>
              JavaScript is required to submit this form. Please enable JavaScript to apply.
            </p>
          </noscript>
          <ApplicationForm />
        </div>
      </div>
    </section>
  );
}
