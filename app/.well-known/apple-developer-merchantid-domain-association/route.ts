import {
  APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
  readApplePayDomainAssociation,
} from "@/lib/apple-pay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const body = readApplePayDomainAssociation(process.env.APPLE_PAY_DOMAIN_ASSOCIATION);
  if (!body) {
    return new NextResponse("Not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
