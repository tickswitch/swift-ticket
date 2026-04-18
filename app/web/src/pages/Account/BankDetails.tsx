import { PostData } from "@/API/API";
import Loader from "@/components/Common/Loader";
import { updateData } from "@/features/SellTicketSlice";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import ReactFlagsSelect from "react-flags-select";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";

interface BankDetailsForm extends Record<string, unknown> {
  bank_country: string;
  account_holder_name: string;
  phone_number: string;
  bank_account_number: string;
}

const BankDetails = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BankDetailsForm>();

  //   submission
  const submitData = useMutation({
    mutationKey: ["bank-details"],
    mutationFn: (payload: BankDetailsForm) => PostData<any>("bank/update", payload),
    onSuccess: () => {
      toast.success("Data submitted successfully");
      navigate("/review-finish")
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "Data submitted successfully"
      );
    },
  });

  const onSubmit = (data: BankDetailsForm) => {
    submitData.mutate(data);
    dispatch(
          updateData({
            country_of_residence: data?.bank_country,
            account_holder_name: data?.account_holder_name,
            phone_number: data?.phone_number,
            bank_account_number: data?.bank_account_number,
          })
        );
  };

  return (
    <div className="max-w-5xl mx-auto py-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Bank Details</h2>

          <div className="space-y-4 border rounded-2xl">
            <div className="p-5">
              {/* Country Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Controller
                  name="bank_country"
                  control={control}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <ReactFlagsSelect
                      className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                      selected={field.value}
                      onSelect={field.onChange}
                      selectButtonClassName="!p-3 !h-10 !border-none w-full flex justify-between items-center"
                      searchable
                      placeholder="Select Country"
                    />
                  )}
                />
                {errors.bank_country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bank_country.message}
                  </p>
                )}
              </div>

              {/* Account holder name */}
              <div className="mb-6">
                <label
                  htmlFor="account_holder_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Account Holder Name
                </label>
                <input
                  id="account_holder_name"
                  type="text"
                  {...register("account_holder_name", {
                    required: "Account holder name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent outline-none transition-all",
                    errors.account_holder_name
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="Enter account holder name"
                />
                {errors.account_holder_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.account_holder_name.message}
                  </p>
                )}
              </div>

              {/* Phone number */}
              <div className="mb-6">
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+]?[\d\s()-]{10,}$/,
                      message: "Please enter a valid phone number",
                    },
                  })}
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent outline-none transition-all",
                    errors.phone_number ? "border-red-500" : "border-gray-300"
                  )}
                  placeholder="Enter phone number"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Bank account number */}
              <div className="mb-6">
                <label
                  htmlFor="bank_account_number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bank Account Number
                </label>
                <input
                  id="bank_account_number"
                  type="text"
                  {...register("bank_account_number", {
                    required: "Bank account number is required",
                    pattern: {
                      value: /^[0-9]{8,20}$/,
                      message:
                        "Please enter a valid account number (8-20 digits)",
                    },
                  })}
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent outline-none transition-all",
                    errors.bank_account_number
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                  placeholder="Enter bank account number"
                />
                {errors.bank_account_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bank_account_number.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary001 text-white rounded-lg hover:bg-primary001/90 transition-colors font-medium"
                >
                  {submitData.isPending ? <Loader parentClass="h-fit w-full" size={30} className="text-white" /> : "Save Bank Details"}
                </button>
                <Link
                  to="/profile"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BankDetails;
