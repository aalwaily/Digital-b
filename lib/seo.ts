import { site } from "@/data/site";
import type { Metadata } from "next";

export const CANONICAL_ORIGIN = "https://getvellumpress.com";

const GOOGLE_VERIFICATION = /^[A-Za-z0-9_-]{10,120}$/;
const BING_VERIFICATION = /^[A-Za-z0-9]{10,120}$/;

export function canonicalUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return CANONICAL_ORIGIN;
  return `${CANONICAL_ORIGIN}${normalized}`;
}

export function hreflang(enPath: string, arPath: string) {
  return {
    en: canonicalUrl(enPath),
    ar: canonicalUrl(arPath),
    "x-default": canonicalUrl(enPath),
  };
}

export function readSiteVerification(env: NodeJS.ProcessEnv = process.env) {
  const google = (env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || env.GOOGLE_SITE_VERIFICATION || "").trim();
  const bing = (env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "").trim();
  return {
    google: GOOGLE_VERIFICATION.test(google) ? google : null,
    bing: BING_VERIFICATION.test(bing) ? bing : null,
  };
}

export function verificationMetadata(env: NodeJS.ProcessEnv = process.env): Metadata["verification"] {
  const { google, bing } = readSiteVerification(env);
  const verification: Metadata["verification"] = {};
  if (google) verification.google = google;
  if (bing) verification.other = { "msvalidate.01": bing };
  return verification;
}

export function rootMetadata(locale: "en" | "ar" = "en"): Metadata {
  const title = locale === "ar" ? "أدلة PDF عملية | من 6 دولارات" : "Practical PDF Guides | From $6";
  const description =
    locale === "ar"
      ? "أدلة PDF عملية من 6 دولارات، مع نموذج مجاني لكل دليل. الدفع عبر الإنترنت يفتح قريبًا. المبيعات نهائية."
      : "Practical PDF guides from $6, with a free sample of each. Online payment opens soon. All sales are final.";
  return {
    metadataBase: new URL(CANONICAL_ORIGIN),
    title: { default: title, template: "%s" },
    description,
    applicationName: site.name,
    verification: verificationMetadata(),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  locale?: "en" | "ar";
  enPath?: string;
  arPath?: string;
  image?: string;
}): Metadata {
  const canonical = canonicalUrl(input.path);
  const image = input.image ?? (input.path === "/" ? "/opengraph-image" : `${input.path}/opengraph-image`);
  const images = input.index === false ? undefined : [{ url: image, width: 1200, height: 630, alt: input.title }];
  const languages = input.enPath && input.arPath ? hreflang(input.enPath, input.arPath) : undefined;
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    robots: input.index === false ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: site.name,
      locale: input.locale === "ar" ? "ar_SA" : "en_US",
      type: input.type ?? "website",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      ...(images ? { images: [image] } : {}),
    },
  };
}
