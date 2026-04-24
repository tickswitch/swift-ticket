import Title from "../Common/Title";
import { Link } from "react-router";
import {  GetSingleData } from "@/API/API";
import { useQuery } from "@tanstack/react-query";
import ErrorText from "../Common/ErrorText";
import Loader from "../Common/Loader";
import { TimerIcon } from "lucide-react";
import { useDateFormat } from "@/lib/formatDate";
import { sortByDistance } from "@/lib/sortByDistance";
import { TicketBadge } from "@/components/Common/TicketBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Container from "@/components/Common/Container";

const AllConcerts = () => {
  const [currentPage, setCurrentPage] = useState(0); 

  const latlong = JSON.parse(
    localStorage.getItem("selectedLocationCoords") || "null"
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["events/concerts", currentPage, latlong],
    queryFn: () =>
      GetSingleData(
        `/events/concerts?lat=${latlong.lat}&lng=${latlong.lon}&page=${
          currentPage + 1
        }`
      ), // API uses 0-based page numbers
  });

  const { formatDate } = useDateFormat();

  // Pagination calculations from API response
  const totalItems = data?.pagination?.totalElements || 1;
  const totalPages = data?.pagination?.totalPages || 1;
  const currentData = sortByDistance(data?.data ?? [], latlong?.lat, latlong?.lon);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <div className="pt-12">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <Title>All Concerts</Title>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorText>
            {error?.response?.data?.message || "Something went wrong."}
          </ErrorText>
        ) : currentData?.length < 1 ? (
          <ErrorText>No Concerts Found</ErrorText>
        ) : (
          <div className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentData?.map((concert) => {
                const formattedDate = formatDate(concert?.date, concert?.time);
                const ticketCount = concert?.available_quantity;
                return (
                  <Link
                    key={concert.id}
                    to={`/event-details/${concert?.id}`}
                    className="md:basis-1/2 lg:basis-1/3 hover:-translate-y-2 transition-all duration-300 bg-slate-200 px-4 py-2 rounded-xl"
                  >
                    <div className="p-1 flex items-center gap-3 w-full h-full rounded-2xl overflow-hidden rounded-b-3xl">
                      <img
                        src={concert?.image || ""}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        data-testid="all-concerts-card-thumbnail"
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
                          {formattedDate}
                        </p>
                        <div className="mt-1">
                          <TicketBadge
                            count={ticketCount}
                            data-testid={`all-concerts-card-ticket-count-${concert?.id}`}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                {/* Previous Button */}
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

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "px-4 py-2 rounded-md border border-gray-300 text-sm font-medium",
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default AllConcerts;
