import { headerSearchIcon } from "@/assets";
import { AppDispatch, RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckIcon } from "./TicketIcons";
import CheckElement from "../AddToCart/CheckElement";
import { Button } from "../ui/button";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router";
import toast from "react-hot-toast";
import { setStep } from "@/features/StepperSlice";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "@/API/API";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { useDebounce } from "@/hooks/useDebounce";
import { updateData } from "@/features/SellTicketSlice";
import { getLocalTime } from "@/lib/getLocalTime";
import { formatEventDate } from "@/lib/formatEventDate";
import { sortByDistance } from "@/lib/sortByDistance";

// Proper EventItem type to match API response
type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  image: string;
  latitude: number;
  mapUrl: string;
  longitude: number;
  start_date: string;
  end_date: string;
  ticket_url: string;
  time: string;
  imageUrl: string;
};

const SelectEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [query, setQuery] = useState("");
  const location: Location = useLocation();
  const isEdit = location.state;
  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  const gotoEditWithNextPage = () => {
    if (events.length === 0) {
      toast.error("Please select at least one event.");
      return;
    }
    dispatch(setStep(2));
    navigate("/review-finish");
  };

  const progress = useSelector((state: RootState) => state.stepper.progress);

  const handleNext = () => {
    if (events.length === 0) {
      toast.error("Please select at least one event.");
      return;
    }
    navigate("/upload-tickets");
  };

  // debounce for search query
  const debouncedQuery = useDebounce(query, 500);

  const userCoords = JSON.parse(localStorage.getItem("selectedLocationCoords") || "null");

  // get search events — global, no lat/lng filter; sorted by distance on frontend
  const { data: rawData, isLoading, error } = useQuery<EventItem[]>({
    queryKey: ["search-events", debouncedQuery],
    queryFn: () =>
      GetData(
        `search-events?keyword=${encodeURIComponent(debouncedQuery || "")}`
      ),
    enabled: true,
  });

  const rawEvents: EventItem[] = Array.isArray(rawData) ? rawData : (rawData as any)?.events ?? [];
  const data = sortByDistance(rawEvents, userCoords?.lat, userCoords?.lon) as EventItem[];

  return (
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between">
        <h3 className="text-2xl sm:text-[28px] md:text-[36px] font-semibold pt-5 md:pt-0">
          Select Event
        </h3>
        <div className="relative w-full md:w-[55%]">
          <input
            type="text"
            placeholder="Search for events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ps-12 pe-3 py-3 w-full rounded-full outline-none border bg-white border-gray-200 flex-1"
          />
          <img
            src={headerSearchIcon}
            alt="Search Icon"
            className="absolute top-1/2 -translate-y-1/2 left-3"
          />
        </div>
      </div>

      {/* stepper */}
      <div className="pt-5 md:pt-0">
        <p className="text-base md:text-xl lg:text-2xl font-semibold text-secondaryText001">
          Which event do you want to sell tickets for?
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="py-5">
        <Suggestions
          setEvents={setEvents}
          data={data}
          isLoading={isLoading}
          error={error}
          dispatch={dispatch}
        />
      </div>

      <Button
        onClick={handleNext}
        className={`px-16 h-12 flex items-center justify-center rounded-full text-lg font-medium bg-primary001/90 hover:bg-primary001 ${
          isEdit ? "hidden" : "block"
        }`}
      >
        Next
      </Button>

      <div>
        <button
          onClick={gotoEditWithNextPage}
          className={`${
            isEdit ? "block" : "hidden"
          } text-base text-white bg-primary001 py-2 px-10 rounded-4xl border border-primary001 w-[180px] cursor-pointer`}
        >
          Continue
        </button>
      </div>

      <div className="pt-5 w-full">
        <CheckElement />
      </div>
    </div>
  );
};

type SuggestionsProps = {
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  data?: EventItem[];
  isLoading: boolean;
  error: unknown;
  dispatch: AppDispatch;
};

const Suggestions = ({
  setEvents,
  data,
  isLoading,
  error,
  dispatch,
}: SuggestionsProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const handleCheckboxChange = (item: EventItem, index: number) => {
    console.log("events", item);
    dispatch(
      updateData({
        ticketmaster_id: item?.id,
        event_title: item?.title,
        venue: item?.venue,
        location: item?.location,
        start_date: item?.start_date,
        end_date: item?.end_date,
        time: item?.time,
        latitude: item?.latitude,
        longitude: item?.longitude,
        mapUrl: item?.mapUrl,
        imageUrl: item?.imageUrl,
      })
    );
    setCheckedItems((prev) => ({
      // ...prev,
      [index]: !prev[index],
    }));

    setEvents([item]);
  };

  return (
    <div>
      <p className="text-xl font-medium text-secondaryText001 uppercase">
        Suggestions
      </p>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorText />
      ) : !data || data.length < 1 ? (
        <ErrorText>No event found</ErrorText>
      ) : (
        <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.slice(0, 6)?.map((item, index) => (
            <div
              onClick={() => handleCheckboxChange(item, index)}
              key={item.id}
              className="relative flex flex-col gap-0 bg-white p-5 rounded-md cursor-pointer hover:shadow-md transition-shadow duration-300"
            >
              {checkedItems[index] && (
                <p className="absolute top-3 right-4">
                  <CheckIcon />
                </p>
              )}
              <h4 className="text-xl font-semibold text-secondaryText001">
                {item?.title}
              </h4>
              <p className="text-base text-gray-500">
                {getLocalTime(item?.start_date, item?.time)}{" "}
                {formatEventDate(item?.start_date)} {item?.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectEvents;
