"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function NewsletterForm({ inverted = false, stack = false }: { inverted?: boolean; stack?: boolean }) {
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
        setMessage(data.error || "Could not add that email.");
        return;
      }
      setStatus("done");
      setEmail("");
      setMessage(
        data.delivered
          ? "You are on the list. We will write when a new guide is ready."
          : "You are on the list for this demo. Connect NEWSLETTER_WEBHOOK_URL to deliver signups to an inbox.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Try again in a moment.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className={stack ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={`h-11 ${inverted ? "border-background/20 bg-background text-foreground" : ""}`}
        />
        <Button type="submit" disabled={status === "loading"} className="h-11 px-4">
          {status === "loading" ? "Joining…" : "Get notes"}
        </Button>
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <p className={`text-xs ${inverted ? "text-background/75" : "text-muted-foreground"}`}>
        Occasional notes about new guides. Unsubscribe anytime. No daily drip.
      </p>
      {message ? (
        <p role={status === "error" ? "alert" : "status"} className="text-sm">
          {message}
        </p>
      ) : null}
    </form>
  );
}
