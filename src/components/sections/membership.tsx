import type { LucideIcon } from "lucide-react";
import { Eye, GitMerge, Heart, KeyRound, Users, Zap } from "lucide-react";

import { ArrowLink } from "@/components/ui/arrow-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

import styles from "./membership.module.css";

const JOURNEY = [
  { title: "Discover", description: "Learn what TUF Networks is and who it is for." },
  {
    title: "Get invited",
    description: "Request an invitation and tell us about yourself.",
  },
  { title: "Introduction", description: "Tell us who you are and what you are building." },
  { title: "Curated", description: "Applications are reviewed for fit, not volume." },
  {
    title: "Enter the room",
    description: "Meet the people, spaces and conversations that make the network.",
  },
  { title: "Contribute", description: "Bring something useful to the room." },
  { title: "Connect", description: "Build relationships that outlast the introduction." },
] as const;

const CURRENT_STEP_INDEX = 4;

interface ValueItem {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

const VALUES: readonly ValueItem[] = [
  { title: "People", description: "Meet exceptional people.", icon: Users },
  { title: "Perspective", description: "See problems differently.", icon: Eye },
  { title: "Access", description: "Get closer to founders and operators.", icon: KeyRound },
  { title: "Collaboration", description: "Find people to build with.", icon: GitMerge },
  { title: "Opportunity", description: "Discover what comes next.", icon: Zap },
  { title: "Belonging", description: "Be part of a room that expects more.", icon: Heart },
];

export function Membership() {
  return (
    <section className="section sectionLine" id="membership" aria-labelledby="membership-title">
      <div className="container">
        <SectionHeading
          eyebrow="TUF Networks / 08 — Membership"
          id="membership-title"
          title={
            <>
              Access is <em>curated.</em>
            </>
          }
          lede="TUF Networks is not designed around open registration. Every application is reviewed for fit."
        />

        <ol className={styles.journey} aria-label="The membership journey">
          {JOURNEY.map((step, index) => {
            const current = index === CURRENT_STEP_INDEX;

            return (
              <li
                className={cn(styles.step, current && styles.current)}
                key={step.title}
                aria-current={current ? "step" : undefined}
              >
                <span className={styles.stepNum} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>

        <div className={styles.values}>
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <article className={styles.value} key={value.title}>
                <span className={styles.valueIcon} aria-hidden="true">
                  <Icon strokeWidth={1.8} />
                </span>
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </article>
            );
          })}
        </div>

        <p className={styles.note}>
          Applying does not guarantee a place.{" "}
          <ArrowLink href="#apply" inline>
            Request an invitation
          </ArrowLink>
        </p>
      </div>
    </section>
  );
}
