import {
  cartIcon,
  checkSymbol, 
  masterCart,
  visaCart,
} from "@/assets";
import Container from "../Common/Container";
import {  useState } from "react";
import CheckElement from "../AddToCart/CheckElement";
import { Link } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form"; 
import { NetIcon } from "./Icons";
import { NetBankingData } from "@/assets/StaticData";

type Inputs = {
  holderName: string;
  cardNumber: number;
  cvvCode: number;
  dateFiled: Date;
  paymentMethod: string;
};

const Payment = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const [selectedMethod, setSelectedMethod] = useState("");
  const [method, setMethod] = useState({
    credit: false,
    netBanking: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }
    if (data) {
      // toast.success("Payment successfull.!");
      reset();
    }
    console.log(data);
  };

  return (
    <div className="bg-[#F4F4F4] py-[50px]">
      <Container className="lg:px-[225px] 2xl:px-[225px] px-5">
        <p className="text-[#181818] font-proximaSemiBold sm:text-4xl text-3xl">
          Payment Method
        </p>
        <p className="text-[#606060] font-proximaRegular sm:text-xl text-lg">
          Choose your prefered payment method. We’ll save your preference for
          next time.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className=" mt-6 flex items-center justify-between p-5 bg-white border border-[#E7EAEC] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedMethod === "card"}
                    onChange={() => {
                      setSelectedMethod("card");
                      setMethod({ credit: true, netBanking: false });
                      setValue("paymentMethod", "card");
                    }}
                    className=" h-6 w-6 appearance-none border border-[#D3D3D3] rounded-2xl"
                  />
                  <img
                    src={checkSymbol}
                    className={`${
                      selectedMethod === "card"
                        ? "block absolute top-0 right-0"
                        : "hidden"
                    }`}
                  />
                </div>

                <div className=" bg-primary001/20 rounded-full px-[5px] py-[7px]">
                  <img className="w-4 h-3 " src={cartIcon} />
                </div>

                <div>
                  <p className="text-[#606060] sm:text-2xl text-lg font-proximaSemiBold ">
                    Credit or debit card
                    <span className="sm:text-xl text-lg font-proximaRegular">
                      {" "}
                      ₹0.00
                    </span>
                  </p>
                </div>
              </div>

              <div className="sm:flex sm:items-center gap-3">
                <img src={masterCart} />
                <img src={visaCart} />
              </div>
            </div>

            {/* iDEAL Option */}
            <div className="mt-3 p-5 bg-white border border-[#E7EAEC] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedMethod === "ideal"}
                    onChange={() => {
                      setSelectedMethod("ideal");
                      setMethod({ credit: false, netBanking: true });
                      setValue("paymentMethod", "ideal");
                    }}
                    className="h-6 w-6 appearance-none border border-[#D3D3D3] rounded-2xl"
                  />
                  <img
                    src={checkSymbol}
                    className={`${
                      selectedMethod === "ideal"
                        ? "block absolute top-0 right-0"
                        : "hidden"
                    }`}
                  />
                </div>

                <div className="bg-primary001/20 rounded-full px-[5px] py-[7px]">
                  <NetIcon />
                </div>
                <p className="text-[#606060] sm:text-2xl text-lg font-proximaSemiBold ">
                  Net Banking
                  <span className="sm:text-xl text-lg font-proximaRegular">
                    {" "}
                    ₹0.00
                  </span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {!selectedMethod && (
              <p className="text-red-500 text-sm mt-2">
                Please select a payment method
              </p>
            )}
            {/* Hidden input for react-hook-form to register paymentMethod */}
            <input
              type="hidden"
              value={selectedMethod}
              {...register("paymentMethod", { required: true })}
            />
          </div>

          {/* Card Number */}
          {method.credit && (
            <div>
              <div className="mt-6 ">
                <label className="text-[#606060] font-proximaRegular text-base">
                  Card number
                </label>

                <div className=" mt-2 p-5 bg-white border border-[#E7EAEC] rounded-xl">
                  <input
                    {...register("cardNumber", {
                      required: "Card Number is required",
                      maxLength: {
                        value: 19, // 16 digits + 3 spaces
                        message: "Card number cannot exceed 16 digits",
                      },
                      pattern: {
                        value: /^[0-9\s]+$/,
                        message: "Only numbers are allowed",
                      },
                    })}
                    className="focus:outline-none w-full"
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      // Remove all non-digit characters
                      let value = e.currentTarget.value.replace(/\D/g, "");

                      // Add space after every 4 digits
                      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

                      // Update the input value
                      e.currentTarget.value = value;
                    }}
                  />
                </div>
                {errors.cardNumber && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.cardNumber.message}
                  </span>
                )}
              </div>

              <div className="flex items-center  gap-6">
                {/* Date */}

                <div className="mt-6  w-full">
                  <label className="text-[#606060] font-proximaRegular text-base">
                    Expiration Date
                  </label>

                  <div className=" mt-2 p-5 bg-white border border-[#E7EAEC] rounded-xl">
                    <input
                      className=" focus:outline-none w-full"
                      min={minDate}
                      type="date"
                      {...register("dateFiled", { required: true })}
                    />
                  </div>
                  {errors.dateFiled && (
                    <span className="text-red-500">
                      Expiration date must be submit
                    </span>
                  )}
                </div>

                {/* CVV Code */}

                <div className="mt-6 w-full ">
                  <label className="text-[#606060] font-proximaRegular text-base">
                    CVV code
                  </label>

                  <div className=" mt-2 p-5 bg-white border border-[#E7EAEC] rounded-xl">
                    <input
                      className=" focus:outline-none w-full"
                      type="text"
                      placeholder="123"
                      {...register("cvvCode", {
                        required: "CVV Code is required",
                        maxLength: {
                          value: 5,
                          message: "CVV Code cannot exceed 5 characters",
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Only numbers  are allowed",
                        },
                      })}
                    />
                  </div>
                  {errors.cvvCode && (
                    <span className="text-red-500">
                      {errors.cvvCode.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Holder Name */}
              <div className="mt-6 ">
                <label className="text-[#606060] font-proximaRegular text-base">
                  Card holder name
                </label>

                <div className=" mt-2 p-5 bg-white border border-[#E7EAEC] rounded-xl">
                  <input
                    {...register("holderName", { required: true })}
                    className=" focus:outline-none w-full"
                    type="text"
                    placeholder="Name on card"
                  />
                </div>
                {errors.holderName && (
                  <span className="text-red-500">
                    Card holder name is required
                  </span>
                )}
              </div>
              {/* Save as Check Box */}

              <div className=" mt-3 flex items-center gap-2 ">
                <input className="w-4 h-4  accent-primary001" type="checkbox" />
                <label className="text-[#606060] font-proximaRegular text-base">
                  Save details for next time
                </label>
              </div>
            </div>
          )}

          {method.netBanking && (
            <div className="flex flex-wrap items-center justify-center w-full px-20 py-5 gap-3">
              {NetBankingData?.map((data, idx) => (
                <div key={idx}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 bg-white px-5 py-2 rounded-md border border-gray-200"
                  >
                    <img src={data?.icon} alt="icon" className="w-8 h-8 rounded-full" /> {data?.name?.slice(0, 11)}
                    {data?.name?.length > 10 && "..."}
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="w-40 flex items-center gap-2 bg-white px-5 py-2 rounded-md border border-gray-200"
              >
                ...More bank
              </button>
            </div>
          )}
          {/* Button */}

          <div className="mt-3 flex justify-between items-center">
            <Link to="/availabletickets">
              <button className=" cursor-pointer rounded-4xl text-primary001 font-proximaRegular sm:text-xl text-base px-15 py-2 border border-primary001">
                Back
              </button>{" "}
            </Link>

            <button
              className=" cursor-pointer bg-primary001 rounded-4xl text-white font-proximaRegular sm:text-xl text-base px-10 py-2"
              type="submit"
            >
              Continue
            </button>
          </div>
        </form>

        <div className="mt-[50px]">
          <CheckElement />
        </div>
      </Container>
    </div>
  );
};

export default Payment;
