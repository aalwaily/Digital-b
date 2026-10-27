import { ClaimOrder } from "@/components/claim-order";
import { localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { requireLocale } from "@/lib/i18n/content";
import { pageMetadata } from "@/lib/page-meta";
import { publicMetadata } from "@/lib/public-meta";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  return pageMetadata(publicMetadata(locale, "/checkout/success")!);
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const locale = requireLocale((await params).locale);
  const t = getDictionary(locale);
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="mx-auto min-w-0 max-w-3xl px-5 py-16">
      <h1 className="font-serif text-4xl">{t.success.title}</h1>
      <div className="mt-6">
        {sessionId ? (
          <ClaimOrder sessionId={sessionId} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {t.success.missing}{" "}
            <Link href={localePath(locale, "/contact")} className="inline-flex min-h-11 items-center underline underline-offset-4">
              {t.success.contact}
            </Link>{" "}
            {t.success.missingTail}
          </p>
        )}
      </div>
    </div>
  );
}
