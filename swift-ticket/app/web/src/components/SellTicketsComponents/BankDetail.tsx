import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import CheckElement from "../AddToCart/CheckElement";
import ReactFlagsSelect from "react-flags-select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { setStep } from "@/features/StepperSlice";
import { updateData } from "@/features/SellTicketSlice";

type Inputs = {
  example: string;
  phone_number: string;
  bank_account_number: string;
  account_holder_name: string;
  bank_country: string;
};
const BankDetail = () => {
  const location = useLocation();
  const isEdit = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const gotoEditWithNextPage = () => {
    dispatch(setStep(8));
    navigate("/review-finish");
  };
  const goToBackPage = () => {
    navigate("/your-address");
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(
      updateData({
        bank_country: data?.bank_country,
        account_holder_name: data?.account_holder_name,
        phone_number: data?.phone_number,
        bank_account_number: data?.bank_account_number,
      })
    );
    navigate("/review-finish");
    gotoEditWithNextPage();
  };
  console.log(watch("example"));

  const progress = useSelector((state: RootState) => state.stepper.progress);
  const currentStep = useSelector(
    (state: RootState) => state.stepper.currentStep
  );
  console.log("currentStep", currentStep);
  return (
    <div className="max-w-[872px] mx-auto pt-12 lg:px-0 px-5">
      {/* Top Title */}
      <h3 className="text-[#181818] sm:text-4xl text-3xl font-proximaSemiBold mb-4 ">
        Provide Your Banking Details
      </h3>

      {/* stepper */}
      <div>
        <p className="sm:text-2xl text-xl  text-secondaryText001">
          We just need your address to make sure your payment gets to the right
          place once your ticket sells.
        </p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-4">
          <div
            className="bg-secondary001 h-1 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* From Details */}

      <form
        className="mt-8 grid sm:grid-cols-2 grid-cols-1 gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1 w-full">
          <label className="text-secondaryText001 sm:text-xl text-base font-proximaSemiBold">
            Country of your Bank
          </label>
          <Controller
            name="bank_country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <ReactFlagsSelect
                className="border border-[#E7EAEC] font-proximaRegular text-[#606060] text-xl bg-white  px-3 rounded-md"
                selected={field.value}
                onSelect={field.onChange}
                selectButtonClassName="!border-none"
              />
            )}
          />
          {errors.bank_country && (
            <span className="text-red-500">{errors.bank_country.message}</span>
          )}
        </div>

        <div className="flex flex-col  gap-1 w-full">
          <label className="text-secondaryText001 sm:text-xl text-base font-proximaSemiBold">
            Full Name
          </label>
          <input
            {...register("account_holder_name", { required: true })}
            className="border border-[#E7EAEC] bg-white text-secondaryText001 sm:text-xl text-base focus:outline-none px-4 py-4 rounded-md"
            type="text"
            placeholder="Enter your name"
          />
          {errors.account_holder_name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        <div className="flex flex-col  gap-1 w-full">
          <label className="text-secondaryText001 sm:text-xl text-base font-proximaSemiBold">
            Phone Number
          </label>
          <input
            {...register("phone_number", { required: true })}
            className="border border-[#E7EAEC] bg-white text-secondaryText001 text-xl focus:outline-none px-4 py-4 rounded-md"
            placeholder="Phone Number"
            type="text"
            inputMode="numeric"
            pattern="[0-9-+]*"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9+-]/g, "");
            }}
          />
          {errors.phone_number && (
            <span className="text-red-600">
              {errors?.phone_number?.message}
            </span>
          )}
        </div>

        <div className="flex flex-col  gap-1 w-full">
          <label className="text-secondaryText001 sm:text-xl text-base font-proximaSemiBold">
            Bank Account Number (IBAN)
          </label>
          <input
            className="border border-[#E7EAEC] bg-white text-secondaryText001 sm:text-xl text-base focus:outline-none px-4 py-4 rounded-md"
            placeholder="xxxxxxxxxxxxxx"
            {...register("bank_account_number", {
              required: "IBAN is required",
              maxLength: {
                value: 34,
                message: "IBAN cannot be more than 34 characters",
              },
            })}
            type="text"
            inputMode="numeric"
            pattern="[0-9-]*"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9-]/g, "");
            }}
          />
          {errors.bank_account_number && (
            <span className="text-red-600">
              {errors?.bank_account_number?.message}
            </span>
          )}
        </div>

        <div className="pt-6 pb-[50px] flex gap-[10px] items-center">
          <button
            className={`${
              isEdit ? " hidden" : "block"
            } duration-300 hover:bg-primary001 hover:text-white text-base font-proximaSemiBold text-primary001 py-2 px-10 rounded-4xl border border-primary001 w-[187px] cursor-pointer`}
            onClick={goToBackPage}
          >
            Back
          </button>

          <button
            type="submit"
            className={` ${
              isEdit ? " hidden" : "block"
            } text-base text-white bg-primary001 py-2 px-10 rounded-4xl border font-proximaSemiBold  border-primary001 w-[187px] cursor-pointer`}
          >
            Next
          </button>
          <button
            type="submit"
            className={` ${
              isEdit ? " block" : "hidden"
            } text-base text-white bg-primary001 py-2 px-10 rounded-4xl border font-proximaSemiBold  border-primary001 w-[187px] cursor-pointer`}
          >
            Continue
          </button>
        </div>
      </form>
      <CheckElement />
    </div>
  );
};

export default BankDetail;
