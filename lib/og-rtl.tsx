import { stripBidiIsolates } from "@/lib/i18n/bidi";

const ARABIC_DIGIT = /[\u0660-\u0669\u06F0-\u06F9]/;
const ARABIC_LETTER = /[\u0590-\u065F\u066A-\u06EF\u06FA-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LTR_CHAR = /[A-Za-z0-9@#$%&*+=/_.]/;

export type OgRtlPiece = { text: string; ltr: boolean };

/** One visual word. Pieces stay together; a pure Latin phrase keeps its internal order. */
export type OgRtlChunk = { pieces: OgRtlPiece[]; ltrPhrase: boolean };

/**
 * Satori shapes Arabic letters but lays words out from the left. These chunks
 * are the logical reading order. Render them in a row-reverse flex line.
 * Consecutive Latin words ("Vellum Press", "$29 · PDF") stay one left-to-right phrase.
 */
export function ogRtlChunks(value: string): OgRtlChunk[] {
  const text = stripBidiIsolates(value).replace(/\s+/g, " ").trim();
  if (!text) return [];
  const words = text.split(" ").map(wordPieces).filter((word) => word.length > 0);
  const chunks: OgRtlChunk[] = [];
  for (const word of words) {
    const ltrPhrase = word.every((piece) => piece.ltr);
    const previous = chunks[chunks.length - 1];
    if (ltrPhrase && previous?.ltrPhrase) {
      previous.pieces.push({ text: " ", ltr: true }, ...word);
      continue;
    }
    chunks.push({ pieces: word, ltrPhrase });
  }
  return chunks;
}

export function ogRtlChunkText(chunk: OgRtlChunk) {
  return chunk.pieces.map((piece) => piece.text).join("");
}

function wordPieces(word: string): OgRtlPiece[] {
  const pieces: OgRtlPiece[] = [];
  let buffer = "";
  let ltr: boolean | null = null;
  const flush = () => {
    if (!buffer) return;
    pieces.push({ text: buffer, ltr: ltr === true });
    buffer = "";
    ltr = null;
  };
  for (const char of word) {
    const kind = charKind(char);
    if (kind === "neutral") {
      buffer += char;
      continue;
    }
    if (ltr === null) {
      ltr = kind === "ltr";
      buffer += char;
      continue;
    }
    if ((kind === "ltr") !== ltr) {
      flush();
      ltr = kind === "ltr";
    }
    buffer += char;
  }
  flush();
  return pieces;
}

function charKind(char: string): "rtl" | "ltr" | "neutral" {
  if (ARABIC_DIGIT.test(char)) return "ltr";
  if (ARABIC_LETTER.test(char)) return "rtl";
  if (LTR_CHAR.test(char)) return "ltr";
  return "neutral";
}

export function OgRtlText({
  text,
  fontSize,
  color,
  lineHeight = 1.25,
  opacity,
  block = true,
  chunkColors,
}: {
  text: string;
  fontSize: number;
  color?: string;
  lineHeight?: number;
  opacity?: number;
  /** Fill the row so wrapped lines stay right-aligned. Short labels shrink. */
  block?: boolean;
  /** Optional per-chunk colors used to verify reading order. */
  chunkColors?: string[];
}) {
  const chunks = ogRtlChunks(text);
  const gap = Math.max(8, Math.round(fontSize * 0.28));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
        ...(block ? { width: "100%" } : {}),
        columnGap: gap,
        rowGap: Math.round(fontSize * 0.22),
        fontSize,
        lineHeight,
        ...(color ? { color } : {}),
        ...(opacity === undefined ? {} : { opacity }),
      }}
    >
      {chunks.map((chunk, index) => {
        const mark = chunkColors?.[index];
        const body = chunk.ltrPhrase ? (
          <div style={{ display: "flex", direction: "ltr", unicodeBidi: "isolate", ...(mark ? { color: mark } : {}) }}>
            {ogRtlChunkText(chunk)}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "row-reverse", ...(mark ? { color: mark } : {}) }}>
            {chunk.pieces.map((piece, pieceIndex) => (
              <div
                key={pieceIndex}
                style={{
                  display: "flex",
                  ...(piece.ltr ? { direction: "ltr" as const, unicodeBidi: "isolate" as const } : {}),
                }}
              >
                {piece.text}
              </div>
            ))}
          </div>
        );
        if (!mark) return <div key={index} style={{ display: "flex" }}>{body}</div>;
        return (
          <div key={index} style={{ display: "flex", flexDirection: "column" }}>
            {body}
            <div style={{ display: "flex", width: "100%", height: 6, background: mark }} />
          </div>
        );
      })}
    </div>
  );
}
