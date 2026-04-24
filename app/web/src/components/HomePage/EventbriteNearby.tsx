import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Common/Loader";
import { formatShortDate } from "@/lib/formatDate";
import { TimerIcon, MapPinIcon, CalendarDaysIcon } from "lucide-react";
import { filterParkingEvents } from "@/utils/filterParkingEvents";

const categoryColor: Record<string, string> = {
  concerts: "bg-purple-100 text-purple-700",
  festivals: "bg-yellow-100 text-yellow-700",
  sports: "bg-blue-100 text-blue-700",
  community: "bg-green-100 text-green-700",
  conferences: "bg-indigo-100 text-indigo-700",
  expos: "bg-orange-100 text-orange-700",
};

const EventbriteNearby = () => {
  const latlong = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const locationQuery =
    latlong?.lat && latlong?.lon ? `?lat=${latlong.lat}&lng=${latlong.lon}` : "";

  const { data, isLoading } = useQuery({
    queryKey: ["events/nearby-phq", latlong?.lat, latlong?.lon],
    queryFn: () => GetData(`events/nearby-phq${locationQuery}`),
  });

  if (isLoading) return <Loader />;
  if (!data || (data as any[]).length === 0) return null;

  const events = filterParkingEvents(data as any[]).slice(0, 8);

  return (
    <div className="pt-12">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold text-black">Events near you</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full font-medium">
          via PredictHQ
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-6">Concerts, sports, community events & more.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {events.map((event: any) => {
          const shortDate = formatShortDate(event?.date, event?.time);
          const category = event?.segment?.[0] ?? null;
          const badgeClass = category ? (categoryColor[category] ?? "bg-gray-100 text-gray-600") : null;

          return (
            <div
              key={event?.id}
              className="flex flex-col bg-white border border-gray-100 hover:border-gray-300 rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-default"
            >
              <div className="w-full h-28 bg-gradient-to-br from-primary001/20 via-primary001/10 to-purple-100 flex items-center justify-center flex-shrink-0">
                <CalendarDaysIcon size={32} className="text-primary001/40" />
              </div>
              <div className="flex flex-col gap-1 p-3 min-w-0 flex-1">
                <p className="font-semibold text-black text-sm leading-tight line-clamp-2">
                  {event?.title}
                </p>
                {(event?.venue || event?.location) && (
                  <p className="text-gray-500 text-xs flex items-center gap-1 truncate">
                    <MapPinIcon size={11} className="flex-shrink-0" />
                    {event.venue ? `${event.venue}${event?.location ? `, ${event.location}` : ""}` : event.location}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap mt-auto pt-1">
                  {shortDate && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <TimerIcon size={12} />
                      {shortDate}
                    </span>
                  )}
                  {badgeClass && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${badgeClass}`}>
                      {category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventbriteNearby;
