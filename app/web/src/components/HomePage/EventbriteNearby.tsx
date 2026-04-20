import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Common/Loader";
import { formatShortDate } from "@/lib/formatDate";
import { TimerIcon, MapPinIcon } from "lucide-react";

const EventbriteNearby = () => {
  const latlong = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const locationQuery =
    latlong?.lat && latlong?.lon ? `?lat=${latlong.lat}&lng=${latlong.lon}` : "";

  const { data, isLoading } = useQuery({
    queryKey: ["events/nearby-eb", latlong?.lat, latlong?.lon],
    queryFn: () => GetData(`events/nearby-eb${locationQuery}`),
  });

  if (isLoading) return <Loader />;
  if (!data || (data as any[]).length === 0) return null;

  const events = (data as any[]).slice(0, 8);

  return (
    <div className="pt-12">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold text-black">Local events near you</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-medium">
          via Eventbrite
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-6">Community events, meetups & more.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {events.map((event: any) => {
          const shortDate = formatShortDate(event?.date, event?.time);
          return (
            <a
              key={event?.id}
              href={event?.ticket_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col bg-white border border-gray-100 hover:border-gray-300 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-200 shadow-sm"
            >
              {event?.image ? (
                <img
                  src={event.image}
                  alt={event?.title || ""}
                  className="w-full h-36 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-primary001/20 to-primary001/5 flex-shrink-0" />
              )}
              <div className="flex flex-col gap-1 p-3 min-w-0 flex-1">
                <p className="font-semibold text-black text-sm leading-tight line-clamp-2">
                  {event?.title}
                </p>
                {event?.venue && (
                  <p className="text-gray-500 text-xs flex items-center gap-1 truncate">
                    <MapPinIcon size={11} className="flex-shrink-0" />
                    {event.venue}{event?.location ? `, ${event.location}` : ""}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap mt-auto pt-1">
                  {shortDate && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <TimerIcon size={12} />
                      {shortDate}
                    </span>
                  )}
                  {event?.is_free ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Free
                    </span>
                  ) : event?.price != null ? (
                    <span className="text-xs font-semibold text-gray-600">
                      From ₹{Number(event.price).toLocaleString("en-IN")}
                    </span>
                  ) : null}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default EventbriteNearby;
