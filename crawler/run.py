import argparse
import sys

from config import CITIES, SOURCES


def main() -> None:
    parser = argparse.ArgumentParser(
        description="SwiftTickets event crawler — fetches events and upserts them into the DB."
    )
    parser.add_argument(
        "--site",
        choices=SOURCES,
        required=True,
        metavar="SITE",
        help=f"Spider to run. Choices: {SOURCES}",
    )
    parser.add_argument(
        "--city",
        choices=CITIES,
        required=True,
        metavar="CITY",
        help=f"City to crawl. Choices: {CITIES}",
    )
    args = parser.parse_args()

    raw_events: list[dict] = []
    events_upserted = 0
    error: str | None = None

    try:
        if args.site == "townscript":
            from spiders.townscript import crawl
            raw_events = crawl(args.city)

        elif args.site == "skillboxes":
            from spiders.skillboxes import crawl
            raw_events = crawl(args.city)

        from normalizer import normalize
        from db import upsert_event

        for raw in raw_events:
            event = normalize(raw)
            if event and upsert_event(event):
                events_upserted += 1

    except Exception as exc:
        error = str(exc)
        print(f"[ERROR] {error}", file=sys.stderr)

    finally:
        from db import log_scrape
        log_scrape(args.site, args.city, len(raw_events), events_upserted, error)
        status = "ERROR" if error else "OK"
        print(f"[{status}] {args.site}/{args.city} — found={len(raw_events)} upserted={events_upserted}")


if __name__ == "__main__":
    main()