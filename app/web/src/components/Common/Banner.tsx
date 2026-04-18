// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar"; 

import { bannerBg2, bannerBg3, bannerBg4, bannerBg5 } from "@/assets";
import {
  ActionIcon,
  DateIcon,
  GoingIcon,
  InterestIcon,
  LocationIcon,
  ShareIcon,
  StatidumIcon,
} from "@/assets/Banner/svg/BannerSvg";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "../HomePage/EventsIcons";
import { Link } from "react-router";

const Banner = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      swiperRef.current.params.navigation
    ) {
      // override navigation elements AFTER refs are available
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      // re-init navigation
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="max-w-[1720px] mx-auto my-0 relative rounded-2xl">
      <div className="flex gap-4 ">
        <button
          ref={prevRef}
          className="absolute top-1/2 left-4 z-20 w-10 h-10 flex items-center justify-center bg-primary001 rounded-full"
          aria-label="Previous"
        >
          <ArrowLeftIcon />
        </button>
        <button
          ref={nextRef}
          className="absolute top-1/2 right-5 z-20 w-10 h-10 flex items-center justify-center bg-primary001 rounded-full "
          aria-label="Next"
        >
          <ArrowRightIcon />
        </button>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        speed={2000}
        className="!rounded-2xl overflow-hidden"
      >
        <SwiperSlide className="rounded-2xl overflow-hidden ">
          <Slider1 />
        </SwiperSlide>
        <SwiperSlide className="rounded-2xl overflow-hidden">
          <Slider2 />
        </SwiperSlide>
        <SwiperSlide className="rounded-2xl overflow-hidden">
          <Slider3 />
        </SwiperSlide>
        <SwiperSlide className="rounded-2xl overflow-hidden">
          <Slider4 />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

const Slider1 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-cover rounded-2xl"
          src={bannerBg5}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] rounded-2xl bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 rounded-2xl overflow-hidden" />

      <div className="mx-auto w-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-proximaSemiBold text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
            Buy & Sell Tickets Securely
          </p>
          <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            Fast, Safe, and Hassle-Free!
          </p>
        </div>
        <Link
          to={"/sell-tickets"}
          className="bg-primary001 px-5 py-2 rounded-4xl w-39"
        >
          <button className="font-proximaSemiBold text-white">
            Sell your tickets
          </button>
        </Link>
      </div>
    </div>
  );
};

const Slider2 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-top object-cover rounded-2xl"
          src={bannerBg4}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] rounded-2xl bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-2xl overflow-hidden" />

      <div className="mx-auto w-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-proximaSemiBold text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
            IND vs PAK T20 Match 2025
          </p>
          <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            From the Abu Dhabi Grand Prix to Pirelli Gran Premio D'Italia, and
            beyond
          </p>
          <div className="flex flex-wrap items-center justify-center  pt-3 gap-3">
            <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
              <DateIcon />
              25, Apr 2025
            </button>
            <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
              <LocationIcon />
              25, Apr 2025
            </button>
            <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
              <StatidumIcon />
              Stadium, India
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center  pt-3 gap-3">
            <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
              <InterestIcon />
              Interested
            </button>
            <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
              <GoingIcon />
              Going
            </button>
            <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
              <ShareIcon />
              Share
            </button>
            <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
              <ActionIcon />
            </button>
          </div>
        </div>
        <Link
          to={"/sell-tickets"}
          className="bg-primary001 px-5 py-2 rounded-4xl w-39"
        >
          <button className="font-proximaSemiBold text-white">
            Sell your tickets
          </button>
        </Link>
      </div>
    </div>
  );
};
const Slider3 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-cover rounded-2xl"
          src={bannerBg3}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] rounded-2xl bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-2xl overflow-hidden" />

      <div className="mx-auto w-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-proximaSemiBold text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
            The Secure Way to Buy & Sell E-Tickets
          </p>
          <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            SwiftTickets offers a safe, hassle-free, and fair platform to buy
            and sell e-tickets for concerts, festivals, sports events, theatre,
            and more. With rigorous security checks and trusted partnerships, we
            ensure a fraud-free experience.
          </p>
        </div>
        <Link
          to={"/sell-tickets"}
          className="bg-primary001 px-5 py-2 rounded-4xl w-39"
        >
          <button className="font-proximaSemiBold text-white">
            Sell your tickets
          </button>
        </Link>
      </div>
    </div>
  );
};
const Slider4 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-cover rounded-2xl"
          src={bannerBg2}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] rounded-2xl bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 rounded-2xl" />

      <div className="mx-auto w-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-proximaSemiBold text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
            The Secure Way to Buy & Sell E-Tickets
          </p>
          <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            SwiftTickets offers a safe, hassle-free, and fair platform to buy
            and sell e-tickets for concerts, festivals, sports events, theatre,
            and more. With rigorous security checks and trusted partnerships, we
            ensure a fraud-free experience.
          </p>
        </div>
        <Link
          to={"/sell-tickets"}
          className="bg-primary001 px-5 py-2 rounded-4xl w-39"
        >
          <button className="font-proximaSemiBold text-white">
            Sell your tickets
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
