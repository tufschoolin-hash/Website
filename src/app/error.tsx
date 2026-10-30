"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import styles from "./status-page.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the technical detail in the browser console, never in the UI.
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page} id="main">
      <div className="container">
        <div className={styles.inner}>
          <p className={`eyebrow ${styles.eyebrow}`}>TUF Networks / Something went wrong</p>
          <h1 className={styles.title}>
            A brief <em>interruption.</em>
          </h1>
          <p className={styles.body}>
            This page couldn’t load properly. Please try again — if the problem continues, come back
            in a little while.
          </p>
          {error.digest ? <p className={styles.detail}>Reference: {error.digest}</p> : null}
          <div className={styles.actions}>
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Link className="btn btnGhost" href="/">
              Return home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
