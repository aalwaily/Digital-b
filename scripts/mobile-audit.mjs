/**
 * Mobile overflow check for the storefront.
 *
 * Usage: node scripts/mobile-audit.mjs [baseUrl]
 * Expects `next start` (or `next dev`) already running.
 *
 * Fails when a key page, in English or Arabic, grows wider than the viewport
 * at 320, 360, 375, 390, 414, or 430px, or in a 667×375 landscape check.
 * Also fails when the product buy bar covers the on-screen purchase button
 * or the footer, when the mobile menu cannot scroll or will not close, and
 * when the WhatsApp button is missing, not in the bottom-left of the viewport,
 * or covering the buy bar, price, or add-to-cart control.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const base = (process.argv[2] || "http://127.0.0.1:43123").replace(/\/$/, "");
const out = "/tmp/vellum-mobile";
mkdirSync(out, { recursive: true });

const viewports = [
  { width: 320, height: 568, name: "320" },
  { width: 360, height: 800, name: "360" },
  { width: 375, height: 667, name: "375" },
  { width: 390, height: 844, name: "390" },
  { width: 414, height: 896, name: "414" },
  { width: 430, height: 932, name: "430" },
  { width: 667, height: 375, name: "667x375" },
];

function pathsFor(locale) {
  return [
    "/",
    "/shop",
    "/shop?category=health",
    "/shop?category=career",
    "/product/first-client",
    "/product/health-fitness-bundle",
    "/product/gulf-ats-cv-kit",
    "/cart",
    "/faq",
    "/contact",
    "/blog",
    "/blog/sunday-prep-that-holds",
    locale === "ar" ? "/blog/qalb-sira-ats" : "/blog/ats-cv-template-saudi-jobs",
    "/legal/privacy",
    "/legal/terms",
    "/legal/refunds",
    "/legal/delivery",
    "/missing-page",
  ];
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});

const problems = [];

function probeOverflow() {
  const vw = document.documentElement.clientWidth;
  const docOverflow = document.documentElement.scrollWidth - vw;
  const outside = [];
  for (const node of document.body.querySelectorAll("*")) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    if (node.closest(".sr-only, [hidden]")) continue;
    const rect = node.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    const overRight = rect.right - vw;
    const overLeft = -rect.left;
    if (overRight <= 1 && overLeft <= 1) continue;
    const childAlso = [...node.children].some((child) => {
      const childStyle = getComputedStyle(child);
      if (childStyle.display === "none" || childStyle.visibility === "hidden") return false;
      const box = child.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) return false;
      return box.right - vw > 1 || -box.left > 1;
    });
    if (childAlso) continue;
    const text = (node.getAttribute("aria-label") || node.textContent || node.tagName)
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 60);
    outside.push(`${overRight > 1 ? "right" : "left"} ${Math.round(Math.max(overRight, overLeft))}px ${node.tagName.toLowerCase()} "${text}"`);
  }
  return { docOverflow, outside: outside.slice(0, 8) };
}

function probeBuyBar() {
  const barShown = (bar) => {
    const style = getComputedStyle(bar);
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) !== 0;
  };
  const bar = document.querySelector("[data-sticky-buy]");
  const purchase = document.querySelector("#product-purchase");
  const button = purchase?.querySelector("button");
  const heroPrice = purchase?.querySelector(".price");
  if (!bar || !button || !heroPrice) return ["missing purchase block or buy bar"];
  const issues = [];
  const shown = barShown(bar);
  const barBox = bar.getBoundingClientRect();
  const priceBox = heroPrice.getBoundingClientRect();
  const buttonBox = button.getBoundingClientRect();
  const priceInView = priceBox.height >= 8 && priceBox.bottom > 8 && priceBox.top < window.innerHeight - 8;
  const priceCovered = shown && priceBox.bottom > barBox.top + 1 && priceBox.top < barBox.bottom - 1 && priceInView;
  if (priceCovered) issues.push("buy bar covers the price");
  if (!priceInView && !shown) issues.push("price is not in the first screen");
  const buttonCovered = shown && buttonBox.bottom > barBox.top + 1 && buttonBox.top < barBox.bottom - 1 && buttonBox.bottom > 0 && buttonBox.top < window.innerHeight;
  if (buttonCovered) issues.push("buy bar covers the on-screen purchase button");
  const belowFold = buttonBox.top >= window.innerHeight - 1;
  if (belowFold && !shown) issues.push("purchase button is below the fold and the buy bar is hidden");
  if ((!priceInView || belowFold) && shown) {
    const barButton = bar.querySelector("button");
    const barPrice = bar.querySelector(".price");
    for (const [name, node] of [["bar button", barButton], ["bar price", barPrice]]) {
      if (!node) {
        issues.push(`buy bar is missing its ${name}`);
        continue;
      }
      const box = node.getBoundingClientRect();
      if (box.width < 8 || box.height < 8 || box.top < -1 || box.bottom > window.innerHeight + 1 || box.left < -1 || box.right > window.innerWidth + 1) {
        issues.push(`${name} is not fully on screen`);
      }
    }
    if (barButton) {
      const box = barButton.getBoundingClientRect();
      if (box.height < 43 || box.width < 43) issues.push(`bar button ${Math.round(box.width)}x${Math.round(box.height)}`);
    }
  }
  return issues;
}

function probeWhatsApp() {
  const link = [...document.querySelectorAll("[data-whatsapp]")].find((node) => {
    if (node.dataset.placed !== "true") return false;
    const nodeStyle = getComputedStyle(node);
    if (nodeStyle.display === "none" || nodeStyle.visibility === "hidden") return false;
    const nodeBox = node.getBoundingClientRect();
    return nodeBox.width > 8 && nodeBox.height > 8;
  });
  if (!link) return ["whatsapp button missing"];
  const issues = [];
  const style = getComputedStyle(link);
  const box = link.getBoundingClientRect();
  if (style.position !== "fixed") issues.push("whatsapp button is not fixed");
  const computedLeft = Number.parseFloat(style.left);
  if (!Number.isFinite(computedLeft) || computedLeft > 48) issues.push(`whatsapp button left ${style.left}`);
  if (box.width < 44 || box.height < 44) issues.push(`whatsapp target ${Math.round(box.width)}x${Math.round(box.height)}`);
  if (box.left < -1 || box.top < -1 || box.right > window.innerWidth + 1 || box.bottom > window.innerHeight + 1) {
    issues.push("whatsapp button is outside the viewport");
  }
  if (box.left > 48 || box.right > window.innerWidth * 0.55) issues.push("whatsapp button is not at the bottom-left");
  const fromBottom = window.innerHeight - box.bottom;
  if (fromBottom > box.top && fromBottom > 180) issues.push(`whatsapp button is ${Math.round(fromBottom)}px above the bottom`);
  const href = link.getAttribute("href") || "";
  if (href !== "https://wa.me/966509309787?s=p") issues.push(`whatsapp href ${href}`);
  if (link.target !== "_blank") issues.push("whatsapp target");
  const rel = link.getAttribute("rel") || "";
  if (!/\bnoopener\b/.test(rel) || !/\bnoreferrer\b/.test(rel)) issues.push("whatsapp rel");
  const expected = document.documentElement.dir === "rtl" ? "تواصل معنا عبر واتساب" : "Chat on WhatsApp";
  if ((link.getAttribute("aria-label") || "") !== expected) issues.push(`whatsapp label "${link.getAttribute("aria-label") || ""}"`);
  const shown = (el) => {
    const nodeStyle = getComputedStyle(el);
    return nodeStyle.display !== "none" && nodeStyle.visibility !== "hidden" && Number(nodeStyle.opacity) !== 0;
  };
  const hits = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
  const blocks = [
    ["buy bar", document.querySelector("[data-sticky-buy]")],
    ["price", document.querySelector("#product-purchase .price")],
    ["add to cart", document.querySelector("#product-purchase button")],
    ["copyright", document.querySelector("[data-copyright]")],
  ];
  for (const el of document.querySelectorAll("aside .price, aside a, aside button, #checkout-form button")) {
    blocks.push(["key control", el]);
  }
  for (const [name, el] of blocks) {
    if (!el || !shown(el)) continue;
    const target = el.getBoundingClientRect();
    if (target.width < 8 || target.height < 8 || target.bottom <= 0 || target.top >= window.innerHeight) continue;
    if (hits(box, target)) issues.push(`whatsapp button covers the ${name}`);
  }
  return issues;
}

function probeFooter() {
  const barShown = (bar) => {
    const style = getComputedStyle(bar);
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) !== 0;
  };
  const bar = document.querySelector("[data-sticky-buy]");
  if (!bar || !barShown(bar)) return ["buy bar stayed hidden at the end of the page"];
  const barBox = bar.getBoundingClientRect();
  const covered = [...document.querySelectorAll("footer a, footer button, footer p")].filter((node) => {
    const box = node.getBoundingClientRect();
    if (box.height < 2 || box.bottom < 0 || box.top > window.innerHeight) return false;
    return box.top < barBox.bottom - 1 && box.bottom > barBox.top + 1;
  });
  if (!covered.length) return [];
  const sample = (covered[0].textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
  return [`buy bar covers footer "${sample}"`];
}

for (const locale of ["en", "ar"]) {
  const context = await browser.newContext({
    locale: locale === "ar" ? "ar-SA" : "en-US",
    extraHTTPHeaders: { "Accept-Language": locale === "ar" ? "ar" : "en" },
  });
  await context.addCookies([{ name: "vellum_locale", value: locale, url: base }]);
  await context.addInitScript(() => {
    localStorage.setItem("vellum-cart-v1", JSON.stringify(["first-client", "health-fitness-bundle"]));
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => problems.push(`${locale} pageerror ${error.message}`));

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const path of pathsFor(locale)) {
      const url = `${base}/${locale}${path === "/" ? "" : path}`;
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts?.ready);
      const status = response?.status() ?? 0;
      const label = `${locale} ${viewport.name} ${path}`;
      if (path === "/missing-page") {
        if (status !== 404) problems.push(`${label} status ${status} expected 404`);
      } else if (status >= 400) {
        problems.push(`${label} status ${status}`);
        continue;
      }
      await page.waitForFunction(() => {
        return [...document.querySelectorAll("[data-whatsapp]")].some((node) => {
          if (node.dataset.placed !== "true") return false;
          const box = node.getBoundingClientRect();
          return box.width > 8 && box.height > 8;
        });
      });
      const metrics = await page.evaluate(probeOverflow);
      if (metrics.docOverflow > 1) problems.push(`${label} document overflow ${metrics.docOverflow}px`);
      for (const item of metrics.outside) problems.push(`${label} ${item}`);
      const whatsappIssues = await page.evaluate(probeWhatsApp);
      for (const item of whatsappIssues) problems.push(`${label} ${item}`);
      if (path.startsWith("/product/")) {
        await page.waitForFunction(() => document.querySelector("[data-sticky-buy]")?.dataset.ready === "true");
        const barIssues = await page.evaluate(probeBuyBar);
        for (const item of barIssues) problems.push(`${label} ${item}`);
        await page.evaluate(() => {
          document.documentElement.style.scrollBehavior = "auto";
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
        await page.waitForFunction(() => {
          const bar = document.querySelector("[data-sticky-buy]");
          const fab = [...document.querySelectorAll("[data-whatsapp]")].find((node) => {
            const box = node.getBoundingClientRect();
            return node.dataset.placed === "true" && box.width > 8 && box.height > 8;
          });
          if (!bar || !fab) return false;
          const style = getComputedStyle(bar);
          if (style.visibility === "hidden" || style.display === "none") return false;
          return fab.getBoundingClientRect().bottom <= bar.getBoundingClientRect().top + 1;
        });
        const footerIssues = await page.evaluate(probeFooter);
        const footerWhatsapp = await page.evaluate(probeWhatsApp);
        for (const item of footerWhatsapp) problems.push(`${label} scrolled ${item}`);
        for (const item of footerIssues) problems.push(`${label} ${item}`);
      }
      if (problems.some((item) => item.startsWith(label))) {
        const name = `${label.replace(/[^\w.-]+/g, "_")}.png`;
        await page.screenshot({ path: `${out}/${name}`, fullPage: false }).catch(() => {});
      }
    }
  }

  for (const viewport of [
    { width: 320, height: 568, name: "320" },
    { width: 667, height: 375, name: "667x375" },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/${locale}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts?.ready);
    const menuName = locale === "ar" ? "فتح القائمة" : "Open menu";
    await page.getByRole("button", { name: menuName }).click();
    await page.waitForTimeout(300);
    const menu = await page.evaluate(() => {
      const dialog = document.querySelector("[data-slot='sheet-content']");
      if (!dialog) return { missing: true };
      const scroller = dialog.querySelector(".overflow-y-auto") || dialog;
      const style = getComputedStyle(scroller);
      const scrollable = /(auto|scroll)/.test(style.overflowY);
      const links = [...dialog.querySelectorAll("a, button")];
      const clipped = links.filter((node) => {
        const box = node.getBoundingClientRect();
        return box.height > 2 && (box.bottom > window.innerHeight + 1 || box.top < -1 || box.right > window.innerWidth + 1 || box.left < -1);
      }).map((node) => (node.textContent || node.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40));
      const close = dialog.querySelector("[data-slot='sheet-close']");
      const closeBox = close?.getBoundingClientRect();
      return {
        scrollable,
        overflow: scroller.scrollHeight - scroller.clientHeight,
        clipped,
        close: closeBox ? { w: closeBox.width, h: closeBox.height, top: closeBox.top, bottom: closeBox.bottom } : null,
      };
    });
    const label = `${locale} ${viewport.name} menu`;
    if (menu.missing) problems.push(`${label} did not open`);
    if (!menu.scrollable) problems.push(`${label} cannot scroll`);
    if (menu.overflow > 1 && !menu.scrollable) problems.push(`${label} content clipped ${menu.overflow}px`);
    for (const item of menu.clipped || []) problems.push(`${label} clips "${item}"`);
    if (!menu.close || menu.close.h < 43 || menu.close.w < 43 || menu.close.top < -1 || menu.close.bottom > viewport.height + 1) {
      problems.push(`${label} close target ${menu.close ? `${Math.round(menu.close.w)}x${Math.round(menu.close.h)}` : "missing"}`);
    }
    const overflow = await page.evaluate(probeOverflow);
    if (overflow.docOverflow > 1) problems.push(`${label} document overflow ${overflow.docOverflow}px`);
    for (const item of overflow.outside) problems.push(`${label} ${item}`);
    await page.locator("[data-slot='sheet-close']").click();
    await page.waitForTimeout(250);
    if (await page.locator("[data-slot='sheet-content']").count()) problems.push(`${label} did not close`);
  }

  await context.close();
}

await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} mobile issues. Failure screenshots in ${out}`);
  process.exit(1);
}
console.log("Mobile overflow check passed.");
