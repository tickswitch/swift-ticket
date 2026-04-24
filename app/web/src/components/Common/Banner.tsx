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
  DateIcon,
  LocationIcon,
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
    <div className="w-full relative hero-orbs">
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
          reverseDirection: true,
        }}
        speed={2000}
        className="overflow-hidden"
      >
        <SwiperSlide className="overflow-hidden ">
          <Slider1 />
        </SwiperSlide>
        <SwiperSlide className="overflow-hidden">
          <Slider2 />
        </SwiperSlide>
        <SwiperSlide className="overflow-hidden">
          <Slider3 />
        </SwiperSlide>
        <SwiperSlide className="overflow-hidden">
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
          className="w-[1720px] h-[466px] object-cover"
          src={bannerBg5}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 overflow-hidden" />

      <div className="mx-auto w-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-proximaSemiBold text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
            Buy & Sell Tickets Securely
          </p>
          <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
            Fast, Safe, and Hassle-Free!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={"/events"}
            data-testid="hero-cta-find-tickets"
            style={{ backgroundColor: "#2563EB" }}
            className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Find Tickets
          </Link>
          <Link
            to={"/sell-tickets"}
            data-testid="hero-cta-sell-tickets"
            style={{ borderColor: "#2563EB", color: "#2563EB" }}
            className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors"
          >
            Sell Your Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

const Slider2 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-top object-cover"
          src={bannerBg4}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 overflow-hidden" />

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
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={"/events"}
            data-testid="hero-cta-find-tickets"
            style={{ backgroundColor: "#2563EB" }}
            className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Find Tickets
          </Link>
          <Link
            to={"/sell-tickets"}
            data-testid="hero-cta-sell-tickets"
            style={{ borderColor: "#2563EB", color: "#2563EB" }}
            className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors"
          >
            Sell Your Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};
const Slider3 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-cover"
          src={bannerBg3}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 overflow-hidden" />

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
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={"/events"}
            data-testid="hero-cta-find-tickets"
            style={{ backgroundColor: "#2563EB" }}
            className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Find Tickets
          </Link>
          <Link
            to={"/sell-tickets"}
            data-testid="hero-cta-sell-tickets"
            style={{ borderColor: "#2563EB", color: "#2563EB" }}
            className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors"
          >
            Sell Your Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};
const Slider4 = () => {
  return (
    <div className="overflow-hidden relative">
      <div>
        <img
          className="w-[1720px] h-[466px] object-cover"
          src={bannerBg2}
        />
      </div>

      <div className=" absolute top-0 right-0 w-[1720px] h-[466px] bg-[#178AFF] mix-blend-hue overflow-hidden" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60" />

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
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={"/events"}
            data-testid="hero-cta-find-tickets"
            style={{ backgroundColor: "#2563EB" }}
            className="font-proximaSemiBold text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity"
          >
            Find Tickets
          </Link>
          <Link
            to={"/sell-tickets"}
            data-testid="hero-cta-sell-tickets"
            style={{ borderColor: "#2563EB", color: "#2563EB" }}
            className="font-proximaSemiBold bg-white rounded-full px-6 py-2.5 border-2 hover:bg-gray-50 transition-colors"
          >
            Sell Your Tickets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
