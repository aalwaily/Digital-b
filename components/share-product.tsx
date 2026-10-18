"use client";

import { Button } from "@/components/ui/button";
import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export function ShareProduct({ title, url }: { title: string; url: string }) {
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
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ];

  return (
    <div className="mt-4">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Share this guide</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" className="h-9 px-3" onClick={copyLink}>
          {copied ? <Check /> : <Link2 />}
          {copied ? "Link copied" : "Copy link"}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-9 px-3" onClick={nativeShare}>
            <Share2 />
            Share
          </Button>
        ) : null}
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.label === "Email" ? undefined : "_blank"}
            rel={link.label === "Email" ? undefined : "noopener noreferrer"}
            className="inline-flex h-9 items-center rounded-lg border px-3 text-sm hover:bg-secondary"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
