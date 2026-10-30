import { cn } from "@/lib/cn";

import styles from "./brand.module.css";

interface BrandProps {
  href?: string;
  footer?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Brand({ href = "#top", footer = false, className, onClick }: BrandProps) {
  return (
    <a
      className={cn(styles.brand, footer && styles.footer, className)}
      href={href}
      aria-label="TUF Networks home"
      onClick={onClick}
    >
      <span className={styles.mark} aria-hidden="true">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <path d="M18 48V27a14 14 0 0 1 28 0v21" />
          <path
            d="M26 48V28a6 6 0 0 1 12 0v20"
            opacity=".55"
            strokeWidth="2.5"
          />
          <path d="M14 48h36" />
        </svg>
      </span>
      <span className={styles.text}>
        <span className={styles.small}>TUF</span>{" "}
        <span className={styles.name}>NETWORKS</span>
      </span>
    </a>
  );
}
