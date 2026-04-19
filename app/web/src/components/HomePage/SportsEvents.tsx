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
              spaceBetween={50}
              slidesPerView={3}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
            >
              <SwiperSlide>
                <Link
                  to={`/events?genre=Basketball${locationCoords?.lat ? `&lat=${locationCoords.lat}&lng=${locationCoords.lon}` : ""}`}
                  className="w-full bg-primary001/10 px-2 py-2 rounded-2xl flex flex-col items-start gap-3 hover:-translate-y-2 transition-all duration-300"
                >
                  <img
                    src={data?.Basketball?.[0]?.image || ""}
                    className="w-full h-[200px] rounded-md object-cover"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1 w-full ps-3">
                      <div className="flex items-center justify-between w-full">
                        <p className="font-semibold text-base md:text-lg line-clamp-1">
                          Basketball
                        </p>
                      </div>
                      <p className="px-2 border border-gray-400 rounded-full w-fit text-xs">
                        Sports
                      </p>
                    </div>
                    {/* <button>
                  <BookmarkIcon2 />
                </button> */}
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link
                  to={`/events?genre=Hockey${locationCoords?.lat ? `&lat=${locationCoords.lat}&lng=${locationCoords.lon}` : ""}`}
                  className="w-full bg-primary001/10 px-2 py-2 rounded-2xl flex flex-col items-start gap-3 hover:-translate-y-2 transition-all duration-300"
                >
                  <img
                    src={data?.Hockey?.[0]?.image || ""}
                    className="w-full h-[200px] rounded-md object-cover"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1 w-full ps-3">
                      <div className="flex items-center justify-between w-full">
                        <p className="font-semibold text-base md:text-lg line-clamp-1">
                          Hockey
                        </p>
                      </div>
                      <p className="px-2 border border-gray-400 rounded-full w-fit text-xs">
                        Sports
                      </p>
                    </div>
                    {/* <button>
                  <BookmarkIcon2 />
                </button> */}
                  </div>
                </Link>
              </SwiperSlide>
              <SwiperSlide>
                <Link
                  to={`/events?genre=Football${locationCoords?.lat ? `&lat=${locationCoords.lat}&lng=${locationCoords.lon}` : ""}`}
                  className="w-full bg-primary001/10 px-2 py-2 rounded-2xl flex flex-col items-start gap-3 hover:-translate-y-2 transition-all duration-300"
                >
                  <img
                    src={data?.Football?.[0]?.image || ""}
                    className="w-full h-[200px] rounded-md object-cover"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1 w-full ps-3">
                      <div className="flex items-center justify-between w-full">
                        <p className="font-semibold text-base md:text-lg line-clamp-1">
                          Football
                        </p>
                      </div>
                      <p className="px-2 border border-gray-400 rounded-full w-fit text-xs">
                        Sports
                      </p>
                    </div>
                    {/* <button>
                  <BookmarkIcon2 />
                </button> */}
                  </div>
                </Link>
              </SwiperSlide>
             
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsEvents;
