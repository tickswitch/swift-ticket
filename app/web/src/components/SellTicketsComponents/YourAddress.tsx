import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CheckElement from "../AddToCart/CheckElement";
import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setStep } from "@/features/StepperSlice";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { updateData } from "@/features/SellTicketSlice";

type FormValues = {
  bank_country: string;
  city: string;
  address: string;
  postal_code: number;
};

const YourAddress = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  // react hook form using for form validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log("form data submit", data);
    dispatch(setStep(7));
    navigate("/bank-details");
    dispatch(
      updateData({
        bank_country: data?.bank_country,
        address: data?.address,
        city: data?.city,
        postal_code: data?.postal_code,
      })
    );
  };
  countries.registerLocale(enLocale);

  // country select handler

  const handleCountrySelect = (code: string) => {
    setSelected(code);
    const countryName = countries.getName(code, "en");
    setValue("bank_country", countryName);
  };

  const progress = useSelector((state: RootState) => state.stepper.progress);

  return (
    <div className="max-w-[872px] mx-auto pt-10 px-5 lg:px-0">
      <h3 className="text-2xl md:text-[36px] font-semibold text-[#181818] mb-4">
        Add Your Address
      </h3>
      {/* stepper */}
      <div>
        <p className="text-base sm:text-xl md:text-2xl font-semibold text-secondaryText001">
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

      {/* select address inputs */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-8"
      >
        <div className="flex flex-col gap-2 h-full">
          <label
            htmlFor="bank_country"
            className="flex flex-col text-base md:text-[20px] text-[#606060] font-semibold gap-[6px]"
          >
            Country of residence
            <ReactFlagsSelect
              id="bank_country"
              selected={selected}
              onSelect={handleCountrySelect}
            />
            <input
              type="hidden"
              {...register("bank_country", { required: true })}
            />
            {errors.bank_country && (
              <p className="text-red-500 text-xs">Country is required</p>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="city"
            className="flex flex-col text-base md:text-[20px] text-[#606060] font-semibold gap-[6px] "
          >
            City
            <input
              {...register("city", { required: "City Name is Required" })}
              className="bg-white py-[15px] px-[14px] focus:outline-0 rounded-[12px] h-[60px] border border-[#E7EAEC] text-[#9F9F9F] text-base md:text-[20px] font-normal"
              type="text"
              id="city"
              placeholder="Enter City Name"
            />
            {errors.city && (
              <p className="text-red-500 text-xs">{errors.city.message}</p>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-2 h-full">
          <label
            htmlFor="address"
            className="flex flex-col text-base md:text-[20px] text-[#606060] font-semibold gap-[6px] "
          >
            Address
            <input
              {...register("address", { required: "Address is required" })}
              className="bg-white py-[15px] px-[14px] focus:outline-0 rounded-[12px] h-[60px] border border-[#E7EAEC] text-[#9F9F9F] text-base md:text-[20px] font-normal"
              type="text"
              id="address"
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="postalCode"
            className="flex flex-col text-base md:text-[20px] text-[#606060] font-semibold gap-[6px] "
          >
            Postal Code
            <input
              {...register("postal_code", {
                required: "Postal Code is required",
              })}
              className="bg-white py-[15px] px-[14px] focus:outline-0 rounded-[12px] h-[60px] border border-[#E7EAEC] text-[#9F9F9F] text-base md:text-[20px] font-normal"
              type="number"
              id="postalCode"
              placeholder="Enter postal code"
            />
            {errors.postal_code && (
              <p className="text-red-500 text-xs">
                {errors.postal_code.message}
              </p>
            )}
          </label>
        </div>

        {/* buttons */}
        <div className="pt-6 pb-[50px] flex gap-[10px] items-center">
          <Link to={"/your-ticket-price"}>
            <button className="text-base text-[#178AFF] py-2 px-10 rounded-[38px] border border-[#178AFF] w-[187px] cursor-pointer">
              Back
            </button>
          </Link>

          <button
            type="submit"
            className={`text-base text-white bg-[#178AFF] py-2 px-10 rounded-[38px] border border-[#178AFF] w-[187px] cursor-pointer`}
          >
            Next
          </button>
        </div>
      </form>

      <CheckElement />
    </div>
  );
};

export default YourAddress;
