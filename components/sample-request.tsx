"use client";

import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { translateMessage } from "@/lib/i18n/messages";
import { useState } from "react";

type SampleDownload = {
  slug: string;
  title: string;
  href: string;
  pages: number | null;
};

export function SampleRequest({
  slug,
  samples,
}: {
  slug: string;
  samples: { slug: string; title: string; pages: number | null }[];
}) {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [downloads, setDownloads] = useState<SampleDownload[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/sample", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          slug,
          company: String(form.get("company") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string; downloads?: SampleDownload[] };
      if (!response.ok || !data.downloads?.length) {
        setStatus("error");
        setMessage(translateMessage(locale, data.error || "Could not unlock that sample."));
        return;
      }
      setDownloads(data.downloads);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(t.sample.network);
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border bg-card p-4" role="status">
        <p className="text-sm font-medium">{t.product.sampleReady}</p>
        <ul className="mt-3 space-y-2">
          {downloads.map((sample) => (
            <li key={sample.slug}>
              <a href={sample.href} className="text-sm underline underline-offset-4" download>
                {t.product.downloadSample(sample.title, sample.pages)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const label = samples.length > 1 ? t.product.sampleMany : t.product.sampleOne;

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-card p-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {t.product.sampleHelp}
          {samples.length > 1 ? t.product.sampleBundle(samples.length) : ""}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`sample-email-${slug}`}>{t.sample.email}</Label>
        <Input
          id={`sample-email-${slug}`}
          type="email"
          required
          autoComplete="email"
          placeholder={t.newsletter.placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11"
        />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`sample-company-${slug}`}>{t.newsletter.company}</label>
        <input id={`sample-company-${slug}`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {message ? (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "loading"} className="h-11 px-4">
        {status === "loading" ? t.product.unlocking : label}
      </Button>
    </form>
  );
}
