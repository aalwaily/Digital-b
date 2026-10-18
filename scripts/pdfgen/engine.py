"""Render a Vellum Press guide to a full PDF and a shorter sample."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    CondPageBreak,
    Flowable,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

PAGE_W, PAGE_H = letter
INK = HexColor("#1C1915")
MUTED = HexColor("#5C564E")
CREAM = HexColor("#F7F3EC")
RULE = HexColor("#E4DDD2")
PAPER = HexColor("#FFFcf8")

DISCLAIMERS = {
    "health": (
        "Health disclaimer. This guide is education for adults. It is not medical advice, "
        "diagnosis, or a treatment plan, and it does not replace a physician, registered dietitian, "
        "or qualified coach. Bodies differ. Talk with a licensed clinician before you change how you "
        "eat or train, especially if you are pregnant, under 18, injured, managing an illness, or "
        "have a history of disordered eating. Stop and seek care for chest pain, fainting, or pain "
        "that is sharp, swelling, or unexplained. If you are in crisis in the United States, call or text 988."
    ),
    "finance": (
        "Money disclaimer. This guide is general education. It is not financial, tax, investment, "
        "or credit advice, and it is not a recommendation to buy or sell anything. Rules depend on "
        "where you live and they change. A licensed adviser or nonprofit credit counselor is the "
        "right next step for decisions that affect your taxes, your housing, or debts you cannot pay."
    ),
    "career": (
        "Work disclaimer. This guide is practical education for starting a small service practice. "
        "It is not legal, tax, or employment advice. Contracts, taxes, and conflicts with an existing "
        "job depend on where you live and on the agreement you already signed. Have a qualified "
        "professional review anything you will sign or file."
    ),
    "mind": (
        "Wellness disclaimer. This guide is education, not psychotherapy, and not a crisis service. "
        "Mindfulness can sit alongside care. It does not replace it. Stop a practice that leaves you "
        "more distressed, and contact a licensed clinician if worry, panic, or low mood is persistent. "
        "If you might hurt yourself, contact local emergency services. In the United States, call or text 988."
    ),
    "jobs": (
        "Work disclaimer. This guide is education about CVs, applications, and interviews. "
        "It is not a promise of an interview, a job, a visa, or a salary. Hiring rules, "
        "Saudization, iqama professions, and what an employer's screening software does "
        "depend on that employer and on the country. Read the posting. Where a rule affects "
        "your right to work, ask the employer or a qualified adviser. Do not invent numbers on a CV."
    ),
    "general": (
        "A note on limits. This guide describes methods. It cannot see your course, your calendar, "
        "or your life. Use what fits. Leave what does not. Nothing here guarantees a grade, a streak, "
        "or a particular outcome."
    ),
}


def _font_dir() -> Path:
    bundled = Path(__file__).resolve().parents[1] / "fonts"
    if (bundled / "LiberationSerif-Regular.ttf").exists():
        return bundled
    return Path("/usr/share/fonts/truetype/liberation")


def register_fonts() -> None:
    if "LibSerif" in pdfmetrics.getRegisteredFontNames():
        return
    folder = _font_dir()
    pairs = {
        "LibSerif": "LiberationSerif-Regular.ttf",
        "LibSerif-Bold": "LiberationSerif-Bold.ttf",
        "LibSerif-Italic": "LiberationSerif-Italic.ttf",
        "LibSerif-BoldItalic": "LiberationSerif-BoldItalic.ttf",
        "LibSans": "LiberationSans-Regular.ttf",
        "LibSans-Bold": "LiberationSans-Bold.ttf",
        "LibSans-Italic": "LiberationSans-Italic.ttf",
        "LibSans-BoldItalic": "LiberationSans-BoldItalic.ttf",
    }
    for name, filename in pairs.items():
        pdfmetrics.registerFont(TTFont(name, str(folder / filename)))
    pdfmetrics.registerFontFamily(
        "LibSerif",
        normal="LibSerif",
        bold="LibSerif-Bold",
        italic="LibSerif-Italic",
        boldItalic="LibSerif-BoldItalic",
    )
    pdfmetrics.registerFontFamily(
        "LibSans",
        normal="LibSans",
        bold="LibSans-Bold",
        italic="LibSans-Italic",
        boldItalic="LibSans-BoldItalic",
    )


def styles() -> dict[str, ParagraphStyle]:
    return {
        "h1": ParagraphStyle(
            "h1",
            fontName="LibSerif",
            fontSize=22,
            leading=26,
            textColor=INK,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName="LibSerif",
            fontSize=14,
            leading=18,
            textColor=INK,
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            fontName="LibSerif",
            fontSize=11,
            leading=16.5,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=9,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName="LibSerif",
            fontSize=11,
            leading=16,
            textColor=INK,
        ),
        "check": ParagraphStyle(
            "check",
            fontName="LibSerif",
            fontSize=11,
            leading=15.5,
            textColor=INK,
        ),
        "small": ParagraphStyle(
            "small",
            fontName="LibSans",
            fontSize=8.5,
            leading=11.5,
            textColor=INK,
        ),
        "small_bold": ParagraphStyle(
            "small_bold",
            fontName="LibSans-Bold",
            fontSize=8.5,
            leading=11.5,
            textColor=white,
        ),
        "kicker": ParagraphStyle(
            "kicker",
            fontName="LibSans-Bold",
            fontSize=9,
            leading=12,
            textColor=HexColor("#8C4A2F"),
            spaceAfter=4,
        ),
        "toc": ParagraphStyle(
            "toc",
            fontName="LibSerif",
            fontSize=12,
            leading=16,
            textColor=INK,
        ),
        "footer": ParagraphStyle("footer", fontName="LibSans", fontSize=8, textColor=MUTED),
    }


class CheckItem(Flowable):
    def __init__(self, text: str, style: ParagraphStyle, width: float | None = None):
        super().__init__()
        self.text = text
        self.style = style
        self.box = 9
        self.paragraph = Paragraph(text, style)

    def wrap(self, avail_width, avail_height):
        self.width = avail_width
        _, height = self.paragraph.wrap(avail_width - 18, avail_height)
        self.height = max(height, self.box) + 4
        return avail_width, self.height

    def draw(self):
        self.canv.setStrokeColor(INK)
        self.canv.setLineWidth(0.8)
        self.canv.rect(0, self.height - self.box - 2, self.box, self.box, stroke=1, fill=0)
        self.paragraph.drawOn(self.canv, 16, 2)


def _draw_motif(canvas, motif: str, accent: Color, fg: Color) -> None:
    canvas.saveState()
    if motif == "path":
        for step in range(5):
            canvas.setFillColor(accent)
            canvas.setFillColor(Color(accent.red, accent.green, accent.blue, alpha=0.35 + step * 0.12))
            x = 70 + step * 95
            height = 80 + step * 38
            y = 150
            canvas.roundRect(x, y, 52, height, 4, stroke=0, fill=1)
    elif motif == "plate":
        canvas.setStrokeColor(accent)
        canvas.setLineWidth(8)
        canvas.circle(430, 230, 120, stroke=1, fill=0)
        canvas.circle(430, 230, 78, stroke=1, fill=0)
        canvas.setFillColor(accent)
        canvas.circle(430, 230, 28, stroke=0, fill=1)
    elif motif == "form":
        canvas.setStrokeColor(accent)
        canvas.setLineWidth(12)
        canvas.setLineCap(1)
        path = canvas.beginPath()
        path.moveTo(140, 120)
        path.curveTo(180, 230, 240, 260, 300, 320)
        canvas.drawPath(path, stroke=1, fill=0)
        path = canvas.beginPath()
        path.moveTo(470, 120)
        path.curveTo(420, 220, 360, 250, 320, 330)
        canvas.drawPath(path, stroke=1, fill=0)
        canvas.setFillColor(accent)
        canvas.circle(312, 370, 22, stroke=0, fill=1)
    elif motif == "ledger":
        canvas.setFillColor(fg)
        for index in range(7):
            canvas.setFillColor(Color(fg.red, fg.green, fg.blue, alpha=0.25 if index else 0.8))
            canvas.roundRect(64, 150 + index * 26, 460 - (index % 3) * 36, 7, 3, stroke=0, fill=1)
        canvas.setFillColor(accent)
        canvas.roundRect(64, 150 + 6 * 26, 110, 7, 3, stroke=0, fill=1)
    elif motif == "grid":
        for row in range(4):
            for col in range(5):
                marked = col + row == 3
                canvas.setFillColor(accent if marked else Color(fg.red, fg.green, fg.blue, alpha=0.14))
                canvas.roundRect(70 + col * 92, 140 + row * 52, 70, 36, 4, stroke=0, fill=1)
    elif motif == "mark":
        canvas.setStrokeColor(accent)
        canvas.setLineWidth(12)
        canvas.circle(440, 230, 100, stroke=1, fill=0)
        canvas.line(370, 160, 510, 300)
    elif motif == "bars":
        heights = [80, 130, 100, 170, 120, 190]
        for index, height in enumerate(heights):
            canvas.setFillColor(accent if index == 3 else Color(fg.red, fg.green, fg.blue, alpha=0.2))
            canvas.roundRect(70 + index * 80, 140, 44, height, 4, stroke=0, fill=1)
    elif motif == "breath":
        canvas.setStrokeColor(accent)
        canvas.setLineWidth(7)
        for radius, alpha in ((36, 0.95), (82, 0.55), (132, 0.28)):
            canvas.setStrokeColor(Color(accent.red, accent.green, accent.blue, alpha=alpha))
            canvas.circle(420, 240, radius, stroke=1, fill=0)
    else:
        canvas.saveState()
        for card in range(3):
            canvas.saveState()
            canvas.translate(280 + card * 24, 160 + card * 18)
            canvas.rotate(-8 + card * 6)
            canvas.setFillColor(accent if card == 2 else Color(fg.red, fg.green, fg.blue, alpha=0.16))
            canvas.roundRect(0, 0, 200, 120, 8, stroke=0, fill=1)
            canvas.restoreState()
        canvas.restoreState()
    canvas.restoreState()


def _cover(canvas, book: dict) -> None:
    cover = book["cover"]
    bg = HexColor(cover["bg"])
    fg = HexColor(cover["fg"])
    accent = HexColor(cover["accent"])
    canvas.saveState()
    canvas.setFillColor(bg)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    _draw_motif(canvas, cover["motif"], accent, fg)
    canvas.setFillColor(fg)
    canvas.setFont("LibSans", 9)
    canvas.drawString(48, PAGE_H - 64, "VELLUM PRESS")
    canvas.setFillColor(accent)
    canvas.setFont("LibSans", 10)
    canvas.drawString(48, PAGE_H - 150, cover["eyebrow"].upper())
    canvas.setFillColor(fg)
    canvas.setFont("LibSerif", 40)
    y = PAGE_H - 210
    for line in cover["title_lines"]:
        canvas.drawString(48, y, line)
        y -= 48
    canvas.setFont("LibSans", 12)
    canvas.setFillColor(Color(fg.red, fg.green, fg.blue, alpha=0.85))
    canvas.drawString(48, y - 8, cover["deck"])
    canvas.setStrokeColor(accent)
    canvas.setLineWidth(2)
    canvas.line(48, 78, 160, 78)
    canvas.setFillColor(Color(fg.red, fg.green, fg.blue, alpha=0.75))
    canvas.setFont("LibSans", 8)
    canvas.drawString(48, 58, "A DIGITAL GUIDE")
    canvas.restoreState()


def _interior(canvas, doc, book: dict, sample: bool) -> None:
    canvas.saveState()
    if sample and canvas.getPageNumber() > 1:
        canvas.saveState()
        canvas.setFillColor(Color(0.1, 0.1, 0.1, alpha=0.06))
        canvas.translate(PAGE_W / 2, PAGE_H / 2)
        canvas.rotate(32)
        canvas.setFont("LibSerif-Bold", 64)
        canvas.drawCentredString(0, 0, "SAMPLE")
        canvas.restoreState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.4)
    canvas.line(0.7 * inch, PAGE_H - 0.48 * inch, PAGE_W - 0.7 * inch, PAGE_H - 0.48 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("LibSans", 8)
    canvas.drawString(0.7 * inch, PAGE_H - 0.4 * inch, book["title"])
    canvas.drawRightString(PAGE_W - 0.7 * inch, PAGE_H - 0.4 * inch, "Vellum Press")
    canvas.line(0.7 * inch, 0.48 * inch, PAGE_W - 0.7 * inch, 0.48 * inch)
    footer = "Sample preview · not the full guide" if sample else "Personal license · not for redistribution"
    canvas.drawString(0.7 * inch, 0.32 * inch, footer)
    canvas.drawRightString(PAGE_W - 0.7 * inch, 0.32 * inch, str(canvas.getPageNumber()))
    canvas.restoreState()


def _table(
    headers: list[str],
    rows: list[list[str]],
    style_map: dict[str, ParagraphStyle],
    accent: str,
    row_height: float | None = None,
) -> Table:
    head = [Paragraph(cell, style_map["small_bold"]) for cell in headers]
    body = [[Paragraph(str(cell), style_map["small"]) for cell in row] for row in rows]
    available = PAGE_W - 1.4 * inch
    col = available / len(headers)
    heights = None
    if row_height:
        heights = [16, *([row_height] * len(rows))]
    table = Table([head, *body], colWidths=[col] * len(headers), rowHeights=heights, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), HexColor(accent)),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("BACKGROUND", (0, 1), (-1, -1), PAPER),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [PAPER, CREAM]),
                ("GRID", (0, 0), (-1, -1), 0.3, RULE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def _callout(text: str, style_map: dict[str, ParagraphStyle], fill: str) -> Table:
    table = Table([[Paragraph(text, style_map["body"])]], colWidths=[PAGE_W - 1.4 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), HexColor(fill)),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("LINEBEFORE", (0, 0), (0, -1), 3, HexColor("#8C4A2F")),
            ]
        )
    )
    return table


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_story(book: dict, sample: bool, style_map: dict[str, ParagraphStyle]) -> list:
    story: list = [Spacer(1, 12), NextPageTemplate("interior"), PageBreak()]
    accent = book["cover"]["bg"]
    story.append(Paragraph(esc(book["title"]), style_map["h1"]))
    for paragraph in book["intro"]:
        story.append(Paragraph(esc(paragraph), style_map["body"]))
    kind = book.get("disclaimer", "general")
    story.append(Spacer(1, 4))
    story.append(_callout(esc(DISCLAIMERS[kind]), style_map, "#F3E6D8"))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Contents", style_map["h2"]))
    for index, chapter in enumerate(book["chapters"], start=1):
        story.append(Paragraph(f"{index:02d} &nbsp;&nbsp; {esc(chapter['title'])}", style_map["toc"]))
        story.append(Spacer(1, 3))

    chapters = book["chapters"][:2] if sample else book["chapters"]
    for index, chapter in enumerate(chapters, start=1):
        blocks = [
            CondPageBreak(220),
            Paragraph(f"{index:02d}", style_map["kicker"]),
            Paragraph(esc(chapter["title"]), style_map["h1"]),
        ]
        for block in chapter["blocks"]:
            kind_name = block["type"]
            if kind_name == "p":
                blocks.append(Paragraph(esc(block["text"]), style_map["body"]))
            elif kind_name == "h":
                blocks.append(Paragraph(esc(block["text"]), style_map["h2"]))
            elif kind_name == "bullets":
                for item in block["items"]:
                    blocks.append(Paragraph(f"•  {esc(item)}", style_map["bullet"]))
                    blocks.append(Spacer(1, 3))
            elif kind_name == "checklist":
                for item in block["items"]:
                    blocks.append(CheckItem(esc(item), style_map["check"]))
            elif kind_name == "table":
                blocks.append(Spacer(1, 4))
                blocks.append(
                    _table(
                        [esc(cell) for cell in block["headers"]],
                        [[esc(cell) for cell in row] for row in block["rows"]],
                        style_map,
                        accent,
                        block.get("row_height"),
                    )
                )
                blocks.append(Spacer(1, 8))
            elif kind_name == "tip":
                blocks.append(Spacer(1, 2))
                blocks.append(_callout(f"<b>Try this.</b> {esc(block['text'])}", style_map, "#F4F0E6"))
                blocks.append(Spacer(1, 6))
            elif kind_name == "note":
                blocks.append(_callout(esc(block["text"]), style_map, "#F3E6D8"))
                blocks.append(Spacer(1, 6))
        story.append(blocks[0])
        story.append(KeepTogether(blocks[1:4]))
        story.extend(blocks[4:])

    if sample:
        story.append(Spacer(1, 12))
        story.append(Paragraph("This sample stops here", style_map["h1"]))
        story.append(
            Paragraph(
                esc(
                    "The full guide continues with the remaining chapters, worksheets, and checklists listed in the contents. "
                    "Buy the PDF to download the complete file. This preview is free to share; the full guide is licensed for personal use."
                ),
                style_map["body"],
            )
        )
    else:
        story.append(Spacer(1, 8))
        story.append(Paragraph("A last word", style_map["h2"]))
        story.append(
            Paragraph(
                "Use the pages that match the week you are actually having. Print a worksheet if paper helps you tell the truth. "
                "Put the file somewhere you can find it. And if a chapter tells you to talk to a licensed professional, that instruction outranks the rest of the PDF.",
                style_map["body"],
            )
        )
    return story


def render(book: dict, path: Path, sample: bool) -> int:
    register_fonts()
    path.parent.mkdir(parents=True, exist_ok=True)
    style_map = styles()
    doc = BaseDocTemplate(
        str(path),
        pagesize=letter,
        title=book["title"] + (" (sample)" if sample else ""),
        author="Vellum Press",
        subject=book["subtitle"],
    )
    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, id="cover", showBoundary=0)
    body_frame = Frame(
        0.7 * inch,
        0.65 * inch,
        PAGE_W - 1.4 * inch,
        PAGE_H - 1.3 * inch,
        id="body",
        showBoundary=0,
    )
    doc.addPageTemplates(
        [
            PageTemplate(
                id="cover",
                frames=[cover_frame],
                onPageEnd=lambda canvas, _doc: _cover(canvas, book),
            ),
            PageTemplate(
                id="interior",
                frames=[body_frame],
                onPage=lambda canvas, _doc: _interior(canvas, _doc, book, sample),
            ),
        ]
    )
    doc.build(build_story(book, sample, style_map))
    return doc.page
