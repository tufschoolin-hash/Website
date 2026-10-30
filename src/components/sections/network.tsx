import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./network.module.css";

const NODES = [
  "Founders",
  "Builders",
  "Creators",
  "Operators",
  "Companies",
  "Investors",
  "TUF Students",
  "Alumni",
] as const;

export function Network() {
  return (
    <section className="section" id="network" aria-labelledby="network-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionHeading
            eyebrow="TUF Networks / 07 — The network"
            id="network-title"
            title={
              <>
                One room. <em>Many possibilities.</em>
              </>
            }
            lede="Every person in the network connects to every other — creating a living ecosystem of founders, builders, creators, operators and companies."
            tight
          />
          <p className={styles.note}>Eight roles. One connected room.</p>
        </div>

        <div className={styles.orbitWrap}>
          <div className={styles.orbit} role="group" aria-label="TUF Networks connects eight roles">
            <svg className={styles.lines} viewBox="0 0 100 100" aria-hidden="true">
              <line x1="50" y1="50" x2="50" y2="6" />
              <line x1="50" y1="50" x2="88" y2="20" />
              <line x1="50" y1="50" x2="94" y2="50" />
              <line x1="50" y1="50" x2="88" y2="80" />
              <line x1="50" y1="50" x2="50" y2="94" />
              <line x1="50" y1="50" x2="12" y2="80" />
              <line x1="50" y1="50" x2="6" y2="50" />
              <line x1="50" y1="50" x2="12" y2="20" />
            </svg>
            <div className={`${styles.ring} ${styles.ringOuter}`} aria-hidden="true" />
            <div className={`${styles.ring} ${styles.ringInner}`} aria-hidden="true" />

            <div className={styles.core} aria-hidden="true">
              <span>TUF</span>
              <strong>NETWORKS</strong>
            </div>

            <ul className={styles.nodes}>
              {NODES.map((node) => (
                <li className={styles.node} key={node}>
                  {node}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
