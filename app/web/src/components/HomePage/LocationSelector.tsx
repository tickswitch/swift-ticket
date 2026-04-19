import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronDown, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

/** localStorage key for the homepage city selector (shared with Header's LocationDropdown). */
export const CITY_STORAGE_KEY = "swifttickets_city";
/** Legacy key used by existing LocationDropdown / fetch components. Kept in sync. */
const LEGACY_CITY_STORAGE_KEY = "selectedLocation";
const DEFAULT_CITY = "Bengaluru";

const CITIES: string[] = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Lucknow",
  "Other",
];

/** Read the currently-selected city (for other components to import). */
export const getSelectedCity = (): string => {
  try {
    return (
      localStorage.getItem(CITY_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_CITY_STORAGE_KEY) ||
      DEFAULT_CITY
    );
  } catch {
    return DEFAULT_CITY;
  }
};

/** Persist city under both keys and notify same-tab listeners. */
export const setSelectedCity = (city: string) => {
  try {
    localStorage.setItem(CITY_STORAGE_KEY, city);
    localStorage.setItem(LEGACY_CITY_STORAGE_KEY, city);
    window.dispatchEvent(
      new CustomEvent("swifttickets:city-change", { detail: city })
    );
  } catch {
    // ignore storage errors
  }
};

/** Find the nearest city in the list (case-insensitive exact match only). */
const matchCity = (candidate?: string | null): string | null => {
  if (!candidate) return null;
  const lower = candidate.toLowerCase().trim();
  const found = CITIES.find(
    (c) => c.toLowerCase() === lower && c !== "Other"
  );
  return found ?? null;
};

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  state_district?: string;
  state?: string;
  county?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
}

const LocationSelector = () => {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState<string>(DEFAULT_CITY);
  const [query, setQuery] = useState("");
  const [detecting, setDetecting] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCity(getSelectedCity());
  }, []);

  // Keep in sync across tabs + in-tab consumers
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CITY_STORAGE_KEY || e.key === LEGACY_CITY_STORAGE_KEY) {
        setCity(getSelectedCity());
      }
    };
    const onLocal = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) setCity(detail);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "swifttickets:city-change",
      onLocal as EventListener
    );
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "swifttickets:city-change",
        onLocal as EventListener
      );
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const chooseCity = (next: string) => {
    if (next === "Other") {
      // For "Other" we just close without changing — can be extended later
      setOpen(false);
      return;
    }
    setCity(next);
    setSelectedCity(next);
    setOpen(false);
    setQuery("");
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Could not detect location");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { Accept: "application/json" } }
          );
          if (!res.ok) throw new Error("reverse geocode failed");
          const data = (await res.json()) as NominatimResponse;
          const candidate =
            matchCity(data.address?.city) ??
            matchCity(data.address?.town) ??
            matchCity(data.address?.village) ??
            matchCity(data.address?.state_district) ??
            matchCity(data.address?.state);
          if (candidate) {
            chooseCity(candidate);
          } else {
            toast.error("Could not detect location");
          }
        } catch {
          toast.error("Could not detect location");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        toast.error("Could not detect location");
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      data-testid="location-selector"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-testid="location-selector-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#181818] hover:border-[#2563EB] transition-colors"
      >
        <MapPin size={16} className="text-[#2563EB]" />
        <span data-testid="location-selector-city">{city}</span>
        <ChevronDown
          size={16}
          className={
            "text-[#606060] transition-transform " +
            (open ? "rotate-180" : "rotate-0")
          }
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          role="listbox"
          data-testid="location-selector-dropdown"
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
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2">
              <Search size={14} className="text-gray-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city..."
                data-testid="location-search-input"
                className="flex-1 bg-transparent py-2 text-sm text-[#181818] outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <ul
            className="max-h-64 overflow-y-auto py-1"
            data-testid="location-city-list"
          >
            {filteredCities.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-500">
                No matches
              </li>
            )}
            {filteredCities.map((c) => {
              const selected = c === city;
              return (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => chooseCity(c)}
                    data-testid={`location-city-${c}`}
                    className={
                      "w-full text-left px-4 py-2 text-sm transition-colors " +
                      (selected
                        ? "bg-[#F0F6FF] text-[#2563EB] font-semibold"
                        : "text-[#181818] hover:bg-gray-50")
                    }
                    role="option"
                    aria-selected={selected}
                  >
                    {c}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
