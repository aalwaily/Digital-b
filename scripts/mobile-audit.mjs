/**
 * Mobile layout check for the storefront.
 * Usage: node scripts/mobile-audit.mjs http://127.0.0.1:43123
 * Writes screenshots under /tmp/vellum-mobile and exits 1 on overflow or a tiny control.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const base = (process.argv[2] || "http://127.0.0.1:43123").replace(/\/$/, "");
const out = "/tmp/vellum-mobile";
mkdirSync(out, { recursive: true });

const widths = [320, 360, 375, 390, 412, 430];
const paths = ["/", "/shop", "/product/habit-ledger", "/product/gulf-work-bundle", "/product/saudi-freelancer-starter-kit", "/cart", "/checkout", "/faq", "/legal/refunds", "/legal/terms", "/contact", "/about", "/blog", "/missing-page"];

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});
const problems = [];

for (const locale of ["en", "ar"]) {
  const context = await browser.newContext({
    locale: locale === "ar" ? "ar-SA" : "en-US",
    extraHTTPHeaders: { "Accept-Language": locale === "ar" ? "ar" : "en" },
  });
  await context.addCookies([{ name: "vellum_locale", value: locale, url: base }]);
  const page = await context.newPage();
  page.on("pageerror", (error) => {
    problems.push(`${locale} pageerror ${error.message}`);
  });

  for (const width of widths) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of paths) {
      const url = `${base}/${locale}${path === "/" ? "" : path}`;
      const response = await page.goto(url, { waitUntil: "networkidle" });
      if (path === "/missing-page") {
        if (response && response.status() !== 404) problems.push(`${url} status ${response.status()} expected 404`);
      } else if (response && response.status() >= 400) {
        problems.push(`${url} status ${response.status()}`);
      }
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        const small = [];
        const skip = (node) => {
          if (node.closest("[aria-hidden='true'], .sr-only")) return true;
          const style = getComputedStyle(node);
          if (style.display === "none" || style.visibility === "hidden") return true;
          if (node.classList.contains("sr-only")) return true;
          return false;
        };
        for (const node of document.querySelectorAll("a, button, input, select, textarea, summary")) {
          if (skip(node)) continue;
          const style = getComputedStyle(node);
          const box = node.getBoundingClientRect();
          if (box.width < 2 || box.height < 2) continue;
          const font = parseFloat(style.fontSize);
          const tag = node.tagName;
          const label = (node.getAttribute("aria-label") || node.textContent || node.getAttribute("name") || tag).trim().replace(/\s+/g, " ").slice(0, 48);
          if ((tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") && node.type !== "hidden" && node.type !== "checkbox" && node.type !== "radio") {
            if (font < 16) small.push(`${tag} font ${font} ${label}`);
            if (box.height < 44) small.push(`${tag} ${Math.round(box.width)}x${Math.round(box.height)} ${label}`);
          }
          if (tag === "BUTTON" || tag === "SUMMARY" || (tag === "A" && style.display !== "inline")) {
            // 43px tolerates subpixel rounding of a 2.75rem (44px) target.
            if (box.height < 43 || box.width < 43) small.push(`${tag} ${Math.round(box.width)}x${Math.round(box.height)} ${label}`);
          } else if (tag === "A" && box.height < 24) {
            small.push(`inline ${tag} ${Math.round(box.width)}x${Math.round(box.height)} ${label}`);
          }
        }
        return { overflow, small };
      });
      if (metrics.overflow > 1) problems.push(`${locale} ${width} ${path} overflow ${metrics.overflow}px`);
      for (const item of metrics.small) problems.push(`${locale} ${width} ${path} ${item}`);
      if (width === 320 || width === 390) {
        const name = `${locale}-${width}-${path.replaceAll("/", "") || "home"}.png`;
        await page.screenshot({ path: `${out}/${name}`, fullPage: true });
      }
    }
  }
  await context.close();
}

await browser.close();
if (problems.length) {
  const unique = [...new Set(problems.map((item) => item.replace(/^(en|ar) \d+ /, "")))];
  console.error(unique.join("\n"));
  console.error(`\n${problems.length} mobile issues across viewports (${unique.length} unique). Screenshots in ${out}`);
  process.exit(1);
}
console.log(`Mobile audit passed. Screenshots in ${out}`);
