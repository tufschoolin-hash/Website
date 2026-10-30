import { X } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./standard.module.css";

const NOT_ITEMS = [
  "Not a LinkedIn group.",
  "Not a WhatsApp group.",
  "Not a conference.",
  "Not a mass community.",
  "Not a collection of business cards.",
] as const;

const BELIEFS = [
  "Interesting people deserve interesting rooms.",
  "Relationships matter more than reach.",
  "Curiosity is more valuable than status.",
  "Builders should meet builders.",
  "Experiences create stronger relationships than introductions.",
  "Small rooms create better conversations.",
  "The best opportunities often begin with a conversation.",
] as const;

export function Standard() {
  return (
    <section className="section" id="standard" aria-labelledby="standard-title">
      <div className="container">
        <SectionHeading
          eyebrow="TUF Networks / 09 — The standard"
          id="standard-title"
          title={
            <>
              What we <em>stand for.</em>
            </>
          }
        />

        <div className={styles.grid}>
          <div>
            <h3 className="subhead">What this isn’t.</h3>
            <ul className={styles.notList}>
              {NOT_ITEMS.map((item) => (
                <li key={item}>
                  <X aria-hidden="true" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className={styles.result}>
              A curated <em>room.</em>
            </p>
          </div>

          <div className={styles.manifesto}>
            <h3 className="subhead">We believe…</h3>
            <ul className={styles.manifestoList}>
              {BELIEFS.map((belief) => (
                <li key={belief}>{belief}</li>
              ))}
            </ul>
            <p className={styles.foot}>
              Build the room.
              <br />
              <span>Build what’s next.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
