import { GetData } from "@/API/API";
import { ibtn } from "@/assets";
import Container from "@/components/Common/Container";
import Loader from "@/components/Common/Loader";
import {
  TicketDeleteIcon,
  TicketPdfUpload,
} from "@/components/SellTicketsComponents/TicketIcons";
import { updateData } from "@/features/SellTicketSlice";
import { formatEventDate } from "@/lib/formatEventDate";
import { getLocalTime } from "@/lib/getLocalTime";
import { UploadPdf } from "@/types/FileTypes";
import { setStep } from "@/features/StepperSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import {  PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Document, Page } from "react-pdf";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavigateFunction, useLocation, useNavigate } from "react-router";

// Extend Window interface to include uploadedTicketFiles
declare global {
  interface Window {
    uploadedTicketFiles?: File[];
  }
}

// pages/api/download-image.ts or app/api/download-image/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("URL parameter required", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new Response(`Failed to fetch file: ${response.status}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
    const blob = await response.blob();
    if (blob.size === 0) {
      return new Response("Empty file", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    let contentType = response.headers.get("Content-Type") || "image/png";
    let filename = "ticket";
    let extension = ".png";

    if (contentType.includes("pdf")) {
      extension = ".pdf";
      contentType = "application/pdf";
    } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      extension = ".jpg";
    } else if (contentType.includes("gif")) {
      extension = ".gif";
    } else if (contentType.includes("webp")) {
      extension = ".webp";
    } else if (contentType.includes("svg")) {
      extension = ".svg";
    }

    filename += extension;

    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": blob.size.toString(),
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return new Response("Download failed", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

type TicketType = {
  order_items: {
    quantity: number;
    ticket: {
      ticket_type: string;
      start_date: string;
      time: string;
      price: number;
      ticket_file_url: string | null;
    };
    place: string;
    name: string;
    newquantity: number;
  }[];
  subtotal?: number;
};

const Tickets = () => {
  const {
    data,
    isLoading,
    error: listError,
  } = useQuery<TicketType[], Error>({
    queryKey: ["ticket-list"],
    queryFn: () => GetData("tickets/list/buy"),
  });

  const state = useLocation();

  useEffect(() => {
    try {
      const ticketsFromStorage = JSON?.parse(
        localStorage?.getItem("displayTickets") || "[]"
      );
      const exists = ticketsFromStorage.some(
        (ticket: any) => ticket?.id?.toString() === state?.state?.id?.toString()
      );

      if (!exists) {
        ticketsFromStorage.push(state?.state);
        localStorage.setItem(
          "displayTickets",
          JSON.stringify(ticketsFromStorage)
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [state?.state?.id]);

  // const handleDownload = async (url: string) => {
  //   const apiUrl = `/api/download-image?url=${encodeURIComponent(url)}`;

  //   try {
  //     const response = await fetch(apiUrl);
  //     if (!response.ok) {
  //       console.error("Download failed:", await response.text());
  //       // Optionally, show an alert or UI message
  //       // alert('Failed to download the file.');
  //       return;
  //     }

  //     const blob = await response.blob();
  //     const contentDisposition = response.headers.get("Content-Disposition");
  //     const filenameMatch =
  //       contentDisposition && contentDisposition.match(/filename="?(.+)"?/);
  //     const filename = filenameMatch ? filenameMatch[1] : "ticket.png";

  //     const objectUrl = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = objectUrl;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(objectUrl);
  //   } catch (err) {
  //     console.error("Error during download:", err);
  //     // Optionally, show an alert or UI message
  //     // alert('An error occurred during download.');
  //   }
  // };

  // const location: Location = useLocation();
  // const isEdit = location.state;
  // const progress = useSelector((state: RootState) => state.stepper.progress);
  const sellTicketData = useSelector(
    (state: RootState) => state.sellTicket.data
  );

  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // Store files separately from Redux to maintain File objects
  const [pdfFileUrl, setPdfFileUrl] = useState<UploadPdf[]>([]);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0); // Used in PDF preview
  const [pageNumber, setPageNumber] = useState<number>(1); // Used in PDF preview

  const modalRef = useRef<HTMLDivElement>(null);

  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length === 0) {
      toast.error("Please upload valid PDF files");
      return;
    }

    console.log("=== File Upload Debug ===");
    files.forEach((file, index) => {
      console.log(`File ${index}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        instanceof: file instanceof File,
        constructor: file.constructor.name,
        lastModified: file.lastModified,
      });
    });

    // Store File objects in component state for previews and actual files
    const newFiles = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setPdfFileUrl((prev) => {
      const updated = [...prev, ...newFiles];

      // Store files in a global variable - CRITICAL: Ensure these remain File objects
      const fileObjects = updated.map((item) => item.file);
      window.uploadedTicketFiles = fileObjects;

      console.log("=== Global Storage Debug ===");
      console.log("Files stored globally:", fileObjects);
      console.log(
        "Global files are File instances:",
        fileObjects.map((f) => f instanceof File)
      );
      console.log(
        "Global files constructors:",
        fileObjects.map((f) => f.constructor.name)
      );

      // Immediate verification
      setTimeout(() => {
        console.log("=== Global Storage Verification (async) ===");
        console.log("window.uploadedTicketFiles:", window.uploadedTicketFiles);
        console.log(
          "Still File instances?",
          window.uploadedTicketFiles?.map((f) => f instanceof File)
        );
      }, 100);

      // Store file metadata in Redux (not the actual files)
      dispatch(
        updateData({
          ticket_file_metadata: updated.map((item) => ({
            name: item.name,
            size: item.file.size,
            type: item.file.type,
            lastModified: item.file.lastModified,
          })),
        })
      );

      return updated;
    });
  };

  // Initialize files from global variable on component mount
  useEffect(() => {
    console.log("=== Component Mount - Checking for Existing Files ===");

    const storedFiles = window.uploadedTicketFiles;
    const storedMetadata = sellTicketData.ticket_file_metadata;

    console.log("Global files on mount:", storedFiles);
    console.log("Redux metadata on mount:", storedMetadata);

    if (storedFiles && Array.isArray(storedFiles) && storedFiles.length > 0) {
      console.log("Restoring files from global storage...");

      // Verify files are still File objects
      const validFiles = storedFiles.filter((file, index) => {
        const isValid = file instanceof File;
        console.log(`File ${index} is valid:`, isValid, file);
        return isValid;
      });

      if (validFiles.length > 0) {
        const restoredFiles = validFiles.map((file: File) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file,
        }));

        console.log("Successfully restored files:", restoredFiles.length);
        setPdfFileUrl(restoredFiles);
      } else {
        console.warn("No valid File objects found in global storage");
      }
    } else if (
      storedMetadata &&
      Array.isArray(storedMetadata) &&
      storedMetadata.length > 0
    ) {
      console.log(
        "Found metadata but no files - files may have been lost during navigation"
      );
      // toast.error("Files were lost during navigation. Please upload again.");
    }
  }, [sellTicketData.ticket_file_metadata]);

  const openModal = (url: string) => {
    setPreviewUrl(url);
    setShowPdfPreview(true);
  };

  const closeModal = () => {
    setShowPdfPreview(false);
    setPreviewUrl(null);
  };

  // const handleNext = () => {
  //   if (pdfFileUrl.length === 0) {
  //     toast.error("Must upload at least one PDF file");
  //     return;
  //   }
  //   // Make sure files are available globally
  //   window.uploadedTicketFiles = pdfFileUrl.map((item) => item.file);
  //   dispatch(setStep(3));
  //   navigate("/add-ticket-details");
  // };

  // const gotoEditWithNextPage = () => {
  //   if (pdfFileUrl.length === 0) {
  //     toast.error("Must upload at least one PDF file");
  //     return;
  //   }
  //   // Make sure files are available globally
  //   window.uploadedTicketFiles = pdfFileUrl.map((item) => item.file);
  //   navigate("/review-finish");
  // };

  const handleDeleteFile = (idx: number) => {
    setPdfFileUrl((prev) => {
      const fileToDelete = prev[idx];
      const newFiles = prev.filter((_, i) => i !== idx);

      // Cleanup URL
      URL.revokeObjectURL(fileToDelete.url);

      // Update global files
      window.uploadedTicketFiles = newFiles.map((item) => item.file);

      // Update Redux metadata
      dispatch(
        updateData({
          ticket_file_metadata: newFiles.map((item) => ({
            name: item.name,
            size: item.file.size,
            type: item.file.type,
            lastModified: item.file.lastModified,
          })),
        })
      );

      toast.success("Your PDF file deleted");
      return newFiles;
    });
  };

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };
    if (showPdfPreview) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPdfPreview]);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      pdfFileUrl.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [pdfFileUrl]);

  return (
    <div className="min-h-screen pt-16">
      <Container className="max-w-[50%]">
        <div className="flex items-center justify-between">
          <p className="text-2xl md:text-4xl lg:text-5xl font-semibold">
            Your tickets
          </p>
          <label className="bg-primary001/20 px-3 py-2 rounded-full text-primary001 font-semibold flex items-center gap-2 text-sm">
            <input
              type="file"
              className="hidden w-20 relative z-10 h-fit"
              onChange={handlePdfFileUpload}
            />
            <div className="flex items-center gap-2 text-sm cursor-pointer">
              <p className="bg-primary001 text-white font-semibold w-fit rounded-full">
                <PlusIcon size={20} />
              </p>
              Import
            </div>
          </label>
        </div>

        {isLoading ? (
          <Loader />
        ) : listError ? (
          <p className="py-5">Something went wrong.</p>
        ) : (data && data.length < 1) ? (
          <p className="py-3 text-lg font-semibold">
            You don't have any tickets yet.
          </p>
        ) : (
          <div className="bg-white mt-3 p-5 border border-[#E7EAEC] rounded-2xl shadow-xl">
            {data?.map((ticket, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center justify-between w-full">
                    {ticket.order_items?.map((item) => (
                      <div>
                        <div className="flex justify-between gap-1">
                          <div>
                            <p className="text-[#606060] font-proximaSemiBold sm:text-2xl text-xl">
                              {item?.quantity} x{" "}
                              {item?.ticket?.ticket_type}
                            </p>
                          </div>
                        </div>

                        <p className="text-[#838383] font-proximaRegular sm:text-xl text-sm">
                          {getLocalTime(
                            item?.ticket?.start_date,
                            item?.ticket?.time
                          )}
                          ,{" "}
                          {formatEventDate(
                            item?.ticket?.start_date
                          )}{" "}
                          {item?.place}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          {/* {item?.ticket_file_url !== null && (
                            <img
                              className="rounded-full h-[42px] w-[42px] object-cover"
                              src={item?.ticket?.ticket_file_url}
                              alt={item?.name}
                            />
                          )} */}
                          <p className="text-[#838383] font-proximaRegular sm:text-xl text-lg">
                            <span className="text-[#606060] font-proximaSemiBold">
                              ₹{item?.ticket?.price} {item?.newquantity}{" "}
                            </span>
                            per ticket
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4 bg-[#E7EAEC]" />
                </div>
              );
            })}

            {data && data[0] && data[0].order_items && data[0].order_items.length < 1 && (
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-[#606060] sm:text-2xl text-xl  font-proximaSemiBold">
                    Total ₹{data[0]?.subtotal}
                  </p>
                  <img src={ibtn} alt="Info" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ticket upload list */}
        <div className="flex flex-col justify-start gap-[14px] pt-6">
          {pdfFileUrl.map((fileName, idx) => (
            <div
              key={idx}
              className="px-[14px] py-[17px] rounded-[8px] border border-[#EBECEF] bg-white flex items-center gap-3"
            >
              <div className="py-[14px] px-[10px] border border-[#EBECEF] rounded-[6px] w-[89px] h-[98px] flex items-center justify-center">
                <TicketPdfUpload />
              </div>
              <div className="flex-1 flex flex-col">
                <h5 className="text-[#606060] text-base md:text-xl lg:text-2xl font-semibold">
                  {fileName.name}
                </h5>
                <div className="flex flex-col sm:flex-row gap-3 pt-[14px]">
                  <button
                    onClick={() => openModal(fileName.url)}
                    className="text-sm md:text-base w-fit text-[#606060] rounded-[8px] border border-[#C1C4CC] py-[6px] px-4 cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
              <div
                onClick={() => handleDeleteFile(idx)}
                className="items-end justify-end bg-[#EBECEF] rounded-[13px] p-[6px] cursor-pointer"
              >
                <TicketDeleteIcon />
              </div>
            </div>
          ))}
        </div>

        {/* Modal for PDF preview */}
        {showPdfPreview && previewUrl && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div
              ref={modalRef}
              className="bg-gray-200 rounded-3xl w-11/12 md:w-3/4 h-[95vh] relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-[-13px] right-[-10px] text-white text-3xl font-bold cursor-pointer px-2 bg-gray-500 rounded-2xl z-10"
              >
                &times;
              </button>
              <Document
                className="absolute w-full h-full overflow-y-auto left-0"
                file={previewUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(err) => console.error("PDF Load Error:", err)}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            </div>
          </div>
        )}
        <div className="py-5 space-y-3">
          <p className="text-3xl font-semibold">Import your tickets</p>
          <p>
            Upload any tickets for easy organisation, sharing or selling – plus
            faster access at the door.
          </p>
          <div className="border-2 border-dashed border-primary001 rounded-xl bg-primary001/10 w-full h-60">
            <label className="w-full h-full">
              <input
                type="file"
                className="hidden w-full h-full"
                accept="application/pdf"
                multiple
                onChange={handlePdfFileUpload}
              />
              <div className="flex flex-col items-center justify-center gap-3 h-60">
                <p>
                  <svg
                    className="styles_filesIllustration__s_ckE"
                    width="106px"
                    height="100px"
                    // alt="Drop file"
                  >
                    <path
                      opacity="0.16"
                      d="M42.1453 95.6312C65.3412 95.6312 84.1453 76.6033 84.1453 53.1312C84.1453 29.6591 65.3412 10.6312 42.1453 10.6312C18.9493 10.6312 0.145264 29.6591 0.145264 53.1312C0.145264 76.6033 18.9493 95.6312 42.1453 95.6312Z"
                      fill="#00B6F0"
                      className="custom-cursor-on-hover"
                    ></path>
                    <g filter="url(#filter0_d_3907_4956)">
                      <path
                        d="M101.099 43.1146L74.4472 20.6278C71.9145 18.4909 68.1291 18.8118 65.9922 21.3445C65.9853 21.3527 65.9783 21.361 65.9714 21.3693L31.5764 62.5851C29.4614 65.1196 29.791 68.8866 32.314 71.0153L58.966 93.502C61.4987 95.6389 65.2841 95.318 67.421 92.7853C67.428 92.7771 67.4349 92.7688 67.4418 92.7605L101.837 51.5447C103.952 49.0102 103.622 45.2433 101.099 43.1146Z"
                        fill="white"
                        className="custom-cursor-on-hover"
                      ></path>
                    </g>
                    <g filter="url(#filter1_d_3907_4956)">
                      <path
                        d="M86.4504 20.0068L53.7751 8.04855C50.6632 6.90969 47.2174 8.50913 46.0785 11.621C46.0761 11.6276 46.0737 11.6342 46.0713 11.6409L27.7634 62.218C26.6384 65.3261 28.239 68.7587 31.3431 69.8947L64.0184 81.853C67.1303 82.9918 70.5762 81.3924 71.715 78.2805C71.7175 78.2739 71.7199 78.2673 71.7223 78.2607L90.0301 27.6835C91.1552 24.5755 89.5545 21.1428 86.4504 20.0068Z"
                        fill="white"
                        className="custom-cursor-on-hover"
                      ></path>
                    </g>
                    <g filter="url(#filter2_d_3907_4956)">
                      <path
                        d="M59.912 2.63074H25.1473C21.8336 2.63074 19.1473 5.31703 19.1473 8.63074V62.4615C19.1473 65.7752 21.8336 68.4615 25.1473 68.4615H59.912C63.2257 68.4615 65.912 65.7752 65.912 62.4615V8.63074C65.912 5.31703 63.2257 2.63074 59.912 2.63074Z"
                        fill="white"
                        className="custom-cursor-on-hover"
                      ></path>
                    </g>
                    <path
                      d="M35.33 49C34.6597 49 34.0858 48.7646 33.6085 48.2939C33.1312 47.8231 32.8925 47.2572 32.8925 46.5962V26.4038C32.8925 25.7428 33.1312 25.1769 33.6085 24.7061C34.0858 24.2354 34.6597 24 35.33 24H44.5925C44.916 24 45.2244 24.0588 45.5177 24.1763C45.8109 24.2938 46.0725 24.4657 46.3026 24.6921L52.3887 30.6797C52.6187 30.9061 52.796 31.1655 52.9206 31.4581C53.0452 31.7508 53.1075 32.0585 53.1075 32.3814V46.5962C53.1075 47.2572 52.8688 47.8231 52.3915 48.2939C51.9142 48.7646 51.3403 49 50.67 49H35.33ZM44.3975 31.3878V26.4038H35.33V46.5962H50.67V32.5897H45.6162C45.2804 32.5897 44.9933 32.4722 44.755 32.2372C44.5167 32.0021 44.3975 31.719 44.3975 31.3878Z"
                      fill="#667175"
                    ></path>
                    <path
                      d="M30 37.782C30 36.3659 31.1641 35.2179 32.6 35.2179H53.4C54.8359 35.2179 56 36.3659 56 37.7821V42.3974C56 43.8136 54.8359 44.9615 53.4 44.9615H32.6C31.1641 44.9615 30 43.8136 30 42.3974V37.782Z"
                      fill="#FE4A49"
                    ></path>
                    <path
                      d="M37.0668 36.5C37.5244 36.5 37.9265 36.5991 38.2732 36.7974C38.6199 36.9889 38.8903 37.2624 39.0844 37.618C39.2785 37.9667 39.3756 38.3701 39.3756 38.8282C39.3756 39.2795 39.2785 39.6761 39.0844 40.018C38.8972 40.353 38.6268 40.6162 38.2732 40.8077C37.9265 40.9923 37.5279 41.0846 37.0772 41.0846H36.2348C36.1932 41.0846 36.1724 41.1051 36.1724 41.1462V43.5256C36.1724 43.5735 36.1585 43.6111 36.1308 43.6385C36.1031 43.6658 36.0649 43.6795 36.0164 43.6795H34.3732C34.3247 43.6795 34.2865 43.6658 34.2588 43.6385C34.2311 43.6111 34.2172 43.5735 34.2172 43.5256V36.6538C34.2172 36.606 34.2311 36.5684 34.2588 36.541C34.2865 36.5137 34.3247 36.5 34.3732 36.5H37.0668ZM36.734 39.5769C36.942 39.5769 37.1084 39.5154 37.2332 39.3923C37.358 39.2624 37.4204 39.088 37.4204 38.8692C37.4204 38.6436 37.358 38.4692 37.2332 38.3462C37.1084 38.2162 36.942 38.1513 36.734 38.1513H36.2348C36.1932 38.1513 36.1724 38.1718 36.1724 38.2128V39.5154C36.1724 39.5564 36.1932 39.5769 36.2348 39.5769H36.734Z"
                      fill="white"
                    ></path>
                    <path
                      d="M40.8316 43.6795C40.7831 43.6795 40.7449 43.6658 40.7172 43.6385C40.6895 43.6111 40.6756 43.5735 40.6756 43.5256V36.6538C40.6756 36.606 40.6895 36.5684 40.7172 36.541C40.7449 36.5137 40.7831 36.5 40.8316 36.5H43.1924C43.7055 36.5 44.1561 36.5923 44.5444 36.7769C44.9327 36.9547 45.2343 37.2077 45.4492 37.5359C45.6641 37.8641 45.7716 38.2436 45.7716 38.6744V41.4949C45.7716 41.9256 45.6641 42.3085 45.4492 42.6436C45.2343 42.9718 44.9327 43.2282 44.5444 43.4128C44.1561 43.5906 43.7055 43.6795 43.1924 43.6795H40.8316ZM42.6308 41.9667C42.6308 42.0077 42.6516 42.0282 42.6932 42.0282L43.2028 42.018C43.3761 42.018 43.5183 41.9496 43.6292 41.8128C43.7471 41.6761 43.8095 41.4949 43.8164 41.2692V38.9C43.8164 38.6744 43.7575 38.4932 43.6396 38.3564C43.5287 38.2197 43.3796 38.1513 43.1924 38.1513H42.6932C42.6516 38.1513 42.6308 38.1718 42.6308 38.2128V41.9667Z"
                      fill="white"
                    ></path>
                    <path
                      d="M51.7828 37.9974C51.7828 38.0453 51.7689 38.0829 51.7412 38.1103C51.7135 38.1376 51.6753 38.1513 51.6268 38.1513H49.0892C49.0476 38.1513 49.0268 38.1718 49.0268 38.2128V39.1769C49.0268 39.2179 49.0476 39.2385 49.0892 39.2385H50.5556C50.6041 39.2385 50.6423 39.2521 50.67 39.2795C50.6977 39.3068 50.7116 39.3444 50.7116 39.3923V40.7256C50.7116 40.7735 50.6977 40.8111 50.67 40.8385C50.6423 40.8658 50.6041 40.8795 50.5556 40.8795H49.0892C49.0476 40.8795 49.0268 40.9 49.0268 40.941V43.5256C49.0268 43.5735 49.0129 43.6111 48.9852 43.6385C48.9575 43.6658 48.9193 43.6795 48.8708 43.6795H47.2276C47.1791 43.6795 47.1409 43.6658 47.1132 43.6385C47.0855 43.6111 47.0716 43.5735 47.0716 43.5256V36.6538C47.0716 36.606 47.0855 36.5684 47.1132 36.541C47.1409 36.5137 47.1791 36.5 47.2276 36.5H51.6268C51.6753 36.5 51.7135 36.5137 51.7412 36.541C51.7689 36.5684 51.7828 36.606 51.7828 36.6538V37.9974Z"
                      fill="white"
                    ></path>
                    <defs>
                      <filter
                        id="filter0_d_3907_4956"
                        x="28.183"
                        y="19.2135"
                        width="77.0473"
                        height="79.7029"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        ></feColorMatrix>
                        <feOffset dy="2"></feOffset>
                        <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          operator="out"
                        ></feComposite>
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                        ></feColorMatrix>
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_3907_4956"
                        ></feBlend>
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_3907_4956"
                          result="shape"
                        ></feBlend>
                      </filter>
                      <filter
                        id="filter1_d_3907_4956"
                        x="25.4036"
                        y="5.6814"
                        width="70.9864"
                        height="82.5387"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        ></feColorMatrix>
                        <feOffset dx="2" dy="2"></feOffset>
                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          operator="out"
                        ></feComposite>
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                        ></feColorMatrix>
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_3907_4956"
                        ></feBlend>
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_3907_4956"
                          result="shape"
                        ></feBlend>
                      </filter>
                      <filter
                        id="filter2_d_3907_4956"
                        x="19.1473"
                        y="0.630737"
                        width="54.7647"
                        height="73.8308"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        ></feFlood>
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        ></feColorMatrix>
                        <feOffset dx="4" dy="2"></feOffset>
                        <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                        <feComposite
                          in2="hardAlpha"
                          operator="out"
                        ></feComposite>
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                        ></feColorMatrix>
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_3907_4956"
                        ></feBlend>
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_3907_4956"
                          result="shape"
                        ></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </p>
                <p className="text-2xl font-semibold">
                  Upload PDF or Apple Wallet tickets
                </p>
                <p className="text-primary001 font-semibold">
                  Select a file or drag and drop it here
                </p>
              </div>
            </label>
          </div>
        </div>
        {pdfFileUrl?.length > 0 && (
          <Link to={"/sell-tickets"} className="py-5 w-full">
            <button className="bg-primary001/20 text-primary001 font-semibold px-8 py-2 rounded-full flex items-end justify-end">
              Next
            </button>
          </Link>
        )}
      </Container>
    </div>
  );
};

export default Tickets;
