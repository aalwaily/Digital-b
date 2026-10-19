import { CartView } from "@/components/cart-view";
import { staticSeo } from "@/data/page-seo";
import { pageMetadata } from "@/lib/page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: staticSeo.cart.title,
  description: staticSeo.cart.description,
  path: "/cart",
  index: false,
});

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-serif text-4xl">Cart</h1>
      <p className="mt-2 text-muted-foreground">Guides stay in this browser until you check out or remove them.</p>
      <div className="mt-8">
        <CartView canceled={canceled === "1"} />
      </div>
    </div>
  );
}
