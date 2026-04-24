import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Common/Loader";
import { formatShortDate } from "@/lib/formatDate";
import { TimerIcon } from "lucide-react";
import { sortByDistance } from "@/lib/sortByDistance";
import { TicketBadge } from "@/components/Common/TicketBadge";

const FestivalsForYou = () => {
  const latlong = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const locationQuery =
    latlong?.lat && latlong?.lon ? `?lat=${latlong.lat}&lng=${latlong.lon}` : "";

  const { data, isLoading } = useQuery({
    queryKey: ["events/festivals", latlong?.lat, latlong?.lon],
    queryFn: () => GetData(`events/festivals${locationQuery}`),
  });

  if (isLoading) return <Loader />;
  if (!data || (data as any[]).length === 0) return null;

  const festivals = sortByDistance(data as any[], latlong?.lat, latlong?.lon).slice(0, 10);

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold text-black">Festivals for you</h2>
        <Link
          to={`/events?genre=festival${latlong?.lat ? `&lat=${latlong.lat}&lng=${latlong.lon}` : ""}`}
          className="text-sm text-primary001 bg-primary001/20 px-3 py-1 rounded-full font-semibold"
        >
          Show all
        </Link>
      </div>
      <p className="text-gray-500 text-sm mb-6">For a day or the entire weekend.</p>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {festivals.map((festival: any) => {
          const shortDate = formatShortDate(festival?.date, festival?.time);
          const ticketCount = festival?.available_quantity;

          return (
            <Link
              key={festival?.id}
              to={`/event-details/${festival?.id}`}
              className="flex items-center gap-3 bg-white border border-gray-100 hover:border-gray-300 rounded-xl px-3 py-3 hover:-translate-y-1 transition-all duration-200 shadow-sm"
            >
              {/* Thumbnail */}
              <img
                src={festival?.image || ""}
                alt={festival?.title || ""}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                data-testid="festival-card-thumbnail"
              />

              {/* Details */}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="font-semibold text-base leading-tight line-clamp-2" data-testid="festival-card-title">
                  {festival?.title}
                </p>
                <p className="text-gray-500 text-sm truncate">
                  {festival?.venue}{festival?.location ? `, ${festival?.location}` : ""}
                </p>
                {shortDate && (
                  <span className="text-red-500 text-sm flex items-center gap-1 mt-0.5">
                    <TimerIcon size={12} />
                    {shortDate}
                  </span>
                )}
                <div className="mt-0.5">
                  <TicketBadge
                    count={ticketCount}
                    data-testid={`festival-card-ticket-count-${festival?.id}`}
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

export default FestivalsForYou;
