import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/button";

import styles from "./status-page.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className={styles.page} id="main">
      <div className="container">
        <div className={styles.inner}>
          <p className={`eyebrow ${styles.eyebrow}`}>TUF Networks / 404</p>
          <h1 className={styles.title}>
            This room <em>isn’t here.</em>
          </h1>
          <p className={styles.body}>
            The page you’re looking for may have moved, or it may never have existed. The room
            itself is still being built.
          </p>
          <div className={styles.actions}>
            <ButtonLink href="/">Return to the room</ButtonLink>
            <ButtonLink href="/#apply" variant="ghost">
              Request an invitation
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
