"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-serif text-4xl">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">
        The page did not finish loading. You can try again, or come back to the shop.
      </p>
      <Button className="mt-6 h-11 px-5" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
