import { ClaimOrder } from "@/components/claim-order";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.success.title,
  description: staticSeo.success.description,
  path: "/checkout/success",
  index: false,
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-serif text-4xl">Payment received</h1>
      <div className="mt-6">
        {sessionId ? (
          <ClaimOrder sessionId={sessionId} />
        ) : (
          <p className="text-sm text-muted-foreground">
            This page is missing a checkout session. If you completed a demo order, use the receipt link from that page.{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Contact support
            </Link>{" "}
            if a live charge is missing its downloads.
          </p>
        )}
      </div>
    </div>
  );
}
