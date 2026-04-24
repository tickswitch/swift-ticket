import Title from "../Common/Title";
import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import { TimerIcon } from "lucide-react";
import { useDateFormat, formatShortDate } from "@/lib/formatDate";
import { sortByDistance } from "@/lib/sortByDistance";
import { TicketBadge } from "@/components/Common/TicketBadge";
import { useMemo, useEffect } from "react";
import { useHomepageDedup } from "@/context/HomepageDedupContext";
import { filterParkingEvents } from "@/utils/filterParkingEvents";

const Concerts = () => {
  const latlong = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );

  const locationQuery = latlong?.lat && latlong?.lon ? `?lat=${latlong.lat}&lng=${latlong.lon}` : "";
  const { data, isLoading, error } = useQuery({
    queryKey: ["events/concerts", latlong?.lat, latlong?.lon],
    queryFn: () => GetData(`/events/concerts${locationQuery}`),
  });

  const { formatDate } = useDateFormat();
  const { registerIds } = useHomepageDedup();

  const concerts = useMemo(() => {
    const seen = new Set<string>();
    return filterParkingEvents(sortByDistance(data as any[] ?? [], latlong?.lat, latlong?.lon) as any[])
      .filter((c) => { if (!c.id || seen.has(c.id)) return false; seen.add(c.id); return true; })
      .slice(0, 10);
  }, [data, latlong?.lat, latlong?.lon]);

  useEffect(() => {
    if (concerts.length > 0) registerIds(concerts.map((c: any) => c.id));
  }, [concerts, registerIds]);

  return (
    <div className="pt-12">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <Title>Concerts</Title>
          <Link
            to={"/all-concerts"}
            className="text-sm text-primary001 bg-primary001/20 px-3 py-1 rounded-full font-semibold"
          >
            See all
          </Link>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorText>
          {error?.response?.data?.message || "Something went wrong."}
        </ErrorText>
      ) : data?.length < 1 ? (
        <ErrorText>No Sports Found</ErrorText>
      ) : (
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {concerts.map((concert) => {
              const shortDate = formatShortDate(concert?.date, concert?.time);
              const longDate = formatDate(concert?.date, concert?.time);
              const ticketCount = concert?.available_quantity;
              return (
                <Link
                  to={`/event-details/${concert?.id}`}
                  data-testid={`concert-card-${concert?.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:-translate-y-1 transition-all duration-200 shadow-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(37, 99, 235, 0.12)',
                  }}
                >
                  <div className="flex items-center gap-3 w-full h-full">
                    <img
                      src={concert?.image || ""}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      data-testid="concert-card-thumbnail"
                    />

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <p
                        className="font-semibold text-base leading-tight line-clamp-1"
                        data-testid="concert-card-title"
                      >
                        {concert?.title}
                      </p>
                      <p className="text-gray-500 text-sm truncate">
                        {concert?.venue}
                        {concert?.location ? `, ${concert?.location}` : ""}
                      </p>
                      {concert?.city && (
                        <p
                          className="text-gray-500 text-sm"
                          data-testid="concert-card-city"
                        >
                          {concert.city}
                        </p>
                      )}
                      <p
                        className="text-red-500 text-sm flex items-center gap-1"
                        data-testid="concert-card-date"
                      >
                        <TimerIcon size={14} />
                        {shortDate || longDate}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {typeof concert?.price === "number" && (
                          <span
                            className="text-primary001 text-sm font-semibold"
                            data-testid="concert-card-price"
                          >
                            From \u20b9{Number(concert.price).toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        )}
                        <TicketBadge
                          count={ticketCount}
                          data-testid="concert-card-ticket-count"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Concerts;
