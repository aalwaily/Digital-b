import { GET as associationGET } from "@/app/.well-known/apple-developer-merchantid-domain-association/route";
import { POST as capturePOST } from "@/app/api/paypal/applepay/capture/route";
import { POST as orderPOST } from "@/app/api/paypal/applepay/order/route";
import { GET as configGET } from "@/app/api/paypal/config/route";
import { quote } from "@/lib/catalog";
import { verifyDownloadToken } from "@/lib/download-token";
import {
  APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE,
  APPLE_PAY_DOMAIN_ASSOCIATION_PATH,
  applePayBrowserConfig,
  applePaySheetTotal,
  formatApplePayAmount,
  isPayPalApplePaySdkUrl,
  paypalApplePaySdkUrl,
  readApplePayDomainAssociation,
  shouldShowApplePayButton,
} from "@/lib/apple-pay";
import { formatUsdCents, paypalOrderBinding, signPayPalCheckoutState, type PayPalOrder } from "@/lib/paypal";
import { afterEach, describe, expect, it, vi } from "vitest";

const SECRET = "download-secret-value";

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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Apple Pay eligibility and SDK", () => {
  it("shows the button only when the device and PayPal both allow Apple Pay", () => {
    expect(
      shouldShowApplePayButton({ hasApplePaySession: true, canMakePayments: true, isEligible: true }),
    ).toBe(true);
    expect(
      shouldShowApplePayButton({ hasApplePaySession: false, canMakePayments: true, isEligible: true }),
    ).toBe(false);
    expect(
      shouldShowApplePayButton({ hasApplePaySession: true, canMakePayments: false, isEligible: true }),
    ).toBe(false);
    expect(
      shouldShowApplePayButton({ hasApplePaySession: true, canMakePayments: true, isEligible: false }),
    ).toBe(false);
  });

  it("loads the applepay component on the host that matches PAYPAL_ENV", () => {
    const sandbox = new URL(paypalApplePaySdkUrl("sandbox-client", "sandbox"));
    expect(sandbox.origin).toBe("https://www.sandbox.paypal.com");
    expect(sandbox.pathname).toBe("/sdk/js");
    expect(sandbox.searchParams.get("components")).toBe("applepay");
    expect(sandbox.searchParams.get("client-id")).toBe("sandbox-client");
    expect(sandbox.searchParams.get("currency")).toBe("USD");
    expect(sandbox.searchParams.get("intent")).toBe("capture");
    expect(sandbox.searchParams.get("buyer-country")).toBe("US");

    const live = new URL(paypalApplePaySdkUrl("live-client", "live"));
    expect(live.origin).toBe("https://www.paypal.com");
    expect(live.searchParams.get("components")).toBe("applepay");
    expect(live.searchParams.get("buyer-country")).toBeNull();
    expect(live.toString()).not.toContain("secret");

    expect(isPayPalApplePaySdkUrl(sandbox.toString())).toBe(true);
    expect(isPayPalApplePaySdkUrl(live.toString())).toBe(true);
    expect(isPayPalApplePaySdkUrl("https://example.com/sdk/js?components=applepay&client-id=x")).toBe(false);
    expect(isPayPalApplePaySdkUrl("http://www.paypal.com/sdk/js?components=applepay&client-id=x")).toBe(false);
  });

  it("formats the sheet total the same way Orders v2 formats USD", () => {
    expect(formatApplePayAmount(59)).toBe(formatUsdCents(5900));
    expect(formatApplePayAmount(18.5)).toBe("18.50");
    expect(applePaySheetTotal({ label: "Vellum Press", amount: 59 })).toEqual({
      label: "Vellum Press",
      amount: "59.00",
      type: "final",
    });
    expect(formatApplePayAmount(0)).toBeNull();
  });
});

describe("Apple Pay domain association", () => {
  it("keeps the file bytes and rejects an empty value", () => {
    expect(APPLE_PAY_DOMAIN_ASSOCIATION_PATH).toBe("/.well-known/apple-developer-merchantid-domain-association");
    const file = "ASSOCIATION\nLINE-2";
    expect(readApplePayDomainAssociation(`\uFEFF${file}`)).toBe(file);
    expect(readApplePayDomainAssociation("  \n")).toBeNull();
    expect(readApplePayDomainAssociation(undefined)).toBeNull();
    expect(readApplePayDomainAssociation("x".repeat(64 * 1024 + 1))).toBeNull();
  });

  it("serves the env value with status 200 and no redirect", async () => {
    await withEnv("APPLE_PAY_DOMAIN_ASSOCIATION", "PAYPAL-DOMAIN-FILE", async () => {
      const response = await associationGET();
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("content-type")).toBe(APPLE_PAY_DOMAIN_ASSOCIATION_CONTENT_TYPE);
      expect(await response.text()).toBe("PAYPAL-DOMAIN-FILE");
    });
  });

  it("returns 404 when the association file is not configured", async () => {
    await withEnv("APPLE_PAY_DOMAIN_ASSOCIATION", undefined, async () => {
      const response = await associationGET();
      expect(response.status).toBe(404);
      expect(response.headers.get("location")).toBeNull();
    });
  });
});

describe("PayPal browser config", () => {
  it("returns the client id for the SDK and never the secret", async () => {
    await withEnv("PAYPAL_CLIENT_ID", "public-client", async () => {
      await withEnv("PAYPAL_CLIENT_SECRET", undefined, async () => {
        const hidden = await configGET();
        expect(hidden.status).toBe(404);
      });
      await withEnv("PAYPAL_CLIENT_SECRET", "super-secret-value", async () => {
        await withEnv("PAYPAL_ENV", "live", async () => {
          const response = await configGET();
          const body = (await response.json()) as { clientId: string; environment: string; sdkUrl: string };
          expect(response.status).toBe(200);
          expect(body.clientId).toBe("public-client");
          expect(body.environment).toBe("live");
          expect(new URL(body.sdkUrl).origin).toBe("https://www.paypal.com");
          expect(JSON.stringify(body)).not.toContain("super-secret-value");
          expect(Object.keys(body).sort()).toEqual(["clientId", "environment", "sdkUrl"]);
          expect(applePayBrowserConfig("public-client", "sandbox")?.environment).toBe("sandbox");
        });
      });
    });
  });
});

function paypalOrder(input: { status: string; value: string; currency?: string; customId: string; captured?: boolean }): PayPalOrder {
  const currency = input.currency ?? "USD";
  return {
    id: "5O190127TN364715T",
    status: input.status,
    purchase_units: [
      {
        custom_id: input.customId,
        amount: { currency_code: currency, value: input.value },
        payments: input.captured
          ? {
              captures: [
                {
                  id: "CAP0",
                  status: "COMPLETED",
                  create_time: "2026-10-18T00:00:00.000Z",
                  amount: { currency_code: currency, value: input.value },
                },
              ],
            }
          : undefined,
      },
    ],
  };
}

describe("Apple Pay order and capture", () => {
  it("prices the order from the catalog and ignores a client amount", async () => {
    const priced = quote(["health-fitness-bundle"]);
    expect(priced.subtotal).toBe(59);
    const bodies: Array<{ purchase_units?: Array<{ amount?: { value?: string; currency_code?: string } }>; payment_source?: unknown }> = [];

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const href = String(url);
        if (href.endsWith("/v1/oauth2/token")) {
          return new Response(JSON.stringify({ access_token: "tok" }), { status: 200 });
        }
        if (href.endsWith("/v2/checkout/orders")) {
          bodies.push(JSON.parse(String(init?.body)) as (typeof bodies)[number]);
          return new Response(JSON.stringify({ id: "5O190127TN364715T", status: "CREATED" }), { status: 201 });
        }
        return new Response("unexpected", { status: 500 });
      }),
    );

    await withEnv("PAYPAL_CLIENT_ID", "client-id", async () => {
      await withEnv("PAYPAL_CLIENT_SECRET", "client-secret", async () => {
        await withEnv("PAYPAL_ENV", "sandbox", async () => {
          await withEnv("DOWNLOAD_SECRET", SECRET, async () => {
            const response = await orderPOST(
              new Request("http://127.0.0.1/api/paypal/applepay/order", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: "reader@example.com",
                  slugs: ["health-fitness-bundle"],
                  amount: 1,
                  currency: "EUR",
                }),
              }),
            );
            const payload = (await response.json()) as { id?: string; state?: string; token?: string };
            expect(response.status).toBe(200);
            expect(payload.id).toBe("5O190127TN364715T");
            expect(payload.state).toBeTruthy();
            expect(payload.token).toBeUndefined();
            expect(bodies[0]?.purchase_units?.[0]?.amount).toEqual({
              currency_code: "USD",
              value: "59.00",
              breakdown: { item_total: { currency_code: "USD", value: "59.00" } },
            });
            expect(bodies[0]?.payment_source).toBeUndefined();
          });
        });
      });
    });
  });

  it("issues a receipt only when the captured PayPal total matches the catalog", async () => {
    const email = "reader@example.com";
    const slugs = ["health-fitness-bundle"];
    const customId = paypalOrderBinding(email, slugs, SECRET);
    const state = signPayPalCheckoutState({ email, slugs }, SECRET);
    const calls: string[] = [];

    function install(order: PayPalOrder, captured?: PayPalOrder) {
      calls.length = 0;
      vi.stubGlobal(
        "fetch",
        vi.fn(async (url: string, init?: RequestInit) => {
          const href = String(url);
          calls.push(`${init?.method ?? "GET"} ${href}`);
          if (href.endsWith("/v1/oauth2/token")) {
            return new Response(JSON.stringify({ access_token: "tok" }), { status: 200 });
          }
          if (href.endsWith("/capture")) {
            return new Response(JSON.stringify(captured ?? order), { status: 201 });
          }
          if (href.includes("/v2/checkout/orders/")) {
            return new Response(JSON.stringify(order), { status: 200 });
          }
          return new Response("unexpected", { status: 500 });
        }),
      );
    }

    async function capture() {
      return capturePOST(
        new Request("http://127.0.0.1/api/paypal/applepay/capture", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: "5O190127TN364715T", state }),
        }),
      );
    }

    await withEnv("PAYPAL_CLIENT_ID", "client-id", async () => {
      await withEnv("PAYPAL_CLIENT_SECRET", "client-secret", async () => {
        await withEnv("PAYPAL_ENV", "sandbox", async () => {
          await withEnv("DOWNLOAD_SECRET", SECRET, async () => {
            install(paypalOrder({ status: "COMPLETED", value: "59.00", customId, captured: true }));
            const paid = await capture();
            const paidBody = (await paid.json()) as { token?: string };
            expect(paid.status).toBe(200);
            expect(calls.some((call) => call.includes("/capture"))).toBe(false);
            const receipt = verifyDownloadToken(paidBody.token ?? "");
            expect(receipt?.demo).toBe(false);
            expect(receipt?.email).toBe(email);
            expect(receipt?.files).toEqual(["12-week-reset", "weeknight-table", "floor-and-form"]);
            expect(receipt?.orderId).toBe("5O190127TN364715T");

            install(paypalOrder({ status: "APPROVED", value: "59.00", customId }), paypalOrder({
              status: "COMPLETED",
              value: "59.00",
              customId,
              captured: true,
            }));
            const approved = await capture();
            expect(approved.status).toBe(200);
            expect(calls.some((call) => call.startsWith("POST") && call.includes("/capture"))).toBe(true);

            install(paypalOrder({ status: "COMPLETED", value: "80.00", customId, captured: true }));
            const retail = await capture();
            const retailBody = (await retail.json()) as { token?: string; error?: string };
            expect(retail.status).toBe(402);
            expect(retailBody).toEqual({
              error: "Apple Pay could not be confirmed, so the downloads were not released.",
            });
            expect(retailBody.token).toBeUndefined();

            install(paypalOrder({ status: "COMPLETED", value: "59.00", currency: "EUR", customId, captured: true }));
            const euros = await capture();
            expect(euros.status).toBe(402);
            const eurosBody = (await euros.json()) as { token?: string };
            expect(eurosBody.token).toBeUndefined();
          });
        });
      });
    });
  });

  it("does not start Apple Pay when PayPal is not configured", async () => {
    await withEnv("PAYPAL_CLIENT_ID", undefined, async () => {
      await withEnv("PAYPAL_CLIENT_SECRET", undefined, async () => {
        const response = await orderPOST(
          new Request("http://127.0.0.1/api/paypal/applepay/order", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: "reader@example.com", slugs: ["steady-mind"], amount: 1 }),
          }),
        );
        expect(response.status).toBe(501);
      });
    });
  });
});
