import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import CheckElement from "../AddToCart/CheckElement";
import { useState } from "react";
import {
  Link,
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router";
import { setStep } from "@/features/StepperSlice";
import { useDispatch } from "react-redux";
import { updateData } from "@/features/SellTicketSlice";
import { ChevronLeft } from "lucide-react";

const AddTicketDetails = () => {
  const location: Location = useLocation();
  const isEdit = location.state;
  const progress = useSelector((state: RootState) => state.stepper.progress);

  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [isContent, setIsContent] = useState<string>("");
  const [hasSpecificSeats, setHasSpecificSeats] = useState(false);
  const [entrance, setEntrance] = useState("");
  const [row, setRow] = useState("");
  const [seat, setSeat] = useState("");
  const [section, setSection] = useState("");

  const saveToRedux = () => {
    dispatch(updateData({
      additional_info: isContent,
      has_specific_seats: hasSpecificSeats,
      ...(hasSpecificSeats ? { entrance, row, seat, section } : {}),
    }));
  };

  const handleNext = () => {
    saveToRedux();
    dispatch(setStep(4));
    navigate("/ticket-price");
  };

  const gotoEditWithNextPage = () => {
    saveToRedux();
    navigate("/review-finish");
  };

  return (
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">
      <h3 className="text-2xl lg:text-[36px] font-semibold text-[#181818] mb-2">
        Add ticket details
      </h3>

      {/* stepper */}
      <div>
        <p className="text-base text-[#606060]">
          Buyers will feel more confident buying your ticket.
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Specific seats checkbox */}
      <div className="pt-5">
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={hasSpecificSeats}
            onChange={(e) => setHasSpecificSeats(e.target.checked)}
            className="w-4 h-4 accent-[#178AFF] cursor-pointer"
          />
          <span className="text-[#181818] text-base">These tickets have specific seats.</span>
        </label>
      </div>

      {/* Seating info — shown when checkbox is checked */}
      {hasSpecificSeats && (
        <div className="mt-4 border border-[#EBECEF] rounded-xl p-5 bg-white">
          <p className="text-base font-semibold text-[#181818] mb-4">Seating info</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#606060]">Entrance</label>
              <input
                type="text"
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
                className="border border-[#EBECEF] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#178AFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#606060]">Row</label>
              <input
                type="text"
                value={row}
                onChange={(e) => setRow(e.target.value)}
                className="border border-[#EBECEF] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#178AFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#606060]">Seat</label>
              <input
                type="text"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                className="border border-[#EBECEF] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#178AFF]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#606060]">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="border border-[#EBECEF] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#178AFF]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional info */}
      <div className="flex flex-col justify-start pt-6">
        <span className="text-base font-semibold text-[#181818] mb-2">
          Additional info (optional)
        </span>
        <textarea
          value={isContent}
          onChange={(e) => setIsContent(e.target.value)}
          className="h-[189px] w-full px-4 py-3 rounded-xl text-[#606060] text-base bg-white border border-[#EBECEF] resize-none focus:outline-none focus:border-[#178AFF]"
          placeholder="Type"
        />
        <p className="text-[#949494] text-sm mt-2">
          Provide details about your ticket that might be crucial to potential buyers. For example: entrance time, seating information, child ticket, VIP, valid until, time slot, day or night ticket, etc.
        </p>
      </div>

      {/* buttons */}
      <div className={`pt-6 pb-10 flex items-center justify-between ${isEdit ? "hidden" : "flex"}`}>
        <Link to="/upload-tickets">
          <button className="flex items-center gap-2 bg-blue-50 text-[#178AFF] font-medium px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
            <ChevronLeft size={18} />
            Back
          </button>
        </Link>
        <button
          onClick={handleNext}
          className="bg-[#178AFF] text-white font-medium px-8 py-2.5 rounded-xl hover:bg-[#1279e6] transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>

      <button
        onClick={gotoEditWithNextPage}
        className={`mb-10 ${isEdit ? "block" : "hidden"} text-base text-white bg-primary001 py-2 px-10 rounded-4xl border border-primary001 cursor-pointer`}
      >
        Continue
      </button>

      <CheckElement />
    </div>
  );
};

export default AddTicketDetails;
