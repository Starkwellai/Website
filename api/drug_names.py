"""Display formatting for Cost Plus Drugs' dosage_form slugs.

Its own module (not inline in serving_api.py) so it can be tested without
importing the API, which opens DuckDB and loads the price tables on use.
"""
from __future__ import annotations

import re

_UNITS = ("Mg", "Ml", "Mcg", "Gm", "Iu")


def strip_name_prefix(raw: str, drug_name: str) -> tuple[str, bool]:
    """Remove the leading drug-name portion of a slug, comparing with
    separators ignored on both sides. Returns (rest, stripped).

    The slug sometimes keeps a dash between a combo drug's words
    ("amlodipine-atorvastatin-10-...") and sometimes runs them together
    ("lisinoprilhctz-10mg-..."), so a plain startswith() against the
    separator-free name only caught the second form."""
    name_slug = re.sub(r"[^a-z0-9]", "", drug_name.lower())
    if not name_slug:
        return raw, False
    seen = 0
    for i, ch in enumerate(raw):
        if ch.isalnum():
            seen += 1
        if seen == len(name_slug):
            if re.sub(r"[^a-z0-9]", "", raw[: i + 1].lower()) == name_slug:
                return raw[i + 1:].lstrip("-_"), True
            break
    return raw, False


def friendly_dosage_form(raw: str, drug_name: str, include_name: bool = True) -> str:
    """Pure reformatting of Cost Plus Drugs' own slug text — never a guess
    at strength or form.

    An underscore between two digits is their decimal point ("2_5mg" =
    2.5mg) and is restored before the generic underscore->space pass, which
    is for combo-drug strength separators ("600mg_300mg") where it really
    does mean a space.

    When the slug isn't a prefix-match for the drug name at all (diabetic
    supplies, e.g. "Accu-Chek Guide Me Meter for ..." vs slug
    "accu-chek-guide-me-care-kit"), nothing is stripped and prepending the
    real name would show two different descriptions run together, so only
    the cleaned slug is returned."""
    s, stripped = strip_name_prefix(raw, drug_name)
    s = s.replace("-", " ")
    s = re.sub(r"(\d)_(\d)", r"\1.\2", s)
    s = s.replace("_", " ")
    s = re.sub(r"(\d)([a-zA-Z])", r"\1 \2", s)
    s = s.title()
    for unit in _UNITS:
        s = re.sub(rf"\b{unit}\b", unit.upper(), s)
    # A combo drug's two strengths can share one trailing unit in the slug
    # ("-10-10mg-" -> "10 10 MG"), ambiguous as two bare numbers. "10/10 MG"
    # is the conventional combo-strength form. Doesn't touch slugs that pair
    # each number with its own unit ("10 MG 12.5 MG").
    s = re.sub(r"(?<!\d)(\d+(?:\.\d+)?) (\d+(?:\.\d+)?) (MG|ML|MCG|GM|IU)\b", r"\1/\2 \3", s)
    s = s.strip()
    return f"{drug_name} {s}".strip() if include_name and stripped else s
