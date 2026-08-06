import {  RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { 
  DotIcon,
  FacebookIcon,
  InstagramIcon,
  LogoIcon,
  OptinIcon,
  TwitorIcon,
  WhatApssIcon,
} from "./TicketIcons";
import CheckElement from "../AddToCart/CheckElement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, NavigateFunction, useNavigate } from "react-router";
import { setStep } from "@/features/StepperSlice";
import Loader from "../Common/Loader";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const ReviewAndFinish = () => {
  const [isOpen, setIsColse] = useState<boolean>(false);
  const [isOpen2, setIsColse2] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.sellTicket.data);
  const uploadedFiles = useSelector(
    (state: RootState) => state.sellTicket.uploadedFiles
  );
  const token = localStorage.getItem("token");
  console.log("data in review and data", data);

  // Define the mutation inside the component
  const FinalSubmit = useMutation({
    mutationKey: ["final-data"],
    mutationFn: async (formData: FormData) => {
      try {
        // Log the exact FormData being sent
        console.log("=== Sending FormData ===");
        console.log("Token:", token ? "Present" : "Missing");
        console.log("Base URL:", import.meta.env.VITE_BASE_URL);

        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(
              `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
            );
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        // Try with Axios first (more reliable with auth)
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/tickets/upload`,
          formData,
          {
            headers: {
              // Don't set Content-Type - let axios handle it for FormData
              Authorization: `Bearer ${token}`,
              // Add these headers to help with CORS/API issues
              Accept: "application/json",
            },
            // Prevent axios from transforming FormData
            transformRequest: [(data) => data],
            // Handle redirects properly
            maxRedirects: 0,
            // Add timeout
            timeout: 30000,
            // Ensure credentials are sent
            withCredentials: false,
          }
        );

        console.log("Axios Success Response:", response.data);
        return response.data;
      } catch (error: any) {
        // Enhanced error logging for debugging
        if (error.response) {
          console.error("Response Error:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers,
            config: {
              url: error.config?.url,
              method: error.config?.method,
            },
          });

          // Handle specific error cases
          if (error.response.status === 302) {
            throw new Error(
              "Authentication failed or session expired. Please login again."
            );
          } else if (error.response.status === 401) {
            throw new Error(
              "Unauthorized. Please check your authentication token."
            );
          } else if (error.response.status === 422) {
            const validationErrors = error.response.data?.errors;
            const errorMessage =
              error.response.data?.message || "Validation failed";
            console.error("Validation errors:", validationErrors);
            throw new Error(errorMessage);
          }
        } else if (error.request) {
          console.error("Network Error:", error.request);
          throw new Error("Network error. Please check your connection.");
        } else {
          console.error("Request Setup Error:", error.message);
        }

        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong."
        );
      }
    },
    onSuccess: () => {
      setIsColse(false);
      setIsColse2(true);
      localStorage.removeItem("reduxState");
      localStorage.removeItem("sellTicket");
    },
    onError: (err: any) => {
      console.error("Mutation Error:", err);
      toast.error(err?.message || "Something went wrong.");
    },
  });

  const handleSubmit = () => {
    const formData = new FormData();

    // Get files from Redux store (where they are stored as actual File objects)
    const ticketFiles = uploadedFiles;

    console.log("Redux ticket files:", ticketFiles);

    // Append ticket files
    if (ticketFiles && Array.isArray(ticketFiles) && ticketFiles.length > 0) {
      ticketFiles.forEach((file: File, index: number) => {
        if (file instanceof File) {
          console.log(`Appending file ${index}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });

          // Use 'ticket_file[]' for multiple files or 'ticket_file' based on your API
          formData.append("ticket_file", file, file.name);
        } else {
          console.warn(`ticket_file[${index}] is not a File object:`, file);
        }
      });
    } else {
      console.error("No ticket files found in Redux store");
      toast.error("No ticket files found. Please upload files again.");
      return;
    }

    // Append other form data
    Object.entries(data).forEach(([key, value]) => {
      // Skip file-related fields that we handle separately
      if (key !== "ticket_file" && key !== "ticket_file_metadata") {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // For arrays, you might want to append each item separately or as JSON
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, String(item));
            });
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      }
    });

    // Debug FormData contents
    console.log("=== FormData Contents ===");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          fileName: value.name,
          fileSize: value.size,
          fileType: value.type,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log("=== End FormData Contents ===");

    // Verify we have files before submitting
    let hasFiles = false;
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("ticket_file") && value instanceof File) {
        hasFiles = true;
        break;
      }
    }

    if (!hasFiles) {
      toast.error("No valid ticket files found. Please upload files again.");
      return;
    }

    dispatch(setStep(7));
    FinalSubmit.mutate(formData);
    console.log("form data", formData);
  };

  const progress = useSelector((state: RootState) => state.stepper.progress);
  // const currentStep = useSelector(
  //   (state: RootState) => state.stepper.currentStep
  // );
 
  const handleNavigate = () => {
    navigate("/tickets");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  return (
    <div className="max-w-[872px] mx-auto pt-12 px-5 lg:px-0">
      {/* Top Title */}
      <h3 className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold mb-4">
        Review & Finish
      </h3>

      {/* stepper */}
      <div>
        <p className="sm:text-2xl text-xl  text-secondaryText001">
          Make sure all info is correct and put your ticket up for sale!
        </p>

        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {/* cart of select */}
      <div className="mt-20 flex flex-col gap-3">
        {/* Event */}
        <div className=" bg-white p-5 border border-[#E7EAEC] rounded-2xl hover:shadow-xl duration-300 hover:-translate-y-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 items-center">
              <OptinIcon />
              <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                Event
              </p>
            </div>
            <button
              onClick={() => navigate("/sell-tickets", { state: true })}
              className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div>
            <p className="text-[#838383] sm:text-xl text-base  ">
              {data?.event_title}, {data?.venue}, {data?.location}
            </p>
          </div>
        </div>

        {/* Tickets */}
        <div className=" bg-white p-5 border border-[#E7EAEC] rounded-2xl hover:shadow-xl duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 items-center">
              <OptinIcon />
              <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                Tickets
              </p>
            </div>
            <button
              onClick={() => navigate("/upload-tickets", { state: true })}
              className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div>
            <p className="text-[#838383] sm:text-xl text-base">
              {data?.ticket_file_metadata?.length} ticket for sale <br />
            </p>
          </div>
        </div>

        {/* Ticket Details */}
        {/* <div className=" bg-white p-5 border border-[#E7EAEC] rounded-2xl hover:shadow-xl duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 items-center">
              <OptinIcon />
              <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                Ticket Details
              </p>
            </div>
            <button
              onClick={() => navigate("/add-ticket-details", { state: true })}
              className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div>
            <p className="text-[#838383] sm:text-xl text-base ">
              Additional info: Selling tickets, picked up wrong event
            </p>
          </div>
        </div> */}

        {/* Selling price */}
        <div className=" bg-white p-5 border border-[#E7EAEC] rounded-2xl hover:shadow-xl duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 items-center">
              <OptinIcon />
              <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                Selling price
              </p>
            </div>
            <button
              onClick={() => navigate("/your-ticket-price", { state: true })}
              className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div>
            <p className="text-[#838383] sm:text-xl text-base ">
              {/* €44.00 per ticket (you'll receive €41.80 per ticket) */}
              Original price: ₹{data?.original_price} <br />
              Current price: ₹{data?.price}
            </p>
          </div>
        </div>

        {/* Payout method */}
        <div className=" bg-white p-5 border border-[#E7EAEC] rounded-2xl hover:shadow-xl duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 items-center">
              <OptinIcon />
              <p className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold">
                Payout method
              </p>
            </div>
            <Link
              to="/account/payout"
              className="text-[#606060] sm:text-xl text-lg font-proximaSemiBold cursor-pointer hover:text-primary001 transition-colors"
            >
              Manage in your profile →
            </Link>
          </div>
          <div>
            <p className="text-[#838383] sm:text-xl text-base">
              UPI / Bank account
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="pt-6 pb-[50px] sm:flex-row  items-center flex flex-col sm:items-center sm:gap-5 gap-3 ">
          <Link to="/sell-tickets">
            <button className="duration-300 hover:bg-primary001 hover:text-white text-base font-proximaSemiBold  text-primary001 py-2 px-10  rounded-4xl border border-primary001 cursor-pointer text-nowrap">
              Clear & Start Again
            </button>
          </Link>

          <Dialog open={isOpen} onOpenChange={setIsColse}>
            <DialogTrigger>
              <button className="text-base w-55 text-white bg-primary001 py-2 font-proximaSemiBold px-10 rounded-4xl border border-primary001 cursor-pointer text-nowrap">
                Create Listing
              </button>
            </DialogTrigger>
            <DialogContent className="w-[529px]">
              <DialogHeader>
                <DialogTitle className=" mb-4 text-[#606060] font-proximaSemiBold text-2xl text-center">
                  Read with care
                </DialogTitle>
                <hr />
                <DialogDescription>
                  <div className="flex flex-col gap-5 mt-4 ">
                    <div className="flex gap-1">
                      <div className="mt-2">
                        <DotIcon />
                      </div>
                      <div>
                        <p className="sm:text-xl text-base text-[#838383] font-proximaRegular text-left">
                          After finishing this process people will be able to
                          buy your tickets.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <div className="mt-2">
                        <DotIcon />
                      </div>
                      <div>
                        <p className=" sm:text-xl text-base text-[#838383] font-proximaRegular text-left">
                          If you decide to use tickets yourself or sell them
                          elsewhere, you'll need to remove them from SwiftTickets
                          first.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <div className="mt-2">
                        <DotIcon />
                      </div>
                      <div>
                        <p className=" sm:text-xl text-base text-[#838383] font-proximaRegular text-left">
                          By continuing, you confirm that you’re not a
                          professional trader.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        // fristModal();
                        handleSubmit();
                      }}
                      className="text-nowrap cursor-pointer mt-4 mb-2 bg-primary001 text-white text-base px-10 py-2 rounded-4xl"
                    >
                      {FinalSubmit.isPending ? (
                        <Loader parentClass="h-auto w-fit" size={25} />
                      ) : (
                        <>Agree & continue</>
                      )}
                    </button>

                    <p className="text-[#606060] sm:text-xl text-base font-proximaSemiBold mb-10 text-center">
                      Platform & Ticket Agreements apply.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog open={isOpen2} onOpenChange={setIsColse2}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="w-[621px] sm:h-[621px] h-auto">
              <DialogHeader>
                <DialogTitle> </DialogTitle>

                <DialogDescription className="relative">
                  <div className=" absolute sm:top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-13 pt-5 pb-11 flex flex-col items-center bg-white shadow-2xl rounded-3xl sm:w-[442px] w-3/4 sm:h-[292px] ">
                    <div className="sm:w-[129px] sm:h-[129px]  w-[80px] h-[80px]">
                      <LogoIcon />
                    </div>
                    <div>
                      <p className="sm:text-5xl text-3xl  font-proximaBold text-primary001">
                        SwiftTickets
                      </p>
                    </div>
                  </div>

                  <div className="sm:mt-55 mt-30">
                    <p className="my-10 text-2xl text-[#606060] text-center">
                      Share this with your social community!
                    </p>

                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-5 justify-items-center">
                      <button
                        onClick={() => {
                          window.open(
                            "https://x.com/",
                            "_blank",
                            "noopener,noreferrer"
                          );
                          setIsColse2(false);
                          navigate("/listing");
                        }}
                        className="bg-[#55ACEE] px-12 py-3 flex gap-2 rounded-4xl items-center cursor-pointer w-[220px]"
                      >
                        <TwitorIcon />
                        <p className="text-white text-base font-proximaRegular ">
                          Twitter
                        </p>
                      </button>

                      <button
                        onClick={() => {
                          window.open(
                            "https://www.whatsapp.com/",
                            "_blank",
                            "noopener,noreferrer"
                          );
                          setIsColse2(false);
                          navigate("/listing");
                        }}
                        className="bg-[#1FAF38] px-12 py-3 flex gap-2 rounded-4xl items-center cursor-pointer  w-[220px]"
                      >
                        <WhatApssIcon />
                        <p className="text-white text-base font-proximaRegular ">
                          What’s app
                        </p>
                      </button>

                      <button
                        onClick={() => {
                          window.open(
                            "https://www.instagram.com/",
                            "_blank",
                            "noopener,noreferrer"
                          );
                          setIsColse2(false);
                          navigate("/listing");
                        }}
                        className="bg-[radial-gradient(127.77%_127.77%_at_14.93%_100.35%,_#FFB140_0%,_#FF5445_25.59%,_#FC2B82_59.9%,_#8E40B7_100%)] px-12 py-3 flex gap-2 rounded-4xl items-center cursor-pointer  w-[220px]"
                      >
                        <InstagramIcon />
                        <p className="text-white text-base font-proximaRegular ">
                          Instagram
                        </p>
                      </button>

                      <button
                        onClick={() => {
                          window.open(
                            "https://www.facebook.com/",
                            "_blank",
                            "noopener,noreferrer"
                          );
                          setIsColse2(false);
                          navigate("/listing");
                        }}
                        className="bg-[#1877F2] px-12 py-3 flex gap-2 rounded-4xl items-center cursor-pointer  w-[220px]"
                      >
                        <FacebookIcon />
                        <p className="text-white text-base font-proximaRegular ">
                          Facebook
                        </p>
                      </button>
                    </div>
                    <div className="py-9 flex items-center justify-center">
                      <Link
                        onClick={handleNavigate}
                        to={"/tickets"}
                        className="bg-primary001 px-7 py-4 rounded-full text-white font-semibold"
                      >
                        Go to your tickets
                      </Link>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <CheckElement />
      </div>
    </div>
  );
};

export default ReviewAndFinish;

{
  /* <div className="flex justify-center sm:flex-none ">
  <div
    onClick={handleCopy}
    className="cursor-pointer sm:w-[500px] w-[220px]  mt-5 flex gap-2 items-center justify-center border border-[#DDDDDD] px-5 py-2 rounded-lg mx-8"
  >
    <CopyLinkIcon />
    <p className="text-[#848484] font-proximaSemiBold text-2xl">copy link</p>
  </div>
</div>; */
}
