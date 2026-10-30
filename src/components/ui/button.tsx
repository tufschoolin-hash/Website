import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "md" | "sm";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btnPrimary",
  ghost: "btnGhost",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "",
  sm: "btnSmall",
};

interface SharedButtonOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export type ButtonLinkProps = SharedButtonOptions &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "btn",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "btnFull",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export type ButtonProps = SharedButtonOptions & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "btn",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "btnFull",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
