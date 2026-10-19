import { getPost, postPath, posts } from "@/data/blog";

export function languageAlternate(pathname: string): { href: string; label: string; lang: "en" | "ar" } {
  const map = new Map<string, string>();
  for (const post of posts) {
    if (!post.translationOf) continue;
    const other = getPost(post.translationOf);
    if (!other) continue;
    map.set(postPath(post), postPath(other));
  }
  const paired = map.get(pathname);
  if (paired) {
    const toArabic = paired.startsWith("/ar");
    return { href: paired, label: toArabic ? "العربية" : "English", lang: toArabic ? "ar" : "en" };
  }
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const rest = pathname === "/ar" ? "/" : pathname.slice(3);
    return { href: rest === "/" ? "/en" : `/en${rest}`, label: "English", lang: "en" };
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const rest = pathname === "/en" ? "/" : pathname.slice(3);
    return { href: rest === "/" ? "/ar" : `/ar${rest}`, label: "العربية", lang: "ar" };
  }
  if (pathname === "/") return { href: "/ar", label: "العربية", lang: "ar" };
  if (pathname.startsWith("/product/") || pathname.startsWith("/blog") || pathname.startsWith("/legal/")) {
    return { href: `/ar${pathname}`, label: "العربية", lang: "ar" };
  }
  return { href: "/ar", label: "العربية", lang: "ar" };
}
