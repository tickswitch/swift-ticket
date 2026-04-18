const SellYourTicket = () => {
  return (
    <div className="bg-[#181818] 2xl:px-0 px-5">
      <div className="max-w-[1119px] mx-auto flex flex-col items-center py-10">
        {/* Title */}
        <div>
          <p className="text-white sm:text-4xl text-2xl font-proximaSemiBold text-center">
          Online ticket sales have never been easier
          </p>
        </div>
        {/* Button */}

        <div className=" cursor-pointer mt-5 bg-primary001 rounded-4xl px-8 py-3">
          <button className="cursor-pointer">
            <p className="text-white font-proximaRegular text-base">Sell your ticket </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellYourTicket;
