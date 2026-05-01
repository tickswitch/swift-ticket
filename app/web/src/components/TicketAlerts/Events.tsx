import { Link, useSearchParams } from "react-router";
import { image2 } from "@/assets";
import Container from "../Common/Container";
import { useQuery } from "@tanstack/react-query";
import { GetSingleData } from "@/API/API";
import PopularEvents from "./PopularEvents";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { TicketIcons } from "@/components/TicketAlerts/TickertAlertIcons";
import { useDateFormat } from "@/lib/formatDate";
import { TicketBadge } from "@/components/Common/TicketBadge";
import { useState, useEffect } from "react";
import { filterParkingEvents } from "@/utils/filterParkingEvents";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GenreFiltersBar } from "@/components/HomePage/GenreFiltersBar";

const Events = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Local filter state (only active on genre pages)
  const [filterPeriod, setFilterPeriod] = useState("anytime");
  const [filterSort, setFilterSort] = useState("date,asc");
  const [filterCategory, setFilterCategory] = useState("Category");

  const [searchParams] = useSearchParams();
  const urlPeriod = searchParams.get("period");
  const venue = searchParams.get("venue");
  const genre = searchParams.get("genre");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lng");

  const resetPages = () => {
    setCurrentPage(0);
    setAllEvents([]);
    setHasMore(true);
  };

  // Reset when URL params change
  useEffect(() => { resetPages(); }, [urlPeriod, venue, genre, lat, lon]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset when local filters change
  useEffect(() => { resetPages(); }, [filterPeriod, filterSort, filterCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const buildUrl = (page: number) => {
    const locParam = lat && lon ? `&lat=${lat}&lng=${lon}&radius=150` : "";
    const sortParam = `&sort=${filterSort}`;

    if (urlPeriod) return `events?period=${urlPeriod}${locParam}&page=${page}`;
    if (venue)     return `events?venue=${venue}${locParam}&page=${page}`;

    if (genre) {
      // Always route through filterEvents so period + category + sort all work consistently
      // For "anytime", send a 2-year window so the backend doesn't restrict to today
      let dateParam: string;
      if (filterPeriod === 'anytime') {
        const now = new Date();
        const future = new Date(now);
        future.setFullYear(future.getFullYear() + 2);
        const from = now.toISOString().split('T')[0];
        const to   = future.toISOString().split('T')[0];
        dateParam = `period=custom&from=${from}&to=${to}`;
      } else {
        dateParam = `period=${filterPeriod}`;
      }
      // Category selection overrides the original genre (e.g. "Concerts" replaces "festival")
      const classificationParam = filterCategory !== 'Category'
        ? `genre=${encodeURIComponent(filterCategory)}`
        : `genre=${genre}`;
      return `events?${dateParam}&${classificationParam}${locParam}${sortParam}&page=${page}&size=20`;
    }

    return `events${locParam ? '?' + locParam.slice(1) : '?'}${locParam ? '&' : ''}page=${page}`;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", currentPage, urlPeriod, venue, genre, lat, lon, filterPeriod, filterSort, filterCategory],
    queryFn: () => GetSingleData(buildUrl(currentPage)),
  });

  useEffect(() => {
    const raw: any[] = (data as any)?.data ?? [];
    if (!raw.length && currentPage === 0) return;
    const newFiltered = filterParkingEvents(raw);
    if (currentPage === 0) {
      setAllEvents(newFiltered);
    } else {
      setAllEvents((prev) => {
        const seen = new Set(prev.map((e) => e.id));
        return [...prev, ...newFiltered.filter((e) => !seen.has(e.id))];
      });
    }
    const totalPages: number = (data as any)?.pagination?.totalPages ?? 1;
    setHasMore(currentPage < totalPages - 1);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (!isLoading && hasMore) setCurrentPage((prev) => prev + 1);
  };

  const isInitialLoad = isLoading && allEvents.length === 0;
  const isLoadingMore = isLoading && allEvents.length > 0;
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isLoading);

  return isInitialLoad ? (
    <Loader />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="-mt-[135px] w-full h-full max-w-full">
      <Banner />
      <Container>
        <div className="pt-5">
          {/* Filter bar — only shown on genre "See all" pages */}
          {genre && !urlPeriod && (
            <GenreFiltersBar
              period={filterPeriod}
              onPeriodChange={setFilterPeriod}
              category={filterCategory}
              onCategoryChange={setFilterCategory}
              sort={filterSort}
              onSortChange={setFilterSort}
            />
          )}
          <div className="py-5 flex flex-col gap-2">
            {allEvents.length === 0 ? (
              <div className="pt-5">
                <div className="max-w-3xl w-full mx-auto rounded-xl p-8 flex flex-col items-center gap-4 border border-gray-400">
                  <div className="bg-gray-300 rounded-full p-4">
                    <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                      <TicketIcons />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    No events available right now
                  </h3>
                  <p className="text-gray-500 text-center max-w-xl">
                    Got tickets to sell? Set up a listing for one of the fans
                    looking for a ticket.
                  </p>
                  <Link
                    to="/sell-tickets"
                    className="mt-2 bg-primary001/20 text-primary001 font-semibold px-4 py-1.5 rounded-full text-sm"
                  >
                    Start selling
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <EntranceTickets data={allEvents} />

                {/* Sentinel for IntersectionObserver */}
                <div ref={sentinelRef} className="h-1" />

                {isLoadingMore && (
                  <div className="flex justify-center py-6">
                    <Loader />
                  </div>
                )}

                {!isLoadingMore && hasMore && (
                  <div className="flex justify-center py-6">
                    <button
                      onClick={loadMore}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Load more
                    </button>
                  </div>
                )}

                {!hasMore && (
                  <p className="text-center text-gray-400 text-sm py-6">
                    No more events
                  </p>
                )}
              </>
            )}
            <PopularEvents />
          </div>
        </div>
      </Container>
    </div>
  );
};

const Banner = () => {
  return (
    <div className="w-full h-[600px] relative z-10 hero-orbs">
      <img src={image2} alt="" className="w-full h-full object-cover" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm" />
      <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  h-full flex flex-col items-center justify-center">
        <p className="text-2xl lg:text-4xl font-semibold">Events List</p>
      </div>
    </div>
  );
};

const EntranceTickets = ({ data }: { data: any[] }) => {
  const { formatDate } = useDateFormat();
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((event) => {
          const formattedDate = formatDate(event?.end_date, event?.time);
          return (
            <Link
              key={event?.id}
              to={`/event-details/${event?.id}`}
              className="flex items-center justify-start gap-3 bg-white rounded-xl p-5"
            >
              <img
                src={event?.image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                data-testid="event-list-card-thumbnail"
              />
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="font-semibold text-base leading-tight line-clamp-1">
                  {event?.title || ""}
                </p>
                <p className="text-gray-500 text-sm truncate">
                  {event?.venue}, {event?.location}
                </p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
                <div className="mt-1">
                  <TicketBadge
                    count={event?.available_quantity}
                    data-testid={`ticket-alerts-event-card-ticket-count-${event?.id}`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Events;
