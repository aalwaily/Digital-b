"use client";

import { useEffect, useRef } from "react";

const WHATSAPP_URL = "https://wa.me/966509309787?s=p";

/**
 * Fixed chat button. `left` is physical, so Arabic pages keep it in the
 * bottom-left corner. A short effect lifts it above the buy bar and any
 * on-screen control the corner would cover.
 */
export function WhatsAppButton({ label, dir }: { label: string; dir: "ltr" | "rtl" }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fab = ref.current;
    if (!fab) return;

    const cornerSelector = "a, button, input, select, textarea, .price, [data-copyright], [data-sticky-buy], .fixed.bottom-0";
    const mustClearSelector = "#product-purchase .price, #product-purchase button, [data-copyright], [data-sticky-buy], .fixed.bottom-0, aside .price, aside a, aside button, #checkout-form button, #checkout-form .price";
    let frame = 0;

    const overlaps = (rect: { left: number; right: number; top: number; bottom: number }, box: DOMRect) =>
      rect.left < box.right - 1 && rect.right > box.left + 1 && rect.top < box.bottom - 1 && rect.bottom > box.top + 1;

    const boxesFor = (selector: string) => {
      const boxes: DOMRect[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(selector)) {
        if (el === fab || fab.contains(el)) continue;
        if (el.closest("[data-whatsapp], [data-slot='sheet-content'], [data-slot='sheet-overlay'], .sr-only, [hidden]")) continue;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
        const box = el.getBoundingClientRect();
        if (box.width < 8 || box.height < 8) continue;
        if (box.bottom <= 0 || box.top >= window.innerHeight) continue;
        boxes.push(box);
      }
      return boxes;
    };

    const place = () => {
      if (fab.getClientRects().length === 0) {
        fab.dataset.placed = "true";
        return;
      }
      const width = fab.offsetWidth;
      const height = fab.offsetHeight;
      const left = fab.getBoundingClientRect().left;
      const gap = 12;
      const floor = 16;
      const maxBottom = Math.max(floor, Math.round(window.innerHeight * 0.58 - height));
      const rectAt = (bottom: number) => {
        const top = window.innerHeight - bottom - height;
        return { left, right: left + width, top, bottom: top + height };
      };

      // One step out of whatever is already in the resting corner. Full-width
      // rows above that stay put, so a long list does not chase the button up the page.
      const resting = rectAt(floor);
      let ceiling = Number.POSITIVE_INFINITY;
      for (const box of boxesFor(cornerSelector)) {
        if (overlaps(resting, box) && box.top < ceiling) ceiling = box.top;
      }
      let bottom = floor;
      if (Number.isFinite(ceiling)) bottom = Math.min(maxBottom, Math.ceil(window.innerHeight - ceiling + gap));

      const stepAbove = (candidates: DOMRect[], passes: number, guard: (box: DOMRect, rect: { left: number; right: number; top: number; bottom: number }) => boolean) => {
        for (let pass = 0; pass < passes; pass += 1) {
          const rect = rectAt(bottom);
          let hit = Number.POSITIVE_INFINITY;
          for (const box of candidates) {
            if (!guard(box, rect)) continue;
            if (box.top < hit) hit = box.top;
          }
          if (!Number.isFinite(hit)) break;
          const next = Math.min(maxBottom, Math.ceil(window.innerHeight - hit + gap));
          if (next <= bottom) break;
          bottom = next;
        }
      };
      stepAbove(boxesFor(mustClearSelector), 6, (box, rect) => overlaps(rect, box));
      // One step off a chip or icon button. Full-width rows still have room
      // beside the button, and a wrapped row of chips should not chase it up the page.
      stepAbove(
        boxesFor("a, button").filter((box) => box.width <= 128),
        1,
        (box, rect) => {
          if (box.top < window.innerHeight - 340) return false;
          if (!overlaps(rect, box)) return false;
          const overlapW = Math.min(rect.right, box.right) - Math.max(rect.left, box.left);
          return overlapW > box.width * 0.45;
        },
      );

      fab.style.setProperty("--wa-lift", `${bottom}px`);
      fab.dataset.placed = "true";
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        place();
      });
    };

    place();
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: true,
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <a
      ref={ref}
      className="wa-fab"
      data-whatsapp=""
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <span className="wa-fab-bob">
        <span className="wa-fab-wiggle">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
            />
          </svg>
        </span>
      </span>
      <span className="wa-fab-tip" dir={dir} lang={dir === "rtl" ? "ar" : "en"} aria-hidden="true">
        {label}
      </span>
    </a>
  );
}
