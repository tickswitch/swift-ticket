import { apple, phone1, phone2, playStore } from "@/assets";
import Container from "../Common/Container";

const GetApp = () => {
  return (
    <div className="bg-[#F4F4F4] pb-[50px]">
      <Container className="md:flex-row  flex flex-col">
        {/* Blue Part */}
        <div className="sm:block hidden bg-primary001 md:rounded-l-2xl md:rounded-r-none rounded-r-2xl rounded-l-2xl rounded-b-none   lg:w-[560px] sm:h-[491px] h-[300px] md:w-[660px]  w-full relative overflow-hidden">
          <div>
            <img
              className="h-[700px]  w-[850px] absolute -top-25 lg:right-12 md:right-2  sm:right-20  object-cover"
              src={phone1}
            />
          </div>

          <div>
            <img
              className="absolute top-0 lg:right-10 md:right-0 sm:right-32 right-15  object-cover"
              src={phone2}
            />
          </div>
        </div>

        {/* Black Part */}

        <div className="bg-[#181818] rounded-t-2xl sm:rounded-t-none flex flex-col justify-center md:rounded-r-2xl md:rounded-bl-none rounded-b-2xl lg:w-[760px] md:w-[660px] w-full sm:h-[491px] h-[300px] pl-[50px] px-5">
          <p className="text-white sm:text-4xl text-3xl font-proximaSemiBold">
            Get the app
          </p>
          <p className="text-white sm:text-2xl text-base  font-proximaRegular">
            Buy & Sell Tickets Securely
          </p>
          <p className="text-white sm:text-2xl text-base font-proximaRegular">
            Enjoy faster ticket alerts, curated recs and more!
          </p>
          <div className="mt-4 sm:flex-row sm:items-center gap-2  flex flex-col">
            <div className="cursor-pointer bg-[#0C0D10] w-[151px] h-[44px] border border-[#A6A6A6] py-2 px-5 rounded-sm">
              <button className="cursor-pointer">
                <img src={apple} />
              </button>
            </div>
            <div className="cursor-pointer  w-[151px] h-[44px]  bg-[#0C0D10] border border-[#A6A6A6]  py-2 px-5 rounded-sm">
              <button className="cursor-pointer">
                <img src={playStore} />
              </button>
            </div>
          </div>
        </div>
        
      </Container>
    </div>
  );
};

export default GetApp;
