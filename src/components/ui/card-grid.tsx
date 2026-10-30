import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import styles from "./card-grid.module.css";

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

/** Shared responsive grid for the experiences and partner-space cards. */
export function CardGrid({ children, className }: CardGridProps) {
  return <div className={cn(styles.grid, className)}>{children}</div>;
}
