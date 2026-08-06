import { iPhone13, Notification, PaymentPhone,ShareMedia } from "@/assets";
import Container from "../Common/Container";
const FansOfSwifTickets = () => {
  return (
    <div className="bg-[#F4F4F4] py-[50px]">
    <Container className="flex flex-col items-center">
      {/* Tittle */}
      <div className="">
        <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold text-center">
        Discover Why Fans Love SwiftTickets
        </p>
        <p className="text-[#606060] sm:text-2xl text-lg font-proximaRegular text-center"> Whether you're missing a concert, festival, theater show, museum visit, or sports event, selling your ticket is seamless. Fans trust SwiftTickets—why not give it a try and see for yourself?</p>
      </div>

      {/* Cart */}
      <div className="mt-6 grid  md:grid-cols-2 grid-cols-1 gap-y-4 gap-x-4">
        
        {/* Payment */}
        <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-4 rounded-xl">
          <img src={PaymentPhone} />
          <p className="text-[#181818] font-proximaSemiBold sm:text-2xl text-xl text-center">
          Sell Tickets Quickly & Get Paid Fast
          </p>
          <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
          With 9 out of 10 tickets selling successfully, you can count on a smooth process. Once your ticket sells, your earnings are transferred promptly—hitting your bank account within 5 business days.
          </p>
        </div>

        {/* Connected Phone */}
        <div className=" cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-4 rounded-xl  overflow-hidden">
          <img className="w-[128px] h-[165px] object-cover" src={iPhone13} />
          <p className="text-[#181818] font-proximaSemiBold sm:text-2xl text-xl text-center">
          A Safe & Fair Marketplace for Every Fan
          </p>
          <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
          Sell your tickets to another excited fan at a fair price on SwiftTickets. With verified buyers and sellers, transparent fees, and a secure process, you can trade with confidence.
          </p>
        </div>

        {/* Share */}
        <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-4 rounded-xl">
          <img src={ShareMedia} />
          <p className="text-[#181818] font-proximaSemiBold sm:text-2xl text-xl text-center">
          Join over 14 million fans across 46 countries and growing!
          </p>
          <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
          Become part of the band and share or sell tickets with ease—whether privately or even on the day of the event. We’re a community united by our love for great experiences!
          </p>
        </div>

        {/* Notification */}
        <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-4 rounded-xl">
          <img src={Notification} />
          <p className="text-[#181818] font-proximaSemiBold sm:text-2xl text-xl text-center">
          Committed support for a seamless experience
          </p>
          <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
          Whether it's two months before the gig or you're at the door, our Support team is always ready to assist and will know exactly how to help.
          </p>
        </div>
      </div>
    </Container>
  </div>
  );
};

export default FansOfSwifTickets;
