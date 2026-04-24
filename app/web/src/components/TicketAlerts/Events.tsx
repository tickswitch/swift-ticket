import { Link, useSearchParams } from "react-router";
import { image2 } from "@/assets";
import Container from "../Common/Container";
import { useQuery } from "@tanstack/react-query";
import { GetSingleData } from "@/API/API";
import PopularEvents from "./PopularEvents";
import Loader from "../Common/Loader";
import ErrorText from "../Common/ErrorText";
import { TicketIcons } from "@/components/TicketAlerts/TickertAlertIcons";
import { useDateFormat } from "@/lib/formatDate";
import { TicketBadge } from "@/components/Common/TicketBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const period = searchParams.get("period");
  const venue = searchParams.get("venue");
  const genre = searchParams.get("genre");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lng");
  const { data, isLoading, error } = useQuery({
    // queryKey: period ? ["events", { period }] : ["events"],
    queryKey: ["events", currentPage, period, venue, genre, lat, lon],
    // queryKey: ["ev"],
    queryFn: () =>
      GetSingleData(
        period
          ? `events?period=${period}&lat=${lat}&lng=${lon}&radius=50`
          : venue
          ? `events?venue=${venue}&lat=${lat}&lng=${lon}&radius=50`
          : genre
          ? `events/by-genre/${genre}`
          : `events?lat=${lat}&lng=${lon}`
      ),
  });
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  console.log("log", data?.pagination?.totalPages);
  return isLoading ? (
    <Loader />
  ) : error ? (
    <ErrorText />
  ) : (
    <div className="-mt-[135px] w-full h-full max-w-full">
      <Banner />
      <Container>
        <div className="pt-5">
          {/* <div className="flex flex-col gap-2 items-center justify-center">
            <Title className="text-center">IND vs PAK T20 Match 2025</Title>
            <p>902 available * 2931 sold * 2136 wanted</p>
          </div> */}
          <div className="py-5 flex flex-col gap-2">
            {data?.data?.length < 1 ? (
              <div className="pt-5">
                <div className="max-w-3xl w-full mx-auto rounded-xl p-8 flex flex-col items-center gap-4 border border-gray-400">
                  <div className="bg-gray-300 rounded-full p-4">
                    <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                      <TicketIcons />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    No events available right now
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
              <>
                <EntranceTickets data={data?.data} />
                {/* You can also add pagination here in parent if needed */}

                {data?.pagination?.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "px-4 py-2 rounded-md border border-gray-300 text-sm font-medium",
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: data.pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium",
                          currentPage === page
                            ? "bg-primary001 text-white border border-primary001"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        )}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === data.pagination.totalPages}
                      className={cn(
                        "px-4 py-2 rounded-md border border-gray-300 text-sm font-medium",
                        currentPage === data.pagination.totalPages
                          ? "bg-gray-100 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
            {/* <NoEntranceTickets /> */}
            {/* <Location /> */}
            {}
            <PopularEvents />
          </div>
        </div>
      </Container>
    </div>
  );
};

const Banner = () => {
  return (
    <div className="w-full h-[600px] relative z-10 hero-orbs">
      <img src={image2} alt="" className="w-full h-full object-cover" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm" />
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  h-full flex flex-col items-center justify-center">
        <p className="font-proximaSemiBold text-2xl sm:text-[32px] md:text-[40px] lg:text-[56px] text-white">
          IND vs PAK T20 Match 2025
        </p>
        <p className="font-proximaRegular text-base sm:text-lg md:text-xl lg:text-2xl text-white">
          From the Abu Dhabi Grand Prix to Pirelli Gran Premio D'Italia, and
          beyond
        </p>
        <div className="flex flex-wrap items-center justify-center  pt-3 gap-3">
          <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
            <DateIcon />
            25, Apr 2025
          </button>
          <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
            <LocationIcon />
            25, Apr 2025
          </button>
          <button className="flex items-center gap-2 font-semibold text-base md:text-lg xl:text-xl text-white">
            <StatidumIcon />
            Stadium, India
          </button>
        </div>
        <div className="flex items-center justify-center  pt-3 gap-3">
          <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
            <InterestIcon />
            Interested
          </button>
          <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
            <GoingIcon />
            Going
          </button>
          <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
            <ShareIcon />
            Share
          </button>
          <button className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full">
            <ActionIcon />
          </button>
        </div>
      </div> */}
      <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  h-full flex flex-col items-center justify-center">
        <p className="text-2xl lg:text-4xl font-semibold">Events List</p>
      </div>
    </div>
  );
};

const EntranceTickets = ({ data }) => {
  const { formatDate } = useDateFormat();
  return (
    <div>
      <div>
        {/* <p className="text-2xl font-semibold pt-10 pb-5">Entrance tickets</p> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data &&
            data?.map((event) => {
              const formattedDate = formatDate(event?.end_date, event?.time);
              console.log("timesss", event?.start_date, event?.time);
              return (
                <Link
                  key={event?.id}
                  to={`/event-details/${event?.id}`}
                  className="flex items-center justify-start gap-3 bg-white rounded-xl p-5"
                >
                  <img
                    src={event?.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    data-testid="event-list-card-thumbnail"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl md:text-2xl font-semibold">
                      {event?.title || ""}
                    </p>
                    <p className="text-secondaryText001">
                      {event?.venue}, {event?.location}
                    </p>
                    <p>{formattedDate}</p>
                    <div className="mt-1">
                      <TicketBadge
                        count={event?.available_quantity}
                        data-testid={`ticket-alerts-event-card-ticket-count-${event?.id}`}
                      />
                    </div>
                  </div>
                  {/* <p className="bg-[#FEC100] px-2 py-1 rounded-md w-fit">
                  <span className="flex flex-col gap-1 text-white">
                    <TicketIcons />
                    03
                  </span>
                </p> */}
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};
// const NoEntranceTickets = () => {
//   return (
//     <div className="">
//       <div>
//         <p className="text-2xl font-semibold pt-10 pb-5">
//           Non-Entrance tickets
//         </p>
//         <p className="flex items-start gap-2 ">
//           <span className="text-secondaryText001 font-medium text-xl pb-5">
//             Available
//           </span>{" "}
//           <span className="text-xs flex items-center gap-1 bg-[#2FA75F] text-white w-fit p-1 rounded-md">
//             <TicketIcons /> 06
//           </span>
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <Link
//             to={"/availabletickets"}
//             className="flex items-center justify-between bg-white rounded-xl p-5"
//           >
//             <div className="flex flex-col gap-1">
//               <p className="text-xl md:text-2xl font-semibold">
//                 Mumbai Indians vs Sunrisers Hyderabad Fast Match
//               </p>
//               <p className="text-secondaryText001">
//                 Thu, Apr 17. Wankhede Stadium, Mumbai
//               </p>
//             </div>
//             <p className="bg-[#2FA75F] px-2 py-1 rounded-md w-fit">
//               <span className="flex flex-col gap-1 text-white">
//                 <TicketIcons />
//                 03
//               </span>
//             </p>
//           </Link>
//           <Link
//             to={"/availabletickets"}
//             className="flex items-center justify-between bg-white rounded-xl p-5"
//           >
//             <div className="flex flex-col gap-1">
//               <p className="text-xl md:text-2xl font-semibold">
//                 Mumbai Indians vs Sunrisers Hyderabad Fast Match
//               </p>
//               <p className="text-secondaryText001">
//                 Thu, Apr 17. Wankhede Stadium, Mumbai
//               </p>
//             </div>
//             <p className="bg-[#2FA75F] px-2 py-1 rounded-md w-fit">
//               <span className="flex flex-col gap-1 text-white">
//                 <TicketIcons />
//                 03
//               </span>
//             </p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

export default Events;
