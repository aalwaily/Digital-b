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
    if (pathname.startsWith("/ar/product/")) return { href: pathname.slice(3), label: "English", lang: "en" };
    if (pathname === "/ar/blog") return { href: "/blog", label: "English", lang: "en" };
    return { href: "/", label: "English", lang: "en" };
  }
  if (pathname === "/") return { href: "/ar", label: "العربية", lang: "ar" };
  if (pathname.startsWith("/product/")) return { href: `/ar${pathname}`, label: "العربية", lang: "ar" };
  if (pathname === "/blog") return { href: "/ar/blog", label: "العربية", lang: "ar" };
  return { href: "/ar", label: "العربية", lang: "ar" };
}
