import re
from datetime import datetime

from scrapling.fetchers import DynamicFetcher

from .base import BaseSpider

_CITY_SLUGS: dict[str, str] = {
    "bengaluru": "bangalore",
    "mumbai": "mumbai",
    "delhi": "delhi",
}

_BASE_URL = "https://www.townscript.com/in/{city}"
_BASE_DOMAIN = "https://www.townscript.com"


_MONTH_MAP: dict[str, int] = {
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
}


def _parse_date_text(text: str) -> str | None:
    """
    Parse Townscript card date strings into ISO 8601.

    Format A — ordinal day + optional 12-h time (month inferred):
      'Mon 11th, 06:30 AM (IST) onwards | Multiple Dates'
      → '2026-05-11T06:30:00'

    Format B — explicit MMM DD'YY range (first/earliest date taken):
      "Sep 07'25 - Oct 04'26"
      → '2025-09-07T00:00:00'

    Returns None when no valid date can be extracted.
    """
    if not text:
        return None

    # ── Format A: ordinal day, e.g. "11th" ──────────────────────────────────
    day_m = re.search(r"\b(\d{1,2})(?:st|nd|rd|th)\b", text)
    if day_m:
        day = int(day_m.group(1))
        if 1 <= day <= 31:
            time_m = re.search(r"(\d{1,2}):(\d{2})\s*(AM|PM)", text, re.IGNORECASE)
            if time_m:
                hour = int(time_m.group(1))
                minute = int(time_m.group(2))
                meridiem = time_m.group(3).upper()
                if meridiem == "PM" and hour != 12:
                    hour += 12
                elif meridiem == "AM" and hour == 12:
                    hour = 0
            else:
                hour, minute = 0, 0

            now = datetime.now()
            for offset in range(13):
                m = (now.month - 1 + offset) % 12 + 1
                y = now.year + (now.month - 1 + offset) // 12
                try:
                    candidate = datetime(y, m, day, hour, minute, 0)
                except ValueError:
                    continue
                if candidate >= now:
                    return candidate.strftime("%Y-%m-%dT%H:%M:%S")

    # ── Format B: "MMM DD’YY" range — take the first date ───────────────────
    # Handles straight (‘), right (‘), and left (‘) apostrophes before 2-digit year
    range_m = re.search(
        r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})[‘’’](\d{2})",
        text,
    )
    if range_m:
        mon = _MONTH_MAP[range_m.group(1)]
        day = int(range_m.group(2))
        year = 2000 + int(range_m.group(3))
        try:
            return datetime(year, mon, day, 0, 0, 0).strftime("%Y-%m-%dT%H:%M:%S")
        except ValueError:
            pass

    # ── Format C: "MMM DD" or "MMM DD - DD" or "MMM DD - MMM DD" ────────────
    # No apostrophe/year — infer nearest future year.
    # Negative lookahead excludes Format B matches (apostrophe or trailing digit).
    bare_m = re.search(
        r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?![‘’’\d])",
        text,
    )
    if bare_m:
        mon = _MONTH_MAP[bare_m.group(1)]
        day = int(bare_m.group(2))
        now = datetime.now()
        for year in (now.year, now.year + 1):
            try:
                candidate = datetime(year, mon, day, 0, 0, 0)
            except ValueError:
                continue
            if candidate >= now:
                return candidate.strftime("%Y-%m-%dT%H:%M:%S")

    return None


def _parse_price(text: str) -> float | None:
    cleaned = text.replace("₹", "").replace(",", "").strip()
    cleaned = cleaned.split()[0] if cleaned else ""
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


SKIP_KEYWORDS: frozenset[str] = frozenset({
    "training", "course", "workshop", "conference", "summit",
    "placement", "institute", "real estate", "property",
    "founders meetup", "investors", "b2b", "marketing mixer",
    "leadership", "startup stories", "expo",
})

# Tokens that indicate a span contains date information
_DATE_SIGNALS: frozenset[str] = frozenset({
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
})


class TownscriptSpider(BaseSpider):
    source_name = "townscript"

    def crawl(self, city: str) -> list[dict]:
        slug = _CITY_SLUGS.get(city)
        if not slug:
            raise ValueError(
                f"Unsupported city: {city!r}. Expected one of {list(_CITY_SLUGS)}"
            )

        url = _BASE_URL.format(city=slug)
        page = DynamicFetcher().fetch(url, wait_selector="div.event-card-container")

        cards = page.css("div.event-card-container")
        print(f"[townscript/{city}] found {len(cards)} cards")

        events: list[dict] = []

        for card in cards:
            # ── source_url ──────────────────────────────────────────────────
            link_el = card.css("a").first
            href = link_el.attrib.get("href", "").strip() if link_el else ""
            source_url = (_BASE_DOMAIN + href) if href.startswith("/e/") else ""

            # ── title ────────────────────────────────────────────────────────
            title_el = card.css("div.event-name span").first
            title = title_el.text.strip() if title_el else ""

            if not title or not source_url:
                continue

            if any(kw in title.lower() for kw in SKIP_KEYWORDS):
                print(f"[SKIP:keyword]  {title!r}")
                continue

            # ── image ────────────────────────────────────────────────────────
            img_el = card.css("div.image-container img").first
            image_url = img_el.attrib.get("src", "").strip() if img_el else None
            if image_url:
                image_url = re.sub(r"&blur=\d+", "", image_url)

            # ── date ─────────────────────────────────────────────────────────
            secondary_spans = card.css("div.secondary-details span")
            date_text = ""
            for span in secondary_spans:
                t = span.text.strip() if span.text else ""
                if t and any(sig in t for sig in _DATE_SIGNALS):
                    date_text = t
                    break

            # ── venue / city ─────────────────────────────────────────────────
            venue_city = city
            for span in secondary_spans:
                t = span.text.strip() if span.text else ""
                if t and t not in ("|", "") and "AM" not in t and "PM" not in t:
                    venue_city = t

            # ── price ────────────────────────────────────────────────────────
            price_min = None
            raw_price_text = ""
            for span in card.css("span"):
                t = span.text.strip() if span.text else ""
                if "₹" in t:
                    raw_price_text = t
                    price_min = _parse_price(t)
                    break

            start_dt = _parse_date_text(date_text)
            if not start_dt:
                print(f"[SKIP:no-date]  {title!r} | date_text={date_text!r} | price_raw={raw_price_text!r} | price_min={price_min}")
                continue
            if not price_min:
                print(f"[SKIP:no-price] {title!r} | date_text={date_text!r} | start_dt={start_dt!r} | price_raw={raw_price_text!r}")
                continue

            events.append(
                {
                    "title": title,
                    "image_url": image_url or None,
                    "source_url": source_url,
                    "start_dt": start_dt,
                    "source_name": "townscript",
                    "venue_name": "",
                    "venue_city": venue_city,
                    "price_min": price_min,
                    "price_max": None,
                }
            )

        return events


def crawl(city: str) -> list[dict]:
    """Module-level convenience wrapper used by run.py."""
    return TownscriptSpider().crawl(city)