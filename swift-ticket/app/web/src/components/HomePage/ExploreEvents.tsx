import { useEffect, useRef, useState } from "react";
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
import { venus1 } from "@/assets";
import Loader from "@/components/Common/Loader";
import ErrorText from "@/components/Common/ErrorText";

const ExploreVenues = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevBtnRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["venus"],
    queryFn: () => GetData("venues/best"),
  });

  useEffect(() => {
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;

    if (prevBtn && nextBtn) {
      const handlePrev = () => {
        if (swiperRef.current) {
          swiperRef.current.slidePrev();
        }
      };
      const handleNext = () => {
        if (swiperRef.current) {
          swiperRef.current.slideNext();
        }
      };

      prevBtn.addEventListener("click", handlePrev);
      nextBtn.addEventListener("click", handleNext);

      return () => {
        prevBtn.removeEventListener("click", handlePrev);
        nextBtn.removeEventListener("click", handleNext);
      };
    }
  }, []);

  const location = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );

  return (
    <div className="bg-black w-full px-3 md:px-[71px] py-[50px]">
      <div className="text-white flex flex-wrap gap-4  items-center justify-between max-w-[1322px] mx-auto">
        <div>
          <Title>Explore Venues</Title>
          <p className="text-white">Check the agenda of these great locales.</p>
        </div>
        {/* <Link to={"/venues"}>
          <button className="font-medium bg-primary001 px-6 py-2 rounded-full cursor-pointer">
            View All
          </button>
        </Link> */}
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorText />
      ) : (
        <div className="overflow-hidden max-w-[1400px] mx-auto">
          <style>{`
  /* Hide default scrollbar */
  .swiper {
    scrollbar-width: none; /* Firefox */
  }
  .swiper::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }

  .slide-active {
    transform: translateY(-50px);
    transition: transform 0.3s ease;
    z-index: 10;
  }
  .slide-active img {
    width: 780px !important;
    height: 400px !important;
  }
  .slide-active .bottom-section {
    display: block;
  }
  .slide-active .bottom-text {
    display: none;
  }
  .slide-active .overlay {
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
    position: static !important;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100% !important;
    margin-top: 8px;
  }
  .swiper-pagination-bullet {
    background-color: #fff !important;
    opacity: 0.5 !important;
    margin: 0 5px !important;
    width: 8px !important;
    height: 8px !important;
  }
  .swiper-pagination-bullet-active {
    background-color: #fff !important;
    opacity: 1 !important;
  }
`}</style>

          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            modules={[Navigation, Pagination, A11y]}
            slidesPerView={2}
            centeredSlides={true}
            loop={true}
            pagination={{
              clickable: true,
              el: paginationRef.current || ".custom-pagination",
              renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
              },
            }}
            breakpoints={{
              380: {
                slidesPerView: 1,
                spaceBetween: "10",
              },
              640: {
                slidesPerView: 2,
                spaceBetween: "30",
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: "60",
              },
            }}
            className="nft-swiper"
          >
            {data?.slice(0,12)?.map((data, idx) => (
              <SwiperSlide
                key={`index-${idx}`}
                className={idx === activeIndex ? "slide-active" : ""}
              >
                <Link
                  to={`events?venue=${data?.name}&radius=50&lat=${location?.lat}&lng=${location?.lon}`}
                  className="overflow-hidden transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={venus1}
                      alt=""
                      className="w-[429px] h-auto md:h-[285px] object-cover rounded-2xl active:h-auto md:active:h-full active:w-[900px] activeimg"
                    />
                    <div className="bottom-section hidden absolute bottom-5 w-[90%] left-1/2 -translate-x-1/2 px-4 pt-3 pb-4 p-8 bg-white/10 backdrop-blur-lg rounded-2xl">
                      <p className="text-xl sm:text-2xl md:text-[30px] lg:text-[40px] font-semibold text-white">
                        {data?.name || "N/A"}
                      </p>
                      {/* <p className="text-white">
                      Expect two mind blowing days with a huge techno led
                      international lineup.
                    </p> */}
                    </div>
                    <p className="bottom-text absolute bottom-7 left-5 text-[20px] font-semibold text-white">
                      {data?.name}
                    </p>
                    <div className="overlay bg-black/40 absolute top-0 left-0 w-full h-full rounded-2xl" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons and pagination */}
          <div className="flex items-center justify-center gap-4 mt-8 max-w-[350px] mx-auto relative z-40">
            <div
              ref={prevBtnRef}
              className="border border-white p-0.5 px-2 rounded-full h-13 w-18 cursor-pointer"
            >
              <button className="bg-black rounded-full w-full h-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.61447 11.9479C3.46816 12.0944 3.38599 12.2929 3.38599 12.5C3.38599 12.707 3.46816 12.9056 3.61447 13.052L9.86447 19.302C9.93599 19.3788 10.0222 19.4404 10.1181 19.4831C10.2139 19.5258 10.3174 19.5487 10.4223 19.5506C10.5272 19.5524 10.6314 19.5331 10.7286 19.4938C10.8259 19.4545 10.9143 19.3961 10.9885 19.3219C11.0626 19.2477 11.1211 19.1593 11.1604 19.062C11.1997 18.9648 11.219 18.8606 11.2172 18.7557C11.2153 18.6508 11.1924 18.5473 11.1497 18.4515C11.107 18.3556 11.0454 18.2694 10.9686 18.1979L6.05197 13.2812L20.8332 13.2812C21.0404 13.2812 21.2391 13.1989 21.3856 13.0524C21.5322 12.9059 21.6145 12.7072 21.6145 12.5C21.6145 12.2928 21.5322 12.094 21.3856 11.9475C21.2391 11.801 21.0404 11.7187 20.8332 11.7187L6.05197 11.7187L10.9686 6.80204C11.0454 6.73052 11.107 6.64427 11.1497 6.54843C11.1924 6.4526 11.2153 6.34915 11.2172 6.24425C11.219 6.13935 11.1997 6.03515 11.1604 5.93788C11.1211 5.8406 11.0626 5.75223 10.9885 5.67804C10.9143 5.60385 10.8259 5.54537 10.7286 5.50608C10.6313 5.46679 10.5272 5.44749 10.4223 5.44934C10.3174 5.45119 10.2139 5.47415 10.1181 5.51685C10.0222 5.55955 9.93599 5.62112 9.86446 5.69787L3.61447 11.9479Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>

            {/* This is where the pagination bullets will appear */}
            <div
              className="custom-pagination flex items-center justify-center"
              ref={paginationRef}
            ></div>

            <div
              ref={nextBtnRef}
              className="bg-gradient-to-r border border-white p-0.5 px-2 rounded-full !h-13 !w-18 cursor-pointer"
            >
              <button className="bg-black rounded-full w-full h-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.3855 11.9479C21.5318 12.0944 21.614 12.2929 21.614 12.5C21.614 12.707 21.5318 12.9056 21.3855 13.052L15.1355 19.302C15.064 19.3788 14.9778 19.4404 14.8819 19.4831C14.7861 19.5258 14.6826 19.5487 14.5777 19.5506C14.4728 19.5524 14.3686 19.5331 14.2714 19.4938C14.1741 19.4545 14.0857 19.3961 14.0115 19.3219C13.9374 19.2477 13.8789 19.1593 13.8396 19.062C13.8003 18.9648 13.781 18.8606 13.7828 18.7557C13.7847 18.6508 13.8076 18.5473 13.8503 18.4515C13.893 18.3556 13.9546 18.2694 14.0314 18.1979L18.948 13.2812L4.16679 13.2812C3.95959 13.2812 3.76087 13.1989 3.61436 13.0524C3.46785 12.9059 3.38554 12.7072 3.38554 12.5C3.38554 12.2928 3.46785 12.094 3.61436 11.9475C3.76087 11.801 3.95959 11.7187 4.16679 11.7187L18.948 11.7187L14.0314 6.80204C13.9546 6.73052 13.893 6.64427 13.8503 6.54843C13.8076 6.4526 13.7847 6.34915 13.7828 6.24425C13.781 6.13935 13.8003 6.03515 13.8396 5.93788C13.8789 5.8406 13.9374 5.75223 14.0115 5.67804C14.0857 5.60385 14.1741 5.54537 14.2714 5.50608C14.3687 5.46679 14.4728 5.44749 14.5777 5.44934C14.6826 5.45119 14.7861 5.47415 14.8819 5.51685C14.9778 5.55955 15.064 5.62112 15.1355 5.69787L21.3855 11.9479Z"
                    fill="white"
                  />
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
