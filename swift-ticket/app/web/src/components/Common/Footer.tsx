import {
  coinbase,
  droupbox,
  facebook,
  fapple,
  fbtn,
  fplayStore,
  instagram,
  logo,
  slack,
  spofiy,
  star,
  twitor,
  webflow,
} from "@/assets";
import Marquee from "react-fast-marquee";

const NavElement = [
  { path: "/", label: "Home" },
  { path: "/howitworks", label: "How it works" },
  { path: "/howtosell", label: "How to sell" },
  { path: "/about", label: "About us" },
  { path: "/magazine", label: "Magazine" },
  { path: "/jobs", label: "Jobs" },
  { path: "/login", label: "Become a partner" },
  { path: "/login", label: "Become an affiliate" },
];
const NavItem = () => {
  return (
    <ul className=" flex flex-col gap-2">
      {NavElement.map((item, index) => (
        <li key={index} className="text-white font-proximaRegular text-base">
          <NavLink to={item.path}>{item.label}</NavLink>
        </li>
      ))}
    </ul>
  );
};
import Container from "./Container";
import { NavLink } from "react-router";

const Footer = () => {
  return (
    <div>
      {/* Footer Top */}
      <div className="bg-[#133240] py-5">
        <Container>
          <Marquee direction="right" pauseOnHover={true}>
            <div className="flex items-center justify-evenly  gap-5 sm:gap-10 lg:gap-16">
              <div className="pl-5 sm:pl-10 lg:pl-16">
                <p className="text-white sm:text-2xl text-xl  font-proximaSemiBold ">
                  10000+ Loyal Partner
                </p>
                <p className="text-white sm:text-xl text-base  font-proximaRegular ">
                  Become a partner
                </p>
              </div>
              <div>
                <img className="h-[30px] sm:h-auto" src={coinbase} />
              </div>
              <div>
                <img className="h-[30px] sm:h-auto" src={spofiy} />
              </div>
              <div>
                <img className="h-[30px] sm:h-auto" src={slack} />
              </div>
              <div>
                <img className="h-[30px] sm:h-auto"  src={droupbox} />
              </div>
              <div>
                <img className="h-[30px] sm:h-auto" src={webflow} />
              </div>
            </div>
          </Marquee>
        </Container>
      </div>

      {/* Footer */}
      <div className="bg-black py-[50px]">
        <Container className="grid md:grid-cols-3">
          {/*Left Part  */}

          <div className=" w-full flex flex-col gap-4">
            <div className="flex items-center">
              <img src={logo} />
              <p className="text-primary001 text-2xl font-proximaBold">
                SwiftTickets
              </p>
            </div>
            <div>
              <p className="text-white font-proximaRegular">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div>
              <button className="w-full max-w-[300px] cursor-pointer flex gap-1 items-center justify-center  mt-4 sm:mt-1 bg-white rounded-4xl py-2">
                <img src={fbtn} />
                <p className="text-[#181818] font-proximaRegular text-base">
                  How it works
                </p>
              </button>
            </div>
          </div>

          {/* Middle Part */}

          <div className="w-full md:flex justify-center hidden">
            <div>
              <div>
                <p className="text-white font-proximaSemiBold text-xl"> Menu</p>
              </div>
              <div className="mt-5">
                <NavItem />
              </div>
            </div>
          </div>

          {/* Extra when 640 and 768 px */}
          <div className="md:hidden mt-5 mb-5 flex justify-between ">
            <div >
              <div>
                <div>
                  <p className="text-white font-proximaSemiBold text-xl">
                    Menu
                  </p>
                </div>
                <div className="mt-5">
                  <NavItem />
                </div>
              </div>
            </div>

            <div >
              {/* Support */}
              <div >
                <div>
                  <p className="text-white text-xl font-proximaSemiBold">
                    Support
                  </p>
                </div>
                <div className=" mt-5 flex flex-col gap-2 text-white font-proximaRegular text-sm">
                  <p className="cursor-pointer"> Terms & Conditions</p>
                  <p className="cursor-pointer"> Privacy Policy</p>
                  <p className="cursor-pointer"> Help & FAQs</p>
                </div>
              </div>

              {/* Follow  */}
              <div className="mt-5 ">
                <div>
                  <p className="text-white text-xl font-proximaSemiBold">
                    Follow Us
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <div className="flex gap-1 items-center cursor-pointer">
                    <img src={facebook} />
                    <p className="  text-white font-proximaRegular text-sm">
                      Facebook
                    </p>
                  </div>
                  <div className="flex gap-1 items-center cursor-pointer">
                    <img src={twitor} />
                    <p className="  text-white font-proximaRegular text-sm">
                      Twitter
                    </p>
                  </div>
                  <div className="flex gap-1 items-center cursor-pointer">
                    <img src={instagram} />
                    <p className="  text-white font-proximaRegular text-sm">
                      Instagram
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Part */}

          <div className=" w-full flex flex-col gap-6">
            {/* Support And Follow */}
            <div className="md:flex justify-between items-center hidden">
              {/* Support */}
              <div>
                <div className="">
                  <p className="text-white text-xl font-proximaSemiBold">
                    Support
                  </p>
                </div>
                <div className=" mt-5 flex flex-col gap-2 text-white font-proximaRegular text-base">
                  <p className="cursor-pointer"> Terms & Conditions</p>
                  <p className="cursor-pointer"> Privacy Policy</p>
                  <p className="cursor-pointer"> Help & FAQs</p>
                </div>
              </div>

              {/* Follow  */}
              <div>
                <div>
                  <p className="text-white text-xl font-proximaSemiBold">
                    Follow Us
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <div className="flex gap-1 items-center cursor-pointer">
                    <img src={facebook} />
                    <p className="  text-white font-proximaRegular text-base">
                      Facebook
                    </p>
                  </div>
                  <div className="flex gap-1 items-center cursor-pointer">
                    <img src={twitor} />
                    <p className="  text-white font-proximaRegular text-base">
                      Twitter
                    </p>
                  </div>
                  <div className="flex gap-1 items-center cursor-pointer">
                    <img src={instagram} />
                    <p className="  text-white font-proximaRegular text-base">
                      Instagram
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apps */}
            <div className="flex items-center justify-between gap-3">
              {/* Apple Part */}
              <div className=" flex items-center flex-col">
                <div className=" cursor-pointer bg-white border  border-[#A6A6A6] rounded-xl py-2 lg:px-10  2xl:px-12 px-10 md:px-5">
                  <img className="w-[100px] h-[25px]" src={fapple} />
                </div>
                <div className="mt-1 lg:flex items-center  gap-1">
                  <img src={star} />
                  <p className=" mt-1 text-white font-proximaRegular text-xs">
                    4.7 - 9000 + reviews
                  </p>
                </div>
              </div>
              {/* PlayStore */}
              <div className=" flex items-center flex-col">
                <div className=" cursor-pointer bg-white border  border-[#A6A6A6] rounded-xl py-2  lg:px-10 2xl:px-12 px-10 md:px-5 ">
                  <img className="w-[100px] h-[25px]" src={fplayStore} />
                </div>
                <div className="mt-1 lg:flex items-center gap-1 ">
                  <img src={star} />
                  <p className=" mt-1 text-white font-proximaRegular text-xs">
                    4.7 - 9000 + reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer Down */}
      <div className="bg-[#303030]">
        <Container>
          <p className="py-3 text-[#A6AAB5] font-proximaRegular sm:text-sm text-xs text-center">
            Copyright © 2025. LogoIpsum. All rights reserved.
          </p>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
