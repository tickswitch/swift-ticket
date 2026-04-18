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

const AddTicketDetails = () => {
  const location: Location = useLocation();
  const isEdit = location.state;
  const progress = useSelector((state: RootState) => state.stepper.progress);

  const navigate: NavigateFunction = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [isContent, setIsContent] = useState<string>("");

  const handleTextare = () => {
    dispatch(
      updateData({
        additional_info: isContent,
      })
    );
    gotoEditWithNextPage();
    navigate("/ticket-price");
  };

  const handleNext = () => {
    dispatch(
      updateData({
        additional_info: isContent,
      })
    );
    dispatch(setStep(4));
    navigate("/ticket-price");
  };
  const gotoEditWithNextPage = () => {
    dispatch(
      updateData({
        additional_info: isContent,
      })
    );
    navigate("/review-finish");
  };

  return (
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">
      <h3 className="text-2xl lg:text-[36px] font-semibold text-[#181818] mb-4">
        Add Tickets Details
      </h3>

      {/* stepper */}
      <div>
        <p className="text-base md:text-xl lg:text-2xl font-semibold text-secondaryText001">
          Fans will only be able to see your tickets once they’ve bought them.
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* ticket info */}
      <div className="flex flex-col justify-start pt-6">
        <span className="text-xl md:text-2xl text-[#606060] font-semibold">
          Additional Info (optional)
        </span>
        <p className="text-[#606060] text-base md:text-xl font-normal ">
          Lorem ipsum dolor sit amet consectetur. Sodales morbi bibendum a
          volutpat quis sollicitudin ut sit sed. Lorem lectus sed sodales varius
          consectetur auctor.
        </p>
        <div className="pt-[10px]">
          <textarea
            value={isContent}
            onChange={(e) => setIsContent(e.target.value)}
            className="h-[189px] w-full px-4 py-5 rounded-[12px] text-[#949494] text-base md:text-[20px] bg-white resize-none"
            name=""
            id=""
            placeholder="Type"
          ></textarea>
        </div>
      </div>

      {/* buttons */}
      <div className="pt-6 pb-[50px] flex gap-[10px] items-center">
        <Link to={"/upload-tickets"}>
          <button
            className={`  ${
              isEdit ? " hidden" : "block"
            } text-base text-[#178AFF] py-2 rounded-[38px] border border-[#178AFF]  px-16 cursor-pointer`}
          >
            Back
          </button>
        </Link>

        {isContent.length < 15 ? (
          <>
            <button
              onClick={handleTextare}
              className={` ${
                isEdit ? " hidden" : "block"
              } text-base text-white bg-[#178AFF] py-2 rounded-[38px] border border-[#178AFF]  px-16 cursor-pointer`}
            >
              Next
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              handleTextare();
              handleNext();
            }}
            className={` ${
              isEdit ? " hidden" : "block"
            } text-base text-white bg-[#178AFF] py-2 px-10 rounded-[38px] border border-[#178AFF] w-[187px] cursor-pointer`}
          >
            Next
          </button>
        )}
        <button
          onClick={() => {
            gotoEditWithNextPage();
          }}
          className={` ${
            isEdit ? " block" : "hidden"
          } text-base text-white bg-primary001 py-2 px-10 rounded-4xl border  border-primary001 w-[187px] cursor-pointer`}
        >
          Continue
        </button>
      </div>

      <CheckElement />
    </div>
  );
};

export default AddTicketDetails;
