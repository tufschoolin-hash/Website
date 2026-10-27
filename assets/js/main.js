/* ==========================================================================
   TUF Networks — site interactions
   No dependencies. Everything here is progressive enhancement.
   ========================================================================== */

(() => {
  "use strict";

  /* ------------------------------------------------------------------------
     FORM DELIVERY CONFIGURATION
     ------------------------------------------------------------------------
     The forms are fully built and validated, but no form service or inbox was
     supplied with the project. Add one of the following before launch:

     1. A form backend that accepts a POST request and returns a 2xx response.
        Formspree, Basin, Getform, Netlify Forms (with a matching static form)
        and a custom API all work. Paste the endpoint below.

     2. A contact email address. Until an endpoint is connected, submissions
        will show an honest "opening soon" message and point people to this
        address instead. Nothing is silently discarded.

     You can use one endpoint for both forms, or give nominations their own.
     ------------------------------------------------------------------------ */
  const FORM_CONFIG = {
    endpoint: "",
    nominationEndpoint: "",
    contactEmail: "",
    timeout: 15000,
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileViewport = window.matchMedia("(max-width: 1023px)");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ------------------------------------------------------------------------
     Header state and current section
     ------------------------------------------------------------------------ */
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return null;
      const section = document.querySelector(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  let scrollQueued = false;

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function updateCurrentSection() {
    if (!sections.length) return;

    const headerHeight = header ? header.getBoundingClientRect().height : 76;
    const readingLine = headerHeight + 120;
    let current = null;
    let closestTop = -Infinity;

    // Nav order and page order are not the same. Compare document positions so
    // the section nearest the reading line wins regardless of nav order.
    sections.forEach(({ link, section }) => {
      const top = section.getBoundingClientRect().top;
      if (top <= readingLine && top > closestTop) {
        closestTop = top;
        current = link;
      }
    });

    navLinks.forEach((link) => {
      if (link === current) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(() => {
      updateHeader();
      updateCurrentSection();
      scrollQueued = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateHeader();
  updateCurrentSection();

  /* ------------------------------------------------------------------------
     Accessible mobile menu
     ------------------------------------------------------------------------ */
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuLabel = document.querySelector("[data-menu-label]");
  let menuOpen = false;

  function isMobile() {
    return mobileViewport.matches;
  }

  function setMenu(open, options = {}) {
    if (!menuToggle || !nav) return;

    menuOpen = open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (menuLabel) menuLabel.textContent = open ? "Close menu" : "Open menu";
    nav.dataset.open = String(open);
    document.body.classList.toggle("menu-open", open && isMobile());

    // `inert` keeps the visually hidden mobile menu out of the tab order.
    // It must never be applied to the desktop navigation.
    if (isMobile()) {
      nav.inert = !open;
    } else {
      nav.inert = false;
    }

    if (!open && options.returnFocus) {
      menuToggle.focus();
    }
  }

  function syncMenuToViewport() {
    if (!isMobile() && menuOpen) {
      setMenu(false);
      return;
    }

    if (nav) nav.inert = isMobile() ? !menuOpen : false;
    if (!isMobile()) document.body.classList.remove("menu-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      setMenu(!menuOpen);
    });

    nav.addEventListener("click", (event) => {
      if (menuOpen && event.target.closest("a")) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuOpen) {
        event.preventDefault();
        setMenu(false, { returnFocus: true });
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (!menuOpen || !header) return;
      if (!header.contains(event.target)) {
        setMenu(false);
      }
    });

    if (typeof mobileViewport.addEventListener === "function") {
      mobileViewport.addEventListener("change", syncMenuToViewport);
    } else {
      mobileViewport.addListener(syncMenuToViewport);
    }

    syncMenuToViewport();
  }

  /* ------------------------------------------------------------------------
     Marquee pause / play
     ------------------------------------------------------------------------ */
  const marquee = document.querySelector("[data-marquee]");
  const marqueeToggle = document.querySelector("[data-marquee-toggle]");
  const marqueeIcon = document.querySelector("[data-marquee-icon]");
  const marqueeLabel = document.querySelector("[data-marquee-label]");
  let marqueePaused = false;

  function setMarqueePaused(paused) {
    if (!marquee || !marqueeToggle) return;

    marqueePaused = paused;
    marquee.dataset.paused = String(paused);
    marqueeToggle.setAttribute("aria-pressed", String(paused));
    if (marqueeIcon) {
      marqueeIcon.setAttribute("href", paused ? "#icon-play" : "#icon-pause");
    }
    if (marqueeLabel) {
      marqueeLabel.textContent = paused ? "Play scrolling text" : "Pause scrolling text";
    }
  }

  if (marquee && marqueeToggle) {
    setMarqueePaused(reduceMotion.matches);
    marqueeToggle.addEventListener("click", () => {
      setMarqueePaused(!marqueePaused);
    });
  }

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------------------------------
     Form helpers
     ------------------------------------------------------------------------ */
  function isEmail(value) {
    return value.length <= 254 && emailPattern.test(value);
  }

  function isWebUrl(value) {
    const trimmed = value.trim();
    if (!trimmed) return false;

    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
      const url = new URL(candidate);
      if (url.protocol !== "http:" && url.protocol !== "https:") return false;
      const hostname = url.hostname;
      return hostname.includes(".") && !hostname.startsWith(".") && !hostname.endsWith(".");
    } catch (error) {
      return false;
    }
  }

  function getErrorElement(field) {
    const describedBy = field.getAttribute("aria-describedby");
    if (!describedBy) return null;

    const errorId = describedBy
      .split(/\s+/)
      .find((token) => token.endsWith("-error"));

    return errorId ? document.getElementById(errorId) : null;
  }

  function getValidationMessage(field) {
    const type = field.dataset.validate;
    const value = field.type === "checkbox" ? "" : field.value.trim();

    switch (type) {
      case "name":
        if (!value) return "Please enter a name.";
        if (value.length < 2) return "Please enter at least 2 characters.";
        if (value.length > 100) return "Please keep this under 100 characters.";
        return "";

      case "email":
        if (!value) return "Please enter your email address.";
        if (!isEmail(value)) return "Please enter a valid email address, like you@example.com.";
        return "";

      case "building":
        if (!value) return "Please tell us what you’re building.";
        if (value.length < 2) return "Please add a little more detail.";
        if (value.length > 2000) return "Please keep this under 2,000 characters.";
        return "";

      case "link":
        if (!value) return "";
        if (!isWebUrl(value)) return "Please enter a valid website or LinkedIn URL.";
        return "";

      case "why":
        if (!value) return "Please tell us why you want to be in the room.";
        if (value.length < 20) return "Please share a little more — at least 20 characters.";
        if (value.length > 2000) return "Please keep this under 2,000 characters.";
        return "";

      case "nomination-why":
        if (!value) return "Please tell us why they belong.";
        if (value.length < 20) return "Please share a little more — at least 20 characters.";
        if (value.length > 2000) return "Please keep this under 2,000 characters.";
        return "";

      case "nominee-contact":
        if (!value) return "Please add the nominee’s email or a link.";
        if (value.includes("@") && !value.includes("://")) {
          return isEmail(value) ? "" : "Please enter a valid email address or link.";
        }
        return isWebUrl(value) ? "" : "Please enter a valid email address or link.";

      case "consent":
        return field.checked ? "" : "Please confirm before submitting.";

      default:
        return "";
    }
  }

  function validateField(field) {
    const message = getValidationMessage(field);
    const errorElement = getErrorElement(field);

    if (errorElement) errorElement.textContent = message;

    if (message) {
      field.setAttribute("aria-invalid", "true");
      field.closest(".field")?.classList.add("field--invalid");
    } else {
      field.removeAttribute("aria-invalid");
      field.closest(".field")?.classList.remove("field--invalid");
    }

    return message;
  }

  function clearFieldError(field) {
    field.removeAttribute("aria-invalid");
    field.dataset.touched = "";
    field.closest(".field")?.classList.remove("field--invalid");
    const errorElement = getErrorElement(field);
    if (errorElement) errorElement.textContent = "";
  }

  function clearFormErrors(form) {
    form.querySelectorAll("[data-validate]").forEach(clearFieldError);
  }

  function setFormStatus(form, message, type, options = {}) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;

    status.textContent = message;
    status.className = `form-status is-${type}`;

    if (options.email) {
      status.append(document.createTextNode(" "));
      const emailLink = document.createElement("a");
      emailLink.href = `mailto:${options.email}`;
      emailLink.textContent = options.email;
      status.append(emailLink);
      status.append(document.createTextNode("."));
    }

    if (options.focus) {
      status.focus({ preventScroll: true });
    }
  }

  function clearFormStatus(form) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = "";
    status.className = "form-status";
  }

  function setFormBusy(form, busy) {
    const submit = form.querySelector("[data-submit]");
    const submitText = form.querySelector("[data-submit-text]");
    if (!submit || !submitText) return;

    if (busy) {
      submit.dataset.originalLabel = submitText.textContent;
      submitText.textContent = "Sending…";
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
    } else {
      if (submit.dataset.originalLabel) {
        submitText.textContent = submit.dataset.originalLabel;
      }
      submit.disabled = false;
      form.removeAttribute("aria-busy");
    }
  }

  function getEndpoint(type) {
    if (type === "nomination") {
      return FORM_CONFIG.nominationEndpoint || FORM_CONFIG.endpoint;
    }
    return FORM_CONFIG.endpoint;
  }

  function successMessage(type) {
    return type === "nomination"
      ? "Thank you — your nomination is in. We’ll take it from here."
      : "Thank you — your application is in. We review every submission and will be in touch if there’s a fit.";
  }

  function showOpeningSoon(form, type) {
    const noun = type === "nomination" ? "Nominations" : "Applications";
    const message = `${noun} are opening soon. Nothing has been sent yet — please check back shortly.`;

    if (FORM_CONFIG.contactEmail) {
      setFormStatus(form, `${noun} are opening soon. To register your interest, email`, "info", {
        email: FORM_CONFIG.contactEmail,
        focus: true,
      });
    } else {
      setFormStatus(form, message, "info", { focus: true });
    }
  }

  async function sendForm(form, type, endpoint) {
    const formData = new FormData(form);
    formData.append("form", type);
    formData.append("page", window.location.href);
    formData.append("_subject", type === "nomination" ? "New TUF Networks nomination" : "New TUF Networks application");

    form.dataset.submitting = "true";
    setFormBusy(form, true);
    clearFormStatus(form);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), FORM_CONFIG.timeout || 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Form endpoint returned ${response.status}`);
      }

      setFormStatus(form, successMessage(type), "success", { focus: true });
      form.reset();
      clearFormErrors(form);
    } catch (error) {
      console.error("[TUF Networks] Form submission failed:", error);

      if (FORM_CONFIG.contactEmail) {
        setFormStatus(
          form,
          "We couldn’t send that just now. Please try again in a moment, or email",
          "error",
          { email: FORM_CONFIG.contactEmail, focus: true },
        );
      } else {
        setFormStatus(
          form,
          "We couldn’t send that just now. Please try again in a moment.",
          "error",
          { focus: true },
        );
      }
    } finally {
      window.clearTimeout(timeout);
      form.dataset.submitting = "false";
      setFormBusy(form, false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.dataset.submitting === "true") return;

    const fields = Array.from(form.querySelectorAll("[data-validate]"));
    let firstInvalid = null;
    let invalidCount = 0;

    fields.forEach((field) => {
      field.dataset.touched = "true";
      if (validateField(field)) {
        invalidCount += 1;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (firstInvalid) {
      const message =
        invalidCount === 1
          ? "Please check the highlighted field and try again."
          : `Please check the ${invalidCount} highlighted fields and try again.`;
      setFormStatus(form, message, "error");
      firstInvalid.focus();
      return;
    }

    const type = form.dataset.form || "application";
    const honeypot = form.querySelector('input[name="company-website"]');

    // Bots fill hidden fields. Give them a harmless success response and stop.
    if (honeypot && honeypot.value.trim()) {
      setFormStatus(form, successMessage(type), "success", { focus: true });
      form.reset();
      clearFormErrors(form);
      return;
    }

    const endpoint = getEndpoint(type);
    if (!endpoint) {
      showOpeningSoon(form, type);
      return;
    }

    sendForm(form, type, endpoint);
  }

  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", handleSubmit);

    form.querySelectorAll("[data-validate]").forEach((field) => {
      field.addEventListener("blur", () => {
        field.dataset.touched = "true";
        validateField(field);
      });

      const liveEvent = field.type === "checkbox" ? "change" : "input";
      field.addEventListener(liveEvent, () => {
        if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });
  });

  if (!getEndpoint("application") && !FORM_CONFIG.contactEmail) {
    console.info(
      "%cTUF Networks forms are in preview mode.",
      "color:#00d966;font-weight:700",
      "Set FORM_CONFIG.endpoint (and optionally FORM_CONFIG.contactEmail) in assets/js/main.js before launch. Until then, submissions show an honest opening-soon message and are not sent.",
    );
  }
})();
