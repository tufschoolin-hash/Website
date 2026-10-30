"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { postEnquiry } from "@/lib/enquiry-client";
import { applicationSchema, type ApplicationValues } from "@/lib/validation/enquiry";

import { CheckboxField, HoneypotField, TextField } from "./form-field";
import { FormStatus, type FormStatusState } from "./form-status";
import styles from "./forms.module.css";

const APPLICATION_FIELDS = [
  "name",
  "email",
  "building",
  "link",
  "curious",
  "why",
  "consent",
] as const;

type ApplicationField = (typeof APPLICATION_FIELDS)[number];

function isApplicationField(field: string): field is ApplicationField {
  return (APPLICATION_FIELDS as readonly string[]).includes(field);
}

const DEFAULT_VALUES: ApplicationValues = {
  name: "",
  email: "",
  building: "",
  link: "",
  curious: "",
  why: "",
  consent: false,
  companyWebsite: "",
};

export function ApplicationForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const [status, setStatus] = useState<FormStatusState | null>(null);

  const onSubmit = handleSubmit(async (values) => {
    setStatus(null);

    try {
      const { data } = await postEnquiry({ type: "application", payload: values });

      if (data.ok) {
        reset(DEFAULT_VALUES);
        setStatus({ kind: "success", message: data.message });
        return;
      }

      for (const [field, message] of Object.entries(data.fieldErrors ?? {})) {
        if (isApplicationField(field)) {
          setError(field, { type: "server", message });
        }
      }

      setStatus({
        kind: data.code === "not_configured" ? "info" : "error",
        message: data.message,
        contactEmail: data.contactEmail,
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "We couldn’t submit the form just now. Please check your connection and try again.",
      });
    }
  });

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-busy={isSubmitting}
      data-testid="application-form"
    >
      <div className={styles.grid}>
        <TextField
          id="name"
          label="Full name"
          required
          autoComplete="name"
          placeholder="Your name"
          registration={register("name")}
          error={errors.name?.message}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          registration={register("email")}
          error={errors.email?.message}
        />
        <TextField
          id="building"
          label="What are you building?"
          required
          multiline
          rows={3}
          placeholder="A project, company, practice or idea — early is welcome."
          registration={register("building")}
          error={errors.building?.message}
          className={styles.full}
        />
        <TextField
          id="link"
          label="LinkedIn or website"
          type="url"
          optional
          autoComplete="url"
          inputMode="url"
          placeholder="https://"
          registration={register("link")}
          error={errors.link?.message}
          className={styles.full}
        />
        <TextField
          id="curious"
          label="What are you curious about?"
          multiline
          rows={2}
          placeholder="The questions, industries or ideas you keep coming back to."
          registration={register("curious")}
          error={errors.curious?.message}
          className={styles.full}
        />
        <TextField
          id="why"
          label="Why do you want to be in the room?"
          required
          multiline
          rows={3}
          placeholder="What do you want to learn, build or contribute?"
          registration={register("why")}
          error={errors.why?.message}
          className={styles.full}
        />
        <CheckboxField
          id="consent"
          registration={register("consent")}
          error={errors.consent?.message}
          className={styles.full}
        >
          I agree to be contacted about my application.
        </CheckboxField>
      </div>

      <HoneypotField
        id="company-website-application"
        registration={register("companyWebsite")}
      />

      <div className={styles.actions}>
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className={styles.spinner} aria-hidden="true" strokeWidth={1.8} />
              Submitting…
            </>
          ) : (
            "Submit application"
          )}
        </Button>
        <p className={styles.note}>We’ll only use your details to review your application.</p>
      </div>

      <FormStatus status={status} />
    </form>
  );
}
