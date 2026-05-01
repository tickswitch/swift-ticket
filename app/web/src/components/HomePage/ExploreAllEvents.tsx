import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetSingleData } from '@/API/API';

type EventItem = Record<string, any>;
type PaginatedEventsResponse = {
  data: EventItem[];
  pagination: { totalPages: number; totalElements: number; number: number; size: number };
};
import { LocationDropdown } from './LocationDropdown';
import { EventFiltersBar } from './EventFiltersBar';
import { EventsListWithPagination } from './EventsListWithPagination';
import { SortDropdown } from './GenreFiltersBar';

const ExploreAllEvents = () => {
  const [location, setLocation] = useState(() => {
    return localStorage.getItem("selectedLocation") || "Nearby";
  });
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lon: number } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
    } catch {
      return null;
    }
  });

  const [time, setTime] = useState('today');
  const [eventType, setEventType] = useState('All events');
  const [category, setCategory] = useState('Category');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customDateRange, setCustomDateRange] = useState<{ from: string; to: string } | null>(null);
  const [sort, setSort] = useState('date,asc');

  const [page, setPage] = useState(0);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  // Reset accumulated events whenever filters change
  const resetPages = () => {
    setPage(0);
    setAllEvents([]);
  };

  const handleTimeChange = (value: string) => {
    setTime(value);
    setCustomDateRange(null);
    resetPages();
  };

  const handleCustomDateSave = (from: string, to: string) => {
    setCustomDateRange({ from, to });
    setTime('custom');
    resetPages();
  };

  const handleEventTypeChange = (value: string) => {
    setEventType(value);
    resetPages();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    resetPages();
  };

  const handleGenresChange = (genres: string[]) => {
    setSelectedGenres(genres);
    resetPages();
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    resetPages();
    try {
      const coords = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
      setLocationCoords(coords);
    } catch {
      setLocationCoords(null);
    }
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    resetPages();
  };

  const buildApiQuery = () => {
    const params: string[] = [];

    if (customDateRange) {
      params.push(`period=custom&from=${customDateRange.from}&to=${customDateRange.to}`);
    } else if (time !== 'today') {
      params.push(`period=${time}`);
    }

    if (selectedGenres.length > 0) {
      params.push(`genre=${selectedGenres.join(',')}`);
    }

    if (locationCoords && locationCoords.lat && locationCoords.lon) {
      params.push(`lat=${locationCoords.lat}&lng=${locationCoords.lon}`);
    }

    if (eventType && eventType !== 'All events') {
      params.push(`type=${eventType}`);
    }

    if (category && category !== 'Category') {
      params.push(`category=${category}`);
    }

    params.push(`sort=${sort}`);
    params.push(`page=${page}&size=10`);

    return `events${params.length > 0 ? '?' + params.join('&') : ''}`;
  };

  const { data: responseData, isLoading, error } = useQuery<PaginatedEventsResponse>({
    queryKey: ['events', time, customDateRange, selectedGenres, page, eventType, category, location, locationCoords, sort],
    queryFn: () => GetSingleData(buildApiQuery()) as unknown as Promise<PaginatedEventsResponse>,
  });

  const newPageData: any[] | undefined = responseData?.data;
  const pagination = responseData?.pagination;

  // Accumulate events: replace on page 0, append on subsequent pages
  useEffect(() => {
    if (!newPageData) return;
    if (page === 0) {
      setAllEvents(newPageData);
    } else {
      setAllEvents((prev) => {
        const seen = new Set(prev.map((e: any) => e.id));
        return [...prev, ...newPageData.filter((e: any) => !seen.has(e.id))];
      });
    }
  }, [newPageData]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMore = pagination ? page < pagination.totalPages - 1 : false;
  const isInitialLoad = isLoading && allEvents.length === 0;
  const isLoadingMore = isLoading && allEvents.length > 0;

  const loadNextPage = () => {
    if (!isLoading && hasMore) setPage((prev) => prev + 1);
  };


  return (
    <div className="text-black py-16 px-6 max-w-3xl mx-auto">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            Explore events
          </h1>
          <p className="text-xl text-black">
            Find gigs, events and more whenever you're looking to go out.
          </p>
        </header>

        <div className="mb-8">
          <div
            className="flex flex-wrap items-center gap-3"
          >
            <LocationDropdown
              defaultLocation="Nearby"
              onLocationChange={handleLocationChange}
            />
            <EventFiltersBar
              time={time}
              onTimeChange={handleTimeChange}
              customDateRange={customDateRange}
              onCustomDateSave={handleCustomDateSave}
              eventType={eventType}
              onEventTypeChange={handleEventTypeChange}
              category={category}
              onCategoryChange={handleCategoryChange}
              selectedGenres={selectedGenres}
              onGenresChange={handleGenresChange}
            />
            <div className="ml-auto flex-shrink-0">
              <SortDropdown sort={sort} onSortChange={handleSortChange} />
            </div>
          </div>

        </div>

        <EventsListWithPagination
          events={allEvents}
          isLoading={isInitialLoad}
          error={error}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadNextPage}
        />
      </div>
    </div>
  );
};

export default ExploreAllEvents;
