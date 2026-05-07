from abc import ABC, abstractmethod


class BaseSpider(ABC):
    source_name: str = ""

    @abstractmethod
    def crawl(self, city: str) -> list[dict]:
        """Fetch events for *city* and return a list of raw dicts."""
        ...
