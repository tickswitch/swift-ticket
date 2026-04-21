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
import { DownArrow, MoneyIcon } from "./TicketIcons";
import {
  Link,
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router";
import { ChevronLeft } from "lucide-react";
import CheckElement from "../AddToCart/CheckElement"; 
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { TbCoinTaka } from "react-icons/tb"; 
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setStep } from "@/features/StepperSlice";
import { updateData } from "@/features/SellTicketSlice";
import { priceCap } from "@/utils/priceCap";

const YourTicketPrice = () => {
  const location: Location = useLocation();
  const isEdit = location.state;
  const [selectedOption, setSelectedOption] = useState<string | null>("Rupe");
  const [amount, setAmount] = useState<string>("");

  const faceValue =
    useSelector(
      (state: RootState) => state.sellTicket.data.originalFaceValue
    ) ?? 0;
  const maxAllowed = priceCap.maxListingPrice(faceValue);
  const numericPrice = Number(amount);
  const priceExceedsCap =
    amount.trim() !== "" && !isNaN(numericPrice) && numericPrice > maxAllowed;

  const isButtonDisabled =
    !selectedOption ||
    amount.trim() === "" ||
    isNaN(numericPrice) ||
    numericPrice > maxAllowed;

  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();

  const handleSubmit = () => {
    if (isButtonDisabled) return;

    if (selectedOption === null || amount.trim() === "") {
      toast.error("Please select at least one event.");
      return;
    }
    dispatch(setStep(6));
    dispatch(
      updateData({
        price: Number(amount),
      })
    );
    navigate("/your-address");
  };

  const progress = useSelector((state: RootState) => state.stepper.progress);

  const gotoEditWithNextPage = () => {
    if (isButtonDisabled) return;
    toast.success("You are successfully  Updated Your Ticket price Page");

    if (selectedOption === null || amount.trim() === "") {
      toast.error("Please select at least one event.");
      return;
    }
    navigate("/review-finish");
  };

  const info = JSON.parse(localStorage.getItem("sellTicket") || "null");
  return (
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">
      <h3 className="text-2xl md:text-[36px] font-semibold text-[#181818] mb-4">
        Set Your Ticket Price
      </h3>

      {/* stepper */}
      <div>
        <p className="text-xl md:text-2xl font-semibold text-secondaryText001">
          The original ticket price was ${info?.data?.original_price}. To keep
          things fair, you can list it for up to 20% more than the face value.
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Face-value and cap info */}
      <div className="pt-6 flex flex-col gap-1">
        <p className="text-base md:text-xl text-[#606060]" data-testid="face-value-label">
          Original face value: ₹{faceValue.toLocaleString("en-IN")}
        </p>
        <p
          className="text-base md:text-xl font-semibold"
          style={{ color: "#FEC100" }}
          data-testid="max-listing-price-label"
        >
          Maximum you can list for: ₹
          {maxAllowed.toLocaleString("en-IN")}
        </p>
      </div>

      {/* ticket select buttons */}
      <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-[9px]">
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

        <div className="w-full inline-flex relative">
          <input
            value={amount}
            onChange={(e) => {
              const raw = e.target.value;
              const digitsOnly = raw.replace(/[^0-9]/g, "");
              const parsed = digitsOnly === "" ? NaN : Number(digitsOnly);
              if (!isNaN(parsed) && faceValue > 0 && parsed > maxAllowed) {
                toast.error(
                  `SwiftTickets enforces fair pricing. Maximum price is ₹${maxAllowed.toLocaleString(
                    "en-IN"
                  )}`
                );
                setAmount(String(maxAllowed));
                return;
              }
              setAmount(digitsOnly);
            }}
            type="number"
            min={0}
            max={maxAllowed}
            step={50}
            placeholder="00"
            inputMode="numeric"
            data-testid="listing-price-input"
            className="w-full ps-5 bg-white text-right border border-[#606060] pr-[122px] h-[60px] text-[#181818] font-semibold text-2xl focus:border-0 focus:outline-0 focus:ring-0 rounded-[12px] placeholder:text-[#A8A8A8] placeholder:text-[20px]"
          />
          <span className="absolute right-[25px] top-1/2 -translate-y-1/2 text-[#A8A8A8] text-[20px] pointer-events-none">
            Per Ticket
          </span>
        </div>

        <div className="w-full inline-flex relative">
          <input
            readOnly
            value={"₹" + (info?.data?.original_price ?? faceValue)}
            type="text"
            placeholder="00"
            inputMode="numeric"
            className="w-full ps-5 bg-[#2FA75F] text-right pr-[95px] h-[60px] text-white font-semibold text-[20px] focus:border-0 focus:outline-0 focus:ring-0 rounded-[12px] placeholder:text-white placeholder:text-[20px]"
          />
          <span className="absolute right-[32px] top-1/2 -translate-y-1/2 text-[#FFFFFF] text-base pointer-events-none">
            Original
          </span>
        </div>

        <div className="w-full inline-flex relative">
          <input
            readOnly
            value={"₹" + maxAllowed}
            type="text"
            placeholder="00"
            inputMode="numeric"
            className="w-full ps-5 bg-[#FEC100] text-right pr-[98px] h-[60px] text-[#181818] font-semibold text-[20px] focus:border-0 focus:outline-0 focus:ring-0 rounded-[12px] placeholder:text-[#A8A8A8] placeholder:text-[20px]"
          />
          <span className="absolute right-[24px] top-1/2 -translate-y-1/2 text-[#181818] text-base pointer-events-none">
            Maximum
          </span>
        </div>
      </div>

      {/* Cap violation error */}
      {priceExceedsCap && (
        <p
          className="text-red-600 text-sm md:text-base mt-3"
          data-testid="price-cap-error"
        >
          SwiftTickets enforces fair pricing. Maximum price is ₹
          {maxAllowed.toLocaleString("en-IN")}
        </p>
      )}

      {/* Live fee preview */}
      <div className="mt-4 flex flex-col gap-1" data-testid="price-preview-block">
        <div className="flex items-center justify-between text-base md:text-xl text-[#606060]">
          <span>What you'll get per ticket <span className="text-sm">(your price minus 5% seller fee)</span></span>
          <span className="font-semibold text-[#2FA75F]" data-testid="seller-receives-label">
            ₹{priceCap.sellerReceives(isNaN(numericPrice) ? 0 : numericPrice).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between text-base md:text-xl text-[#606060]">
          <span>Buyer pays per ticket <span className="text-sm">(your price plus 6% service fee & 3% transaction fee)</span></span>
          <span className="font-semibold text-[#181818]">
            ₹{priceCap.totalBuyerPays(isNaN(numericPrice) ? 0 : numericPrice).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* your facilities when you buy tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[9px] pt-4">
        <div className="bg-white rounded-[12px] border border-[] py-[32px] px-5 md:px-10 lg:px-[76px] flex flex-col justify-start items-center text-center w-full">
          <h3 className="text-[#606060] text-xl md:text-2xl font-semibold">
            What you’ll get per ticket
          </h3>
          <span className="text-base md:text-[20px] text-[#606060]">
            Your price minus 5% service fee
          </span>
          <div className="flex items-start gap-[6px]">
            <MoneyIcon />
            <h6 className="text-[#606060] text-2xl md:text-[32px] font-semibold">
              {priceCap.sellerReceives(isNaN(numericPrice) ? 0 : numericPrice) || "0"}{" "}
              <small className="text-[#9F9F9F] text-base md:text-[20px] font-normal">
                Per ticket
              </small>
            </h6>
          </div>
        </div>

        <div className="w-full  bg-white rounded-[12px] border border-[] py-[32px] px-5 md:px-10 lg:px-[76px] flex flex-col justify-start items-center text-center">
          <h3 className="text-[#606060] text-xl md:text-2xl font-semibold">
            Byer pays per ticket
          </h3>
          <span className="text-base md:text-[20px] text-[#606060]">
            Your price plus 5% service fee.
          </span>
          <div className="flex items-start gap-[6px]">
            <MoneyIcon />
            <h6 className="text-[#606060] text-2xl md:text-[32px] font-semibold">
              {priceCap.totalBuyerPays(isNaN(numericPrice) ? 0 : numericPrice) || "0"}{" "}
              <small className="text-[#9F9F9F] text-base md:text-[20px] font-normal">
                Per ticket
              </small>
            </h6>
          </div>
        </div>
      </div>

      <span className="text-[#606060] text-[20px] my-6 block">
        How to fees work,{" "}
        <Link to={""} className="text-[#178AFF] font-normal">
          Read More...
        </Link>
      </span>

      {/* buttons */}
      <div className={`pt-6 pb-10 flex items-center justify-between ${isEdit ? "hidden" : "flex"}`}>
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

      <button
        onClick={gotoEditWithNextPage}
        disabled={isButtonDisabled}
        className={`mb-10 ${isEdit ? "block" : "hidden"} text-base text-white bg-primary001 py-2 px-10 rounded-4xl border border-primary001 ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        Continue
      </button>

      <CheckElement />
    </div>
  );
};

export default YourTicketPrice;
