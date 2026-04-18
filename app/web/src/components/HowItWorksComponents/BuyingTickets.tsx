import { btn } from "@/assets";
import Container from "../Common/Container";

const BuyingTickets = () => {
  return (
    <div className="bg-gradient-to-r from-[#E5E5E8] via-white to-[#E5E5E8]">
      <Container className="flex flex-col items-center">
        {/* Title */}
        <div className="pt-[50px] pb-6">
          <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold text-center">
            Buying Tickets Made Simple
          </p>
        </div>

        {/* Cart  */}
        <div className="grid md:grid-cols-2 grid-cols-1  gap-x-2 gap-y-[10px]">
          {/* Card 1 */}
          <div className="cursor-pointer hover:-translate-y-1 duration-300  w-full p-5 bg-white border border-[#E7EAEC] rounded-lg">
            <p className="text-[#181818] sm:text-2xl text-xl  font-proximaSemiBold">
              Instant Ticket Delivery
            </p>
            <p className="text-[#606060] mt-2 sm:text-xl text-base font-proximaRegular">
              Find the ticket you need, pay securely online, and receive it
              immediately. Every ticket listed is pre-uploaded by the seller, so
              there’s no waiting—just instant access.
            </p>
          </div>
          {/* Card 2 */}
          <div className="cursor-pointer hover:-translate-y-1 duration-300  w-full p-5 bg-white border border-[#E7EAEC] rounded-lg">
            <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
              Strict Security Checks
            </p>
            <p className="text-[#606060] mt-2 sm:text-xl text-base font-proximaRegular ">
              Your safety comes first. We prevent fraud with thorough user
              verification and trusted partnerships with event organizers. Want
              to know more about our security measures?
            </p>
          </div>
          {/* Card 3 */}
          <div className="cursor-pointer hover:-translate-y-1 duration-300  w-full p-5 bg-white border border-[#E7EAEC] rounded-lg">
            <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
              Full Transparency
            </p>
            <p className="text-[#606060] mt-2 sm:text-xl text-base font-proximaRegular ">
              Know exactly who you’re buying from. View the seller’s name,
              profile photo, social media connections, and their history of
              selling tickets on our platform. More trust, more confidence.
            </p>
          </div>
          {/* Card 4 */}
          <div className="cursor-pointer hover:-translate-y-1 duration-300  w-full p-5 bg-white border border-[#E7EAEC] rounded-lg">
            <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
              Fair Pricing, No Surprises
            </p>
            <p className="text-[#606060] mt-2 sm:text-xl text-base font-proximaRegular ">
              We ensure fair pricing by capping markups at 20% above face value.
              No hidden fees, no inflated costs—just a safe and affordable way
              to buy tickets.
            </p>
          </div>
        </div>

        {/* Button  */}
        <div className=" cursor-pointer mt-4  bg-primary001 rounded-4xl px-5 py-2 w-50 mb-[50px]">
          <button className="cursor-pointer flex gap-1 items-center justify-center">
            <img src={btn} />
            <p className="text-white font-proximaRegular text-base">
              See How it works
            </p>
          </button>
        </div>
      </Container>
    </div>
  );
};

export default BuyingTickets;
