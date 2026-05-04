import { Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { useDateFormat } from '@/lib/formatDate';
import Loader from '@/components/Common/Loader';
import { TicketBadge } from '@/components/Common/TicketBadge';
import { filterParkingEvents } from '@/utils/filterParkingEvents';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Event {
  id: string;
  title: string;
  image: string;
  venue: string;
  location: string;
  end_date: string;
  time: string;
  available_quantity: number;
}

interface EventsListWithPaginationProps {
  events: Event[] | undefined;
  isLoading: boolean;
  error: any;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function EventsListWithPagination({
  events,
  isLoading,
  error,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: EventsListWithPaginationProps) {
  const { formatDate } = useDateFormat();
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore && !isLoadingMore);
  const filtered = filterParkingEvents(events ?? []);

  return (
    <section>
      <h2 className="text-2xl font-bold text-black mb-6">Events</h2>

      {isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-600 flex items-center justify-center gap-3">
            <Loader />
            Loading events...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-red-600">Error loading events. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {filtered.map((event: Event) => {
              const formattedDate = formatDate(event?.end_date, event?.time);
              return (
                <Link
                  key={event?.id}
                  to={`/event-details/${event?.id}`}
                  className="flex items-center justify-start gap-3 bg-white rounded-xl p-5 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={event?.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    data-testid="events-list-card-thumbnail"
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
                        data-testid={`events-list-card-ticket-count-${event?.id}`}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sentinel — IntersectionObserver watches this */}
          <div ref={sentinelRef} className="h-1" />

          {isLoadingMore && (
            <div className="flex justify-center py-6">
              <Loader />
            </div>
          )}

          {!isLoadingMore && hasMore && (
            <div className="flex justify-center py-6">
              <button
                onClick={onLoadMore}
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

      {!isLoading && !error && filtered.length === 0 && (
        <div className="border border-gray-300 rounded-2xl bg-primary001/10 p-16 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-6">
            <Calendar size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-3">No Data found</h3>
          <p className="text-gray-600 text-center">
            We couldn't find any results for that – try searching again.
          </p>
        </div>
      )}
    </section>
  );
}
