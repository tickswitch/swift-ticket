import { eventImg1, eventImg3 } from "@/assets";
import { Dropdown } from "../Common/Dropdown";
import { CheckIcon, IndicatorIcon } from "./EventsIcons";
import { Link } from "react-router";
import Title from "../Common/Title";

const Event = () => {
  const location = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );

  return (
    <div className="pt-8">
      {/* Discover tab + location pill row */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap py-3 border-b border-gray-200"
        data-testid="discover-location-row"
      >
        <button
          type="button"
          data-testid="discover-tab"
          className="text-[#181818] text-base md:text-lg font-semibold pb-1 border-b-2 border-[#2563EB]"
        >
          Discover
        </button>
        <Dropdown />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 pb-4 pt-6">
        <Title className="sm:pb-4">Find Events</Title>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-4">
        <div className="relative hover:-translate-y-2 transition-all duration-300 h-[420px]">
          <div className="w-[657px] h-[100px] md:h-[445px]  rounded-2xl relative">
            <img
              src={eventImg3}
              alt="event image"
              className="w-full h-full rounded-2xl"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-2xl" />
            {/* texts */}

            <Link
              to={`/events?lat=${location?.lat}&lng=${location?.lon}&radius=50`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl max-w-[274px] h-[80px] md:h-[135px]  p-8 bg-white/10 backdrop-blur-md flex items-center justify-center"
              style={{ border: "1px solid rgba(255, 255, 255, 0.15)" }}
            >
              <p className="font-semibold text-lg sm:text-2xl md:text-[28px] lg:text-[32px] xl:text-[36px] text-white text-center">
                Find Events And Explore
              </p>
            </Link>
            <div className="absolute bottom-2 sm:bottom-5 left-5 w-[95%] text-white flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-5 justify-between  ">
              <div className="flex items-start gap-2">
                <p>
                  <CheckIcon />
                </p>
                <p className="text-xs md:text-sm lg:text-base max-w-[150px]">
                  Join 15.1 million fans in buying and selling tickets safely.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <p>
                  <CheckIcon />
                </p>
                <p className="text-xs md:text-sm lg:text-base max-w-[150px]">
                  Fair pricing – capped at just 20% above face value
                </p>
              </div>
              <div className="flex items-start gap-2">
                <p>
                  <CheckIcon />
                </p>
                <p className="text-xs md:text-sm lg:text-base max-w-[150px]">
                  Partnered with 6,000+ events for primary tickets
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:grid sm:grid-cols-2 flex flex-wrap items-center justify-center gap-4 w-full">
          <div className="relative w-full max-w-full lg:max-w-[312px] h-[204px] rounded-2xl hover:-translate-y-2 transition-all duration-300">
            <img src={eventImg1} alt="" className="rounded-2xl w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Link
                to={`/events?period=today&lat=${location?.lat}&lng=${location?.lon}`}
                className="text-xl text-white text-center flex items-center gap-2"
              >
                Today{" "}
                <p className="bg-white rounded-full">
                  <IndicatorIcon />
                </p>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-full lg:max-w-[312px] h-[204px] rounded-2xl hover:-translate-y-2 transition-all duration-300">
            <img src={eventImg1} alt="" className="rounded-2xl w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Link
                to={`/events?period=tomorrow&lat=${location?.lat}&lng=${location?.lon}`}
                className="text-xl text-white text-center flex items-center gap-2"
              >
                Tomorrow
                <p className="bg-white rounded-full">
                  <IndicatorIcon />
                </p>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-full lg:max-w-[312px] h-[204px] rounded-2xl hover:-translate-y-2 transition-all duration-300">
            <img src={eventImg1} alt="" className="rounded-2xl w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Link
                to={`/events?period=this-week&lat=${location?.lat}&lng=${location?.lon}`}
                className="text-xl text-white text-center flex items-center gap-2 text-nowrap"
              >
                This week
                <p className="bg-white rounded-full">
                  <IndicatorIcon />
                </p>
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-full lg:max-w-[312px] h-[204px] rounded-2xl hover:-translate-y-2 transition-all duration-300">
            <img src={eventImg1} alt="" className="rounded-2xl w-full h-full" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Link
               to={`/events?lat=${location?.lat}&lng=${location?.lon}`}
                className="text-xl text-white text-center flex items-center gap-2 text-nowrap"
              >
                Explore all
                <p className="bg-white rounded-full">
                  <IndicatorIcon />
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event;
