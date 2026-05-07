import psycopg2
import psycopg2.extras
from datetime import datetime, timezone
from typing import Optional

from config import DATABASE_URL
from normalizer import EventSchema


def _connect():
    return psycopg2.connect(DATABASE_URL)


# ---------------------------------------------------------------------------
# Venue
# ---------------------------------------------------------------------------

def upsert_venue(conn, name: str, city: str) -> int:
    """Insert venue if not present; always returns its id."""
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO venues (name, city)
            VALUES (%s, %s)
            ON CONFLICT (name, city) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            (name, city),
        )
        row = cur.fetchone()
        return row[0]


# ---------------------------------------------------------------------------
# Event
# ---------------------------------------------------------------------------

def upsert_event(event: EventSchema) -> bool:
    """
    Insert event keyed on source_url (ON CONFLICT DO NOTHING).
    Returns True if a new row was written, False if it already existed.
    """
    conn = _connect()
    try:
        with conn:
            venue_id = upsert_venue(conn, event.venue_name, event.venue_city)
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO events (
                        title, description, venue_id,
                        start_dt, end_dt, category,
                        image_url, source_url, source,
                        price_min, price_max, currency
                    ) VALUES (
                        %s, %s, %s,
                        %s, %s, %s,
                        %s, %s, %s,
                        %s, %s, %s
                    )
                    ON CONFLICT (source_url) DO NOTHING
                    """,
                    (
                        event.title,
                        event.description,
                        venue_id,
                        event.start_dt,
                        event.end_dt,
                        event.category,
                        event.image_url,
                        event.source_url,
                        event.source_name,  # maps to "source" column
                        event.price_min,
                        event.price_max,
                        event.currency,
                    ),
                )
                return cur.rowcount == 1
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# ScrapeLog
# ---------------------------------------------------------------------------

def log_scrape(
    source_name: str,
    city: str,
    events_found: int,
    events_upserted: int,
    error: Optional[str] = None,
) -> None:
    conn = _connect()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO scrape_logs (
                        source_name, city, found,
                        upserted, error, ran_at
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        source_name,
                        city,
                        events_found,
                        events_upserted,
                        error,
                        datetime.now(tz=timezone.utc),
                    ),
                )
    finally:
        conn.close()