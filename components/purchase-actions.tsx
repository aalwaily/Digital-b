"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PurchaseActions({ slug }: { slug: string }) {
  const cart = useCart();
  const router = useRouter();
  const inCart = cart.has(slug);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        className="h-11 flex-1 px-4"
        onClick={() => {
          cart.add(slug);
          setAdded(true);
        }}
      >
        {inCart || added ? <Check /> : <ShoppingBag />}
        {inCart || added ? "In cart" : "Add to cart"}
      </Button>
      <Button
        variant="outline"
        className="h-11 flex-1 px-4"
        onClick={() => {
          router.push(`/checkout?buy=${slug}`);
        }}
      >
        Buy now
      </Button>
    </div>
  );
}
