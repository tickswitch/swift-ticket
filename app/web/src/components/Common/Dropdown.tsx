import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetSingleData } from "@/API/API";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "./Loader";

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

export function Dropdown({
  defaultLocation = "Nearby",
  onLocationSelect,
}: DropdownProps) {
  const [userLocation, setUserLocation] = useState<string>("Loading...");
  const [isFocused, setIsFocused] = useState(false);
  const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<string>(defaultLocation);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // --- Fetch Suggestions ---
  const { data, isLoading, error } = useQuery<CitiesResponse>({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => GetSingleData(`cities/search?query=${debouncedQuery}`),
    enabled: !!debouncedQuery && debouncedQuery.length > 0,
  });

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(savedLocation);
      onLocationSelect?.(savedLocation);
    }
    setIsLocationLoaded(true);
  }, [onLocationSelect]);

  // --- Geolocation setup for nearby cities ---
  useEffect(() => {
    if (!isLocationLoaded) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Unknown Location";

          setUserLocation(city);

          const savedLocation = localStorage.getItem("selectedLocation");
          if (!savedLocation) {
            setSelectedLocation(city);
            onLocationSelect?.(city);
            localStorage.setItem(
              "selectedLocationCoords",
              JSON.stringify({ lat: latitude, lon: longitude })
            );
          }
        },
        () => setUserLocation("Select Location")
      );
    }
  }, [isLocationLoaded, onLocationSelect]);

  // --- Geolocation fetch helper ---
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return null;
    }

    return new Promise<{ city: string; lat: number; lon: number } | null>(
      (resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
              );
              const data = await response.json();

              const city =
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                "Unknown Location";

              localStorage.setItem(
                "selectedLocationCoords",
                JSON.stringify({ lat: latitude, lon: longitude })
              );
              localStorage.setItem("selectedLocation", city);

              resolve({ city, lat: latitude, lon: longitude });
            } catch (err) {
              console.error("Error fetching location details", err);
              resolve(null);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            resolve(null);
          }
        );
      }
    );
  }, []);

  // --- Handle dropdown selection ---
  // const handleSelect = async (value: string) => {
  //   if (value === "Other") {
  //     setIsModalOpen(true);
  //   } else {
  //     setSelectedLocation(value);
  //     onLocationSelect?.(value);
  //     localStorage.setItem("selectedLocation", value);
  //     window.location.reload();
  //   }
  // };
  const handleSelect = async (value: string) => {
    if (value === "Other") {
      setIsModalOpen(true);
      return;
    }

    if (value === userLocation || value === "Nearby") {
      // User clicked default/current location → trigger API
      const locData = await getCurrentLocation();
      if (locData) {
        setSelectedLocation(locData.city);
        onLocationSelect?.(locData.city);
        window.location.reload();
      } else {
        setSelectedLocation("Unknown Location");
      }
      return;
    }

    // Normal custom selection
    setSelectedLocation(value);
    onLocationSelect?.(value);
    localStorage.setItem("selectedLocation", value);
    window.location.reload();
  };

  // --- Handle custom location with city data ---
  const handleCitySelect = useCallback(
    (city: City) => {
      setCustomLocation(city.city);
      setSelectedLocation(city.city);
      onLocationSelect?.(city.city);
      console.log("city", city);
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

  // Show dropdown when user types - don't depend on isFocused
  useEffect(() => {
    if (customLocation.trim() && isModalOpen) {
      setShouldShowDropdown(true);
    } else if (!customLocation.trim()) {
      setShouldShowDropdown(false);
    }
  }, [customLocation, isModalOpen]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 Debug State:", {
      shouldShowDropdown,
      isFocused,
      customLocation,
      debouncedQuery,
      isTyping,
      isLoading,
      hasData: !!data,
      citiesCount: data?.cities?.length || 0,
      error: !!error,
      modalOpen: isModalOpen,
    });
  }, [
    shouldShowDropdown,
    isFocused,
    customLocation,
    debouncedQuery,
    isTyping,
    isLoading,
    data,
    error,
    isModalOpen,
  ]);

  const loc = localStorage.getItem("selectedLocation");

  // --- Debounce ---
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

  return (
    <>
      <Select onValueChange={handleSelect} value={selectedLocation}>
        <SelectTrigger className="w-fit bg-white text-gray-600 rounded-full">
          <SelectValue placeholder={selectedLocation} />
        </SelectTrigger>
        <SelectContent className="text-black">
          <SelectGroup>
            <SelectLabel>Location</SelectLabel>
            <SelectItem value={userLocation}>{userLocation}</SelectItem>
            {loc && loc !== userLocation && (
              <SelectItem value={loc}>{loc}</SelectItem>
            )}
            <SelectItem value="Other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Modal */}
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

            {/* Suggestions Dropdown */}
            {shouldShowDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] max-h-60 overflow-y-auto">
                {/* Show loader while typing or loading */}
                {isLoading && (
                  <div className="px-4 py-3 flex items-center justify-center">
                    <Loader parentClass="h-fit" size={30} />
                  </div>
                )}

                {/* Show error if request failed */}
                {!isTyping && !isLoading && error && (
                  <div className="px-4 py-2 text-red-500 text-sm">
                    Failed to load suggestions
                  </div>
                )}

                {/* Show no results message */}
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

                {/* Show city suggestions */}
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
