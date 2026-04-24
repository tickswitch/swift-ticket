import { ArrowIcon } from "./EventsIcons";
import Title from "../Common/Title";
import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperClass from "swiper";
// @ts-expect-error: Swiper CSS modules have no TypeScript declarations
import "swiper/css";
// @ts-expect-error: Navigation CSS module not typed
import "swiper/css/navigation";
// @ts-expect-error: Scrollbar CSS module not typed
import "swiper/css/scrollbar";
import React from "react";
import { NavigationIcon } from "lucide-react";
import { useHomepageDedup } from "@/context/HomepageDedupContext";

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (km: number): string => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

const SportsEvents = () => {
  const locationCoords = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const locationQuery = locationCoords?.lat && locationCoords?.lon
    ? `?lat=${locationCoords.lat}&lng=${locationCoords.lon}`
    : "";

  const swiperRef = React.useRef<SwiperClass | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["events/by-groupe", locationCoords?.lat, locationCoords?.lon],
    queryFn: () => GetData(`events/by-groupe${locationQuery}`),
  });

  const { registerIds } = useHomepageDedup();

  // Build sorted genre list from API response dynamically; dedup events within each genre
  const genres: { name: string; events: any[] }[] = React.useMemo(() => {
    if (!data || typeof data !== "object") return [];
    const globalSeen = new Set<string>();
    return Object.entries(data as Record<string, any[]>)
      .filter(([, evts]) => Array.isArray(evts) && evts.length > 0)
      .map(([name, evts]) => {
        const deduped = evts.filter((e) => {
          if (!e.id || globalSeen.has(e.id)) return false;
          globalSeen.add(e.id);
          return true;
        });
        return { name, events: deduped };
      })
      .filter(({ events }) => events.length > 0)
      .sort((a, b) => {
        // Sort genres whose nearest event is closest first
        if (!locationCoords?.lat || !locationCoords?.lon) return 0;
        const nearestDist = (evts: any[]) => {
          const d = evts
            .filter((e) => e.latitude && e.longitude)
            .map((e) => haversineKm(locationCoords.lat, locationCoords.lon, Number(e.latitude), Number(e.longitude)));
          return d.length ? Math.min(...d) : Infinity;
        };
        return nearestDist(a.events) - nearestDist(b.events);
      });
  }, [data, locationCoords?.lat, locationCoords?.lon]);

  React.useEffect(() => {
    const allIds = genres.flatMap((g) => g.events.map((e: any) => e.id)).filter(Boolean);
    if (allIds.length > 0) registerIds(allIds);
  }, [genres, registerIds]);

  const isEmpty = !isLoading && !error && genres.length === 0;

  return (
    <div className="pt-12">
      <div className="flex items-center justify-between">
        <div>
          <Title>Sports to catch soon</Title>
        </div>
        <div className="flex gap-4">
          <button
            className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-black/70 rounded-full"
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowIcon />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-black/70 rounded-full rotate-180"
            aria-label="Next slide"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorText>{(error as any)?.response?.data?.message || "Something went wrong."}</ErrorText>
      ) : isEmpty ? (
        <ErrorText>No Sports Found</ErrorText>
      ) : (
        <div className="py-6">
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3.5, spaceBetween: 24 },
            }}
          >
            {genres.map(({ name, events }) => {
              const firstEvent = events[0];
              const image = firstEvent?.image || "";

              // Distance to nearest event in this genre
              const nearestEvent = locationCoords?.lat && locationCoords?.lon
                ? events
                    .filter((e) => e.latitude && e.longitude)
                    .sort((a, b) =>
                      haversineKm(locationCoords.lat, locationCoords.lon, Number(a.latitude), Number(a.longitude)) -
                      haversineKm(locationCoords.lat, locationCoords.lon, Number(b.latitude), Number(b.longitude))
                    )[0]
                : null;

              const distKm = nearestEvent
                ? haversineKm(locationCoords.lat, locationCoords.lon, Number(nearestEvent.latitude), Number(nearestEvent.longitude))
                : null;

              const locationLabel = nearestEvent?.location && nearestEvent?.country
                ? `${nearestEvent.location}, ${nearestEvent.country}`
                : nearestEvent?.location ?? nearestEvent?.country ?? null;

              return (
                <SwiperSlide key={name}>
                  <Link
                    to={`/events?genre=${encodeURIComponent(name)}${locationCoords?.lat ? `&lat=${locationCoords.lat}&lng=${locationCoords.lon}` : ""}`}
                    className="block relative rounded-xl overflow-hidden h-[200px] cursor-pointer group"
                  >
                    {/* Full-bleed image */}
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary001/60 to-indigo-700" />
                    )}

                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
                      }}
                    />

                    {/* Distance badge — top right */}
                    {distKm !== null && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
                        <NavigationIcon size={10} />
                        {formatDistance(distKm)}
                      </span>
                    )}

                    {/* "Events" pill — top left */}
                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                      {events.length} event{events.length !== 1 ? "s" : ""}
                    </span>

                    {/* Genre name + nearest city — bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-base leading-tight">{name}</p>
                      {locationLabel && (
                        <p className="text-white/70 text-xs mt-0.5 truncate">{locationLabel}</p>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default SportsEvents;
