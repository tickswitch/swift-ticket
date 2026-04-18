import { GetData } from "@/API/API";
import Container from "@/components/Common/Container";
import Loader from "@/components/Common/Loader"; 
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { useState } from "react";

type ListingData = {
  sold_quantity: number;
  reserved_quantity: number;
  start_date: string;
  end_date: string;
  place: string;
  price: number;
  newquantity: number;
  status: string;
  ticket_file_url: string;
}[];

const Listing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust this number

  const { data, isLoading, error } = useQuery<ListingData, Error>({
    queryKey: ["listing"],
    queryFn: () => GetData("tickets/list/sell"),
  });

  // Pagination calculations
  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log("data", data);
  return (
    <div className="pt-16">
      <Container className="max-w-[50%]">
        <div className="flex items-center justify-between w-full">
          <p className="text-2xl md:text-4xl lg:text-5xl font-semibold pb-5">
            Your listings
          </p>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="py-5">Something went wrong.</p>
        ) : data && data.length < 1 ? (
          <p className="py-6 text-xl text-gray-500 font-semibold flex flex-col items-start gap-3">
            <span className="pb-6">
              You don't have any listings yet. Click below to kickstart your
              selling journey!
            </span>
          </p>
        ) : (
          <div>
            <Link
              className="py-2 bg-green-500 text-white font-semibold flex items-center justify-center px-4 max-w-[260px] w-full rounded-md"
              to={"/sell-tickets"}
            >
              Create Your {data && data.length < 1 ? "First" : ""} Listing
            </Link>
            <div>
              <div className="bg-white mt-3 p-5 border border-[#E7EAEC] rounded-2xl shadow-xl overflow-hidden pe-5">
                {currentData?.map((ticket, index) => {
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between w-full">
                        <div className="w-full">
                          <div className="w-full flex justify-between gap-1">
                            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                              <div className="flex flex-wrap items-center gap-4">
                                <p className="text-[#606060] font-proximaSemiBold sm:text-2xl text-xl">
                                  <span>Sold: {ticket?.sold_quantity}</span>
                                </p>
                                <p className="text-[#606060] font-proximaSemiBold sm:text-2xl text-xl">
                                  <span>
                                    Reserved: {ticket?.reserved_quantity}
                                  </span>
                                </p>
                              </div>
                              <p
                                className={cn(
                                  "",
                                  ticket?.status === "approved" &&
                                    "text-primary001 bg-primary001/20 px-5 py-1 font-semibold text-xs rounded-full"
                                )}
                              >
                                {ticket?.status === "approved" && "Approved"}
                              </p>
                            </div>
                          </div> 
                          <p className="text-[#838383] font-proximaRegular sm:text-xl text-sm"> 
                            From {ticket?.start_date} to {ticket?.end_date}{" "}
                            {ticket?.place}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-[#838383] font-proximaRegular sm:text-xl text-lg">
                              <span className="text-[#606060] font-proximaSemiBold">
                                ₹{ticket?.price} {ticket?.newquantity}{" "}
                              </span>
                              per ticket
                            </p>
                          </div>
                          <a
                            href={ticket?.ticket_file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ellipsis pe-5"
                          >
                            Ticket File: <span className="underline text-primary001">see</span>
                          </a>
                        </div>
                      </div> 
                      <hr className="my-4 bg-[#E7EAEC]" /> 
                    </div>
                  );
                })}
              </div>

              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center py-6 space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-3 py-2 rounded-md border border-gray-300 text-sm font-medium",
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium",
                        currentPage === page
                          ? "bg-green-500 text-white border border-green-500"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "px-3 py-2 rounded-md border border-gray-300 text-sm font-medium",
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
          </div>
        )}
      </Container>
    </div>
  );
};

export default Listing;