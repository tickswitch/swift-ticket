import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Pagination, A11y } from "swiper/modules";
// @ts-expect-error: Swiper CSS modules have no TypeScript declarations
import "swiper/css";
// @ts-expect-error: Navigation CSS module not typed
import "swiper/css/navigation";
// @ts-expect-error: Pagination CSS module not typed
import "swiper/css/pagination";
import { Link } from "react-router";
import Title from "../Common/Title";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "@/API/API";
import { SkeletonEventCardRow } from "@/components/Common/SkeletonEventCard";
import ErrorText from "@/components/Common/ErrorText";
import { MapPinIcon, NavigationIcon, ExternalLinkIcon, BuildingIcon } from "lucide-react";

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
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
};

const VENUE_GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-violet-600 to-purple-700",
];

const VenueCard = ({
  venue,
  index,
  userLat,
  userLng,
}: {
  venue: any;
  index: number;
  userLat?: number | null;
  userLng?: number | null;
}) => {
  const gradient = VENUE_GRADIENTS[index % VENUE_GRADIENTS.length];
  const initials = (venue.name as string)
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const distanceKm =
    userLat && userLng && venue.latitude && venue.longitude
      ? haversineKm(userLat, userLng, Number(venue.latitude), Number(venue.longitude))
      : null;

  const cityLine = [venue.city, venue.state, venue.country].filter(Boolean).join(", ");

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-2 transition-all duration-300 h-full">
      {/* Top colour band with initials */}
      <div className={`relative bg-gradient-to-br ${gradient} h-44 flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-5xl font-bold opacity-30 select-none">{initials}</span>

        {/* Distance badge */}
        {distanceKm !== null && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <NavigationIcon size={11} />
            {formatDistance(distanceKm)}
          </span>
        )}

        {/* City badge */}
        {venue.city && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            <MapPinIcon size={11} />
            {venue.city}{venue.country ? `, ${venue.country}` : ""}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="font-bold text-black text-base leading-tight line-clamp-2">{venue.name}</p>

        {venue.address && (
          <p className="text-gray-500 text-xs flex items-start gap-1.5">
            <BuildingIcon size={12} className="flex-shrink-0 mt-0.5" />
            {venue.address}{cityLine ? `, ${cityLine}` : ""}
          </p>
        )}

        {/* Footer CTAs */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Link
            to={`/events?venue=${encodeURIComponent(venue.name)}${userLat ? `&lat=${userLat}&lng=${userLng}` : ""}`}
            className="flex-1 text-center text-xs font-semibold bg-primary001 text-white px-3 py-1.5 rounded-full hover:bg-primary001/90 transition-colors"
          >
            View events
          </Link>
          {venue.url && (
            <a
              href={venue.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-semibold border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-gray-400 transition-colors"
            >
              <ExternalLinkIcon size={11} />
              Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ExploreVenues = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const location = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const hasLocation = !!(location?.lat && location?.lon);

  const locationQuery = hasLocation ? `?lat=${location.lat}&lng=${location.lon}` : "";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["venues/best", location?.lat, location?.lon],
    queryFn: () => GetData(`venues/best${locationQuery}`),
  });

  // Sort venues by distance when location is available
  const venues: any[] = (() => {
    const raw: any[] = data ?? [];
    if (!hasLocation) return raw;
    return [...raw].sort((a, b) => {
      const dA = a.latitude && a.longitude
        ? haversineKm(location.lat, location.lon, Number(a.latitude), Number(a.longitude))
        : Infinity;
      const dB = b.latitude && b.longitude
        ? haversineKm(location.lat, location.lon, Number(b.latitude), Number(b.longitude))
        : Infinity;
      return dA - dB;
    });
  })();

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="bg-black w-full px-3 md:px-[71px] py-[50px]">
      <div className="text-white flex flex-wrap gap-4 items-center justify-between max-w-[1322px] mx-auto">
        <div>
          <Title>Explore Venues</Title>
          <p className="text-white/70 text-sm">
            {hasLocation
              ? `Top venues near ${location?.city ?? "your location"} — sorted by distance`
              : "Select a city to discover venues near you"}
          </p>
        </div>
      </div>

      {/* No location selected */}
      {!hasLocation && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/50">
          <MapPinIcon size={40} className="opacity-40" />
          <p className="text-lg font-semibold text-white/70">No location selected</p>
          <p className="text-sm">Use the search bar to pick a city and we'll show venues near you.</p>
        </div>
      )}

      {hasLocation && isLoading && <SkeletonEventCardRow />}
      {hasLocation && error && <ErrorText onRetry={() => refetch()} />}

      {hasLocation && !isLoading && !error && venues.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/50">
          <p className="text-lg font-semibold text-white/70">No venues found nearby</p>
          <p className="text-sm">Try selecting a different city.</p>
        </div>
      )}

      {hasLocation && !isLoading && !error && venues.length > 0 && (
        <div className="overflow-hidden max-w-[1400px] mx-auto mt-6">
          <style>{`
            .swiper { scrollbar-width: none; }
            .swiper::-webkit-scrollbar { display: none; }
            .nft-swiper { padding: 20px 0 40px; overflow: visible; }
            .swiper-pagination {
              position: static !important;
              display: flex; align-items: center; justify-content: center;
              width: 100% !important; margin-top: 8px;
            }
            .swiper-pagination-bullet {
              background-color: #fff !important; opacity: 0.4 !important;
              margin: 0 5px !important; width: 8px !important; height: 8px !important;
            }
            .swiper-pagination-bullet-active { opacity: 1 !important; }
          `}</style>

          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={handleSlideChange}
            modules={[Navigation, Pagination, A11y]}
            centeredSlides={true}
            loop={venues.length > 3}
            pagination={{ clickable: true, el: paginationRef.current || ".custom-pagination" }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 32 },
            }}
            className="nft-swiper"
          >
            {venues.slice(0, 12).map((venue, idx) => (
              <SwiperSlide key={venue.id ?? idx}>
                <VenueCard
                  venue={venue}
                  index={idx}
                  userLat={location?.lat}
                  userLng={location?.lon}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-4 max-w-[350px] mx-auto relative z-40">
            <div className="border border-white p-0.5 px-2 rounded-full h-13 w-18 cursor-pointer">
              <button onClick={() => swiperRef.current?.slidePrev()} className="bg-black rounded-full w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.61447 11.9479C3.46816 12.0944 3.38599 12.2929 3.38599 12.5C3.38599 12.707 3.46816 12.9056 3.61447 13.052L9.86447 19.302C9.93599 19.3788 10.0222 19.4404 10.1181 19.4831C10.2139 19.5258 10.3174 19.5487 10.4223 19.5506C10.5272 19.5524 10.6314 19.5331 10.7286 19.4938C10.8259 19.4545 10.9143 19.3961 10.9885 19.3219C11.0626 19.2477 11.1211 19.1593 11.1604 19.062C11.1997 18.9648 11.219 18.8606 11.2172 18.7557C11.2153 18.6508 11.1924 18.5473 11.1497 18.4515C11.107 18.3556 11.0454 18.2694 10.9686 18.1979L6.05197 13.2812L20.8332 13.2812C21.0404 13.2812 21.2391 13.1989 21.3856 13.0524C21.5322 12.9059 21.6145 12.7072 21.6145 12.5C21.6145 12.2928 21.5322 12.094 21.3856 11.9475C21.2391 11.801 21.0404 11.7187 20.8332 11.7187L6.05197 11.7187L10.9686 6.80204C11.0454 6.73052 11.107 6.64427 11.1497 6.54843C11.1924 6.4526 11.2153 6.34915 11.2172 6.24425C11.219 6.13935 11.1997 6.03515 11.1604 5.93788C11.1211 5.8406 11.0626 5.75223 10.9885 5.67804C10.9143 5.60385 10.8259 5.54537 10.7286 5.50608C10.6313 5.46679 10.5272 5.44749 10.4223 5.44934C10.3174 5.45119 10.2139 5.47415 10.1181 5.51685C10.0222 5.55955 9.93599 5.62112 9.86446 5.69787L3.61447 11.9479Z" fill="white" />
                </svg>
              </button>
            </div>

            <div className="custom-pagination flex items-center justify-center" ref={paginationRef} />

            <div className="bg-gradient-to-r border border-white p-0.5 px-2 rounded-full !h-13 !w-18 cursor-pointer">
              <button onClick={() => swiperRef.current?.slideNext()} className="bg-black rounded-full w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M21.3855 11.9479C21.5318 12.0944 21.614 12.2929 21.614 12.5C21.614 12.707 21.5318 12.9056 21.3855 13.052L15.1355 19.302C15.064 19.3788 14.9778 19.4404 14.8819 19.4831C14.7861 19.5258 14.6826 19.5487 14.5777 19.5506C14.4728 19.5524 14.3686 19.5331 14.2714 19.4938C14.1741 19.4545 14.0857 19.3961 14.0115 19.3219C13.9374 19.2477 13.8789 19.1593 13.8396 19.062C13.8003 18.9648 13.781 18.8606 13.7828 18.7557C13.7847 18.6508 13.8076 18.5473 13.8503 18.4515C13.893 18.3556 13.9546 18.2694 14.0314 18.1979L18.948 13.2812L4.16679 13.2812C3.95959 13.2812 3.76087 13.1989 3.61436 13.0524C3.46785 12.9059 3.38554 12.7072 3.38554 12.5C3.38554 12.2928 3.46785 12.094 3.61436 11.9475C3.76087 11.801 3.95959 11.7187 4.16679 11.7187L18.948 11.7187L14.0314 6.80204C13.9546 6.73052 13.893 6.64427 13.8503 6.54843C13.8076 6.4526 13.7847 6.34915 13.7828 6.24425C13.781 6.13935 13.8003 6.03515 13.8396 5.93788C13.8789 5.8406 13.9374 5.75223 14.0115 5.67804C14.0857 5.60385 14.1741 5.54537 14.2714 5.50608C14.3687 5.46679 14.4728 5.44749 14.5777 5.44934C14.6826 5.45119 14.7861 5.47415 14.8819 5.51685C14.9778 5.55955 15.064 5.62112 15.1355 5.69787L21.3855 11.9479Z" fill="white" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreVenues;
