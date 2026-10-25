"use client";

import { useI18n } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ShareProduct({ title, url }: { title: string; url: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      await copyLink();
    }
  }

  const links = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, external: true },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, external: true },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, external: true },
    { label: t.product.email, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, external: false },
  ];

  return (
    <div className="mt-4">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">{t.product.share}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" className="wrap-button h-auto px-3 py-2" onClick={copyLink}>
          {copied ? <Check /> : <Link2 />}
          {copied ? t.product.linkCopied : t.product.copyLink}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-11 px-3" onClick={nativeShare}>
            <Share2 />
            {t.product.shareAction}
          </Button>
        ) : null}
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm hover:bg-secondary"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
