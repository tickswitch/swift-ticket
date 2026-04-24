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
    <ul className="flex flex-col gap-3">
      {NavElement.map((item, index) => (
        <li key={index} className="text-white/80 font-proximaRegular text-base hover:text-white transition-colors">
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
      {/* Footer Top — Partner Logos */}
      <div className="bg-[#133240] py-5">
        <Container>
          <Marquee direction="right" pauseOnHover={true}>
            <div className="flex items-center justify-evenly gap-5 sm:gap-10 lg:gap-16">
              <div className="pl-5 sm:pl-10 lg:pl-16">
                <p className="text-white sm:text-2xl text-xl font-proximaSemiBold">
                  10000+ Loyal Partner
                </p>
                <p className="text-white sm:text-xl text-base font-proximaRegular">
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
                <img className="h-[30px] sm:h-auto" src={droupbox} />
              </div>
              <div>
                <img className="h-[30px] sm:h-auto" src={webflow} />
              </div>
            </div>
          </Marquee>
        </Container>
      </div>

      {/* Footer Main */}
      <div className="bg-black py-16" data-testid="footer-main">
        <Container className="grid md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="w-full flex flex-col gap-4 md:col-span-1" data-testid="footer-brand-column">
            <div className="flex items-center">
              <img src={logo} alt="SwiftTickets" />
              <p className="text-primary001 text-2xl font-proximaBold">
                SwiftTickets
              </p>
            </div>
            <p className="text-white/70 font-proximaRegular text-sm leading-relaxed" data-testid="footer-description">
              India's trusted fan-to-fan ticket marketplace. Buy and sell
              tickets safely with SecureSwap protection.
            </p>
            <button className="w-full max-w-[300px] cursor-pointer flex gap-1 items-center justify-center mt-2 bg-white rounded-4xl py-2">
              <img src={fbtn} alt="" />
              <p className="text-[#181818] font-proximaRegular text-base">
                How it works
              </p>
            </button>
          </div>

          {/* Menu Column — desktop */}
          <div className="w-full md:flex justify-center hidden" data-testid="footer-menu-column">
            <div>
              <p className="text-white font-proximaSemiBold text-xl mb-6">Menu</p>
              <NavItem />
            </div>
          </div>

          {/* Support Column — desktop */}
          <div className="w-full md:flex justify-center hidden" data-testid="footer-support-column">
            <div>
              <p className="text-white text-xl font-proximaSemiBold mb-6">
                Support
              </p>
              <div className="flex flex-col gap-3 text-white/70 font-proximaRegular text-base">
                <p className="cursor-pointer hover:text-white transition-colors">Terms & Conditions</p>
                <p className="cursor-pointer hover:text-white transition-colors">Privacy Policy</p>
                <p className="cursor-pointer hover:text-white transition-colors">Help & FAQs</p>
              </div>
            </div>
          </div>

          {/* Right Column — Follow Us + App Stores */}
          <div className="w-full flex flex-col gap-8" data-testid="footer-right-column">
            {/* Follow Us — desktop */}
            <div className="hidden md:block">
              <p className="text-white text-xl font-proximaSemiBold mb-6">
                Follow Us
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={facebook} alt="Facebook" />
                  <p className="text-white/70 font-proximaRegular text-base">Facebook</p>
                </div>
                <div className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={twitor} alt="Twitter" />
                  <p className="text-white/70 font-proximaRegular text-base">Twitter</p>
                </div>
                <div className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={instagram} alt="Instagram" />
                  <p className="text-white/70 font-proximaRegular text-base">Instagram</p>
                </div>
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center flex-col">
                <div className="cursor-pointer bg-white border border-[#A6A6A6] rounded-xl py-2 px-8">
                  <img className="w-[100px] h-[25px]" src={fapple} alt="App Store" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <img src={star} alt="" />
                  <p className="text-white/60 font-proximaRegular text-xs">
                    4.7 - 9000 + reviews
                  </p>
                </div>
              </div>
              <div className="flex items-center flex-col">
                <div className="cursor-pointer bg-white border border-[#A6A6A6] rounded-xl py-2 px-8">
                  <img className="w-[100px] h-[25px]" src={fplayStore} alt="Google Play" />
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <img src={star} alt="" />
                  <p className="text-white/60 font-proximaRegular text-xs">
                    4.7 - 9000 + reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only: Menu + Support + Follow */}
          <div className="md:hidden flex flex-col gap-8 col-span-full">
            <div className="flex justify-between gap-8">
              <div>
                <p className="text-white font-proximaSemiBold text-xl mb-4">Menu</p>
                <NavItem />
              </div>
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-white text-xl font-proximaSemiBold mb-4">Support</p>
                  <div className="flex flex-col gap-3 text-white/70 font-proximaRegular text-sm">
                    <p className="cursor-pointer">Terms & Conditions</p>
                    <p className="cursor-pointer">Privacy Policy</p>
                    <p className="cursor-pointer">Help & FAQs</p>
                  </div>
                </div>
                <div>
                  <p className="text-white text-xl font-proximaSemiBold mb-4">Follow Us</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center cursor-pointer">
                      <img src={facebook} alt="Facebook" />
                      <p className="text-white/70 font-proximaRegular text-sm">Facebook</p>
                    </div>
                    <div className="flex gap-2 items-center cursor-pointer">
                      <img src={twitor} alt="Twitter" />
                      <p className="text-white/70 font-proximaRegular text-sm">Twitter</p>
                    </div>
                    <div className="flex gap-2 items-center cursor-pointer">
                      <img src={instagram} alt="Instagram" />
                      <p className="text-white/70 font-proximaRegular text-sm">Instagram</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div className="bg-[#303030]">
        <Container>
          <p className="py-4 text-[#A6AAB5] font-proximaRegular sm:text-sm text-xs text-center">
            Copyright &copy; 2025. SwiftTickets. All rights reserved.
          </p>
        </Container>
      </div>
    </div>
  );
};

export default Footer;
