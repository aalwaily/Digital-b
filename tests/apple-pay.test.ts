import { GET as associationGET } from "@/app/(store)/.well-known/apple-developer-merchantid-domain-association/route";
import { GET as moyasarAssociationGET } from "@/app/(store)/api/moyasar/apple-domain/route";
import {
  APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
  APPLE_PAY_DOMAIN_ASSOCIATION_PATH,
  readApplePayDomainAssociation,
  resolveApplePayDomainAssociation,
} from "@/lib/apple-pay";
import { describe, expect, it } from "vitest";

function withEnv(name: string, value: string | undefined, run: () => Promise<void> | void) {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
  const finish = () => {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  };
  try {
    const result = run();
    if (result && typeof (result as Promise<void>).then === "function") {
      return (result as Promise<void>).finally(finish);
    }
    finish();
    return result;
  } catch (error) {
    finish();
    throw error;
  }
}

describe("Apple Pay domain association", () => {
  it("keeps the file bytes and rejects an empty value", () => {
    expect(APPLE_PAY_DOMAIN_ASSOCIATION_PATH).toBe("/.well-known/apple-developer-merchantid-domain-association");
    const file = "ASSOCIATION\nLINE-2";
    expect(readApplePayDomainAssociation(`\uFEFF${file}`)).toBe(file);
    expect(readApplePayDomainAssociation("  \n")).toBeNull();
    expect(readApplePayDomainAssociation(undefined)).toBeNull();
    expect(readApplePayDomainAssociation("x".repeat(64 * 1024 + 1))).toBeNull();
    expect(resolveApplePayDomainAssociation("MOYASAR-FILE")).toEqual({ ok: true, body: "MOYASAR-FILE" });
    expect(resolveApplePayDomainAssociation("  ")).toEqual({ ok: false, reason: "missing" });
  });

  it("serves the Moyasar domain file from the well-known path", async () => {
    await withEnv("MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION", "MOYASAR-DOMAIN-FILE", async () => {
      const response = await associationGET();
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("content-type")).toBe(APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE);
      expect(await response.text()).toBe("MOYASAR-DOMAIN-FILE");
      const alias = await moyasarAssociationGET();
      expect(await alias.text()).toBe("MOYASAR-DOMAIN-FILE");
    });
  });

  it("returns 404 when the association file is not configured", async () => {
    await withEnv("MOYASAR_APPLE_PAY_DOMAIN_ASSOCIATION", undefined, async () => {
      const response = await associationGET();
      expect(response.status).toBe(404);
      expect(response.headers.get("location")).toBeNull();
    });
  });
});
