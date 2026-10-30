import { ArrowUp } from "lucide-react";

import { Brand } from "@/components/ui/brand";
import { cn } from "@/lib/cn";

import styles from "./site-footer.module.css";

const exploreLinks = [
  { label: "About", href: "#about" },
  { label: "The Room", href: "#the-room" },
  { label: "Experiences", href: "#experiences" },
  { label: "People", href: "#people" },
  { label: "Membership", href: "#membership" },
  { label: "FAQ", href: "#faq" },
] as const;

const involvementLinks = [
  { label: "Request an invitation", href: "#apply" },
  { label: "The standard", href: "#standard" },
  { label: "Inside the room", href: "#gallery" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <Brand footer href="#top" />
            <p className={styles.description}>A curated network for people building what’s next.</p>
            <p className={styles.fullName}>The Ultimate Foundery</p>
          </div>

          <div className={styles.column}>
            <h2>Explore</h2>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h2>Get involved</h2>
            <ul>
              {involvementLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h2>The room</h2>
            <ul className={styles.meta}>
              <li>Kerala, India</li>
              <li>By invitation</li>
              <li>Kerala → India → Beyond</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} TUF — The Ultimate Foundery</p>
          <p>Built around the room.</p>
          <a className={cn(styles.topLink)} href="#top">
            Back to top
            <ArrowUp aria-hidden="true" strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </footer>
  );
}
