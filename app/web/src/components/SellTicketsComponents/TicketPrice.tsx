import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  Select2,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select2";
import { DownArrow } from "./TicketIcons";
import CheckElement from "../AddToCart/CheckElement";
import { Link, NavigateFunction, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { TbCoinTaka } from "react-icons/tb";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { setStep } from "@/features/StepperSlice";
import { updateData } from "@/features/SellTicketSlice";

const TicketPrice = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>("Rupe");
  const [amount, setAmount] = useState<string>("");

  // chech is select input and number input has valu or not
  const isButtonDisabled =
    !selectedOption || amount.trim() === "" || isNaN(Number(amount));

  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = () => {
    if (isButtonDisabled) return;
    if (amount.trim() === "" || selectedOption === null) {
      toast.error("Add the required fields");
      return;
    }
    dispatch(setStep(5));
    dispatch(
      updateData({
        original_price: Number(amount),
        originalFaceValue: Number(amount),
      })
    );
    navigate("/your-ticket-price");
  };

  const progress = useSelector((state: RootState) => state.stepper.progress);

  return (
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">
      <h3 className="text-2xl md:text-[36px] font-semibold text-[#181818] mb-4">
        Add The Original Price Per Ticket
      </h3>

      {/* stepper */}
      <div>
        <p className="text-xl md:text-2xl font-semibold text-secondaryText001">
          Make Sure to include the service fees
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="pt-8 flex flex-col lg:flex-row items-center gap-[9px]">
        <div className="w-full">
          <Select2 defaultValue="Rupe" onValueChange={(value) => setSelectedOption(value)}>
            <SelectTrigger className="w-full rounded-[12px] flex-none bg-white border border-[#606060] py-[30px]">
              <SelectValue placeholder="Select a Currency" /> <DownArrow />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md">
              <SelectGroup>
                <SelectItem value="Rupe">
                  Rupee <RiMoneyRupeeCircleLine className="text-[#606060]" />
                </SelectItem>
                <SelectItem value="BDT">
                  Taka <TbCoinTaka className="text-[#606060]" />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select2>
        </div>

        <div className="w-full bg-white inline-flex items-center relative border border-[#606060] rounded-[12px]">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="text"
            placeholder="00"
            inputMode="numeric"
            className="w-[65%] ps-5 bg-white text-right pr-[100px] h-[60px] text-[#181818] font-semibold text-2xl focus:border-0 focus:outline-0 focus:ring-0 rounded-[12px] placeholder:text-[#A8A8A8] placeholder:text-[20px]"
          />
          <span className="absolute right-[130px] top-1/2 -translate-y-1/2 text-[#A8A8A8] text-[20px] pointer-events-none">
            Per Ticket
          </span>
        </div>
      </div>

      {/* buttons */}
      <div className="pt-6 pb-10 flex items-center justify-between">
        <Link to="/add-ticket-details">
          <button className="flex items-center gap-2 bg-blue-50 text-[#178AFF] font-medium px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
            <ChevronLeft size={18} />
            Back
          </button>
        </Link>
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`bg-[#178AFF] text-white font-medium px-8 py-2.5 rounded-xl hover:bg-[#1279e6] transition-colors ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          Next
        </button>
      </div>

      <CheckElement />
    </div>
  );
};

export default TicketPrice;
