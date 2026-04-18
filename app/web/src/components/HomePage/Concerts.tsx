import Title from "../Common/Title";
import { Link } from "react-router";
import { GetData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import { TimerIcon } from "lucide-react";
import { useDateFormat } from "@/lib/formatDate"; 
import { AvailableTicketIcon } from "@/components/PaymentMethod/Icons";

const Concerts = () => {
  const latlong = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["events/concerts"],
    queryFn: () =>
      GetData(`/events/concerts?lat=${latlong.lat}&lng=${latlong.lon}`),
  });

  const { formatDate } = useDateFormat();

  return (
    <div className="pt-12">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <Title>Concerts</Title>
          <Link
            to={"/all-concerts"}
            className="text-sm text-primary001 bg-primary001/20 px-3 py-1 rounded-full font-semibold"
          >
            See all
          </Link>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorText>
          {error?.response?.data?.message || "Something went wrong."}
        </ErrorText>
      ) : data?.length < 1 ? (
        <ErrorText>No Sports Found</ErrorText>
      ) : (
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.slice(0, 10)?.map((concert) => {
              const formattedDate = formatDate(concert?.date, concert?.time);
              console.log("date", formattedDate);
              return (
                <Link
                  to={`/event-details/${concert?.id}`}
                  className="md:basis-1/2 lg:basis-1/3 hover:-translate-y-2 transition-all duration-300 bg-slate-200 px-4 py-2 rounded-xl"
                >
                  <div className="p-1 flex items-center gap-3 w-full h-full rounded-2xl overflow-hidden rounded-b-3xl">
                    <img
                      src={concert?.image || ""}
                      className="rounded-xl w-20 h-20 object-cover"
                    />

                    <div className="flex-col gap-1 md:gap-2">
                      <p className="flex items-center justify-between text-black text-xl md:text-2xl truncate">
                        {concert?.title}
                      </p>
                      <p className="text-gray-500">
                        {concert?.venue}, {concert?.location}
                      </p>
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <TimerIcon size={20} />
                        {/* {getLocalTime(concert?.date, concert?.time)}{" "} */}
                        {/* {formatEventDate(concert?.date, concert?.time)} */}
                        {formattedDate},{" "}
                        <span className="flex items-center gap-1 text-primary001 text-base">
                          <AvailableTicketIcon /> {concert?.available_quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Concerts;
