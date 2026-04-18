import { Button } from "../ui/button";
import { EventIcons } from "./TickertAlertIcons";
import {  CheckIcon2 } from "../HomePage/EventsIcons";
import { getEmbedMapUrl } from "@/lib/getEmbadedMapUrl";
import { useQuery } from "@tanstack/react-query";
import { GetData } from "@/API/API"; 
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import { Link } from "react-router";

interface LocationData {
  mapUrl?: string;
  venue?: string;
  event_id?: string;
  // Add other possible properties based on usage
  title?: string;
  location?: string;
  date?: string;
  time?: string;
  image?: string;
  id?: string;
}

const Location = ({ data }: { data: LocationData }) => {
  return (
    <div>
      <div>
        <p className="text-2xl py-8">Location</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3">
          <div className="col-span-2 max-w-[850px] max-h-[289px]">
            <iframe
              src={getEmbedMapUrl(data?.mapUrl)}
              width="100%"
              height="300"
              style={{ borderRadius: "20px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="bg-white rounded-2xl p-5 w-full">
            <p className="text-2xl font-semibold">{data?.venue}</p>
            <p className="flex items-center gap-2">
              <EventIcons />7 upcoming events
            </p>
            <p className="text-2xl font-medium text-[#2FA75F] pt-5">
              Organising this event?
            </p>
            <p className="text-secondaryText001 py-2">
              Claim this event to make the experience for fans even better.
            </p>
            <Button className="px-5 bg-[#178AFF] font-medium rounded-full">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <SimilarEvents id={data?.event_id} />
      </div>
    </div>
  );
};

interface SimilarEventData {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
}

const SimilarEvents = ({ id }: { id?: string }) => {
  const { data, isLoading, error } = useQuery<SimilarEventData[]>({
    queryKey: ["similar-events"],
    queryFn: () => GetData(`events/${id}/similar`),
  });

  return isLoading ? (
    <Loader />
  ) : error ? (
    <ErrorText />
  ) : data && data.length < 1 ? (
    <ErrorText>No similar event found</ErrorText>
  ) : (
    <div>
      <p className="text-2xl font-semibold">Similar events</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5">
        {data?.slice(0,6)?.map((event, idx) => (
          <Link to={`/event-details/${event?.id}`}
            key={`index - ${idx}`}
            className="h-[98px] w-full bg-white px-2 py-2 rounded-2xl flex items-start gap-3"
          >
            <img src={event?.image} className="w-[78px] h-[80px] rounded-md" />
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                  <p className="font-semibold text-base md:text-lg line-clamp-1">
                    {event?.title}
                  </p>
                </div>
                <p className="text-secondaryText001 text-sm">
                  {event?.location}
                </p>
                <p className="text-primary001 flex items-center gap-2 font-semibold text-sm">
                  <CheckIcon2 /> {event?.date} {event?.time}
                </p>
              </div>
              {/* <button>
                <BookmarkIcon2 />
              </button> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Location;
