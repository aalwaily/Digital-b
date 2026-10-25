import {
  APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
  resolveApplePayDomainAssociation,
} from "@/lib/apple-pay";
import { NextResponse } from "next/server";

export function applePayDomainAssociationResponse() {
  const resolved = resolveApplePayDomainAssociation(process.env.MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION);
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
