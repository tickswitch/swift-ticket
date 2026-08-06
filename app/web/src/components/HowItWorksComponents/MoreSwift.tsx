import { headerLogo } from "@/assets";

const MoreSwift = () => {
  return (
    <div className="bg-[#181818] 2xl:px-0 px-5">
      <div className="max-w-[1119px] mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="mt-10">
          <img className="sm:h-[60px] sm:w-[60px] w-[50px] h-[50px]" src={headerLogo} />
        </div>
        {/* Title */}
        <div>
          <p className="text-white sm:text-4xl text-3xl font-proximaSemiBold">
            SwiftTickets
          </p>
        </div>
        {/* Description */}
        <div className="mt-3">
          <p className="text-white font-proximaRegular sm:text-xl text-base text-center">
            India's trusted fan-to-fan ticket marketplace — verified sellers,
            price-capped listings, and payment held safe until your ticket is
            confirmed real.
          </p>
        </div>
        {/* Button */}

        <div className=" cursor-pointer mt-6  bg-primary001 rounded-4xl px-7 py-2 w-56 mb-[50px]">
          <button className="cursor-pointer flex gap-1 items-center justify-center">
            <p className="text-white font-proximaRegular text-base">
              More about SwiftTickets
            </p>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MoreSwift;
