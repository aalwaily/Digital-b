import pdfMetaJson from "@/data/pdf-meta.json";
import {
  bundles,
  categories,
  getCategory,
  getProduct,
  guides,
  isBundle,
  products,
  type Product,
} from "@/data/products";

export type PdfMetaEntry = {
  pages: number;
  samplePages: number;
  bytes: number;
  sampleBytes: number;
};

const pdfMeta = pdfMetaJson as Record<string, PdfMetaEntry>;

export class CatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogError";
  }
}

export type QuoteLine = {
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  savings: number;
  files: string[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSlug(value: string) {
  return slugPattern.test(value);
}

export function pageCountFor(product: Product): number {
  if (isBundle(product)) {
    return product.includes.reduce((sum, slug) => {
      const child = getProduct(slug);
      return sum + (child ? pageCountFor(child) : 0);
    }, 0);
  }
  return pdfMeta[product.slug]?.pages ?? product.pageCount;
}

export function samplePageCount(slug: string) {
  return pdfMeta[slug]?.samplePages ?? null;
}

export function expandFiles(slugs: string[]) {
  const files: string[] = [];
  for (const slug of slugs) {
    const product = getProduct(slug);
    if (!product) continue;
    if (isBundle(product)) files.push(...product.includes);
    else files.push(product.slug);
  }
  return [...new Set(files)];
}

export function quote(slugs: string[]): Quote {
  if (slugs.length === 0) throw new CatalogError("Your cart is empty.");
  if (slugs.length > 12) throw new CatalogError("Too many items in one order.");
  const unique = [...new Set(slugs)];
  const lines = unique.map((slug) => {
    if (!isSlug(slug)) throw new CatalogError("Unknown product.");
    const product = getProduct(slug);
    if (!product) throw new CatalogError("Unknown product.");
    return {
      slug: product.slug,
      title: product.title,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.price, 0);
  const compare = lines.reduce((sum, line) => sum + (line.compareAtPrice ?? line.price), 0);
  return {
    lines,
    subtotal,
    savings: Math.max(0, roundMoney(compare - subtotal)),
    files: expandFiles(unique),
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function overlapWarnings(slugs: string[]) {
  const owned = new Set(slugs);
  const warnings: string[] = [];
  for (const slug of slugs) {
    const product = getProduct(slug);
    if (!product || !isBundle(product)) continue;
    for (const included of product.includes) {
      if (!owned.has(included)) continue;
      const guide = getProduct(included);
      if (!guide) continue;
      warnings.push(`${guide.title} is already included in ${product.title}.`);
    }
  }
  return warnings;
}

export function relatedProducts(slug: string, limit = 3) {
  const product = getProduct(slug);
  if (!product) return [];
  if (isBundle(product)) {
    return product.includes
      .map((included) => getProduct(included))
      .filter((item): item is Product => Boolean(item));
  }
  const parent = bundles.find((bundle) => bundle.includes.includes(slug));
  const sameCategory = guides.filter(
    (guide) => guide.slug !== slug && guide.category === product.category,
  );
  const others = guides.filter(
    (guide) => guide.slug !== slug && guide.category !== product.category,
  );
  const ordered = [parent, ...sameCategory, ...others].filter(
    (item): item is Product => Boolean(item),
  );
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const item of ordered) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    result.push(item);
    if (result.length === limit) break;
  }
  return result;
}

export function searchProducts(input: { query?: string; category?: string; sort?: string }) {
  const query = (input.query ?? "").trim().toLowerCase();
  const category = input.category && input.category !== "all" ? input.category : null;
  let list = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!query) return true;
    const categoryName = getCategory(product.category)?.name ?? "";
    const haystack = [product.title, product.subtitle, product.shortDescription, categoryName]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
  const sort = input.sort ?? "featured";
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "newest")
    list = [...list].sort((a, b) => b.published.localeCompare(a.published));
  return list;
}

export { bundles, categories, getCategory, getProduct, guides, isBundle, pdfMeta, products };
