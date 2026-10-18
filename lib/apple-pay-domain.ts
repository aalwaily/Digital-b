import {
  APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
  resolveApplePayDomainAssociation,
} from "@/lib/apple-pay";
import { NextResponse } from "next/server";

export const APPLE_PAY_DOMAIN_CONFLICT_MESSAGE =
  "Two different Apple Pay domain files are configured. Set only APPLE_PAY_DOMAIN_ASSOCIATION or only MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION.";

export function applePayDomainAssociationResponse() {
  const resolved = resolveApplePayDomainAssociation(
    process.env.APPLE_PAY_DOMAIN_ASSOCIATION,
    process.env.MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION,
  );
  if (!resolved.ok && resolved.reason === "conflict") {
    return new NextResponse(APPLE_PAY_DOMAIN_CONFLICT_MESSAGE, {
      status: 409,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
  if (!resolved.ok) {
    return new NextResponse("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
  return new NextResponse(resolved.body, {
    status: 200,
    headers: {
      "Content-Type": APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
