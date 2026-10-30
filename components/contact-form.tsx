"use client";

import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { translateMessage } from "@/lib/i18n/messages";
import { useState } from "react";

export function ContactForm() {
  const { t, locale } = useI18n();
  const topics = t.contact.topics;
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      topic: String(formData.get("topic") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; delivered?: boolean };
      if (!response.ok) {
        setStatus("error");
        setMessage(translateMessage(locale, data.error || "We could not send your message."));
        return;
      }
      setStatus("done");
      form.reset();
      setMessage(
        data.delivered ? t.contact.received : t.contact.notConfigured,
      );
    } catch {
      setStatus("error");
      setMessage(t.contact.network);
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="rounded-xl border bg-card p-5 text-sm leading-relaxed">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t.contact.name}</Label>
          <Input id="name" name="name" required autoComplete="name" className="h-11" maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.contact.email}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" className="h-11" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">{t.contact.topic}</Label>
        <select
          id="topic"
          name="topic"
          required
          defaultValue={topics[0]}
          className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-start text-base"
        >
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t.contact.message}</Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={5000} className="min-h-36" />
      </div>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-company">{t.newsletter.company}</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {message ? (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      ) : null}
      <Button type="submit" data-primary-cta="" disabled={status === "loading"} className="h-11 min-w-11 px-5">
        {status === "loading" ? t.contact.sending : t.contact.send}
      </Button>
    </form>
  );
}
