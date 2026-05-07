from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class EventSchema:
    title: str
    description: str
    venue_name: str
    venue_city: str
    start_dt: datetime
    end_dt: Optional[datetime]
    category: str
    image_url: Optional[str]
    source_url: str
    source_name: str
    price_min: Optional[float]
    price_max: Optional[float]
    currency: str = "INR"


def normalize(raw: dict) -> Optional[EventSchema]:
    """Convert a raw spider dict into a validated EventSchema. Returns None on failure."""
    try:
        return EventSchema(
            title=raw["title"].strip(),
            description=(raw.get("description") or "").strip(),
            venue_name=(raw.get("venue_name") or "").strip(),
            venue_city=(raw.get("venue_city") or "").strip(),
            start_dt=_parse_dt(raw.get("start_dt") or ""),
            end_dt=_parse_dt(raw["end_dt"]) if raw.get("end_dt") else None,
            category=(raw.get("category") or "Other").strip(),
            image_url=raw.get("image_url") or None,
            source_url=raw["source_url"].strip(),
            source_name=(raw.get("source_name") or "").strip(),
            price_min=_to_float(raw.get("price_min")),
            price_max=_to_float(raw.get("price_max")),
            currency=raw.get("currency", "INR"),
        )
    except (KeyError, ValueError, AttributeError):
        return None


def _parse_dt(value: object) -> datetime:
    if not value or str(value).strip() == "":
        return datetime(1970, 1, 1)
    if isinstance(value, datetime):
        return value
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(str(value), fmt)
        except ValueError:
            continue
    return datetime(1970, 1, 1)


def _to_float(value: object) -> Optional[float]:
    if value is None:
        return None
    try:
        return float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None