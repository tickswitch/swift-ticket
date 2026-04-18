import Account from "./Account/Account";

export const Profile = () => {
 
  //   update profile data
  // const updateProfile = useMutation({
  //   mutationKey: ["update-profile"],
  //   mutationFn: (payload) => PostData("profile/update", payload),
  //   onSuccess: () => {
  //     toast.success("Profile update succcess");
  //     queryClient.invalidateQueries({ queryKey: ["profile-data"] });
  //   },
  //   onError: (err) => {
  //     toast.error(err?.message || "Failed to update profile");
  //   },
  // });

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     name: data?.name || "",
  //     address: data?.address || "",
  //     phone: data?.phone || "",
  //     city: data?.city || "",
  //     postal_code: data?.postal_code || "",
  //     country_of_residence: data?.country_of_residence || "",
  //     bank_country: data?.bank_country || "",
  //     account_holder_name: data?.account_holder_name || "",
  //     phone_number: "15348465454",
  //     bank_account_number: data?.bank_account_number || "",
  //   },
  // });

  //   const handleDataSubmit = (data) => {};

  // const onSubmit = (data: any) => {
  //   console.log(data);
  //   updateProfile.mutate(data);
  // };

  // useEffect(() => {
  //   if (data) {
  //     reset({
  //       name: data?.name || "",
  //       address: data?.address || "",
  //       phone: data?.phone || "",
  //       city: data?.city || "",
  //       postal_code: data?.postal_code || "",
  //       country_of_residence: data?.country_of_residence || "",
  //       bank_country: data?.bank_country || "",
  //       postal_code: data?.postal_code || "",
  //       account_holder_name: data?.account_holder_name || "",
  //       phone_number: "15348465454",
  //       bank_account_number: data?.bank_account_number || "",
  //     });
  //   }
  // }, [reset, data]);

  return (
    <div className="min-h-screen py-5">
      {/* <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Profile</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorText />
        ) : data?.length < 1 ? (
          <ErrorText>No Data Found</ErrorText>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  {...register("address", {
                    required: "Address is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="text"
                  {...register("phone", {
                    required: "Phone is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...register("city", {
                    required: "City is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              
              <div>
                <label
                  htmlFor="country_of_residence"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country of Residence
                </label>
                <input
                  id="country_of_residence"
                  type="text"
                  {...register("country_of_residence", {
                    required: "Country of residence is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.country_of_residence && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country_of_residence.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="bank_country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Country
                </label>
                <input
                  id="bank_country"
                  type="text"
                  {...register("bank_country", {
                    required: "Bank country is required",
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.bank_country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bank_country.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Postal Code
                </label>
                <input
                  id="postal_code"
                  type="text"
                  {...register("postal_code", {
                    required: "Postal code is required",
                    pattern: {
                      value: /^\d{5,6}$/,
                      message: "Invalid postal code",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.postal_code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="account_holder_name"
                  className="block text-sm font-medium text-gray-700"
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
                      message:
                        "Account holder name must be at least 2 characters",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.account_holder_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.account_holder_name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  {...register("phone_number", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\d{10,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="bank_account_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Account Number
                </label>
                <input
                  id="bank_account_number"
                  type="text"
                  {...register("bank_account_number", {
                    required: "Bank account number is required",
                    pattern: {
                      value: /^\d+$/,
                      message: "Invalid bank account number",
                    },
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {errors.bank_account_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bank_account_number.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center pt-5">
              <button
                type="submit"
                className="bg-primary001 text-white px-4 py-2 rounded-md"
              >
                {updateProfile.isPending ? (
                  <Loader
                    size={20}
                    className="h-10 tex-white"
                    parentClass="h-8 w-20"
                  />
                ) : (
                  <> Save Changes</>
                )}
              </button>
            </div>
          </form>
        )}
      </div> */}
      <Account />
    </div>
  );
};
