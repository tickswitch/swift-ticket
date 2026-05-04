import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetSingleData } from "@/API/API";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "./Loader";
import { MapPin, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DropdownProps {
  defaultLocation?: string;
  onLocationSelect?: (location: string) => void;
}

interface City {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface CitiesResponse {
  cities: City[];
}

interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state_district?: string;
    state?: string;
  };
}

export function Dropdown({
  defaultLocation = "Bengaluru",
  onLocationSelect,
}: DropdownProps) {
  const [userLocation, setUserLocation] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<string>(defaultLocation);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- Fetch Suggestions (existing city search API) ---
  const { data, isLoading, error } = useQuery<CitiesResponse>({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => GetSingleData(`cities/search?query=${debouncedQuery}`),
    enabled: !!debouncedQuery && debouncedQuery.length > 0,
  });

  // Load saved location on mount; default to "Bengaluru" if nothing stored
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
      onLocationSelect?.(savedLocation);
    } else {
      setSelectedLocation(defaultLocation);
    }
    setIsLocationLoaded(true);
  }, [onLocationSelect, defaultLocation]);

  // Background geolocation for the "userLocation" hint (non-blocking)
  useEffect(() => {
    if (!isLocationLoaded) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = (await response.json()) as NominatimResponse;
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "";
          if (city) setUserLocation(city);

          const savedLocation = localStorage.getItem("selectedLocation");
          if (!savedLocation && city) {
            setSelectedLocation(city);
            onLocationSelect?.(city);
            localStorage.setItem(
              "selectedLocationCoords",
              JSON.stringify({ lat: latitude, lon: longitude })
            );
          }
        } catch {
          // ignore background resolution errors
        }
      },
      () => {
        /* silent; user can click "Use my location" explicitly */
      }
    );
  }, [isLocationLoaded, onLocationSelect]);

  // Geolocation fetch helper (triggered by "Use my location")
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise<{ city: string; lat: number; lon: number } | null>(
      (resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = (await response.json()) as NominatimResponse;
              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                data.address?.state_district ||
                data.address?.state ||
                "";
              if (!city) {
                resolve(null);
                return;
              }
              localStorage.setItem(
                "selectedLocationCoords",
                JSON.stringify({ lat: latitude, lon: longitude })
              );
              localStorage.setItem("selectedLocation", city);
              resolve({ city, lat: latitude, lon: longitude });
            } catch {
              resolve(null);
            }
          },
          () => resolve(null),
          { timeout: 10000 }
        );
      }
    );
  }, []);

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Could not detect location");
      return;
    }
    setDetecting(true);
    const locData = await getCurrentLocation();
    setDetecting(false);
    if (locData) {
      setSelectedLocation(locData.city);
      onLocationSelect?.(locData.city);
      setIsOpen(false);
      window.location.reload();
    } else {
      toast.error("Could not detect location");
    }
  };

  const handlePickCity = (value: string) => {
    if (value === "Other") {
      setIsModalOpen(true);
      setIsOpen(false);
      return;
    }
    setSelectedLocation(value);
    onLocationSelect?.(value);
    localStorage.setItem("selectedLocation", value);
    setIsOpen(false);
    window.location.reload();
  };

  // Handle city selected from the API-backed search modal (unchanged)
  const handleCitySelect = useCallback(
    (city: City) => {
      setCustomLocation(city.city);
      setSelectedLocation(city.city);
      onLocationSelect?.(city.city);
      localStorage.setItem("selectedLocation", city.city);
      localStorage.setItem(
        "selectedLocationCoords",
        JSON.stringify({
          lat: city.latitude,
          lon: city.longitude,
        })
      );
      setIsModalOpen(false);
      setCustomLocation("");
      setShouldShowDropdown(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    [onLocationSelect]
  );

  // Show the in-modal suggestions dropdown only when the user types
  useEffect(() => {
    if (customLocation.trim() && isModalOpen) {
      setShouldShowDropdown(true);
    } else if (!customLocation.trim()) {
      setShouldShowDropdown(false);
    }
  }, [customLocation, isModalOpen]);

  // Debounce search input
  useEffect(() => {
    if (customLocation.trim()) {
      setIsTyping(true);
      const handler = setTimeout(() => {
        setDebouncedQuery(customLocation.trim());
        setIsTyping(false);
      }, 1000);
      return () => clearTimeout(handler);
    } else {
      setDebouncedQuery("");
      setIsTyping(false);
    }
  }, [customLocation]);

  // Click outside closes the pill dropdown
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen]);

  const loc = localStorage.getItem("selectedLocation");

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative inline-block"
        data-testid="location-pill-wrapper"
      >
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          data-testid="location-pill-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#181818] hover:border-[#2563EB] transition-colors"
        >
          <MapPin size={16} className="text-[#2563EB]" />
          <span data-testid="location-pill-city">{selectedLocation}</span>
          <ChevronDown
            size={16}
            className={
              "text-[#606060] transition-transform " +
              (isOpen ? "rotate-180" : "rotate-0")
            }
          />
        </button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
            role="listbox"
            data-testid="location-pill-dropdown"
          >
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={detecting}
              data-testid="location-use-my-location"
              className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-[#2563EB] hover:bg-[#F0F6FF] transition-colors disabled:opacity-60"
            >
              {detecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <MapPin size={16} />
              )}
              {detecting ? "Detecting..." : "Use my location"}
            </button>

            <div className="border-t border-gray-100 px-3 py-2">
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Search city..."
                data-testid="location-pill-search"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[#181818] outline-none placeholder:text-gray-400 focus:border-[#2563EB] focus:bg-white"
              />
            </div>

            <ul
              className="max-h-64 overflow-y-auto py-1"
              data-testid="location-pill-list"
            >
              {/* API-driven suggestions while typing */}
              {debouncedQuery && (
                <>
                  {isLoading && (
                    <li className="px-4 py-2 flex items-center justify-center">
                      <Loader parentClass="h-fit" size={20} />
                    </li>
                  )}
                  {!isTyping && !isLoading && error && (
                    <li className="px-4 py-2 text-xs text-red-500">
                      Failed to load suggestions
                    </li>
                  )}
                  {!isTyping &&
                    !isLoading &&
                    !error &&
                    data?.cities &&
                    data.cities.length === 0 && (
                      <li className="px-4 py-2 text-xs text-gray-500">
                        No results found
                      </li>
                    )}
                  {!isTyping &&
                    !isLoading &&
                    !error &&
                    data?.cities?.map((item: City, idx: number) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            handleCitySelect(item);
                          }}
                          data-testid={`location-city-${item.city}`}
                          className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-50 transition-colors"
                        >
                          {item.city}
                          <span className="text-gray-400">
                            {item.country ? `, ${item.country}` : ""}
                          </span>
                        </button>
                      </li>
                    ))}
                </>
              )}

              {/* Default list when no search query */}
              {!debouncedQuery && (
                <>
                  {userLocation && userLocation !== selectedLocation && (
                    <li>
                      <button
                        type="button"
                        onClick={() => handlePickCity(userLocation)}
                        data-testid="location-nearby-city"
                        className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-50 transition-colors"
                      >
                        {userLocation}{" "}
                        <span className="text-xs text-gray-400">(Nearby)</span>
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      data-testid="location-current-city"
                      className="w-full text-left px-4 py-2 text-sm bg-[#F0F6FF] text-[#2563EB] font-semibold"
                      aria-selected="true"
                      role="option"
                    >
                      {selectedLocation}
                    </button>
                  </li>
                  {loc && loc !== selectedLocation && loc !== userLocation && (
                    <li>
                      <button
                        type="button"
                        onClick={() => handlePickCity(loc)}
                        className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-50 transition-colors"
                      >
                        {loc}
                      </button>
                    </li>
                  )}
                  <li>
                    <button
                      type="button"
                      onClick={() => handlePickCity("Other")}
                      data-testid="location-other"
                      className="w-full text-left px-4 py-2 text-sm text-[#181818] hover:bg-gray-50 transition-colors"
                    >
                      Other
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Modal (unchanged — API city search via existing cities/search endpoint) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-3/4 md:w-1/2">
          <DialogHeader>
            <DialogTitle>Enter Custom Location</DialogTitle>
          </DialogHeader>
          <div className="py-4 relative">
            <input
              type="text"
              placeholder="Enter your location"
              value={customLocation}
              onChange={(e) => {
                setCustomLocation(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl outline-0 border"
              autoFocus
            />

            {shouldShowDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] max-h-60 overflow-y-auto">
                {isLoading && (
                  <div className="px-4 py-3 flex items-center justify-center">
                    <Loader parentClass="h-fit" size={30} />
                  </div>
                )}

                {!isTyping && !isLoading && error && (
                  <div className="px-4 py-2 text-red-500 text-sm">
                    Failed to load suggestions
                  </div>
                )}

                {!isTyping &&
                  !isLoading &&
                  !error &&
                  data &&
                  data.cities &&
                  data.cities.length === 0 && (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No results found
                    </div>
                  )}

                {!isTyping &&
                  !isLoading &&
                  !error &&
                  data &&
                  data.cities &&
                  data.cities.length > 0 &&
                  data.cities.map((item: City, idx: number) => (
                    <div
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCitySelect(item);
                      }}
                      className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-pointer"
                    >
                      {item.city}, {item.country}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
