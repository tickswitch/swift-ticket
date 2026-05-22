import { headerLogo, headerSearchIcon, logo } from "@/assets";
import { Link, NavLink, useLocation } from "react-router";
import { useNavigate } from "react-router";
import Hamburger from "hamburger-react";
import { useMutation } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";
import { PostData, setAuthToken } from "@/API/API";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Wallet } from "lucide-react";
import { SearchOverlay } from "./SearchOverlay";

const NavElement = [
  { path: "/howitworks", label: "How it works" },
  { path: "/howtosell", label: "How to sell" },
  { path: "/about", label: "Partner with us" },
];
const AuthNavElement = [
  { path: "/tickets", label: "Your Tickets" },
  { path: "/listing", label: "Your Listing" },
];

const NavItem = ({ onSearchOpen }: { onSearchOpen: () => void }) => {
  const token = localStorage.getItem("token");

  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => PostData("logout"),
    onSuccess: () => {
      toast.success("Logout Successfull");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("user");
      setAuthToken("");
    },
    onError: (err) => {
      toast.error(err?.data?.response?.message || "Logout Failed");
    },
  });

  const handleLogOut = () => {
    logout.mutate();
  };

  return (
    <ul className="flex items-center 2xl:gap-[65px] xl:gap-10 lg:gap-5 gap-3">
      {NavElement.map((item, index) => (
        <li
          key={index}
          className="text-white font-proximaSemiBold xl:text-lg text-nowrap lg:text-base text-sm "
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
        <button
          onClick={onSearchOpen}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          aria-label="Search"
          data-testid="search-icon-button"
        >
          <img src={headerSearchIcon} alt="Search" className="w-5 h-5" />
        </button>
      </li>
      {token ? (
        <button
          onClick={handleLogOut}
          className="text-white font-proximaSemiBold xl:text-lg text-nowrap lg:text-base text-sm "
        >
          {logout.isPending ? <>Login out...</> : <>Logout</>}
        </button>
      ) : (
        <li className="text-white font-proximaSemiBold xl:text-lg text-nowrap lg:text-base text-sm ">
          <NavLink
            to={"/auth/login"}
            className={({ isActive }) =>
              isActive ? "underline underline-offset-5" : ""
            }
          >
            Login
          </NavLink>
        </li>
      )}
    </ul>
  );
};

const NavItem1 = () => {
  return (
    <ul className="flex flex-col  gap-2">
      {NavElement.map((item, index) => (
        <li key={index} className="text-black font-proximaSemiBold text-lg">
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
    </ul>
  );
};

const NavItem3 = ({ onSearchOpen }: { onSearchOpen: () => void }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => PostData("logout"),
    onSuccess: () => {
      toast.success("Logout successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: () => {
      toast.success("Logout successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  const handleLogout = () => {
    logout.mutate();
  };

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
        <button
          onClick={onSearchOpen}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          aria-label="Search"
          data-testid="search-icon-button"
        >
          <img src={headerSearchIcon} alt="Search" className="w-5 h-5" />
        </button>
      </li>
      <li>
        <NavLink
          to={"/cart"}
          className={cn(
            "border border-primary001 rounded-full text-white px-5 xl:py-1 py-0.5 hover:bg-primary001 hover:text-white transition-all duration-300",
            pathname === "/cart" && "bg-primary001 text-white"
          )}
        >
          Cart
        </NavLink>
      </li>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full w-10 h-10 bg-white/10 flex items-center justify-center ">
            <User className="text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-56" align="start">
          <DropdownMenuItem onClick={() => setOpen(false)}>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(false)}>
            <NavLink to="/howitworks">How It Works</NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(false)}>
            <NavLink to="/howtosell">How to sell</NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(false)}>
            <NavLink to="/about">About</NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(false)}>
            <NavLink to="/help">Help</NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(false)}>
            <NavLink to="/account/payout" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Payouts
            </NavLink>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ul>
  );
};

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navOpen = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const GoToHome = () => {
    navigate("/");
  };

  const token = localStorage.getItem("token");

  return (
    <div className="z-20 ">
      <div className="w-full px-5 md:px-10 py-4 flex items-center justify-between gap-5 fixed top-0 left-0 z-50 bg-[#000000]/50">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={GoToHome}>
          <img
            className="w-full h-full md:w-6 md:h-6 lg:w-full lg:h-full"
            src={headerLogo}
            alt="Logo"
          />
          <p className="font-proximaBold text-white xl:text-3xl text-3xl lg:text-2xl md:text-lg  ">
            SwiftTickets
          </p>
        </div>

        {/* Nav */}
        <div className=" hidden md:block">
          {token ? <NavItem3 onSearchOpen={() => setIsSearchOpen(true)} /> : <NavItem onSearchOpen={() => setIsSearchOpen(true)} />}
        </div>
        <div className="bolck md:hidden">
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            color="white"
            size={24}
          />
        </div>
      </div>

      {/* Search overlay — desktop only trigger, but overlay itself handles mobile too */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile menu — unchanged */}
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
                  {/* Search Bar — mobile sheet (unchanged) */}
                  <div className=" mt-5 bg-white border border-primary001 rounded-4xl flex items-center justify-between px-5 py-2 w-full ">
                    <input
                      className="focus:outline-none font-proximaRegular text-sm w-full"
                      type="search"
                      placeholder="Search events, artists, venues or cities..."
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
                  <div className="text-black font-proximaSemiBold text-lg">
                    <NavLink to={"/tickets"}>Your tickets</NavLink>
                  </div>
                  <div className="text-black font-proximaSemiBold text-lg">
                    <NavLink to={"/listing"}>Your Listing</NavLink>
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

export default Header;
