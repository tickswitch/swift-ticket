import { CheckIcon } from "lucide-react";

const CheckElement = () => {
  return (
    <div className="bg-[#F4F4F4] pb-[50px]">

      <div className=" lg:flex-row lg:items-stretch lg:justify-between gap-4 flex flex-col">

        <div className="rounded-md py-4 px-2 flex-1 flex flex-col items-start justify-start ">
          {/* <img src={cartright} /> */}
          <div className="flex items-start gap-2">
            <CheckIcon className="!text-primary001" size={35}/>
            <div>
              <p className="text-black font-proximaRegular text-xl text-left flex items-start gap-2">
                Seller and tickets anti-fraud checks
              </p>
              <p className="text-[#949494] text-base font-proximaRegular text-left">
                Our system analyses tickets, and we vet sellers for extra safety.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md py-4 px-2  flex-1 flex flex-col items-start justify-start ">
          {/* <img src={cartright} /> */}
          <div className="flex items-start gap-2">
            <CheckIcon className="!text-primary001" size={30}/>
            <div>
              <p className="text-black font-proximaRegular text-xl text-left flex items-start gap-2">
               Support if tickets does not work
              </p>
              <p className="text-[#949494] text-base font-proximaRegular text-left">
                Issues at the door? We will help sort out a refund.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md py-4 px-2  flex-1 flex flex-col items-start justify-start  ">
          {/* <img src={cartright} /> */}
          <div className="flex items-start gap-2">
            <CheckIcon className="!text-primary001" size={35}/>
            <div>
              <p className="text-black font-proximaRegular text-xl text-left flex items-start gap-2">
                We’re trusted by millions
              </p>
              <p className="text-[#949494] text-base font-proximaRegular text-centerleftw-3/4">
              More than 15 million happy fans in 46 countries & counting.
              </p>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
};

export default CheckElement;
