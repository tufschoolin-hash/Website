import type { LucideIcon } from "lucide-react";
import { Compass, DoorOpen, GitMerge, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

import styles from "./access.module.css";

interface AccessItem {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

const ITEMS: readonly AccessItem[] = [
  {
    title: "Experiences",
    description: "Curated events and gatherings designed to create meaningful connections.",
    icon: Sparkles,
  },
  {
    title: "Collaborations",
    description: "Find people and teams to build projects, companies and ideas with.",
    icon: GitMerge,
  },
  {
    title: "Opportunities",
    description: "Discover ventures, investments, roles and possibilities through the network.",
    icon: Compass,
  },
  {
    title: "The Room",
    description: "Access to an exclusive, curated community of ambitious thinkers and builders.",
    icon: DoorOpen,
  },
];

export function Access() {
  return (
    <section className="section sectionLine" id="the-room" aria-labelledby="access-title">
      <div className="container">
        <SectionHeading
          eyebrow="TUF Networks / 02 — What you get"
          id="access-title"
          title={
            <>
              What you get <em>access to.</em>
            </>
          }
          lede="Four things every member can expect from the room: the people, the experiences, the opportunities and the conversations that connect them."
        />

        <div className={styles.grid}>
          {ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <article className={styles.card} key={item.title}>
                <div className={styles.top}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon strokeWidth={1.8} />
                  </span>
                  <span className={styles.num} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
