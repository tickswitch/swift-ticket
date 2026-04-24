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
import { sortByDistance } from "@/lib/sortByDistance";

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
    const handler = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(handler);
  }, [query]);

  // --- Fetch city suggestions ---
  const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useQuery({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => GetSingleData(`cities/search?query=${debouncedQuery}`),
    enabled: !!debouncedQuery && activeTab === "cities",
  });

  // --- Fetch event suggestions via lightweight search endpoint ---
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ["search-events", debouncedQuery],
    queryFn: () => GetSingleData(`search-events?keyword=${encodeURIComponent(debouncedQuery)}`),
    enabled: !!debouncedQuery && activeTab === "events",
  });

  const handleSelect = useCallback((label: string) => {
    setQuery(label);
    setIsFocused(false);
  }, []);

  const userCoords = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");
  const rawEvents: any[] = eventsData?.data?.events ?? (Array.isArray(eventsData?.data) ? eventsData.data : []);
  const eventResults = sortByDistance(rawEvents, userCoords?.lat, userCoords?.lon);

  const cityResults: any[] = citiesData?.cities ?? [];
  const isLoadingData = activeTab === "events" ? eventsLoading : citiesLoading;
  const errorData = activeTab === "events" ? eventsError : citiesError;
  const hasResults = activeTab === "events" ? eventResults.length > 0 : cityResults.length > 0;
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

        {/* Search */}
        <div className="hidden bg-white rounded-4xl md:flex items-center justify-between px-5 py-2 md:py-1 lg:py-2 2xl:w-1/3 xl:w-3/12 relative">
          <input
            className="focus:outline-none font-proximaRegular text-sm w-full"
            type="search"
            placeholder="Search events, artists, venues or cities..."
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
            <div className="absolute top-full left-0 mt-2 w-[480px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Tab bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
                <button
                  onMouseDown={(e) => { e.preventDefault(); setActiveTab("events"); }}
                  className={cn(
                    "text-sm font-semibold px-3 py-1 rounded-full transition-colors",
                    activeTab === "events" ? "bg-primary001 text-white" : "text-primary001 hover:bg-primary001/10"
                  )}
                >
                  Events
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); setActiveTab("cities"); }}
                  className={cn(
                    "text-sm font-semibold px-3 py-1 rounded-full transition-colors",
                    activeTab === "cities" ? "bg-primary001 text-white" : "text-primary001 hover:bg-primary001/10"
                  )}
                >
                  Cities
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {isLoadingData && (
                  <div className="flex items-center justify-center h-32">
                    <Loader parentClass="h-fit" size={28} />
                  </div>
                )}
                {errorData && (
                  <p className="px-4 py-3 text-red-500 text-sm">Failed to load suggestions</p>
                )}
                {!isLoadingData && !errorData && !hasResults && (
                  <p className="px-4 py-4 text-gray-500 text-sm text-center">No results for "{debouncedQuery}"</p>
                )}

                {/* Event results */}
                {activeTab === "events" && eventResults.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onMouseDown={() => {
                      handleSelect(item.title ?? item.name ?? "");
                      navigate(`/event-details/${item.id}`);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary001/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary001 text-xs font-bold">TM</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-black truncate">{item.title ?? item.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {[item.date, item.venue, item.location].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                ))}

                {/* City results */}
                {activeTab === "cities" && cityResults.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    onMouseDown={() => {
                      handleSelect(item.city);
                      navigate(`/events?lat=${item.latitude}&lng=${item.longitude}`);
                      window.location.reload();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">{item.city}</p>
                      <p className="text-xs text-gray-500">{item.country}</p>
                    </div>
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
