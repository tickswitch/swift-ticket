import { easy, fair, safe } from "@/assets";
import Container from "../Common/Container";

const WhySwift = () => {
  return (
    <div className="bg-[#F4F4F4]">
      <Container>
        {/* Title */}
        <div className="mb-[20px] pt-[50px]">
          <p className="font-proximaSemiBold sm:text-4xl text-3xl text-[#181818] text-center">
            Why SwiftTickets?
          </p>
        </div>

        {/* Box */}

        <div className="flex flex-col  gap-5  pb-[50px]">
          {/* Safe Box */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer hover:-translate-y-1 duration-300 ">
            <div className="bg-[#2FA75F] sm:p-7 rounded-lg sm:h-[165px] sm:w-[165px] h-[100px] w-[100px] px-2 flex items-center justify-center">
              <div className="sm:w-[80px] sm:h-[80px] w-[50px] h-[50px]">
                <img src={safe} />
              </div>
            </div>
            <div className="bg-white  border border-[#E7EAEC] rounded-lg sm:p-7 sm:h-[165px] h-[130px] py-3 px-5 md:w-[1147px] ">
              <p className="font-proximaSemiBold sm:text-2xl text-xl text-[#2FA75F]">
                Safe
              </p>
              <p className="text-[#606060] font-proximaRegular sm:text-xl text-base line-clamp-3 ">
                At SwiftTickets, security is our top priority. Every ticket and
                seller is verified through strict criteria, and our partnerships
                with event organizers and ticket providers ensure you get 100%
                valid SecureSwap tickets. No scams, no stress—just secure
                transactions.
              </p>
            </div>
          </div>

          {/* Easy Box */}

          <div className=" flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer hover:-translate-y-1 duration-300 ">
            <div className="bg-[#57BAE3] sm:p-7 rounded-lg sm:h-[165px] sm:w-[165px] h-[100px] w-[100px] px-2 flex items-center justify-center">
              <div className="sm:w-[80px] sm:h-[80px] w-[50px] h-[50px]">
                <img src={easy} />{" "}
              </div>
            </div>
            <div className="bg-white  border border-[#E7EAEC] rounded-lg sm:p-7 sm:h-[165px] h-[130px] py-3 px-5  md:w-[1147px] ">
              <p className="font-proximaSemiBold sm:text-2xl text-xl text-[#57BAE3]">
                Easy
              </p>
              <p className="text-[#606060] font-proximaRegular sm:text-xl text-base line-clamp-3">
                Selling a ticket takes just a few clicks—upload your ticket,
                enter the details, and relax. Once your ticket sells, you’ll
                receive your payment within 5 business days. Buying is just as
                simple—pay instantly through our app and get your ticket
                delivered straight to your email and SwiftTickets account. Fast,
                effortless, and seamless.
              </p>
            </div>
          </div>

          {/* Fair Box*/}

          <div className=" flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer hover:-translate-y-1 duration-300 ">
            <div className="bg-[#FEC100] sm:p-7 rounded-lg sm:h-[165px] sm:w-[165px] h-[100px] w-[100px] px-2 flex items-center justify-center">
              <div className="sm:w-[80px] sm:h-[80px] w-[50px] h-[50px]">
                <img src={fair} />{" "}
              </div>
            </div>
            <div className="bg-white  border border-[#E7EAEC] rounded-lg sm:p-7 sm:h-[165px] h-[130px] py-3 px-5 md:w-[1147px] ">
              <p className="font-proximaSemiBold sm:text-2xl text-xl text-[#FEC100]">
                Fair
              </p>
              <p className="text-[#606060] font-proximaRegular sm:text-xl text-base line-clamp-3">
                No price gouging here! At SwiftTickets, we cap markups at just
                20% above face value, ensuring fair pricing for everyone. Enjoy
                your events without worrying about inflated ticket costs.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WhySwift;
