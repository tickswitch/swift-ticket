import { Link } from "react-router";

const SellNow = () => {
  return (
    <div className="bg-[#181818] 2xl:px-0 px-5">
      <div className="max-w-[1119px] mx-auto flex flex-col items-center py-10">
        {/* Title */}
        <div>
          <p className="text-white sm:text-4xl  text-2xl font-proximaSemiBold  text-center">
            Set to Sell Your Tickets?
          </p>
        </div>
        {/* Button */}

        <Link
          to={"/sell-tickets"}
          className=" cursor-pointer mt-5 bg-primary001 rounded-4xl px-8 py-2"
        >
          <button className="cursor-pointer">
            <p className="text-white font-proximaRegular text-base">Sell now</p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SellNow;
