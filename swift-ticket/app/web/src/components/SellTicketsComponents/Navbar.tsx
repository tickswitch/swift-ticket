import { headerSearchIcon, logo } from "@/assets";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router";
import { useNavigate } from "react-router";
import Hamburger from "hamburger-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";

const NavElement = [
  { path: "/howitworks", label: "How it works" },
  { path: "/howtosell", label: "How to sell" },
  { path: "/about", label: "Partner with us" },
];
const AuthNavElement = [
  { path: "/tickets", label: "Your Tickets" },
  { path: "/listing", label: "Your Listing" },
];
const NavItem = () => {
  const { pathname } = useLocation();
  return (
    <ul className="flex items-center 2xl:gap-[65px] xl:gap-10 lg:gap-5 gap-3">
      {NavElement.map((item, index) => (
        <li
          key={index}
          className="text-secondaryText001 font-proximaSemiBold xl:text-lg text-nowrap lg:text-base text-base "
        >
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive ? "underline underline-offset-5" : ""
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
      <li>
        <NavLink
          to={"/help"}
          className={cn(
            "border border-primary001 rounded-full text-primary001 px-5 xl:py-1 py-0.5 hover:bg-primary001 hover:text-white transition-all duration-300",
            pathname === "/help" && "bg-primary001 text-white"
          )}
        >
          Help
        </NavLink>
      </li>
    </ul>
  );
};

const NavItem1 = () => {
  const { pathname } = useLocation();
  return (
    <ul className="flex flex-col  gap-3">
      {NavElement.map((item, index) => (
        <li
          key={index}
          className="text-secondaryText001 font-proximaSemiBold text-lg"
        >
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive ? "underline underline-offset-5" : ""
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
      <li className="mt-2">
        <NavLink
          to={"/help"}
          className={cn(
            "border border-primary001 rounded-full text-primary001 px-10 py-2 hover:bg-primary001 hover:text-white transition-all duration-300",
            pathname === "/help" && "bg-primary001 text-white"
          )}
        >
          Help
        </NavLink>
      </li>
    </ul>
  );
};
const NavItem3 = () => {
  const { pathname } = useLocation();
  return (
    <ul className="flex items-center 2xl:gap-[65px] xl:gap-10 lg:gap-5 gap-3">
      {AuthNavElement.map((item, index) => (
        <li
          key={index}
          className="text-white font-proximaSemiBold xl:text-lg text-nowrap lg:text-base text-base "
        >
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive ? "underline underline-offset-5" : ""
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
      <li>
        <NavLink
          to={"/cart"}
          className={cn(
            "border border-primary001 rounded-full text-primary001 px-5 xl:py-1 py-0.5 hover:bg-primary001 hover:text-white transition-all duration-300",
            pathname === "/cart" && "bg-primary001 text-white"
          )}
        >
          Cart
        </NavLink>
      </li>
      <li>
        <NavLink
          to={"/help"}
          className={cn(
            "border border-primary001 rounded-full text-primary001 px-5 xl:py-1 py-0.5 hover:bg-primary001 hover:text-white transition-all duration-300",
            pathname === "/help" && "bg-primary001 text-white"
          )}
        >
          Help
        </NavLink>
      </li>
    </ul>
  );
};

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);

  const navOpen = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const GoToHome = () => {
    navigate("/");
  };
  const token = localStorage.getItem("token");

  return (
    <div className="bg-white">
      <div className="max-w-[1720px] mx-auto  px-5 lg:px-10 py-4 flex items-center justify-between   w-full z-50 ">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={GoToHome}>
          <img
            className="w-full h-full md:w-6 md:h-6 lg:w-full lg:h-full"
            src={logo}
            alt="Logo"
          />
          <p className="font-proximaBold text-primary001 xl:text-3xl text-3xl lg:text-2xl md:text-lg ">
            SwiftTickets
          </p>
        </div>

        {/* Search */}
        <div className="hidden bg-white rounded-4xl md:flex items-center justify-between px-5 lg:py-2 py-1 w-1/3  relative">
          <input
            className="focus:outline-none font-proximaRegular text-sm w-full border border-gray-300 lg:py-2 py-1 px-5 pe-10 rounded-full"
            type="search"
            placeholder="Find events, artists, venues, or cities effortlessly"
          />
          <img
            src={headerSearchIcon}
            alt="Search Icon"
            className="ml-2 w-5 h-5 absolute top-1/2 right-10 -translate-y-1/2"
          />
        </div>

        {/* Nav */}
        <div className=" hidden md:block">
          {token ? <NavItem3 /> : <NavItem />}
        </div>

        <div className="bolck md:hidden">
          <Hamburger toggled={isOpen} toggle={setOpen} size={24} />
        </div>
      </div>
      {/* mobile */}
      <div>
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                <div className="flex flex-col  gap-3 mt-5">
                  {/* Logo */}
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={GoToHome}
                  >
                    <img src={logo} alt="Logo" />
                    <p className="font-proximaBold text-primary001 text-3xl">
                      SwiftTickets
                    </p>
                  </div>
                  {/* Search Bar */}

                  <div className=" mt-5 bg-white border border-primary001 rounded-4xl flex items-center justify-between px-5 py-2 w-full ">
                    <input
                      className="focus:outline-none font-proximaRegular text-sm w-full"
                      type="search"
                      placeholder="Find events, artists, venues, or cities effortlessly"
                    />
                    <img
                      src={headerSearchIcon}
                      alt="Search Icon"
                      className="ml-2 w-5 h-5"
                    />
                  </div>

                  {/* NavElement */}
                  <div className="mt-3" onClick={navOpen}>
                    <NavItem1 />
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
