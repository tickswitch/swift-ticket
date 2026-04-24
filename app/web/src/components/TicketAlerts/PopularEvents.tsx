import { Link } from "react-router";
import { CheckIcon2 } from "../HomePage/EventsIcons";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "@/API/API";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText"; 
import { useDateFormat } from "@/lib/formatDate";
import { sortByDistance } from "@/lib/sortByDistance";
import { filterParkingEvents } from "@/utils/filterParkingEvents";

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
          {data && data.length > 0 && filterParkingEvents(sortByDistance(data as any[], location?.lat, location?.lon)).map((event) => {
            const formattedDate = formatDate(event?.date, event?.time);
            return (
              <Link
                to={`/event-details/${event?.id}`}
                key={`index - ${event?.id}`}
                className="h-[98px] w-full bg-primary001/10 px-5 py-2 rounded-2xl flex items-start gap-3 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between w-full">
                      <p className="font-semibold text-base leading-tight line-clamp-1">
                        {event?.title}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {event?.venue}, {event?.location}
                    </p>
                    <p className="text-primary001 flex items-center gap-2 text-sm">
                      <CheckIcon2 /> {formattedDate}
                    </p>
                  </div>
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
