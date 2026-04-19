import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { GetSingleData } from '@/API/API';
import { getSelectedCity } from './LocationSelector';
import { LocationDropdown } from './LocationDropdown';
import { EventFiltersBar } from './EventFiltersBar';
import { EventsListWithPagination } from './EventsListWithPagination';

/**
 * ExploreAllEvents Component
 * 
 * Main page for exploring and filtering events.
 * Orchestrates:
 * - Location selection
 * - Event filters (time, type, category, genre)
 * - Events display with pagination
 * - API queries with all filter parameters
 */
const ExploreAllEvents = () => {
  // Location state
  const [location, setLocation] = useState('New York');

  // Filter states
  const [time, setTime] = useState('today');
  const [eventType, setEventType] = useState('All events');
  const [category, setCategory] = useState('Category');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customDateRange, setCustomDateRange] = useState<{ from: string; to: string } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);

  // Handle time selection
  const handleTimeChange = (value: string) => {
    setTime(value);
    setCustomDateRange(null);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleCustomDateSave = (from: string, to: string) => {
    setCustomDateRange({ from, to });
    setTime('custom');
    setCurrentPage(0); // Reset to first page
  };

  // Handle other filter changes with page reset
  const handleEventTypeChange = (value: string) => {
    setEventType(value);
    setCurrentPage(0);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(0);
  };

  const handleGenresChange = (genres: string[]) => {
    setSelectedGenres(genres);
    setCurrentPage(0);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setCurrentPage(0);
  };

  // Build API query with all filters
  const buildApiQuery = () => {
    const params: string[] = [];

    // Date/time filter
    if (customDateRange) {
      params.push(`period=custom&from=${customDateRange.from}&to=${customDateRange.to}`);
    } else if (time !== 'today') {
      params.push(`period=${time}`);
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      params.push(`genre=${selectedGenres.join(',')}`);
    }

    // Location coordinates
    try {
      const locationCoords = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
      if (locationCoords && locationCoords.lat && locationCoords.lon) {
        params.push(`lat=${locationCoords.lat}&lng=${locationCoords.lon}`);
      }
    } catch (e) {
      console.error("Error parsing location coords:", e);
    }

    // Event type filter (only if not 'All events')
    if (eventType && eventType !== 'All events') {
      params.push(`type=${eventType}`);
    }

    // Category filter (only if not 'Category')
    if (category && category !== 'Category') {
      params.push(`category=${category}`);
    }

    // City filter
    const selectedCity = getSelectedCity();
    if (selectedCity) {
      params.push(`city=${encodeURIComponent(selectedCity)}`);
    }

    // Pagination
    params.push(`page=${currentPage}&size=10`);

    return `events${params.length > 0 ? '?' + params.join('&') : ''}`;
  };

  // Fetch events data with React Query
  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['events', time, customDateRange, selectedGenres, currentPage, eventType, category, location],
    queryFn: () => GetSingleData(buildApiQuery()),
  });

  const data = responseData?.data;
  const pagination = responseData?.pagination;

  // Horizontal scroll functionality for filters
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="text-black py-16 px-6 max-w-3xl mx-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            Explore events
          </h1>
          <p className="text-xl text-black">
            Find gigs, events and more whenever you're looking to go out.
          </p>
        </header>

        {/* Filters Section */}
        <div className="relative mb-12">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth text-nowrap"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Location Dropdown */}
            <LocationDropdown
              defaultLocation="Nearby"
              onLocationChange={handleLocationChange}
            />

            {/* Event Filters */}
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
          </div>

          {/* Navigation Arrows for horizontal scroll */}
          <div className="absolute -right-32 top-0 flex items-center gap-2 to-transparent pl-8">
            <button
              onClick={scrollLeft}
              className="p-2 text-primary001 font-semibold hover:text-black rounded-full"
              aria-label="Scroll Left"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 text-primary001 font-semibold hover:text-black rounded-full"
              aria-label="Scroll Right"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        {/* Events List with Pagination */}
        <EventsListWithPagination
          events={data}
          pagination={pagination}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ExploreAllEvents;
