import { Link, useParams } from "react-router";
import Title from "../Common/Title";
import { Switch } from "../ui/switch";
import Location from "./Location";
import { TickertAlertIcons, TicketIcons } from "./TickertAlertIcons";
import { image2 } from "@/assets";
import Container from "../Common/Container";
import {
  // ActionIcon,
  DateIcon,
  GoingIcon,
  InterestIcon,
  ShareIcon,
  StatidumIcon,
} from "@/assets/Banner/svg/BannerSvg";
import { LocationIcon } from "../HomePage/EventsIcons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetData, PostData } from "@/API/API";
import { formatEventDate } from "@/lib/formatEventDate";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ChevronRight, Ticket } from "lucide-react";

const TicketAlert = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["events", id],
    queryFn: () => GetData(`/events/tickets/${id}`),
    enabled: !!id,
  });
  console.log("dataaaa", data);
  return isLoading ? (
    <Loader className="text-primary001" />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="-mt-[135px] w-full h-full max-w-full">
      <Banner data={data} id={id} />
      <Container>
        <div className="pt-5">
          <div className="flex flex-col gap-2 items-center justify-center">
            <Title className="text-center">{data?.title}</Title>
            <p>
              {data?.total_quantity || "0"} available *{" "}
              {data?.total_sold_quantity || "0"} sold *{" "}
              {data?.total_reserved_quantity || "0"} wanted
            </p>
          </div>
          <div className="py-5 w-full max-w-3xl mx-auto flex flex-col gap-2">
            <Alert />
            {error ? (
              <ErrorText />
            ) : (
              <>
                <EntranceTickets
                  data={data?.tickets_by_type}
                  allData={data}
                  isLoading={isLoading}
                  error={error}
                />
                {/* <NoEntranceTickets /> */}
                <Location data={data} />
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

const Banner = ({ data, id }) => {
  // Remove duplicate useState
  // Track loading state for each button
  const [interestLoading, setInterestLoading] = useState(false);
  const [goingLoading, setGoingLoading] = useState(false);

  // Fetch user's favorite/interest/going status
  const {
    data: getData,
    isLoading: interestQueryLoading,
    error,
  } = useQuery({
    queryKey: ["interest"],
    queryFn: () => GetData(`favorites-calendar`),
  });

  const queryClient = useQueryClient();

  // Mutation for "interest"
  const handleInterest = useMutation({
    mutationKey: ["fav-interest"],
    mutationFn: () =>
      PostData(`favo-calendar/add/${data?.id}`, { status: "interest" }),
    onSuccess: (response) => {
      toast.success(response?.message);
      queryClient.invalidateQueries({ queryKey: ["interest"] });
      setInterestLoading(false);
    },
    onError: () => {
      setInterestLoading(false);
    },
  });

  // Mutation for "going"
  const handleGoing = useMutation({
    mutationKey: ["fav-going"],
    mutationFn: () =>
      PostData(`favo-calendar/add/${data?.id}`, { status: "going" }),
    onSuccess: (response) => {
      toast.success(response?.message);
      queryClient.invalidateQueries({ queryKey: ["interest"] });
      setGoingLoading(false);
    },
    onError: () => {
      setGoingLoading(false);
    },
  });

  // Find if user already marked interest/going
  const matchedInterest = getData?.find(
    (d) => d?.id == id && d?.status === "interest"
  );
  const matchedGoing = getData?.find(
    (d) => d?.id == id && d?.status === "going"
  );

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default button behavior
    const title = "Share this content";
    const text = "Check out this awesome page!";
    const url = window.location.href; // Defaults to current page URL
    if (navigator.share) {
      // Native share dialog (Windows default share modal)
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        console.log("Share successful");
      } catch (error) {
        if (error instanceof DOMException && error.name !== "AbortError") {
          console.error("Share failed:", error);
          // Optional: Show user feedback for other errors
        }
        // AbortError is normal if user cancels
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        alert("Link copied to clipboard! You can paste it anywhere.");
      } catch (error) {
        console.error("Copy failed:", error);
        alert("Failed to copy. Please copy the link manually: " + url);
      }
    }
  };

  return (
    <div className="w-full h-[600px] relative z-10">
      <img
        src={data?.image || image2}
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  h-full flex flex-col items-center justify-center">
        <p className="font-proximaSemiBold text-center text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
          {data?.title || ""}
        </p>
        <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
          {data?.location}
        </p>
        <div className="flex flex-wrap items-center justify-center pt-3 gap-3">
          <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
            <DateIcon />
            {formatEventDate(data?.start_date)}
          </button>
          <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
            <LocationIcon />
            {formatEventDate(data?.end_date)}
          </button>
          <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
            <StatidumIcon />
            {data?.venue}
          </button>
        </div>
        <div className="flex items-center justify-center pt-3 gap-3">
          <button
            onClick={() => {
              setInterestLoading(true);
              handleInterest.mutate();
            }}
            disabled={interestLoading || interestQueryLoading}
            className={cn(
              "flex items-center gap-2 text-sm px-3 py-1 rounded-full",
              matchedInterest ? "bg-orange-200" : "bg-white"
            )}
          >
            <InterestIcon />
            {interestLoading
              ? "Adding..."
              : matchedInterest
              ? "Interested"
              : "Interest"}
          </button>
          <button
            onClick={() => {
              setGoingLoading(true);
              handleGoing.mutate();
            }}
            disabled={goingLoading || interestQueryLoading}
            className={cn(
              "flex items-center gap-2 text-sm px-3 py-1 rounded-full",
              matchedGoing ? "bg-orange-200" : "bg-white"
            )}
          >
            <GoingIcon />
            {goingLoading ? "Adding..." : matchedGoing ? "Going" : "Going"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full"
          >
            <ShareIcon />
            Share
          </button>
          {/* <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
            <ActionIcon />
           
          </button> */}
        </div>
      </div>
    </div>
  );
};

const Alert = () => {
  const { id } = useParams();
  const [isNotificationOn, setIsNotificationOn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load notification state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(`notification_${id}`);
    if (savedState !== null) {
      setIsNotificationOn(JSON.parse(savedState));
    }
    setIsInitialized(true);
  }, [id]);

  const notification = useMutation({
    mutationKey: ["notification"],
    mutationFn: (payload) => {
      // Replace with your actual API call
      return PostData(`events/notification/${id}`, payload);
      // return Promise.resolve(payload);
    },
    onSuccess: (data) => {
      // Backend sends status: "on" | "off"
      const newState = data?.status === "on";

      setIsNotificationOn(newState);
      localStorage.setItem(`notification_${id}`, JSON.stringify(newState));

      toast.success(
        data?.message ||
          `Notification ${newState ? "enabled" : "disabled"} successfully`
      );
      console.log("Notification response:", data);
    },

    onError: (err) => {
      toast.error(err?.message || "Failed to apply changes");
      // Revert the switch state on error
      setIsNotificationOn((prev) => prev);
    },
  });

  const handleNotificationToggle = (checked) => {
    // Update UI immediately for better UX
    setIsNotificationOn(checked);

    // Send API request with correct notify value
    const notifyValue = checked ? true : false;
    const payload = { notify: notifyValue };

    notification.mutate(payload);
  };

  // Don't render switch until we've loaded the initial state
  if (!isInitialized) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-5 bg-[#FF6D00]/10 border border-[#FF6D00] rounded-2xl p-4">
        <div className="flex items-center gap-2 w-full">
          <p className="bg-[#FF7E35] p-4 rounded-md">
            <TickertAlertIcons />
          </p>
          <div className="w-full">
            <p className="text-2xl font-semibold text-[#606060]">
              Ticket alerts
            </p>
            <p className="text-gray-600">
              Get notified when a ticket becomes available
            </p>
          </div>
        </div>
        <div className="animate-pulse bg-gray-200 rounded-full h-8 w-16"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-5 bg-[#FF6D00]/10 border border-[#FF6D00] rounded-2xl p-4">
      <div className="flex items-center gap-2 w-full">
        <p className="bg-[#FF7E35] p-4 rounded-md">
          <TickertAlertIcons />
        </p>
        <div className="w-full">
          <p className="text-2xl font-semibold text-[#606060]">Ticket alerts</p>
          <p className="text-gray-600">
            Get notified when a ticket becomes available
          </p>
        </div>
      </div>
      <Switch
        id="notification-switch"
        on="ON"
        off="OFF"
        checked={isNotificationOn}
        onCheckedChange={handleNotificationToggle}
        disabled={notification.isLoading}
      />
    </div>
  );
};

const EntranceTickets = ({ allData, isLoading, error }) => {
  return isLoading ? (
    <Loader className="text-primary001" />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="pt-5 w-full">
      {!allData?.tickets_by_type ? (
        <div className="pt-5">
          <div className="max-w-3xl w-full mx-auto rounded-xl p-8 flex flex-col items-center gap-4 border border-gray-400">
            <div className="bg-gray-300 rounded-full p-4">
              <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                <TicketIcons />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              No tickets available right now
            </h3>
            <p className="text-gray-500 text-center max-w-xl">
              Got tickets to sell? Set up a listing for one of the fans
              looking for a ticket.
            </p>
            <Link
              to="/sell-tickets"
              className="mt-2 bg-primary001/20 text-primary001 font-semibold px-4 py-1.5 rounded-full text-sm"
            >
              Start selling
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">
            Entrance tickets
          </p>
          {allData?.tickets_by_type?.map((typeGroup) => {
            const count =
              typeGroup?.total_available_quantity_type ??
              typeGroup?.tickets?.length ??
              0;
            const isSoldOut = count === 0;
            const label = typeGroup?.ticket_type
              ? typeGroup.ticket_type.charAt(0).toUpperCase() +
                typeGroup.ticket_type.slice(1)
              : "";
            return (
              <Link
                key={typeGroup?.ticket_type}
                to={`/availabletickets/${allData?.event_id}/${typeGroup?.ticket_type}`}
                className={`w-full bg-white border border-gray-100 rounded-xl px-4 py-4 flex items-center justify-between mb-2 transition-colors ${
                  isSoldOut
                    ? "opacity-50 cursor-default pointer-events-none"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {label}
                  </p>
                  {allData?.start_date && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatEventDate(allData.start_date)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                      isSoldOut
                        ? "bg-gray-200 text-gray-500"
                        : "bg-amber-400 text-amber-900"
                    }`}
                  >
                    <Ticket size={14} />
                    {count} left
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TicketAlert;
