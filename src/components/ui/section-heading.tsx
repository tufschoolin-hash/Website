import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import styles from "./section-heading.module.css";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  centered?: boolean;
  tight?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  centered = false,
  tight = false,
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(styles.header, centered && styles.centered, tight && styles.tight, className)}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="sectionTitle">
        {title}
      </h2>
      {lede ? <p className="sectionLede">{lede}</p> : null}
    </header>
  );
}
