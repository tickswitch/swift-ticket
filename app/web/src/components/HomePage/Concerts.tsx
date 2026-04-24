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
            {sortByDistance(data as any[] ?? [], latlong?.lat, latlong?.lon).slice(0, 10)?.map((concert) => {
              const shortDate = formatShortDate(concert?.date, concert?.time);
              const longDate = formatDate(concert?.date, concert?.time);
              const ticketCount = concert?.available_quantity;
              return (
                <Link
                  to={`/event-details/${concert?.id}`}
                  data-testid={`concert-card-${concert?.id}`}
                  className="md:basis-1/2 lg:basis-1/3 hover:-translate-y-2 transition-all duration-300 bg-slate-200 px-4 py-2 rounded-xl"
                >
                  <div className="p-1 flex items-center gap-3 w-full h-full rounded-2xl overflow-hidden rounded-b-3xl">
                    <img
                      src={concert?.image || ""}
                      className="rounded-xl w-20 h-20 object-cover"
                    />

                    <div className="flex-col gap-1 md:gap-2 min-w-0">
                      <p
                        className="flex items-center justify-between text-black text-xl md:text-2xl truncate"
                        data-testid="concert-card-title"
                      >
                        {concert?.title}
                      </p>
                      <p className="text-gray-500 truncate">
                        {concert?.venue}
                        {concert?.location ? `, ${concert?.location}` : ""}
                      </p>
                      {concert?.city && (
                        <p
                          className="text-gray-600 text-sm"
                          data-testid="concert-card-city"
                        >
                          {concert.city}
                        </p>
                      )}
                      <p
                        className="text-red-500 text-sm flex items-center gap-2"
                        data-testid="concert-card-date"
                      >
                        <TimerIcon size={20} />
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
                        {typeof ticketCount === "number" && (
                          <TicketBadge
                            count={ticketCount}
                            data-testid="concert-card-ticket-count"
                          />
                        )}
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
