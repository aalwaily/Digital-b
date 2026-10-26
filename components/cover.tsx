import type { Product } from "@/data/products";
import {
  COVER_RIGHT,
  COVER_WIDTH,
  coverLatinPlacement,
  coverRule,
  coverSvgBidi,
  coverTextPlacement,
  mirrorX,
  worksheetHeadingX,
} from "@/lib/cover-layout";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "cn";

export function Cover({
  product,
  className,
  locale,
}: {
  product: Product;
  className?: string;
  locale: Locale;
  /** Kept so existing calls compile. The drawing is always hidden from assistive tech; the link or heading names it. */
  decorative?: boolean;
}) {
  const { bg, fg, accent, motif, titleLines, eyebrow, deck } = product.cover;
  const titleStart = titleLines.length > 2 ? 250 : 268;
  const rtl = locale === "ar";
  const family = rtl ? "var(--font-arabic-serif), serif" : "var(--font-serif), Georgia, serif";
  const sans = rtl ? "var(--font-arabic-sans), sans-serif" : "var(--font-sans), sans-serif";
  const arabic = coverTextPlacement(rtl);
  const rule = coverRule(rtl);
  const en = { x: 48 };

  return (
    <svg
      viewBox="0 0 600 800"
      className={cn("h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
      {...coverSvgBidi(rtl)}
    >
      <rect width="600" height="800" fill={bg} />
      <Motif motif={motif} accent={accent} fg={fg} />
      <text
        x={rtl ? COVER_RIGHT : 48}
        textAnchor={rtl ? "end" : undefined}
        direction="ltr"
        unicodeBidi="isolate"
        y="78"
        fill={fg}
        fillOpacity="0.78"
        fontFamily={sans}
        fontSize="16"
        letterSpacing={rtl ? 0 : 5}
      >
        VELLUM PRESS
      </text>
      <text {...(rtl ? arabic : en)} y="168" fill={accent} fontFamily={sans} fontSize="18" letterSpacing={rtl ? 0 : 2.5}>
        {rtl ? eyebrow : eyebrow.toUpperCase()}
      </text>
      {titleLines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          {...(rtl ? arabic : en)}
          y={titleStart + index * (rtl ? 70 : 78)}
          fill={fg}
          fontFamily={family}
          fontSize={rtl ? 54 : 72}
        >
          {line}
        </text>
      ))}
      <text
        {...(rtl ? arabic : en)}
        y={titleStart + titleLines.length * (rtl ? 70 : 78) + 8}
        fill={fg}
        fillOpacity="0.82"
        fontFamily={sans}
        fontSize="22"
      >
        {deck}
      </text>
      <line x1={rule.x1} y1={rule.y1} x2={rule.x2} y2={rule.y2} stroke={accent} strokeWidth="3" />
      <text {...(rtl ? arabic : en)} y="752" fill={fg} fillOpacity="0.7" fontFamily={sans} fontSize="15" letterSpacing={rtl ? 0 : 1.5}>
        {rtl ? "دليل رقمي" : "DIGITAL GUIDE"}
      </text>
    </svg>
  );
}

function Motif({ motif, accent, fg }: { motif: Product["cover"]["motif"]; accent: string; fg: string }) {
  if (motif === "path") {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((step) => (
          <rect
            key={step}
            x={78 + step * 92}
            y={560 - step * 42}
            width="58"
            height={90 + step * 36}
            rx="6"
            fill={accent}
            opacity={0.35 + step * 0.13}
          />
        ))}
      </g>
    );
  }
  if (motif === "plate") {
    return (
      <g fill="none" stroke={accent} strokeWidth="10">
        <circle cx="430" cy="560" r="150" opacity="0.9" />
        <circle cx="430" cy="560" r="98" opacity="0.7" />
        <circle cx="430" cy="560" r="46" fill={accent} stroke="none" opacity="0.85" />
      </g>
    );
  }
  if (motif === "form") {
    return (
      <g fill="none" stroke={accent} strokeWidth="16" strokeLinecap="round">
        <path d="M150 690 C190 560 250 520 310 470" />
        <path d="M470 690 C420 560 360 530 320 450" />
        <circle cx="316" cy="390" r="36" fill={accent} stroke="none" opacity="0.9" />
      </g>
    );
  }
  if (motif === "ledger") {
    return (
      <g>
        {Array.from({ length: 8 }).map((_, index) => (
          <rect
            key={index}
            x="70"
            y={470 + index * 28}
            width={460 - (index % 3) * 40}
            height="8"
            rx="4"
            fill={fg}
            opacity={index === 0 ? 0.85 : 0.28}
          />
        ))}
        <rect x="70" y="470" width="120" height="8" rx="4" fill={accent} />
      </g>
    );
  }
  if (motif === "grid") {
    return (
      <g>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 5 }).map((__, col) => (
            <rect
              key={`${row}-${col}`}
              x={80 + col * 90}
              y={490 + row * 62}
              width="72"
              height="46"
              rx="6"
              fill={col + row === 3 ? accent : fg}
              opacity={col + row === 3 ? 0.95 : 0.12}
            />
          )),
        )}
      </g>
    );
  }
  if (motif === "mark") {
    return (
      <g>
        <circle cx="430" cy="560" r="120" fill="none" stroke={accent} strokeWidth="14" />
        <path d="M360 640 L500 480" stroke={accent} strokeWidth="14" strokeLinecap="round" />
      </g>
    );
  }
  if (motif === "bars") {
    return (
      <g>
        {[90, 140, 110, 180, 130, 200].map((height, index) => (
          <rect
            key={height}
            x={80 + index * 78}
            y={700 - height}
            width="48"
            height={height}
            rx="6"
            fill={index === 3 ? accent : fg}
            opacity={index === 3 ? 1 : 0.18}
          />
        ))}
      </g>
    );
  }
  if (motif === "breath") {
    return (
      <g fill="none" stroke={accent}>
        <circle cx="400" cy="560" r="40" strokeWidth="8" opacity="0.95" />
        <circle cx="400" cy="560" r="90" strokeWidth="8" opacity="0.55" />
        <circle cx="400" cy="560" r="145" strokeWidth="8" opacity="0.28" />
      </g>
    );
  }
  return (
    <g>
      {[0, 1, 2].map((card) => (
        <rect
          key={card}
          x={250 + card * 28}
          y={470 + card * 24}
          width="230"
          height="150"
          rx="12"
          fill={card === 2 ? accent : fg}
          opacity={card === 2 ? 0.95 : 0.14 + card * 0.08}
          transform={`rotate(${-8 + card * 6} 365 545)`}
        />
      ))}
    </g>
  );
}

export function ContentsPlate({ product, locale }: { product: Product; locale: Locale }) {
  const rtl = locale === "ar";
  const lines = product.contents.slice(0, 8);
  const family = rtl ? "var(--font-arabic-serif), serif" : "var(--font-serif), Georgia, serif";
  const sans = rtl ? "var(--font-arabic-sans), sans-serif" : "var(--font-sans), sans-serif";
  const heading = rtl ? coverTextPlacement(true) : { x: 48 };
  const title = rtl ? coverTextPlacement(true) : { x: 48 };
  return (
    <svg viewBox="0 0 600 800" className="h-auto w-full" aria-hidden="true" focusable="false" {...coverSvgBidi(rtl)}>
      <rect width="600" height="800" fill="#F7F3EC" />
      <rect x={rtl ? COVER_WIDTH - 16 : 0} y="0" width="16" height="800" fill={product.cover.bg} />
      <text {...heading} y="86" fill="#1C1915" fontFamily={family} fontSize="36">
        {rtl ? "المحتويات" : "Contents"}
      </text>
      <text {...title} y="122" fill="#6B645C" fontFamily={sans} fontSize="16">
        {product.title}
      </text>
      {lines.map((line, index) => (
        <g key={`${line}-${index}`}>
          <text {...(rtl ? coverLatinPlacement(true) : { x: 48 })} y={200 + index * 58} fill={product.cover.bg} fontFamily={sans} fontSize="16">
            {String(index + 1).padStart(2, "0")}
          </text>
          <text
            {...(rtl ? coverTextPlacement(true, 500) : { x: 96 })}
            y={200 + index * 58}
            fill="#1C1915"
            fontFamily={family}
            fontSize={rtl ? 18 : 22}
          >
            {line.length > (rtl ? 28 : 34) ? `${line.slice(0, rtl ? 26 : 32)}…` : line}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function WorksheetPlate({ product, locale }: { product: Product; locale: Locale }) {
  const rtl = locale === "ar";
  const headings = rtl ? ["خطة", "تم", "ملاحظة"] : ["PLAN", "DONE", "NOTE"];
  const family = rtl ? "var(--font-arabic-serif), serif" : "var(--font-serif), Georgia, serif";
  const sans = rtl ? "var(--font-arabic-sans), sans-serif" : "var(--font-sans), sans-serif";
  const header = rtl ? coverTextPlacement(true, COVER_RIGHT - 16) : { x: 64 };
  return (
    <svg viewBox="0 0 600 800" className="h-auto w-full" aria-hidden="true" focusable="false" {...coverSvgBidi(rtl)}>
      <rect width="600" height="800" fill="#F7F3EC" />
      <rect x="40" y="48" width="520" height="92" rx="12" fill={product.cover.bg} />
      <text {...header} y="92" fill={product.cover.fg} fontFamily={family} fontSize="28">
        {rtl ? "مراجعة أسبوعية" : "Weekly check"}
      </text>
      <text {...header} y="120" fill={product.cover.accent} fontFamily={sans} fontSize="14">
        {rtl ? `صفحة للطباعة · ${product.cover.eyebrow}` : `PRINTABLE PAGE · ${product.cover.eyebrow.toUpperCase()}`}
      </text>
      {headings.map((heading, index) => (
        <text
          key={heading}
          {...(rtl ? coverTextPlacement(true, worksheetHeadingX(index, true)) : { x: worksheetHeadingX(index, false) })}
          y="200"
          fill="#6B645C"
          fontFamily={sans}
          fontSize="14"
          letterSpacing={rtl ? 0 : 1.5}
        >
          {heading}
        </text>
      ))}
      {Array.from({ length: 6 }).map((_, row) => (
        <g key={row}>
          <rect x="48" y={230 + row * 78} width="504" height="64" rx="8" fill="#fff" stroke="#E4DDD2" />
          <rect x={mirrorX(68, 18, rtl)} y={252 + row * 78} width="18" height="18" rx="3" fill="none" stroke={product.cover.bg} strokeWidth="2" />
          <rect x={mirrorX(220, 120, rtl)} y={256 + row * 78} width="120" height="8" rx="4" fill="#E4DDD2" />
          <rect x={mirrorX(390, 130, rtl)} y={256 + row * 78} width="130" height="8" rx="4" fill="#E4DDD2" />
        </g>
      ))}
    </svg>
  );
}
