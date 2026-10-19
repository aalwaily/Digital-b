import { applePayDomainAssociationResponse } from "@/lib/apple-pay-domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return applePayDomainAssociationResponse();
}
