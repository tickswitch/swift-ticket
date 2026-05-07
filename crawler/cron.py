"""
Render cron entry point — runs Skillboxes spider across all supported cities.
No CLI args needed; Render just runs: python cron.py
"""
import sys
from spiders.skillboxes import CITY_IDS
from spiders.skillboxes import crawl
from normalizer import normalize
from db import upsert_event, log_scrape

SITE = "skillboxes"


def run_city(city: str) -> None:
    raw_events: list[dict] = []
    upserted = 0
    error: str | None = None

    try:
        raw_events = crawl(city)
        for raw in raw_events:
            event = normalize(raw)
            if event and upsert_event(event):
                upserted += 1
    except Exception as exc:
        error = str(exc)
        print(f"[ERROR] {SITE}/{city} — {error}", file=sys.stderr)
    finally:
        log_scrape(SITE, city, len(raw_events), upserted, error)
        status = "ERROR" if error else "OK"
        print(f"[{status}] {SITE}/{city} — found={len(raw_events)} upserted={upserted}")


if __name__ == "__main__":
    print(f"[CRON] Starting Skillboxes crawl for {len(CITY_IDS)} cities...")
    for city in CITY_IDS:
        run_city(city)
    print("[CRON] Done.")