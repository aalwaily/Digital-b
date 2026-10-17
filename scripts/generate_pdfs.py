#!/usr/bin/env python3
"""Generate the full Vellum Press guides and the free sample PDFs."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from pdfgen.books import BOOKS  # noqa: E402
from pdfgen.engine import DISCLAIMERS, render  # noqa: E402

FULL_DIR = ROOT / "private" / "pdfs"
SAMPLE_DIR = ROOT / "public" / "samples"
META_PATH = ROOT / "data" / "pdf-meta.json"


def text_of(path: Path) -> str:
    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def main() -> None:
    meta: dict[str, dict[str, int]] = {}
    for book in BOOKS:
        full_path = FULL_DIR / f"{book['slug']}.pdf"
        sample_path = SAMPLE_DIR / f"{book['slug']}-sample.pdf"
        full_pages = render(book, full_path, sample=False)
        sample_pages = render(book, sample_path, sample=True)
        full_text = text_of(full_path)
        sample_text = text_of(sample_path)
        for chapter in book["chapters"]:
            if chapter["title"] not in full_text:
                raise SystemExit(f"{book['slug']}: missing chapter title in PDF: {chapter['title']}")
        marker = DISCLAIMERS[book["disclaimer"]].split(".")[0]
        if marker not in full_text:
            raise SystemExit(f"{book['slug']}: disclaimer missing from full PDF")
        if "SAMPLE" not in sample_text and "sample" not in sample_text.lower():
            raise SystemExit(f"{book['slug']}: sample PDF is not marked as a sample")
        if full_pages < 10:
            raise SystemExit(f"{book['slug']}: full guide is only {full_pages} pages")
        if sample_pages < 3:
            raise SystemExit(f"{book['slug']}: sample is only {sample_pages} pages")
        if sample_pages >= full_pages:
            raise SystemExit(f"{book['slug']}: sample is not shorter than the full guide")
        meta[book["slug"]] = {
            "pages": full_pages,
            "samplePages": sample_pages,
            "bytes": full_path.stat().st_size,
            "sampleBytes": sample_path.stat().st_size,
        }
        print(f"{book['slug']}: {full_pages} pages, sample {sample_pages}")
    META_PATH.write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {META_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
