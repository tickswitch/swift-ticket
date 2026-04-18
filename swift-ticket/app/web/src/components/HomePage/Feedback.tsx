import React, { useRef } from "react";
import { ArrowIcon, HalfStarIcon, OutlineIcon, StartIcon } from "./EventsIcons";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperClass from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Title from "../Common/Title";
import { useQuery } from "@tanstack/react-query";
import { GetSingleData } from "@/API/API";
import Loader from "../Common/Loader";

const Feedback: React.FC = () => {
  // Create refs using React.useRef instead of the imported useRef
  const navigationPrevRef = React.useRef<HTMLButtonElement>(null);
  const navigationNextRef = React.useRef<HTMLButtonElement>(null);
  const swiperRef = React.useRef<SwiperClass | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => GetSingleData("reviews"),
  });

  return (
    <div className="pt-12 relative">
      <div className="flex justify-between items-center">
        <div>
          <Title>Our Customer Feedback</Title>
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
      <div className="pt-3">
        <div>
          <style>{`
          .slide-active {
            transform: translateY(-50px);
            transition: transform 0.3s ease;
            z-index: 10; 
          }
            .slide-active img {
            width: 780px !important;
            height: 400px !important;
            // transition: all 0.3s ease;
          }
            .slide-active .bottom-section{
              display:block;
            }
            .slide-active .bottom-text{
              display: none;
            }
             .slide-active .overlay{
             display: none;
             }
          .swiper-slide {
            transition: transform 0.3s ease;
          }
          .nft-swiper {
            padding: 60px 0;
            overflow: visible;
          }
          .swiper-pagination {
            position: static;
            display: flex;
            align-items: center;
          }
          .swiper-pagination-bullet {
            background-color: #181818;
            opacity: 0.5;
            margin: 0 3px;
          }
          .swiper-pagination-bullet-active {
            background-color: #181818;
            opacity: 100;
          }
        `}</style>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="h-96 flex items-center justify-center">
              Something went wrong.
            </p>
          ) : data?.length < 1 ? (
            <p className="h-96 flex items-center justify-center">
              No Feedback found.
            </p>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={3}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination={{
                el: paginationRef.current,
                clickable: true,
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
              {data?.reviews &&
                data?.reviews?.map((data, index) => (
                  <SwiperSlide key={index} className="border rounded-2xl">
                    <div className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-3 flex flex-col items-start gap-3 h-[300px]">
                        <div className="flex items-center justify-between w-full">
                          <img
                            src={data?.user?.avatar_url}
                            alt={data?.name || ""}
                            className="rounded-full w-[67px] h-[67px]"
                          />
                          <span className="cursor-pointer flex items-center gap-1">
                            <StartIcon />
                            <StartIcon />
                            <StartIcon />
                            <HalfStarIcon />
                            <OutlineIcon />
                          </span>
                        </div>
                        <div>
                          <p className="flex items-start justify-between text-xl font-semibold">
                            {data?.user?.name}
                          </p>
                          <p className="text-secondaryText001">
                            {data?.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
          <div
            className="swiper-pagination flex items-center justify-center"
            ref={paginationRef}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
