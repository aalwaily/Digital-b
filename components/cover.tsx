import type { Product } from "@/data/products";
import { cn } from "cn";

export function Cover({
  product,
  className,
  decorative = false,
}: {
  product: Product;
  className?: string;
  decorative?: boolean;
}) {
  const { bg, fg, accent, motif, titleLines, eyebrow, deck } = product.cover;
  const titleStart = titleLines.length > 2 ? 250 : 268;

  return (
    <svg
      viewBox="0 0 600 800"
      className={cn("h-auto w-full", className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${product.title} cover`}
      aria-hidden={decorative || undefined}
    >
      <rect width="600" height="800" fill={bg} />
      <Motif motif={motif} accent={accent} fg={fg} />
      <text
        x="48"
        y="78"
        fill={fg}
        fillOpacity="0.78"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="16"
        letterSpacing="5"
      >
        VELLUM PRESS
      </text>
      <text
        x="48"
        y="168"
        fill={accent}
        fontFamily="var(--font-sans), sans-serif"
        fontSize="18"
        letterSpacing="2.5"
      >
        {eyebrow.toUpperCase()}
      </text>
      {titleLines.map((line, index) => (
        <text
          key={line}
          x="48"
          y={titleStart + index * 78}
          fill={fg}
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="72"
        >
          {line}
        </text>
      ))}
      <text
        x="48"
        y={titleStart + titleLines.length * 78 + 8}
        fill={fg}
        fillOpacity="0.82"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="22"
      >
        {deck}
      </text>
      <line
        x1="48"
        y1="720"
        x2="180"
        y2="720"
        stroke={accent}
        strokeWidth="3"
      />
      <text
        x="48"
        y="752"
        fill={fg}
        fillOpacity="0.7"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="15"
        letterSpacing="1.5"
      >
        DIGITAL GUIDE
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

export function ContentsPlate({ product }: { product: Product }) {
  const lines = product.contents.slice(0, 8);
  return (
    <svg viewBox="0 0 600 800" className="h-auto w-full" role="img" aria-label={`Contents preview for ${product.title}`}>
      <rect width="600" height="800" fill="#F7F3EC" />
      <rect x="0" y="0" width="16" height="800" fill={product.cover.bg} />
      <text x="48" y="86" fill="#1C1915" fontFamily="var(--font-serif), Georgia, serif" fontSize="36">
        Contents
      </text>
      <text x="48" y="122" fill="#6B645C" fontFamily="var(--font-sans), sans-serif" fontSize="16">
        {product.title}
      </text>
      {lines.map((line, index) => (
        <g key={line}>
          <text x="48" y={200 + index * 58} fill={product.cover.bg} fontFamily="var(--font-sans), sans-serif" fontSize="16">
            {String(index + 1).padStart(2, "0")}
          </text>
          <text x="96" y={200 + index * 58} fill="#1C1915" fontFamily="var(--font-serif), Georgia, serif" fontSize="22">
            {line.length > 34 ? `${line.slice(0, 32)}…` : line}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function WorksheetPlate({ product }: { product: Product }) {
  return (
    <svg viewBox="0 0 600 800" className="h-auto w-full" role="img" aria-label={`Worksheet preview for ${product.title}`}>
      <rect width="600" height="800" fill="#F7F3EC" />
      <rect x="40" y="48" width="520" height="92" rx="12" fill={product.cover.bg} />
      <text x="64" y="92" fill={product.cover.fg} fontFamily="var(--font-serif), Georgia, serif" fontSize="28">
        Weekly check
      </text>
      <text x="64" y="120" fill={product.cover.accent} fontFamily="var(--font-sans), sans-serif" fontSize="14">
        PRINTABLE PAGE · {product.cover.eyebrow.toUpperCase()}
      </text>
      {["Plan", "Done", "Note"].map((heading, index) => (
        <text
          key={heading}
          x={64 + index * 170}
          y="200"
          fill="#6B645C"
          fontFamily="var(--font-sans), sans-serif"
          fontSize="14"
          letterSpacing="1.5"
        >
          {heading.toUpperCase()}
        </text>
      ))}
      {Array.from({ length: 6 }).map((_, row) => (
        <g key={row}>
          <rect x="48" y={230 + row * 78} width="504" height="64" rx="8" fill="#fff" stroke="#E4DDD2" />
          <rect x="68" y={252 + row * 78} width="18" height="18" rx="3" fill="none" stroke={product.cover.bg} strokeWidth="2" />
          <rect x="220" y={256 + row * 78} width="120" height="8" rx="4" fill="#E4DDD2" />
          <rect x="390" y={256 + row * 78} width="130" height="8" rx="4" fill="#E4DDD2" />
        </g>
      ))}
    </svg>
  );
}
