"use client";

import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { translateMessage } from "@/lib/i18n/messages";
import { useState } from "react";

export function NewsletterForm({ inverted = false, stack = false }: { inverted?: boolean; stack?: boolean }) {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(event.currentTarget as HTMLFormElement);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          company: String(form.get("company") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string; delivered?: boolean };
      if (!response.ok) {
        setStatus("error");
        setMessage(translateMessage(locale, data.error || "Could not add that email."));
        return;
      }
      setStatus("done");
      setEmail("");
      setMessage(t.newsletter.done);
    } catch {
      setStatus("error");
      setMessage(t.newsletter.network);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className={stack ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <label className="sr-only" htmlFor="newsletter-email">
          {t.newsletter.label}
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.newsletter.placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`h-11 ${inverted ? "border-background/20 bg-background text-foreground" : ""}`}
        />
        <Button type="submit" disabled={status === "loading"} className="h-11 px-4">
          {status === "loading" ? t.newsletter.joining : t.newsletter.button}
        </Button>
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">{t.newsletter.company}</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <p className={`text-xs ${inverted ? "text-background/75" : "text-muted-foreground"}`}>
        {t.newsletter.fine}
      </p>
      {message ? (
        <p role={status === "error" ? "alert" : "status"} className="text-sm">
          {message}
        </p>
      ) : null}
    </form>
  );
}
