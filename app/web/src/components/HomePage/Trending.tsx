import React from "react";
import { ArrowIcon, ClockIcon } from "./EventsIcons";
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
import Title from "../Common/Title";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "@/API/API";
import { ImageProvider } from "../Common/ImageProvider"; 
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { useDateFormat } from "@/lib/formatDate";

const Trending: React.FC = () => {
  // Create refs using React.useRef instead of the imported useRef
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);
  const swiperRef = React.useRef<SwiperClass | null>(null);

  const latlong = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );
  type TrendingEvent = {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    image: string;
  };
  
  const { data, isLoading, error } = useQuery<TrendingEvent[], Error>({
    queryKey: ["trending"],
    queryFn: () =>
      GetData(`events/trending-nearby?lat=${latlong?.lat}&lng=${latlong?.lon}`),
  });

  const { formatDate } = useDateFormat();

  return (
    <div className="pt-12 relative">
      <div className="flex justify-between items-center">
        <div>
          <Title>Trending near you</Title>
          <p className="text-secondaryText001">
            Find events right up your alley.
          </p>
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
        <ErrorText />
      ) : data && data.length < 1 ? (
        <ErrorText>No Event found</ErrorText>
      ) : (
        <div className="pt-3">
          <div className="">
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
              {data &&
                data?.map((data, index) => {
                  const formattedDate = formatDate(data?.date, data?.time);
                  return (
                    <SwiperSlide key={index}>
                      <Link
                        to={`/event-details/${data?.id}`}
                        className="md:basis-1/2 lg:basis-1/3 hover:-translate-y-2 transition-all duration-300"
                      >
                        <div className="p-1 relative w-full h-full rounded-2xl overflow-hidden rounded-b-3xl">
                          <img
                            src={data?.image || ImageProvider?.eventimg}
                            alt={data?.title || ""}
                            className="rounded-2xl w-full h-96 object-cover"
                          />
                          <div className="absolute bottom-3 w-[90%] left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md p-4 rounded-xl flex flex-col gap-1 md:gap-2">
                            <p className="flex items-center justify-between text-white text-xl md:text-2xl line-clamp-2">
                              {data?.title}
                              {/* <span className="cursor-pointer">
                            <BookmarkIcon />
                          </span> */}
                            </p>
                            <p className="text-white/70">{data?.venue}, {data?.location}</p>
                            <p className="text-[#FEC100] flex items-center gap-2">
                              <ClockIcon />
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trending;
