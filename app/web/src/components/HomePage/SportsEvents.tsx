import { ArrowIcon } from "./EventsIcons";
import Title from "../Common/Title";
import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperClass from "swiper";

// @ts-expect-error: Swiper CSS modules have no TypeScript declarations
import "swiper/css";
// @ts-expect-error: Navigation CSS module not typed
import "swiper/css/navigation";
// @ts-expect-error: Pagination CSS module not typed
import "swiper/css/pagination";
// @ts-expect-error: Scrollbar CSS module not typed
import "swiper/css/scrollbar";
import React from "react";

const SportsEvents = () => {
  const locationCoords = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const locationQuery = locationCoords?.lat && locationCoords?.lon
    ? `?lat=${locationCoords.lat}&lng=${locationCoords.lon}`
    : "";

  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);
  const swiperRef = React.useRef<SwiperClass | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["events/by-groupe", locationCoords?.lat, locationCoords?.lon],
    queryFn: () => GetData(`events/by-groupe${locationQuery}`),
  });

  return (
    <div className="pt-12">
      <div className="flex items-center justify-between">
        <div>
          <Title>Sports to catch soon</Title>
          {/* <p className="text-secondaryText001">
            Head to popular games or events.
          </p> */}
        </div>
        <div className="flex gap-4">
          <button
            ref={navigationPrevRef}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-black/70 rounded-full"
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowIcon />
          </button>
          <button
            ref={navigationNextRef}
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
        <ErrorText>
          {error?.response?.data?.message || "Something went wrong."}
        </ErrorText>
      ) : data?.length < 1 ? (
        <ErrorText>No Sports Found</ErrorText>
      ) : (
        <div className="py-10">
          <div>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                320: { slidesPerView: 1.5, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
            >
              {(
                [
                  { genre: "Basketball", image: data?.Basketball?.[0]?.image },
                  { genre: "Hockey",     image: data?.Hockey?.[0]?.image     },
                  { genre: "Football",   image: data?.Football?.[0]?.image   },
                ] as { genre: string; image?: string }[]
              ).map(({ genre, image }) => (
                <SwiperSlide key={genre}>
                  <Link
                    to={`/events?genre=${genre}${locationCoords?.lat ? `&lat=${locationCoords.lat}&lng=${locationCoords.lon}` : ""}`}
                    className="block relative rounded-xl overflow-hidden h-[200px] cursor-pointer group"
                  >
                    {/* Full-bleed image */}
                    <img
                      src={image || ""}
                      alt={genre}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Dark gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)",
                      }}
                    />

                    {/* "Events" pill — top left */}
                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                      Events
                    </span>

                    {/* Sport name — bottom left */}
                    <p className="absolute bottom-3 left-3 text-white font-bold text-base">
                      {genre}
                    </p>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsEvents;
