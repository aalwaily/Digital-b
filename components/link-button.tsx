"use client";

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
  return (
    <Link href={href} className={cn(buttonVariants({ variant }), className)}>
      {children}
    </Link>
  );
}
