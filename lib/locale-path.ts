import { blogHreflang, blogLocalesForSlug, blogPath, blogRoute } from "@/lib/blog-index";
import { stripLocale, type Locale } from "@/lib/i18n/config";

export function languageAlternate(pathname: string): { href: string; label: string; lang: "en" | "ar" } {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname || "/";
  const blog = path.match(/^\/(en|ar)\/blog\/([^/]+)$/);
  if (blog) {
    const locale = blog[1] as Locale;
    const slug = blog[2];
    const entry = blogRoute(slug);
    const paired = entry?.translationOf ? blogHreflang(slug) : null;
    if (paired) {
      const href = locale === "ar" ? paired.en : paired.ar;
      if (href) {
        const toArabic = href.startsWith("/ar");
        return { href, label: toArabic ? "العربية" : "English", lang: toArabic ? "ar" : "en" };
      }
    }
    const locales = blogLocalesForSlug(slug);
    const other: Locale = locale === "ar" ? "en" : "ar";
    if (locales.includes(other)) {
      return {
        href: blogPath(slug, other),
        label: other === "ar" ? "العربية" : "English",
        lang: other,
      };
    }
    return {
      href: `/${other}/blog`,
      label: other === "ar" ? "العربية" : "English",
      lang: other,
    };
  }

  if (path === "/ar" || path.startsWith("/ar/")) {
    const rest = path === "/ar" ? "/" : path.slice(3);
    return { href: rest === "/" ? "/en" : `/en${rest}`, label: "English", lang: "en" };
  }
  if (path === "/en" || path.startsWith("/en/")) {
    const rest = path === "/en" ? "/" : path.slice(3);
    return { href: rest === "/" ? "/ar" : `/ar${rest}`, label: "العربية", lang: "ar" };
  }
  if (path === "/") return { href: "/ar", label: "العربية", lang: "ar" };
  const bare = stripLocale(path);
  if (bare.startsWith("/product/") || bare.startsWith("/blog") || bare.startsWith("/legal/")) {
    return { href: `/ar${bare}`, label: "العربية", lang: "ar" };
  }
  return { href: "/ar", label: "العربية", lang: "ar" };
}
