import Title from "../Common/Title";
import { Link } from "react-router";
import { GetSingleData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import { TimerIcon } from "lucide-react";
import { useDateFormat } from "@/lib/formatDate";
import { sortByDistance } from "@/lib/sortByDistance";
import { TicketBadge } from "@/components/Common/TicketBadge";
import { filterParkingEvents } from "@/utils/filterParkingEvents";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useState, useEffect } from "react";
import Container from "@/components/Common/Container";

const AllConcerts = () => {
  const [page, setPage] = useState(1);
  const [allConcerts, setAllConcerts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const latlong = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["events/concerts/all", page, latlong],
    queryFn: () =>
      GetSingleData(
        `/events/concerts?lat=${latlong?.lat}&lng=${latlong?.lon}&page=${page}`
      ),
  });

  const { formatDate } = useDateFormat();

  useEffect(() => {
    const raw: any[] = (data as any)?.data ?? [];
    if (!raw.length && page === 1) return;
    const sorted = filterParkingEvents(sortByDistance(raw, latlong?.lat, latlong?.lon));
    if (page === 1) {
      setAllConcerts(sorted);
    } else {
      setAllConcerts((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...sorted.filter((c) => !seen.has(c.id))];
      });
    }
    const totalPages: number = (data as any)?.pagination?.totalPages ?? 1;
    setHasMore(page < totalPages);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    if (!isLoading && hasMore) setPage((prev) => prev + 1);
  };

  const isInitialLoad = isLoading && allConcerts.length === 0;
  const isLoadingMore = isLoading && allConcerts.length > 0;
  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !isLoading);

  return (
    <Container>
      <div className="pt-12">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <Title>All Concerts</Title>
          </div>
        </div>

        {isInitialLoad ? (
          <Loader />
        ) : error ? (
          <ErrorText>
            {(error as any)?.response?.data?.message || "Something went wrong."}
          </ErrorText>
        ) : allConcerts.length === 0 ? (
          <ErrorText>No Concerts Found</ErrorText>
        ) : (
          <div className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allConcerts.map((concert) => {
                const formattedDate = formatDate(concert?.date, concert?.time);
                const ticketCount = concert?.available_quantity;
                return (
                  <Link
                    key={concert.id}
                    to={`/event-details/${concert?.id}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:-translate-y-1 transition-all duration-200 shadow-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(37, 99, 235, 0.12)",
                    }}
                  >
                    <div className="flex items-center gap-3 w-full h-full">
                      <img
                        src={concert?.image || ""}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        data-testid="all-concerts-card-thumbnail"
                      />
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <p className="font-semibold text-base leading-tight line-clamp-1">
                          {concert?.title}
                        </p>
                        <p className="text-gray-500 text-sm truncate">
                          {concert?.venue}, {concert?.location}
                        </p>
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <TimerIcon size={14} />
                          {formattedDate}
                        </p>
                        <div className="mt-1">
                          <TicketBadge
                            count={ticketCount}
                            data-testid={`all-concerts-card-ticket-count-${concert?.id}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

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
                No more concerts
              </p>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default AllConcerts;
