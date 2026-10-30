"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

import styles from "./marquee.module.css";

const WORDS = ["Founders", "Builders", "Creators", "Operators", "Makers"] as const;

export function Marquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={styles.marquee}
      role="group"
      aria-label="Who the network is for"
      data-paused={paused ? "true" : "false"}
    >
      <div className={styles.viewport}>
        <div className={styles.track} data-marquee-track>
          <ul className={styles.group}>
            {WORDS.map((word) => (
              <li key={word} className={styles.item}>
                {word}
              </li>
            ))}
          </ul>
          <ul className={styles.group} aria-hidden="true">
            {WORDS.map((word) => (
              <li key={word} className={styles.item}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button
        className={styles.control}
        type="button"
        aria-pressed={paused}
        aria-label={paused ? "Play scrolling text" : "Pause scrolling text"}
        onClick={() => setPaused((current) => !current)}
        data-marquee-control
      >
        {paused ? (
          <Play aria-hidden="true" fill="currentColor" strokeWidth={1.8} />
        ) : (
          <Pause aria-hidden="true" fill="currentColor" strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}
