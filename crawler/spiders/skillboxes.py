"""
Skillboxes spider — uses their internal v3 JSON API directly.

POST https://www.skillboxes.com/servers/v3/api/event-new/get-event-new
No auth required.

Confirmed city IDs (from event-filters response):
  5        = Mumbai
  9        = Bangalore
  2        = New Delhi
  8        = Kolkata
  7        = Chennai
  1127652  = Pune
  1114881  = Hyderabad
  1113278  = Goa

Run:
  python run.py --site skillboxes --city bengaluru
  python run.py --site skillboxes --city mumbai
"""

from __future__ import annotations

import logging
import re
from datetime import datetime
from typing import Optional

import requests

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

API_URL = "https://www.skillboxes.com/servers/v3/api/event-new/get-event-new"
EVENT_BASE_URL = "https://www.skillboxes.com/events/"

CITY_IDS: dict[str, int] = {
    "mumbai": 5,
    "bengaluru": 9,
    "delhi": 2,
    "kolkata": 8,
    "chennai": 7,
    "pune": 1127652,
    "hyderabad": 1114881,
    "goa": 1113278,
}

HEADERS = {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
    "devicetype": "Angular 1",
    "origin": "https://www.skillboxes.com",
    "referer": "https://www.skillboxes.com/",
    "user-agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/147.0.0.0 Safari/537.36"
    ),
}

MAX_PAGES = 10  # safety cap


# ---------------------------------------------------------------------------
# Date parsing
# ---------------------------------------------------------------------------

def _parse_date(date_str: str) -> Optional[datetime]:
    """
    Skillboxes date formats:
      "21 May 2026"
      "09 May - 10 May 2026"
      "17 May Sunday"
    """
    if not date_str:
        return None

    date_str = date_str.split(" - ")[0].strip()

    for day in [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
    ]:
        date_str = date_str.replace(day, "").strip()

    date_str = re.sub(r"\s+", " ", date_str).strip()

    for fmt in ("%d %b %Y", "%d %b", "%b %d %Y", "%b %d"):
        try:
            dt = datetime.strptime(date_str, fmt)
            if "%Y" not in fmt:
                dt = dt.replace(year=datetime.now().year)
                if dt < datetime.now():
                    dt = dt.replace(year=datetime.now().year + 1)
            return dt
        except ValueError:
            continue

    logger.debug("Could not parse date: %r", date_str)
    return None


# ---------------------------------------------------------------------------
# Price parsing
# ---------------------------------------------------------------------------

def _parse_price(min_price, max_price) -> Optional[str]:
    """Return '₹499', '₹499 – ₹799', or '₹799' when only max is set."""
    try:
        mn = int(min_price) if min_price else None
        mx = int(max_price) if max_price else None
    except (TypeError, ValueError):
        return None

    if not mn and not mx:
        return None
    if not mn and mx:
        return f"₹{mx}"
    if mx and mx != mn:
        return f"₹{mn} – ₹{mx}"
    return f"₹{mn}"


# ---------------------------------------------------------------------------
# Spider
# ---------------------------------------------------------------------------

class SkillboxesSpider:

    def crawl(self, city: str) -> list[dict]:
        city_key = city.lower().strip()
        city_id = CITY_IDS.get(city_key)

        if city_id is None:
            logger.warning(
                "[skillboxes/%s] Unknown city — add city_id to CITY_IDS map", city
            )
            return []

        all_raw: list[dict] = []

        for page in range(1, MAX_PAGES + 1):
            payload = {
                "default_city": city_id,
                "opcode": "search",
                "type": "fetchAll",
                "eventCityEnb": False,
                "page": page,
            }

            try:
                resp = requests.post(
                    API_URL,
                    json=payload,
                    headers=HEADERS,
                    timeout=20,
                )
                resp.raise_for_status()
            except requests.RequestException as exc:
                logger.error(
                    "[skillboxes/%s] Request failed (page %d): %s", city, page, exc
                )
                break

            body = resp.json()
            if not body.get("success"):
                logger.warning(
                    "[skillboxes/%s] API success=false on page %d", city, page
                )
                break

            items = body.get("items", [])
            if not items:
                break  # no more pages

            all_raw.extend(items)

            # Stop if no next page
            if not body.get("next", False):
                break

        logger.info(
            "[skillboxes/%s] found %d cards across pages", city, len(all_raw)
        )

        events = []
        for ev in all_raw:
            if ev.get("is_past_event"):
                continue

            title = ev.get("event_display_name") or ev.get("event_name") or ""
            if not title:
                continue

            slug = ev.get("event_slug") or ev.get("slug") or ""
            source_url = f"{EVENT_BASE_URL}{slug}" if slug else ""

            # Image
            image_url = None
            images = ev.get("image_path_app") or []
            if images and isinstance(images[0], dict):
                image_url = images[0].get("name")

            # Date
            date_text = ev.get("event_date") or ev.get("date") or ""
            start_dt = _parse_date(date_text)

            if start_dt and start_dt < datetime.now():
                logger.debug("[SKIP:past] %r | %s", title, date_text)
                continue

            # Price
            price_text = _parse_price(ev.get("min_price"), ev.get("max_price"))
            if not price_text:
                logger.debug("[SKIP:no-price] %r", title)
                continue

            # Venue
            venue_name = ev.get("venue_name") or ""
            venue_city = ev.get("city_name") or city.title()

            events.append({
                "title": title,
                "image_url": image_url,
                "source_url": source_url,
                "date_text": date_text,
                "start_dt": start_dt,
                "venue_name": venue_name,
                "venue_city": venue_city,
                "price_text": price_text,
                "category": ev.get("category") or "",
            })

        logger.info(
            "[skillboxes/%s] returning %d valid events", city, len(events)
        )
        return events


def crawl(city: str) -> list[dict]:
    """Module-level wrapper used by run.py."""
    return SkillboxesSpider().crawl(city)