import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  inline?: boolean;
  className?: string;
}

export function ArrowLink({ href, children, inline = false, className }: ArrowLinkProps) {
  return (
    <a
      className={cn("textLink", inline && "textLinkInline", className)}
      href={href}
    >
      {children}
      {!inline && <ArrowRight aria-hidden="true" strokeWidth={1.8} />}
    </a>
  );
}
