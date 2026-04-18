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
import CheckElement from "../AddToCart/CheckElement"; 
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { TbCoinTaka } from "react-icons/tb"; 
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setStep } from "@/features/StepperSlice";
import { updateData } from "@/features/SellTicketSlice";

const YourTicketPrice = () => {
  const location: Location = useLocation();
  const isEdit = location.state;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");

  const isButtonDisabled =
    !selectedOption || amount.trim() === "" || isNaN(Number(amount));

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

  // per ticket price
  const perTicket = Number(amount) * 0.05;
  const perTicketPrice = Number(amount) - perTicket;

  // buyer price
  const buyerPecentageAmount = Number(amount) * 0.1;
  const buyerPrice = parseInt(amount) + buyerPecentageAmount;

  const maximumPricePercentage = parseInt(amount) * 0.2;
  console.log(maximumPricePercentage);
  const maximumPrice = parseInt(amount) + maximumPricePercentage || 0;
  const pp = info?.data?.original_price * 0.2;
  const maxPrice = parseInt(info?.data?.original_price) + parseInt(pp);
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

      {/* ticket select buttons */}
      <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center gap-[9px]">
        <div className="w-full">
          <Select2 onValueChange={(value) => setSelectedOption(value)}>
            <SelectTrigger className="w-full rounded-[12px] flex-none bg-white border border-[#606060] py-[30px] ">
              <SelectValue placeholder="Select a Currency" /> <DownArrow />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md">
              <SelectGroup>
                <SelectItem value="Rupe">
                  Rupee
                  <RiMoneyRupeeCircleLine className=" text-[#606060]" />
                </SelectItem>
                <SelectItem value="BDT">
                  Taka
                  <TbCoinTaka className="text-[#606060]" />
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select2>
        </div>

        <div className="w-full inline-flex relative">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            defaultValue={"400"}
            type="text"
            placeholder="00"
            inputMode="numeric"
            className="w-full ps-5 bg-white text-right border border-[#606060] pr-[122px] h-[60px] text-[#181818] font-semibold text-2xl focus:border-0 focus:outline-0 focus:ring-0 rounded-[12px] placeholder:text-[#A8A8A8] placeholder:text-[20px]"
          />
          <span className="absolute right-[25px] top-1/2 -translate-y-1/2 text-[#A8A8A8] text-[20px] pointer-events-none">
            Per Ticket
          </span>
        </div>

        <div className="w-full inline-flex relative">
          <input
            value={"$" + info?.data?.original_price}
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
            value={"$" + maxPrice || "0"}
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
              {perTicketPrice || "0"}{" "}
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
            Your price plus 7% service fee & 3% transaction fee.
          </span>
          <div className="flex items-start gap-[6px]">
            <MoneyIcon />
            <h6 className="text-[#606060] text-2xl md:text-[32px] font-semibold">
              {buyerPrice || "0"}{" "}
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
      <div className="pt-6 pb-[50px] flex gap-[10px] items-center">
        <Link to={"/ticket-price"}>
          <button
            className={` ${
              isEdit ? " hidden" : "block"
            } text-base text-[#178AFF] py-2 px-16 rounded-[38px] border border-[#178AFF] cursor-pointer`}
          >
            Back
          </button>
        </Link>
        {isButtonDisabled ? (
          <Link className={`${isButtonDisabled && "cursor-not-allowed"}`} to="">
            <button
              // disabled={isButtonDisabled}
              className={` ${
                isEdit ? " hidden" : "block"
              } text-base text-white bg-[#178AFF] py-2 px-16 rounded-[38px] border border-[#178AFF]  ${
                isButtonDisabled ? "cursor-not-allowed " : "cursor-pointer"
              }`}
            >
              Next
            </button>
          </Link>
        ) : (
          <Link onClick={handleSubmit} to="/your-address">
            <button
              // disabled={isButtonDisabled}
              className={` ${
                isEdit ? " hidden" : "block"
              } text-base text-white bg-[#178AFF] py-2 px-16 rounded-[38px] border border-[#178AFF] ${
                isButtonDisabled ? "cursor-not-allowed " : "cursor-pointer"
              }`}
            >
              Next
            </button>
          </Link>
        )}

        {isButtonDisabled ? (
          <button
            onClick={gotoEditWithNextPage}
            className={` ${
              isEdit ? " block" : "hidden"
            } text-base text-white bg-[#178AFF] py-2 px-16 rounded-[38px] border border-[#178AFF]  ${
              isButtonDisabled ? "cursor-not-allowed " : "cursor-pointer"
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={gotoEditWithNextPage}
            className={` ${
              isEdit ? " block" : "hidden"
            } text-base text-white bg-[#178AFF] py-2 px-16 rounded-[38px] border border-[#178AFF] ${
              isButtonDisabled ? "cursor-not-allowed " : "cursor-pointer"
            }`}
          >
            Continue
          </button>
        )}
      </div>

      <CheckElement />
    </div>
  );
};

export default YourTicketPrice;
