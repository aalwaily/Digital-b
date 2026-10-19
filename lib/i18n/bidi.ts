const LRI = "\u2066";
const PDI = "\u2069";

/**
 * A Latin embed starts with a letter, digit, @, or $.
 * Punctuation can follow, but a match must not begin with a separator such as "·".
 * The hyphen sits at the end of each class so it stays literal.
 */
const EMBED =
  /[A-Za-z0-9@$][A-Za-z0-9@#$%&*+=/_.·:'’-]*(?:\s+[A-Za-z0-9@#$%&*+=/_.·:'’-]+)*/g;

const BIDI_MARKS = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

/** Keep a Latin embed in source order when it sits inside Arabic (RTL) text. */
export function isolateEmbeds(text: string): string {
  if (!text) return text;
  return text.replace(EMBED, (match, offset: number, source: string) => {
    if (source[offset - 1] === LRI) return match;
    if (!shouldIsolate(match)) return match;
    return `${LRI}${match}${PDI}`;
  });
}

export function stripBidiIsolates(value: string) {
  return value.replace(BIDI_MARKS, "");
}

/** Fully Latin labels (English titles, the wordmark, emails) should not inherit RTL. */
export function textDir(text: string): "ltr" | undefined {
  if (/[A-Za-z]/.test(text) && !/[\u0590-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) return "ltr";
  return undefined;
}

function shouldIsolate(token: string) {
  if (/[@$]|:\/\//.test(token)) return true;
  if (!/[A-Za-z]/.test(token)) return false;
  if (/[\s.&/+_-]/.test(token)) return true;
  if (/^\d/.test(token)) return true;
  return false;
}
