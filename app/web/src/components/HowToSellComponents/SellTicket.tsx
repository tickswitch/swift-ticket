import {
  cart,
  doublePhone,
  googlePixel,
  iPhone,
  playButton,
} from "@/assets";
import Container from "@/components/Common/Container";
const SellTicket = () => {
  return (
    <div className="bg-[#F4F4F4] py-[50px]">
      <Container>
        {/* Title */}
        <div>
          <p className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold text-center ">
            Sell Your Tickets in Just 4 Simple Steps
          </p>
          <p className="text-[#404A60] sm:text-xl text-base font-proximaRegular text-center">
            Setting up an account takes just minutes—add a few details and start
            selling your tickets effortlessly. Here’s how it works!
          </p>
        </div>

        {/* Card */}
        <div className="mt-4 grid md:grid-cols-2  grid-cols-1 gap-5">
          {/* Sign Up */}

          <div className="flex  gap-6 cursor-pointer hover:-translate-y-2 duration-300 bg-white rounded-xl border border-[#E7EAEC] sm:p-8  p-5">
            {/* Cart Image  */}
            <div className="overflow-hidden ">
              <img src={iPhone} />
            </div>
            {/* Card Text */}
            <div>
              <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
                Sign Up or Log In
              </p>
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular line-clamp-3">
                New here? Creating an account is quick and easy! Already a
                member? Just log in. Pro tip: Try using the app for a seamless
                experience!
              </p>
            </div>
          </div>

          {/* Link */}
          <div className=" cursor-pointer hover:-translate-y-2 duration-300 bg-white rounded-xl border border-[#E7EAEC] sm:p-8  p-5 flex items-center gap-6">
            {/* Cart Image  */}
            <div className="h-[120px] w-[140px] overflow-hidden">
              <img className="h-[120px] w-[140px]" src={cart} />
            </div>
            {/* Card Text */}
            <div>
              <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
                Link Your Account Details
              </p>
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular line-clamp-3">
                For security and smooth transactions, we’ll verify your details
                to ensure everything is safe and legit.
              </p>
            </div>
          </div>

          {/* Choose Event */}
          <div className=" cursor-pointer hover:-translate-y-2 duration-300 bg-white rounded-xl border border-[#E7EAEC] sm:p-8  p-5 flex items-center gap-6">
            {/* Cart Image  */}
            <div>
              <img className="h-[120px] w-[130px] " src={googlePixel} />
            </div>
            {/* Card Text */}
            <div>
              <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold ">
                Choose Event & Upload Tickets
              </p>
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular line-clamp-3">
                Pick your event, specify your ticket type, and set your selling
                price—all in just a few clicks.
              </p>
            </div>
          </div>

          {/* List Share */}
          <div className="cursor-pointer hover:-translate-y-2 duration-300 bg-white rounded-xl border border-[#E7EAEC] sm:p-8 p-5 flex items-center gap-6">
            {/* Cart Image  */}
            <div className="">
              <img
                className="h-[120px] w-[140px] "
                src={doublePhone}
              />
              
            </div >
            {/* Card Text */}
            <div className="">
              <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
                List, Share & Get Paid!
              </p>
              <p className="text-[#606060] sm:text-xl text-base font-proximaRegular line-clamp-3">
                Post your tickets, spread the word on social media, and get paid
                quickly once they sell!
              </p>
            </div>
          </div>



          {/* PlayButton */}
          <div className=" cursor-pointer hover:-translate-y-2 duration-300 bg-primary001 rounded-xl border border-[#E7EAEC] sm:p-8 p-5 flex items-center gap-6">
            {/* Cart Image  */}
            <div>
              <img className="w-[50px] h-[50px]" src={playButton} />
            </div>
            {/* Card Text */}
            <div>
              <p className="text-white sm:text-4xl text-xl font-proximaSemiBold">
                {" "}
                Got tickets to sell?
              </p>
            </div>
          </div>

          {/* Watch */}
          <div className=" cursor-pointer hover:-translate-y-2 duration-300 bg-white rounded-xl border border-[#E7EAEC] sm:p-8 p-5 flex items-center gap-6">
            {/* Card Text */}
            <div>
              <p className="text-[#181818] sm:text-2xl text-xl font-proximaSemiBold">
                {" "}
                Watch how to sell tickets online from start to finish
              </p>
              <p className="text-[#606060] sm:text-xl text-base  font-proximaRegular">
                English • 1:27
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SellTicket;
