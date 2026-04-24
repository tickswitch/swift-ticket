import { Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { useDateFormat } from '@/lib/formatDate';
import Loader from '@/components/Common/Loader';
import { TicketBadge } from '@/components/Common/TicketBadge';

// Types
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

interface Pagination {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

interface EventsListWithPaginationProps {
  events: Event[] | undefined;
  pagination: Pagination | undefined;
  isLoading: boolean;
  error: any;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * EventsListWithPagination Component
 * 
 * Displays a list of events with pagination controls.
 * Handles loading, error, and empty states.
 * 
 * @param events - Array of events to display
 * @param pagination - Pagination metadata from API
 * @param isLoading - Loading state
 * @param error - Error state
 * @param currentPage - Current page number (0-indexed)
 * @param onPageChange - Callback when page changes
 */
export function EventsListWithPagination({
  events,
  pagination,
  isLoading,
  error,
  currentPage,
  onPageChange,
}: EventsListWithPaginationProps) {
  const { formatDate } = useDateFormat();

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages - 1) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    onPageChange(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section>
      <h2 className="text-3xl font-bold text-black mb-6">Events</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-600 flex items-center justify-center gap-3">
            <Loader />
            Loading events...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-600">Error loading events. Please try again.</p>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && events && events?.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-6">
          {events?.map((event: Event) => {
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
                  className="w-32 h-32 rounded-xl object-cover"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-xl md:text-2xl font-semibold">
                    {event?.title || ""}
                  </p>
                  <p className="text-secondaryText001">
                    {event?.venue}, {event?.location}
                  </p>
                  <p>{formattedDate}</p>
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
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && events && events?.length > 0 && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {/* First Page */}
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => handlePageClick(0)}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-2">...</span>}
              </>
            )}

            {/* Previous Page */}
            {currentPage > 0 && (
              <button
                onClick={() => handlePageClick(currentPage - 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {currentPage}
              </button>
            )}

            {/* Current Page */}
            <button
              className="w-10 h-10 border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400 rounded-lg font-semibold"
            >
              {currentPage + 1}
            </button>

            {/* Next Page */}
            {currentPage < pagination.totalPages - 1 && (
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {currentPage + 2}
              </button>
            )}

            {/* Last Page */}
            {currentPage < pagination.totalPages - 3 && (
              <>
                {currentPage < pagination.totalPages - 4 && <span className="px-2">...</span>}
                <button
                  onClick={() => handlePageClick(pagination.totalPages - 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* No Events Found State */}
      {!isLoading && !error && (!events || events?.length === 0) && (
        <div className="border border-gray-300 rounded-2xl bg-primary001/10 p-16 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-black/30 flex items-center justify-center mb-6">
            <Calendar size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-3">
            No Data found
          </h3>
          <p className="text-gray-600 text-center">
            We couldn't find any results for that – try searching again.
          </p>
        </div>
      )}
    </section>
  );
}
