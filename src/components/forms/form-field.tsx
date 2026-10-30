"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/cn";

import styles from "./forms.module.css";

type TextFieldType = "text" | "email" | "url";

interface TextFieldProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  hint?: string;
  optional?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: TextFieldType;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  className?: string;
}

export function TextField({
  id,
  label,
  registration,
  error,
  hint,
  optional = false,
  required = false,
  multiline = false,
  rows = 3,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  className,
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null]
      .filter((value): value is string => Boolean(value))
      .join(" ") || undefined;

  const sharedProps = {
    id,
    className: styles.input,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": required ? true : undefined,
    placeholder,
    ...registration,
  } satisfies TextareaHTMLAttributes<HTMLTextAreaElement>;

  return (
    <div className={cn(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.req} aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </label>

      {multiline ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input
          {...(sharedProps as InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />
      )}

      {hint ? (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={styles.fieldError} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface CheckboxFieldProps {
  id: string;
  registration: UseFormRegisterReturn;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function CheckboxField({
  id,
  registration,
  error,
  children,
  className,
}: CheckboxFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn(styles.field, styles.checkField, className)}>
      <div className={styles.check}>
        <input
          id={id}
          type="checkbox"
          className={styles.checkbox}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...registration}
        />
        <label className={styles.checkLabel} htmlFor={id}>
          {children}
          <span className={styles.req} aria-hidden="true">
            {" "}
            *
          </span>
        </label>
      </div>
      {error ? (
        <p className={styles.fieldError} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface HoneypotFieldProps {
  id: string;
  registration: UseFormRegisterReturn;
}

/**
 * Invisible to people and assistive technology, tempting to naive bots.
 * The server treats any value as spam without revealing the trap.
 */
export function HoneypotField({ id, registration }: HoneypotFieldProps) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor={id}>Company website</label>
      <input id={id} type="text" tabIndex={-1} autoComplete="off" {...registration} />
    </div>
  );
}
