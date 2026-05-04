import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  TicketDeleteIcon,
  TicketPdfIcon,
  TicketPdfUpload,
  TicketUploadIcon,
} from "./TicketIcons";
import CheckElement from "../AddToCart/CheckElement";
import {
  Link,
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { setStep } from "@/features/StepperSlice";
import { updateData, setUploadedFiles } from "@/features/SellTicketSlice";
import { UploadPdf } from "@/types/FileTypes";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const TicketsUpload = () => {
  const location: Location = useLocation();
  const isEdit = location.state;
  const progress = useSelector((state: RootState) => state.stepper.progress);

  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  // Store files separately from Redux to maintain File objects
  const [pdfFileUrl, setPdfFileUrl] = useState<UploadPdf[]>([]);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   
  const [, setNumPages] = useState<number>(0);
  const [pageNumber] = useState<number>(1);

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
        lastModified: file.lastModified
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

      // Store File objects in Redux (non-persisted field)
      const fileObjects = updated.map((item) => item.file);
      dispatch(setUploadedFiles(fileObjects));

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

  // Initialize files from Redux store on component mount
  const storedFiles = useSelector(
    (state: RootState) => state.sellTicket.uploadedFiles
  );
  useEffect(() => {
    if (storedFiles && storedFiles.length > 0 && pdfFileUrl.length === 0) {
      const restoredFiles = storedFiles
        .filter((file) => file instanceof File)
        .map((file: File) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          file,
        }));
      if (restoredFiles.length > 0) {
        setPdfFileUrl(restoredFiles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (url: string) => {
    setPreviewUrl(url);
    setShowPdfPreview(true);
  };

  const closeModal = () => {
    setShowPdfPreview(false);
    setPreviewUrl(null);
  };

  const handleNext = () => {
    if (pdfFileUrl.length === 0) {
      toast.error("Must upload at least one PDF file");
      return;
    }
    // Make sure files are available in Redux
    dispatch(setUploadedFiles(pdfFileUrl.map((item) => item.file)));
    dispatch(setStep(3));
    navigate("/add-ticket-details");
  };

  const gotoEditWithNextPage = () => {
    if (pdfFileUrl.length === 0) {
      toast.error("Must upload at least one PDF file");
      return;
    }
    // Make sure files are available in Redux
    dispatch(setUploadedFiles(pdfFileUrl.map((item) => item.file)));
    navigate("/review-finish");
  };

  const handleDeleteFile = (idx: number) => {
    setPdfFileUrl((prev) => {
      const fileToDelete = prev[idx];
      const newFiles = prev.filter((_, i) => i !== idx);
      
      // Cleanup URL
      URL.revokeObjectURL(fileToDelete.url);

      // Update Redux store with the File objects
      dispatch(setUploadedFiles(newFiles.map((item) => item.file)));

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
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">

      <h3 className="text-2xl md:text-[36px] font-semibold text-[#181818] mb-4">
        Upload Ticket
      </h3>

      {/* Stepper */}
      <div>
        <p className="text-base md:text-xl lg:text-2xl font-semibold text-secondaryText001">
          Fans will only be able to see your tickets once they've bought them.
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

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

      {/* Upload tickets */}
      <div>
        <div className="flex flex-col md:flex-row pt-6 gap-[15px]">
          <div className="max-w-[622px] flex flex-col justify-center items-center text-center rounded-[12px] px-4 pb-3 pt-[6px] border-dashed border-[#178AFF] bg-[rgba(23, 138, 255, 0.10)]">
            <TicketUploadIcon />
            <h4 className="text-[#606060] text-[20px] font-semibold">
              Upload your tickets
            </h4>
            <p className="text-[#606060] text-base md:text-[20px]">
              Check the tips below per file format. You can choose which tickets
              to sell next.
            </p>
            <label className="flex items-center justify-center w-fit">
              <span className="text-base md:text-[20px] font-semibold text-[#178AFF] underline cursor-pointer">
                Drop files here or click to select
              </span>
              <input
                className="hidden"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handlePdfFileUpload}
              />
            </label>
          </div>

          <div className="flex flex-col justify-center items-center gap-1 text-center rounded-[12px] border border-[#DDD] bg-white px-4 py-[13px] w-full md:w-[235px]">
            <TicketPdfIcon />
            <span className="text-[20px] text-[#FEC100] font-semibold">PDF</span>
            <p className="text-[#949494] text-base">
              Kindly upload the unmodified original file.
            </p>
            <h4 className="text-base md:text-[20px] text-[#606060] font-semibold">
              Files you can upload
            </h4>
          </div>
        </div>

        {/* Back / Next buttons */}
        <div className={`pt-6 flex items-center justify-between ${isEdit ? "hidden" : "flex"}`}>
          <Link to="/sell-tickets">
            <button className="flex items-center gap-2 bg-blue-50 text-[#178AFF] font-medium px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
              <ChevronLeft size={18} />
              Back
            </button>
          </Link>
          <button
            onClick={handleNext}
            disabled={pdfFileUrl.length === 0}
            className={`bg-[#178AFF] text-white font-medium px-8 py-2.5 rounded-xl hover:bg-[#1279e6] transition-colors ${pdfFileUrl.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            Next
          </button>
        </div>

        {/* Continue button (edit mode only) */}
        <div className={`pt-6 ${isEdit ? "block" : "hidden"}`}>
          <button
            onClick={gotoEditWithNextPage}
            disabled={pdfFileUrl.length === 0}
            className={`text-base text-white py-2 px-16 rounded-[38px] border bg-[#178AFF] border-[#178AFF] ${
              pdfFileUrl.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            Continue
          </button>
        </div>

        {/* Quick tips accordion */}
        <div className="mt-10 pb-10">
          <h4 className="text-2xl font-bold text-[#181818] mb-4">Quick tips on uploading tickets</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base text-[#181818]">
                What if I don't want to sell all tickets in a file?
              </AccordionTrigger>
              <AccordionContent className="text-[#606060]">
                You can select which tickets to sell on the next step. Upload the full file and choose which ones to list.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base text-[#181818]">
                I don't have a PDF or Apple Wallet ticket – what can I do?
              </AccordionTrigger>
              <AccordionContent className="text-[#606060]">
                Contact the event organiser or your ticket provider to request a PDF version of your ticket. Most platforms allow you to download a PDF from your account.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base text-[#181818]">
                Why do I need the original file?
              </AccordionTrigger>
              <AccordionContent className="text-[#606060]">
                We verify tickets using the original file to protect buyers from fraud. Modified or screenshot files cannot be verified and will be rejected.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base text-[#181818]">
                When does a buyer get access to my tickets?
              </AccordionTrigger>
              <AccordionContent className="text-[#606060]">
                Whenever someone buys a ticket, they won't have access to view it until they've finished paying. Once they've completed payment, they'll be able to download the ticket or access it in the app or online.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <CheckElement />
      </div>
    </div>
  );
};

export default TicketsUpload;