import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "@/API/API";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { useDateFormat } from "@/lib/formatDate";
import { sortByDistance } from "@/lib/sortByDistance";
import { filterParkingEvents } from "@/utils/filterParkingEvents";
import { TimerIcon } from "lucide-react";

interface PopularEventData {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image?: string;
}

const PopularEvents = () => {
  const location = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );
  const { data, isLoading, error } = useQuery<PopularEventData[]>({
    queryKey: ["popular-events"],
    queryFn: () =>
      GetData(`events/popular?lat=${location?.lat}&lng=${location?.lon}`),
  });

  const { formatDate } = useDateFormat();

  return (
    <div>
      <p className="text-2xl font-bold py-4">Popular Events</p>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorText />
      ) : data && data.length < 1 ? (
        <ErrorText>No events found.</ErrorText>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data && data.length > 0 &&
            filterParkingEvents(sortByDistance(data as any[], location?.lat, location?.lon)).map((event) => {
              const formattedDate = formatDate(event?.date, event?.time);
              return (
                <Link
                  to={`/event-details/${event?.id}`}
                  key={event?.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:-translate-y-1 transition-all duration-200 shadow-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(37, 99, 235, 0.12)",
                  }}
                >
                  <img
                    src={event?.image || ""}
                    alt={event?.title || ""}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <p className="font-semibold text-base leading-tight line-clamp-1">
                      {event?.title}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      {event?.venue}, {event?.location}
                    </p>
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <TimerIcon size={14} />
                      {formattedDate}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PopularEvents;
