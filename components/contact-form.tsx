"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const topics = ["Order help", "Missing download", "Licensing", "Something else"];

export function ContactForm() {
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
        setMessage(data.error || "Could not send the message.");
        return;
      }
      setStatus("done");
      form.reset();
      setMessage(
        data.delivered
          ? "Message received. We will reply from the support address."
          : "Message validated. Email delivery is not configured yet, so a copy was not sent to an inbox. Connect CONTACT_WEBHOOK_URL when you launch.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Try again in a moment.");
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
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" className="h-11" maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" className="h-11" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <select
          id="topic"
          name="topic"
          required
          defaultValue="Order help"
          className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
        >
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required minLength={10} maxLength={5000} className="min-h-36" />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {message ? (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "loading"} className="h-11 px-5">
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
