import { Notification, PaymentPhone, ScanPhone, ShareMedia } from "@/assets";
import Container from "../Common/Container";

const SellTickets = () => {
  return (
    <div className="bg-[#F4F4F4] py-[50px]">
      <Container className="flex flex-col items-center">
        {/* Tittle */}
        <div className="">
          <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold text-center">
            Selling Tickets Made Simple
          </p>
        </div>

        {/* Cart */}
        <div className="mt-6 grid  md:grid-cols-2 grid-cols-1 gap-y-3 gap-x-2">
          {/* Upload */}
          <div className=" cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-3 rounded-xl">
            <img src={ScanPhone} />
            <p className="text-[#181818] font-proximaSemiBold sm:text-2xl  text-xl text-center">
              📤 Upload Your Ticket & Choose What to Sell
            </p>
            <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
              Simply upload your file and select the tickets you want to sell.
              If you're selling multiple tickets from a bundle, just upload the
              original file—we'll auto-split it and let you keep the ones you
              don’t want to sell.
            </p>
          </div>
          {/* Payment */}
          <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-3 rounded-xl">
            <img src={PaymentPhone} />
            <p className="text-[#181818] font-proximaSemiBold sm:text-2xl  text-xl text-center">
              💰 Set Your Price & Add Payment Details
            </p>
            <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
              Decide on your selling price (capped at 20% above face value to
              keep things fair) and enter your bank account details for secure
              payment processing.
            </p>
          </div>

          {/* Share */}
          <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-3 rounded-xl">
            <img src={ShareMedia} />
            <p className="text-[#181818] font-proximaSemiBold sm:text-2xl  text-xl text-center">
              📢 Boost Your Listing on Social Media
            </p>
            <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
              Want to sell faster? Easily share your listing on Facebook and X
              to reach more buyers. You can also sell privately to a specific
              person if needed.
            </p>
          </div>

          {/* Notification */}
          <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white border border-[#E7EAEC] sm:p-8 p-5 flex flex-col items-center gap-3 rounded-xl">
            <img src={Notification} />
            <p className="text-[#181818] font-proximaSemiBold sm:text-2xl  text-xl text-center">
              🔔 Get Notified & Paid
            </p>
            <p className="text-[#606060] font-proximaRegular sm:text-xl text-base text-center">
              Once your ticket sells, you’ll get an instant notification—and
              your money will be transferred within 5 business days. No extra
              steps, no hassle!
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="cursor-pointer mt-4  bg-[#181818] rounded-4xl px-7 py-2 w-40">
          <button className="cursor-pointer flex gap-1 items-center justify-center">
            <p className="text-white font-proximaRegular text-base">
              Sell your ticket
            </p>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default SellTickets;
