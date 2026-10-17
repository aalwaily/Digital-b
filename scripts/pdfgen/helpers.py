"""Small constructors for guide chapters."""


def P(text: str) -> dict:
    return {"type": "p", "text": text}


def H(text: str) -> dict:
    return {"type": "h", "text": text}


def B(*items: str) -> dict:
    return {"type": "bullets", "items": list(items)}


def C(*items: str) -> dict:
    return {"type": "checklist", "items": list(items)}


def T(headers: list[str], rows: list[list[str]], row_height: float | None = None) -> dict:
    block: dict = {"type": "table", "headers": headers, "rows": rows}
    if row_height:
        block["row_height"] = row_height
    return block


def TIP(text: str) -> dict:
    return {"type": "tip", "text": text}


def N(text: str) -> dict:
    return {"type": "note", "text": text}


def chapter(title: str, *blocks: dict) -> dict:
    return {"title": title, "blocks": list(blocks)}


def cover(bg: str, fg: str, accent: str, motif: str, title_lines: list[str], eyebrow: str, deck: str) -> dict:
    return {
        "bg": bg,
        "fg": fg,
        "accent": accent,
        "motif": motif,
        "title_lines": title_lines,
        "eyebrow": eyebrow,
        "deck": deck,
    }
