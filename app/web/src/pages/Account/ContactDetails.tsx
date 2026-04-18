import { PostData } from "@/API/API";
import Loader from "@/components/Common/Loader";
import { useMutation } from "@tanstack/react-query";
import ReactFlagsSelect from "react-flags-select";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router";

interface ContactFormData extends Record<string, unknown> {
  country_of_residence: string;
  city: string;
  address: string;
  postal_code: string;
  state: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  name: string;
  phone: string;
}

const ContactDetails = () => {
  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "Mohammed",
      phone: "143",
    },
  });

  const selectedCountry = watch("country_of_residence");

  // Mock data for dropdowns
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 100 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const contactUpdate = useMutation({
    mutationKey: ["contact-update"],
    mutationFn: (payload: ContactFormData) => PostData<any>("contact/update", payload),
    onSuccess: () => {
      toast.success("Contact updated");
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.errors ||
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong."
      );
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactUpdate.mutate(data);
    console.log("Form submitted:", data);
    // Handle form submission here
  };

  return (
    <div className="max-w-2xl mx-auto pt-20 pb-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to={"/profile"} className="hover:text-gray-700">
          Account settings
        </Link>{" "}
        /{" "}
        <Link to={"/identy-verify"} className="hover:text-gray-700">
          Identity Verify
        </Link>{" "}
        / Contact details
      </div>

      {/* Contact Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Contact details</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 border border-gray-200 rounded-2xl p-6">
             

            {/* Country Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Controller
                name="country_of_residence"
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
              {errors.country_of_residence && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country_of_residence.message}
                </p>
              )}
            </div>

            {/* Form Fields - Show only when country is selected */}
            {selectedCountry && (
              <div className="space-y-6">
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 gap-4">
                  {/* City, State, Postal Code Row */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      {...register("city", {
                        required: "City is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your address"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter postal code"
                      {...register("postal_code", {
                        required: "Postal code is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                    />
                    {errors.postal_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.postal_code.message}
                      </p>
                    )}
                  </div>

                  {/* Birthdate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birthdate
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Controller
                          name="birthDay"
                          control={control}
                          rules={{ required: "Day is required" }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                            >
                              <option value="">Day</option>
                              {days.map((day) => (
                                <option key={day} value={day}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.birthDay && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.birthDay.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Controller
                          name="birthMonth"
                          control={control}
                          rules={{ required: "Month is required" }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                            >
                              <option value="">Month</option>
                              {months.map((month) => (
                                <option key={month} value={month}>
                                  {month}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.birthMonth && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.birthMonth.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Controller
                          name="birthYear"
                          control={control}
                          rules={{ required: "Year is required" }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                            >
                              <option value="">Year</option>
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.birthYear && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.birthYear.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register("name", {
                        required: "Name is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary001 focus:border-transparent"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={contactUpdate.isPending }
                    className="w-full bg-primary001 text-white py-3 px-4 rounded-lg hover:bg-primary002 focus:ring-2 focus:ring-primary001 focus:ring-offset-2 transition-colors"
                  >
                    {contactUpdate.isPending ? (
                      <div className="flex items-center justify-center">
                        <Loader parentClass="h-8 w-fit" size={35} />
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactDetails;
