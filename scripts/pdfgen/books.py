from pdfgen.appendices import example_chapter, field_chapter, log_chapter
from pdfgen.books_health import BOOKS_HEALTH
from pdfgen.books_life import BOOKS_LIFE

BOOKS = BOOKS_HEALTH + BOOKS_LIFE
for _book in BOOKS:
    _titles = [chapter["title"] for chapter in _book["chapters"]]
    if "A worked example" not in _titles:
        _book["chapters"].append(example_chapter(_book["slug"]))
    if "Field pages" not in _titles:
        _book["chapters"].append(field_chapter(_book["slug"]))
    if "Thirty-day log" not in _titles:
        _book["chapters"].append(log_chapter(_book["slug"]))
