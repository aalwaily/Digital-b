"use client";

import { useI18n } from "@/components/locale-provider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import Link from "next/link";

export function LinkButton({
  href,
  children,
  variant = "default",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}) {
  const { href: localize } = useI18n();
  const next = href.startsWith("/") ? localize(href) : href;
  return (
    <Link href={next} className={cn(buttonVariants({ variant }), "inline-flex min-h-11", className)}>
      {children}
    </Link>
  );
}
