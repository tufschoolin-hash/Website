"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";

import { cn } from "@/lib/cn";

import styles from "./forms.module.css";

export type FormStatusKind = "success" | "error" | "info";

export interface FormStatusState {
  kind: FormStatusKind;
  message: string;
  contactEmail?: string;
}

interface FormStatusProps {
  status: FormStatusState | null;
}

export function FormStatus({ status }: FormStatusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!status) return;
    ref.current?.focus();
  }, [status]);

  if (!status) return null;

  const Icon = status.kind === "success" ? CircleCheck : status.kind === "error" ? CircleAlert : Info;
  const kindClass =
    status.kind === "success"
      ? styles.statusSuccess
      : status.kind === "error"
        ? styles.statusError
        : styles.statusInfo;

  return (
    <div
      ref={ref}
      className={cn(styles.status, kindClass)}
      role={status.kind === "error" ? "alert" : "status"}
      tabIndex={-1}
    >
      <Icon className={styles.statusIcon} aria-hidden="true" strokeWidth={1.8} />
      <div>
        <p>{status.message}</p>
        {status.contactEmail ? (
          <p className={styles.statusContact}>
            You can also reach us at{" "}
            <a href={`mailto:${status.contactEmail}`}>{status.contactEmail}</a>.
          </p>
        ) : null}
      </div>
    </div>
  );
}
