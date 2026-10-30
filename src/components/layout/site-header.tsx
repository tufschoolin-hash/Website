"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Brand } from "@/components/ui/brand";
import { useActiveSection } from "@/hooks/use-active-section";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, NAV_SECTION_IDS } from "@/lib/site";

import styles from "./site-header.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const scrolled = useScrolled();
  const activeId = useActiveSection(NAV_SECTION_IDS);
  const activeHref = activeId ? `#${activeId}` : null;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open || !isMobile) return;

    const { body } = document;
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");

    body.classList.add("menu-open");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        window.requestAnimationFrame(() => menuToggleRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !headerRef.current) return;

      const focusable = Array.from(
        headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getClientRects().length > 0);

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      body.classList.remove("menu-open");
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, isMobile]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      ref={headerRef}
      className={cn(styles.header, scrolled && styles.scrolled)}
      data-open={open ? "true" : "false"}
    >
      <div className={cn("container", styles.inner)}>
        <Brand onClick={closeMenu} />

        <button
          ref={menuToggleRef}
          className={styles.toggle}
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={styles.toggleIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        <nav
          ref={navRef}
          id="site-nav"
          className={styles.nav}
          aria-label="Primary"
          data-open={open ? "true" : "false"}
          inert={isMobile && !open}
          onClick={(event) => {
            if (event.target instanceof HTMLAnchorElement) closeMenu();
          }}
        >
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  className={styles.link}
                  href={item.href}
                  aria-current={activeHref === item.href ? "location" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink
            className={styles.navCta}
            href="#apply"
            size="sm"
            onClick={closeMenu}
          >
            Request an invitation
            <ArrowRight aria-hidden="true" strokeWidth={1.8} />
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
