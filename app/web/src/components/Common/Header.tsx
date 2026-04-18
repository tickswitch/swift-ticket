import { headerLogo, headerSearchIcon, logo } from "@/assets";
import { Link, NavLink, useLocation } from "react-router";
import { useNavigate } from "react-router";
import Hamburger from "hamburger-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { useCallback, useEffect, useState } from "react";
import { GetSingleData, PostData, setAuthToken } from "@/API/API";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Loader from "./Loader";

const NavElement = [
  { path: "/howitworks", label: "How it works" },
  { path: "/howtosell", label: "How to sell" },
  { path: "/about", label: "Partner with us" },
  // { path: "/magazine", label: "Magazine" },
  // { path: "/auth/login", label: "Log in" },
];
const AuthNavElement = [
  { path: "/tickets", label: "Your Tickets" },
  { path: "/listing", label: "Your Listing" },
];

const NavItem = () => {
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
const NavItem3 = () => {
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
    onError: (err) => {
      // toast.error(err?.message || "Logout failed");
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
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"events" | "cities">("events"); // Track active tab

  const navOpen = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const GoToHome = () => {
    navigate("/");
  };

  const token = localStorage.getItem("token");

  // --- Debounce ---
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 900);
    return () => clearTimeout(handler);
  }, [query]);

  // --- Fetch Suggestions cities---
  const { data, isLoading, error } = useQuery({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => GetSingleData(`cities/search?query=${debouncedQuery}`),
    enabled: !!debouncedQuery && activeTab === "cities", // only fetch if query isn't empty and cities tab is active
  });
  const location = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "{}"
  );
  // --- Fetch Suggestions events---
  const {
    data: eventsData,
    isLoading: eventsDataLoading,
    error: eventsDataError,
  } = useQuery({
    queryKey: ["events", debouncedQuery], // Fixed: changed from "cities" to "events"
    queryFn: () =>
      GetSingleData(
        // `events?query=${debouncedQuery}&radius=50&lat=${location.lat}&lng=${location.lon}`
        `events?query=${debouncedQuery}&radius=50&lat=${location.lat}&lng=${location.lon}`
      ),
    enabled: !!debouncedQuery && activeTab === "events", // only fetch if query isn't empty and events tab is active
  });

  const handleSelect = useCallback((city: string) => {
    setQuery(city);
    setIsFocused(false);
  }, []);

  // Get suggestions based on active tab
  const suggestions = activeTab === "events" ? eventsData : data;
  const isLoadingData = activeTab === "events" ? eventsDataLoading : isLoading;
  const errorData = activeTab === "events" ? eventsDataError : error;

  console.log("suggestions", suggestions);
  return (
    <div className="z-20 ">
      <div className="max-w-[1720px] px-5 md:px-10 mx-auto my-0 rounded-2xl py-4 flex items-center justify-between gap-5 fixed top-0 left-1/2 -translate-x-1/2 w-[94%] md:w-[94%] lg:w-[95%] z-50 bg-[#000000]/50">
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

        {/* Search */}
        <div className="hidden bg-white rounded-4xl md:flex items-center justify-between px-5 py-2 md:py-1 lg:py-2 2xl:w-1/3 xl:w-3/12 relative">
          <input
            className="focus:outline-none font-proximaRegular text-sm w-full"
            type="search"
            placeholder="Find events, artists, venues, or cities effortlessly"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay to allow click
            onChange={(e) => setQuery(e.target.value)}
          />
          <img
            src={headerSearchIcon}
            alt="Search Icon"
            className="ml-2 w-5 h-5"
          />
          {/* Suggestions Dropdown */}
          {isFocused && debouncedQuery && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded w-fit shadow-lg z-50 max-h-60 overflow-y-auto overflow-x-hidden">
              {/* Categories */}
              <div className="flex items-start justify-start gap-5 px-4 py-2 bg-primary/10 fixed w-fit border-4">
                <button
                  onClick={() => setActiveTab("events")}
                  className={cn(
                    "font-semibold px-3 rounded-md",
                    activeTab === "events"
                      ? "text-white bg-primary001"
                      : "text-primary001"
                  )}
                >
                  Events
                </button>
                <button 
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   setActiveTab("cities")
                  // }}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    setActiveTab("cities");
                  }}
                  className={cn(
                    "font-semibold px-3 rounded-md",
                    activeTab === "cities"
                      ? "text-white bg-primary001"
                      : "text-primary001"
                  )}
                >
                  Cities
                </button>
              </div>
              {isLoadingData && (
                <div className="px-4 py-2 text-gray-500 text-sm h-40 flex items-center justify-center">
                  <Loader parentClass="h-fit" size={30} />
                </div>
              )}

              {errorData && (
                <div className="px-4 py-2 text-red-500 text-sm pt-20">
                  Failed to load suggestions
                </div>
              )}

              {!isLoadingData &&
                (!suggestions ||
                  (activeTab === "cities"
                    ? suggestions?.cities?.length === 0
                    : suggestions?.length === 0)) && (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No results found
                  </div>
                )}

              <div className="pt-14">
                {activeTab === "cities" &&
                  suggestions?.cities?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      onMouseDown={() => {
                        handleSelect(item.city);
                        navigate(
                          `/events?lat=${item.latitude}&lng=${item.longitude}`
                        );
                        window.location.reload();
                      }}
                      className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                    >
                      {item?.city}, {item?.country}
                    </div>
                  ))}
                {activeTab === "events" &&
                  suggestions &&
                  suggestions?.data?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      onMouseDown={() => {
                        // Handle event selection - adjust based on your event data structure
                        handleSelect(item.name || item.title);
                        // Navigate to event detail or handle as needed
                      }}
                      className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                    >
                      {item?.name || item?.title}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        {/* Nav */}
        <div className=" hidden md:block">
          {token ? <NavItem3 /> : <NavItem />}
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

      {/* mobile menu */}
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
